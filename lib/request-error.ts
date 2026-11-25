/** Thrown when a call needs a sign-in that is missing or has expired. */
export class AuthRequired extends Error {
  constructor() {
    super("Sign-in is required.");
  }
}

/** A refusal from the backend, with its error code. */
export class RequestError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
