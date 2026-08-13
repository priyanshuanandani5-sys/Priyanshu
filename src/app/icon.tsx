import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "#E08FA8",
          display: "flex",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: 9, top: 7, width: 5, height: 5, borderRadius: "50%", background: "#4A2E23" }} />
        <div style={{ position: "absolute", left: 19, top: 9, width: 4, height: 4, borderRadius: "50%", background: "#4A2E23" }} />
        <div style={{ position: "absolute", left: 22, top: 17, width: 4, height: 4, borderRadius: "50%", background: "#4A2E23" }} />
        <div style={{ position: "absolute", left: 14, top: 20, width: 5, height: 5, borderRadius: "50%", background: "#4A2E23" }} />
        <div style={{ position: "absolute", left: 6, top: 18, width: 3, height: 3, borderRadius: "50%", background: "#4A2E23" }} />
      </div>
    ),
    { ...size }
  );
}
