create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  subject text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  academic_stage text not null,
  schedule_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  phone text,
  parent_phone text,
  student_code text,
  qr_token_hash text not null,
  photo_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_teacher_student_code unique (teacher_id, student_code),
  constraint uq_students_qr_token_hash unique (qr_token_hash)
);

create table public.group_memberships (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'inactive')),
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_group_student unique (group_id, student_id),
  constraint chk_membership_status_left_at check (
    (status = 'active' and left_at is null) or
    (status = 'inactive' and left_at is not null)
  )
);

create table public.attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  session_date date not null default current_date,
  title text,
  created_at timestamptz not null default now()
);

create table public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.attendance_sessions(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_session_student unique (session_id, student_id)
);

create table public.exams (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  title text not null,
  max_score numeric(5,2) not null default 100.00 check (max_score > 0),
  exam_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.grades (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  score numeric(5,2) not null check (score >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_exam_student unique (exam_id, student_id)
);

create index idx_groups_teacher_id on public.groups(teacher_id);
create index idx_students_teacher_id on public.students(teacher_id);
create index idx_students_qr_token_hash on public.students(qr_token_hash);
create index idx_group_memberships_group on public.group_memberships(group_id, status);
create index idx_group_memberships_student on public.group_memberships(student_id, status);
create index idx_attendance_sessions_group on public.attendance_sessions(group_id, session_date desc);
create index idx_attendance_sessions_teacher on public.attendance_sessions(teacher_id);
create index idx_attendance_records_session on public.attendance_records(session_id);
create index idx_attendance_records_student on public.attendance_records(student_id);
create index idx_exams_group on public.exams(group_id, exam_date desc);
create index idx_exams_teacher on public.exams(teacher_id);
create index idx_grades_exam on public.grades(exam_id);
create index idx_grades_student on public.grades(student_id);

create or replace function public.fn_validate_group_membership_teacher()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_group_teacher uuid;
  v_student_teacher uuid;
begin
  select teacher_id into v_group_teacher from public.groups where id = NEW.group_id;
  select teacher_id into v_student_teacher from public.students where id = NEW.student_id;
  if v_group_teacher is null or v_student_teacher is null or v_group_teacher <> v_student_teacher then
    raise exception 'Integrity violation: Student and group must belong to the same teacher.';
  end if;
  return NEW;
end;
$$;

create trigger trg_validate_group_membership_teacher
before insert or update of group_id, student_id on public.group_memberships
for each row execute function public.fn_validate_group_membership_teacher();

create or replace function public.fn_validate_attendance_session_teacher()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_group_teacher uuid;
begin
  select teacher_id into v_group_teacher from public.groups where id = NEW.group_id;
  if v_group_teacher is null or v_group_teacher <> NEW.teacher_id then
    raise exception 'Integrity violation: Attendance session teacher must match the group teacher.';
  end if;
  return NEW;
end;
$$;

create trigger trg_validate_attendance_session_teacher
before insert or update of teacher_id, group_id on public.attendance_sessions
for each row execute function public.fn_validate_attendance_session_teacher();

create or replace function public.fn_validate_exam_teacher()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_group_teacher uuid;
begin
  select teacher_id into v_group_teacher from public.groups where id = NEW.group_id;
  if v_group_teacher is null or v_group_teacher <> NEW.teacher_id then
    raise exception 'Integrity violation: Exam teacher must match the group teacher.';
  end if;
  return NEW;
end;
$$;

create trigger trg_validate_exam_teacher
before insert or update of teacher_id, group_id on public.exams
for each row execute function public.fn_validate_exam_teacher();

create or replace function public.fn_validate_attendance_record()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_group_id uuid;
  v_has_active_membership boolean;
begin
  select group_id into v_group_id from public.attendance_sessions where id = NEW.session_id;
  if v_group_id is null then
    raise exception 'Integrity violation: Attendance session not found.';
  end if;
  select exists (
    select 1 from public.group_memberships
    where group_id = v_group_id and student_id = NEW.student_id and status = 'active'
  ) into v_has_active_membership;
  if not v_has_active_membership then
    raise exception 'Cannot record attendance: Student is not an active member of this group.';
  end if;
  return NEW;
end;
$$;

create trigger trg_validate_attendance_record
before insert or update of session_id, student_id on public.attendance_records
for each row execute function public.fn_validate_attendance_record();

create or replace function public.fn_validate_grade_record()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_group_id uuid;
  v_max_score numeric(5,2);
  v_has_active_membership boolean;
begin
  select group_id, max_score into v_group_id, v_max_score from public.exams where id = NEW.exam_id;
  if v_group_id is null then
    raise exception 'Integrity violation: Exam not found.';
  end if;
  if NEW.score > v_max_score then
    raise exception 'Integrity violation: Grade score (%) exceeds exam maximum score (%).', NEW.score, v_max_score;
  end if;
  select exists (
    select 1 from public.group_memberships
    where group_id = v_group_id and student_id = NEW.student_id and status = 'active'
  ) into v_has_active_membership;
  if not v_has_active_membership then
    raise exception 'Cannot record grade: Student is not an active member of this group.';
  end if;
  return NEW;
end;
$$;

create trigger trg_validate_grade_record
before insert or update of exam_id, student_id, score on public.grades
for each row execute function public.fn_validate_grade_record();

create or replace function public.fn_handle_new_teacher()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (NEW.id, coalesce(NEW.raw_user_meta_data->>'full_name', NEW.email, 'معلم جديد'));
  return NEW;
end;
$$;

create trigger trg_on_auth_user_created
after insert on auth.users
for each row execute function public.fn_handle_new_teacher();

-- Data API grants (required by Supabase; authenticated + service_role only)
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.groups, public.students, public.group_memberships,
  public.attendance_sessions, public.attendance_records, public.exams, public.grades to authenticated;
grant all on public.profiles, public.groups, public.students, public.group_memberships,
  public.attendance_sessions, public.attendance_records, public.exams, public.grades to service_role;

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.students enable row level security;
alter table public.group_memberships enable row level security;
alter table public.attendance_sessions enable row level security;
alter table public.attendance_records enable row level security;
alter table public.exams enable row level security;
alter table public.grades enable row level security;

revoke all on public.profiles from anon;
revoke all on public.groups from anon;
revoke all on public.students from anon;
revoke all on public.group_memberships from anon;
revoke all on public.attendance_sessions from anon;
revoke all on public.attendance_records from anon;
revoke all on public.exams from anon;
revoke all on public.grades from anon;

create policy "Authenticated teachers view own profile"
  on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Authenticated teachers update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "Authenticated teachers manage own groups"
  on public.groups for all to authenticated
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

create policy "Authenticated teachers manage own students"
  on public.students for all to authenticated
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

create policy "Authenticated teachers manage group memberships"
  on public.group_memberships for all to authenticated
  using (exists (select 1 from public.groups g where g.id = group_memberships.group_id and g.teacher_id = auth.uid()))
  with check (exists (select 1 from public.groups g where g.id = group_memberships.group_id and g.teacher_id = auth.uid()));

create policy "Authenticated teachers manage attendance sessions"
  on public.attendance_sessions for all to authenticated
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

create policy "Authenticated teachers manage attendance records"
  on public.attendance_records for all to authenticated
  using (exists (select 1 from public.attendance_sessions s where s.id = attendance_records.session_id and s.teacher_id = auth.uid()))
  with check (exists (select 1 from public.attendance_sessions s where s.id = attendance_records.session_id and s.teacher_id = auth.uid()));

create policy "Authenticated teachers manage exams"
  on public.exams for all to authenticated
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

create policy "Authenticated teachers manage grades"
  on public.grades for all to authenticated
  using (exists (select 1 from public.exams e where e.id = grades.exam_id and e.teacher_id = auth.uid()))
  with check (exists (select 1 from public.exams e where e.id = grades.exam_id and e.teacher_id = auth.uid()));