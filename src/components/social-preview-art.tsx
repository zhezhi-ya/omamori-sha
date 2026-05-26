interface SocialPreviewArtProps {
  title: string;
  subtitle: string;
  footer: string;
}

export function SocialPreviewArt({ title, subtitle, footer }: SocialPreviewArtProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        color: "#f8f2e7",
        background:
          "radial-gradient(circle at 18% 16%, rgba(255,196,210,0.42), transparent 24%), radial-gradient(circle at 84% 18%, rgba(155,221,255,0.36), transparent 26%), radial-gradient(circle at 58% 84%, rgba(189,242,205,0.34), transparent 28%), linear-gradient(180deg, #fff8ec 0%, #ffedf3 52%, #eaf8ff 100%)",
        fontFamily: 'Noto Sans SC, "PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 18px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.64)",
            border: "1px solid rgba(255,255,255,0.86)",
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#e84f72",
              boxShadow: "0 0 18px rgba(232,79,114,0.28)",
            }}
          />
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.18em", color: "#493344" }}>御守社</span>
        </div>
        <div style={{ fontSize: 22, letterSpacing: "0.28em", color: "rgba(73,51,68,0.68)" }}>今日签文入口</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1020 }}>
        <h1 style={{ margin: 0, fontSize: 78, lineHeight: 1.03, letterSpacing: "0.08em", fontWeight: 700, color: "#493344" }}>{title}</h1>
        <p style={{ margin: 0, fontSize: 36, lineHeight: 1.25, color: "rgba(73,51,68,0.82)", maxWidth: 960 }}>
          {subtitle}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ fontSize: 22, letterSpacing: "0.22em", color: "rgba(73,51,68,0.72)" }}>{footer}</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.58)",
              border: "1px solid rgba(255,255,255,0.86)",
              fontSize: 20,
              color: "rgba(73,51,68,0.82)",
            }}
          >
            东方Project同人风格签文
          </div>
        </div>
        <div
          style={{
            width: 164,
            height: 164,
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.86)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.72), rgba(255,238,243,0.48))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 118,
              height: 118,
              borderRadius: 999,
              background:
                "radial-gradient(circle, rgba(255,244,221,0.96) 0%, rgba(217,178,111,0.74) 52%, rgba(197,93,97,0.6) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2f1f24",
              fontSize: 56,
              fontWeight: 700,
            }}
          >
            签
          </div>
        </div>
      </div>
    </div>
  );
}
