import { errorText, reasonText } from "./strings";
import { AuthRequired, TaError } from "./ta-client";

/** What to tell the TA when a call fails: field messages first, then a known code, then the server's own message. */
export function describeError(error: unknown): string {
  if (error instanceof AuthRequired) return errorText.FORBIDDEN;
  if (error instanceof TaError) {
    const fields = Object.entries(error.fieldErrors);
    if (fields.length > 0)
      return fields.map(([field, messages]) => `${field}: ${messages.join(", ")}`).join(" · ");
    const known = errorText[error.code];
    if (error.code === "CANNOT_CONFIRM")
      return error.message
        .split(/(?<=\.) /)
        .map((m) => reasonText[m] ?? m)
        .join(" ");
    if (known && error.code !== "FORBIDDEN") return known;
    return reasonText[error.message] ?? error.message;
  }
  return error instanceof Error ? error.message : String(error);
}
