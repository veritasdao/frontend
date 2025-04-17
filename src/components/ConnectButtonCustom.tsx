"use client";

import { ConnectButton } from "@xellar/kit";
import { Button } from "./ui/button";

export const ConnectButtonCustom = () => {
  return (
    <ConnectButton.Custom>
      {({
        isConnected,
        account,
        chain,
        openConnectModal,
        openChainModal,
        openProfileModal,
      }) => {
        if (!isConnected) {
          return (
            <Button onClick={openConnectModal} type="button" size={"lg"}>
              Hubungkan akun
            </Button>
          );
        }

        return (
          <div style={{ display: "flex", gap: 12 }}>
            <Button onClick={openChainModal} type="button" variant={"outline"}>
              {chain?.name}
            </Button>
            <Button
              onClick={openProfileModal}
              type="button"
              variant={"outline"}
            >
              {account?.address.slice(0, 6)}...
              {account?.address.slice(-4)}
              {account?.balanceFormatted
                ? `(${account.balanceFormatted.slice(0, 5)}... ${
                    account.balanceSymbol
                  })`
                : ""}
            </Button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
