import { errorText } from "./strings";
import { AuthRequired, RequestError } from "./request-error";

/** What to tell a leader when a call fails: a known code's text, else the server's own message. */
export function describeError(error: unknown): string {
  if (error instanceof AuthRequired) return errorText.FORBIDDEN;
  if (error instanceof RequestError) return errorText[error.code] ?? error.message;
  return error instanceof Error ? error.message : String(error);
}
