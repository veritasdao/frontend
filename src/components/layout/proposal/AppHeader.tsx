"use client";
import { ConnectButtonCustom } from "@/components/ConnectButtonCustom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useAccount, useSwitchChain } from "wagmi";

export default function AppHeader() {
  const { address, isConnected } = useAccount();
  const pathname = usePathname();
  const { chains, switchChain } = useSwitchChain();

  React.useEffect(() => {
    if (address && isConnected) {
      chains?.map((chain: { id: number }) =>
        switchChain({
          chainId: chain.id,
        })
      );
    }
  }, [chains, isConnected, address, switchChain]);

  return (
    <header className="mb-10 flex items-center justify-between">
      <section className="flex items-center gap-5 font-medium">
        <Link href={"/"} className="text-2xl font-bold">
          Veritas
        </Link>
        <Link
          href={"/proposal/create"}
          className={`text-sm text-muted-foreground hover:text-primary duration-300 ${
            pathname === "/proposal/create" ? "text-primary" : ""
          }`}
        >
          Buat Proposal
        </Link>
        <Link
          href={"/proposal"}
          className={`text-sm text-muted-foreground hover:text-primary duration-300 ${
            pathname === "/proposal" ? "text-primary" : ""
          }`}
        >
          Jelajahi Komunitas
        </Link>
        <Link
          href={"/proposal/staking"}
          className={`text-sm text-muted-foreground hover:text-primary duration-300 ${
            pathname === "/proposal/staking" ? "text-primary" : ""
          }`}
        >
          Menabung Koin
        </Link>
        {address && (
          <Link
            href={"/profile"}
            className={`text-sm text-muted-foreground hover:text-primary duration-300 ${
              pathname === "/profile" ? "text-primary" : ""
            }`}
          >
            Profil Saya
          </Link>
        )}
      </section>
      <ConnectButtonCustom />
    </header>
  );
}
