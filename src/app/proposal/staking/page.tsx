import { StakingTab } from "@/components/layout/staking/StakingTab";
import React from "react";

export default function page() {
  return (
    <main>
      <section className="text-center py-10">
        <h1 className="text-5xl font-bold mb-2">
          Menabung Koin, Raih Imbalan Menarik!
        </h1>
        <h2 className="text-muted-foreground max-w-2xl mx-auto">
          Simpan aset kriptomu dengan IDRX dan dapatkan keuntungan otomatis
          setiap hari. Mulai menabung sekarang, biarkan koinmu bekerja untukmu!
        </h2>
      </section>
      <StakingTab />
    </main>
  );
}
