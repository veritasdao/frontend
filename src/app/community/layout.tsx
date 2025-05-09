import AppHeader from "@/components/layout/proposal/AppHeader";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-5 xl:mx-20 2xl:mx-40">
      <AppHeader />
      {children}
    </div>
  );
}
