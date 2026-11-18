import { ImageResponse } from "next/og";

export const alt = "Growth Flame Company – tuotannon ja kasvuyrityksen johtaminen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#182A50", color: "#EDE9E9", display: "flex", flexDirection: "column", justifyContent: "center", padding: 96, position: "relative" }}>
        <div style={{ fontSize: 76, fontWeight: 900, letterSpacing: 6 }}>GROWTH FLAME COMPANY</div>
        <div style={{ fontSize: 40, marginTop: 24 }}>Tuotannon ja kasvuyrityksen johtaminen · A Boostaamo Company</div>
        <div style={{ position: "absolute", left: 96, right: 96, bottom: 72, height: 16, borderRadius: 8, background: "#EDE9E9" }} />
      </div>
    ),
    size,
  );
}
