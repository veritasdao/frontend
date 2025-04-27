import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "./ui/input";
import useGetVotingPower from "@/hooks/getVotingPower";
import { formatUnits } from "viem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type valueFormType = {
  amount: string;
};

export default function StakeClaim() {
  const { balanceVotingPower } = useGetVotingPower();

  async function confirmStake(values: valueFormType) {
    console.log(Number(values.amount));
  }

  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number().required("Mohon mengisikan jumlah tabungan"),
    }),
    onSubmit: confirmStake,
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            Jumlah tabungan:{" "}
            {balanceVotingPower
              ? parseFloat(formatUnits(balanceVotingPower as bigint, 2))
              : 0}
          </CardTitle>
          <CardDescription>
            Change your password here. After saving, you&apos;ll be logged out.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center relative">
            <Input
              id="amount"
              name="amount"
              placeholder=""
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="absolute right-0 rounded-tr-md rounded-br-md p-1 px-5 flex items-center gap-1">
              <Avatar className="w-5 h-5">
                <AvatarImage src="/images/idrx.svg" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p>IDRX</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Konfirmasi Ambil Tabungan</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
