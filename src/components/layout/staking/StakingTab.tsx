"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClockArrowUp, Wallet } from "lucide-react";
import React from "react";

export function StakingTab() {
  const [duration, setDuration] = React.useState<number>(0);
  async function setDurationButton(days: number) {
    setDuration(days);
  }
  return (
    <Tabs defaultValue="stake" className="mx-auto max-w-2xl">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="stake">Mulai Menabung</TabsTrigger>
        <TabsTrigger value="unstake">Ambil Tabungan</TabsTrigger>
      </TabsList>
      <TabsContent value="stake">
        <Card>
          {/* <CardHeader>
            <CardTitle>Jumlah</CardTitle>
            <CardDescription>Saldo: 0.1 IDRX</CardDescription>
          </CardHeader> */}
          <CardContent className="space-y-5">
            <section className="space-y-2">
              <div className="flex justify-between font-medium text-sm">
                <p>Jumlah</p>
                <div className="flex items-center gap-2">
                  <Wallet size={20} />
                  <p>0.1 IDRX</p>
                </div>
              </div>
              <div className="flex items-center relative">
                <Input id="amount" placeholder="" />
                <div className="absolute right-0 rounded-tr-md rounded-br-md p-1 px-5 flex items-center gap-1">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src="/images/idrx.svg" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>IDRX</p>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <p className="font-medium text-sm">Durasi menabung</p>
              <div className="flex items-center relative">
                <Input id="amount" placeholder="" value={duration} />
                <div className="absolute right-0 rounded-tr-md rounded-br-md p-1 px-5 flex items-center gap-1">
                  <ClockArrowUp size={20} />
                  <p>Hari</p>
                </div>
              </div>
              <div>
                <Button
                  variant={"outline"}
                  onClick={() => {
                    setDurationButton(7);
                  }}
                >
                  1 Minggu
                </Button>
              </div>
            </section>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="unstake">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
