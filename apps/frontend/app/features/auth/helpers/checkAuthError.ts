type ApiErrorCode =
  | "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
  | "INVALID_EMAIL_OR_PASSWORD"

type ApiError = {
  code?: ApiErrorCode
  message?: string
}

export function checkAuthError(
  error: unknown,
  code: ApiErrorCode
): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  )
}
