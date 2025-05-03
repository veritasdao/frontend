"use client";
import React from "react";
import { Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig, darkTheme } from "@xellar/kit";
import { liskSepolia } from "viem/chains";

export const config = defaultConfig({
  appName: "veritas",
  // Required for WalletConnect
  walletConnectProjectId: "8f5138c3b3968106a28d4f9e26d30289",

  // Required for Xellar Passport
  xellarAppId: "31dad043-6324-4117-8b9c-0502f5d710c6",
  xellarEnv: "sandbox",
  chains: [liskSepolia],
  ssr: true, // Use this if you're using Next.js App Router
}) as Config;

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider
          theme={darkTheme}
          showConfirmationModal={true}
          // Fill this if you want to use Google Auth
          googleClientId="506201553534-oikabi8nf8ik6s21roj952r1j480n2bc.apps.googleusercontent.com"
          // Fill this if you want to use Telegram Auth
          telegramConfig={{
            botId: "7389829722:AAEBPnKUZTUEV3aNQVA4pseLFRTFlXszW-Y",
            botUsername: "veritasDAO_bot",
          }}
          // Fill this if you want to use Apple Auth
          // appleLoginConfig={{
          //   clientId: "YOUR_APPLE_CLIENT_ID",
          //   redirectUri: "YOUR_REDIRECT_URI",
          // }}
          // Fill this if you want to use Whatsapp Auth
          // enableWhatsappLogin={true}
        >
          {children}
        </XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
