export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRuleKey =
  | "passwordTooShort"
  | "passwordNeedsUpper"
  | "passwordNeedsLower"
  | "passwordNeedsDigit"
  | "passwordNeedsSymbol";

const UPPER = /[A-Z]/;
const LOWER = /[a-z]/;
const DIGIT = /[0-9]/;
const SYMBOL = /[^A-Za-z0-9]/;

export function passwordRuleFailures(password: string): PasswordRuleKey[] {
  const failures: PasswordRuleKey[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) failures.push("passwordTooShort");
  if (!UPPER.test(password)) failures.push("passwordNeedsUpper");
  if (!LOWER.test(password)) failures.push("passwordNeedsLower");
  if (!DIGIT.test(password)) failures.push("passwordNeedsDigit");
  if (!SYMBOL.test(password)) failures.push("passwordNeedsSymbol");

  return failures;
}

export function isStrongPassword(password: string): boolean {
  return passwordRuleFailures(password).length === 0;
}

export function passwordsMatch(password: string, confirm: string): boolean {
  return password.length > 0 && password === confirm;
}
