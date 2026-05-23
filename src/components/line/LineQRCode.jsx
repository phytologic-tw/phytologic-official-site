import React from "react";

export default function LineQRCode({ className = "" }) {
  return (
    <div className={`rounded-2xl border border-brand-border-gold/70 bg-white p-3 shadow-sm ${className}`}>
      <img
        src="/line-qrcode.png"
        srcSet="/line-qrcode-small.png 180w, /line-qrcode-medium.png 360w, /line-qrcode-large.png 540w"
        sizes="(max-width: 640px) 180px, 360px"
        alt="植本邏輯官方 LINE QR Code"
        className="aspect-square w-full rounded-xl object-contain"
      />
    </div>
  );
}
