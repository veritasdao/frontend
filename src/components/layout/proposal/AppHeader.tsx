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
  }, [chains, isConnected, address]);

  return (
    <header className="mb-10 flex items-center justify-between">
      <section className="flex items-center gap-5">
        <Link href={"/"} className="text-2xl font-bold">
          Veritas
        </Link>
        <Link
          href={"/create"}
          className={`text-sm text-muted-foreground hover:text-primary duration-300 ${
            pathname === "/create" ? "text-primary" : ""
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
          Jelajahi Proposal
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
