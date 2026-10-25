import { describe, expect, it } from "vitest";
import { AUTH_MESSAGES, authErrorMessage } from "@/lib/auth-errors";

describe("authErrorMessage", () => {
  it("maps invalid credentials", () => {
    expect(authErrorMessage({ code: "invalid_credentials" })).toBe(AUTH_MESSAGES.invalidCredentials);
  });
  it("maps duplicate email", () => {
    expect(authErrorMessage({ code: "user_already_exists" })).toBe(AUTH_MESSAGES.duplicateEmail);
  });
  it("maps weak password", () => {
    expect(authErrorMessage({ code: "weak_password" })).toBe(AUTH_MESSAGES.weakPassword);
  });
  it("maps network errors", () => {
    expect(authErrorMessage({ name: "AuthRetryableFetchError", status: 0 })).toBe(AUTH_MESSAGES.network);
  });
});
