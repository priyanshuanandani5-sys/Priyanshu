"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function UpiQrCode({ data }: { data: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(data, { width: 240, margin: 1 }).then((url) => {
      if (!cancelled) setDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [data]);

  if (!dataUrl) {
    return <div className="h-60 w-60 animate-pulse rounded-md bg-cream-100" />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={dataUrl}
      alt="Scan to pay with any UPI app"
      className="h-60 w-60 rounded-md border border-clay-200 bg-white p-3"
    />
  );
}
