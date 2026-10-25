// Maps Supabase Auth errors to clear Arabic messages.
type AuthLikeError = { message?: string; code?: string; status?: number; name?: string } | null | undefined;

export const AUTH_MESSAGES = {
  invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  duplicateEmail: "هذا البريد الإلكتروني مسجّل بالفعل. جرّب تسجيل الدخول.",
  weakPassword: "كلمة المرور ضعيفة. استخدم 8 أحرف على الأقل مع أرقام وحروف.",
  network: "تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت وحاول مرة أخرى.",
  emailNotConfirmed: "لم يتم تأكيد البريد الإلكتروني بعد. افتح رسالة التأكيد في بريدك.",
  rateLimit: "محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.",
  generic: "حدث خطأ غير متوقع. حاول مرة أخرى.",
} as const;

export function authErrorMessage(error: AuthLikeError): string {
  if (!error) return AUTH_MESSAGES.generic;
  const code = error.code ?? "";
  const msg = (error.message ?? "").toLowerCase();

  if (
    error.name === "AuthRetryableFetchError" ||
    error.status === 0 ||
    msg.includes("failed to fetch") ||
    msg.includes("network")
  )
    return AUTH_MESSAGES.network;
  if (code === "invalid_credentials" || msg.includes("invalid login credentials"))
    return AUTH_MESSAGES.invalidCredentials;
  if (code === "user_already_exists" || code === "email_exists" || msg.includes("already registered"))
    return AUTH_MESSAGES.duplicateEmail;
  if (code === "weak_password" || msg.includes("password should"))
    return AUTH_MESSAGES.weakPassword;
  if (code === "email_not_confirmed") return AUTH_MESSAGES.emailNotConfirmed;
  if (code === "over_request_rate_limit" || code === "over_email_send_rate_limit" || error.status === 429)
    return AUTH_MESSAGES.rateLimit;
  return AUTH_MESSAGES.generic;
}
