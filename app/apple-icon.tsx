import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The Bubble mark for a phone's home screen, which does not take the SVG icon. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#141412" }}>
        <svg width="150" height="150" viewBox="0 0 48 48">
          <rect fill="#ffd23f" x="8" y="9" width="32" height="23" rx="7" />
          <path fill="#ffd23f" d="M13 28v12l11-9z" />
          <circle fill="#141412" cx="17" cy="20.5" r="3.6" />
          <circle fill="#141412" cx="25.6" cy="20.5" r="2.8" />
          <circle fill="#141412" cx="32.6" cy="20.5" r="2" />
        </svg>
      </div>
    ),
    size,
  );
}
