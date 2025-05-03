"use client";
import useGetProfile from "@/hooks/getProfile";
import React from "react";
import FormProfile from "./FormProfile";
import { useConnect } from "wagmi";
import { useAccount } from "wagmi";
import { injected } from "wagmi";
import { Button } from "@/components/ui/button";

export default function User() {
  const { profile } = useGetProfile();
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  if (!isConnected) {
    return (
      <div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div>
            <h1 className="text-2xl font-bold">Connect Your Account</h1>
            <p className="text-muted-foreground">
              Please connect your account to continue
            </p>
          </div>
          <Button onClick={() => connect({ connector: injected() })}>
            Connect Accounts
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <FormProfile />;
  }

  return (
    <div>
      <h1>{profile.username}</h1>
    </div>
  );
}
