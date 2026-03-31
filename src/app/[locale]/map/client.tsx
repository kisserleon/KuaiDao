"use client";

import dynamic from "next/dynamic";

const FullMap = dynamic(() => import("@/components/features/FullMap"), { ssr: false });

export default function MapClient() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <FullMap />
    </div>
  );
}
