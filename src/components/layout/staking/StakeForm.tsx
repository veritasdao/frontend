import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Wallet, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../../ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  injected,
  useAccount,
  useConnect,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import useGetBalance from "@/hooks/getBalance";
import { formatUnits, parseUnits } from "viem";
import { DAOABI, DAOToken, IDRXABI, IDRXToken } from "@/config/DAO";
import Link from "next/link";
import { toast } from "sonner";

type valueFormType = {
  amount: string;
  // duration: string;
};

// const DURATIONS = [
//   { label: "1 Bulan", value: "30" },
//   { label: "3 Bulan", value: "90" },
//   { label: "6 Bulan", value: "186" },
//   { label: "1 Tahun", value: "365" },
// ];

moment.locale("id");

export default function StakeForm() {
  const { address } = useAccount();
  const { connect } = useConnect();
  const { balanceIDRX } = useGetBalance();

  const {
    data: hash,
    writeContractAsync,
    isPending,
    isSuccess,
    failureReason,
  } = useWriteContract();

  const {
    isLoading: confirming,
    isSuccess: confirmed,
    isError: isReceiptError,
    failureReason: receiptFailureReason,
  } = useWaitForTransactionReceipt({
    hash: hash,
  });

  React.useEffect(() => {
    if (isSuccess && confirmed) {
      toast.success("Stake berhasil");
    }
  }, [confirmed, isSuccess]);

  async function confirmStake(values: valueFormType) {
    try {
      await writeContractAsync({
        abi: IDRXABI,
        address: IDRXToken,
        functionName: "approve",
        args: [DAOToken, parseUnits(values.amount || "0", 2)],
      });
      await writeContractAsync({
        abi: DAOABI,
        address: DAOToken,
        functionName: "lockIDRX",
        args: [parseUnits(values.amount || "0", 2)],
      });
    } catch (error) {
      console.error("Error staking:", error);
    }
  }

  const formik = useFormik({
    initialValues: {
      amount: "",
      // duration: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Please enter the amount to stake")
        .min(10000, "Minimum stake amount is 10.000 IDRX"),
      // duration: Yup.number().required("Mohon mengisikan durasi tabungan"),
    }),
    onSubmit: confirmStake,
  });

  // Helper to handle button selection
  // function handleDurationButton(days: string) {
  //   formik.setFieldValue("duration", days);
  // }

  // const formattedDuration = moment()
  //   .add(Number(formik.values.duration), "days")
  //   .format("LLLL");

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardContent className="space-y-5">
          <section className="space-y-2">
            <div className="flex justify-between font-medium text-sm">
              <p>Amount</p>
              <div className="flex items-center gap-2">
                <Wallet size={20} />
                {balanceIDRX ? (
                  <p>
                    {parseFloat(
                      formatUnits(balanceIDRX as bigint, 2)
                    ).toLocaleString()}{" "}
                    IDRX
                  </p>
                ) : (
                  "0 IDRX"
                )}
              </div>
            </div>
            <div className="flex items-center relative">
              <Input
                id="amount"
                name="amount"
                placeholder="contoh: 10.000"
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
            {formik.touched.amount && formik.errors.amount && (
              <div className="text-red-500 text-sm">{formik.errors.amount}</div>
            )}
          </section>

          {/* <section className="space-y-2">
            <p className="font-medium text-sm">Durasi menabung</p>
            <div className="flex items-center relative">
              <Input
                id="duration"
                name="duration"
                placeholder=""
                value={formik.values.duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // readOnly // Make it read-only if you only want button selection
              />
              <div className="absolute right-0 rounded-tr-md rounded-br-md p-1 px-5 flex items-center gap-1">
                <ClockArrowUp size={20} />
                <p>Hari</p>
              </div>
            </div>
            <div className="grid xl:grid-cols-4 gap-5">
              {DURATIONS.map((d) => (
                <Button
                  key={d.value}
                  variant={
                    formik.values.duration === d.value ? "default" : "outline"
                  }
                  type="button"
                  onClick={() => handleDurationButton(d.value)}
                >
                  {d.label}
                </Button>
              ))}
            </div>
            {formik.touched.duration && formik.errors.duration && (
              <div className="text-red-500 text-sm">
                {formik.errors.duration}
              </div>
            )}
          </section> */}

          <section className="text-sm  space-y-2">
            <div className="flex items-center justify-between">
              <h1>IDRX to be locked</h1>
              <p>{parseFloat(formik.values.amount).toLocaleString()} IDRX</p>
            </div>
            {/* <div className="flex items-center justify-between">
              <h1>Waktu mengambil tabungan</h1>
              <p>{formattedDuration}</p>
            </div> */}
            <div className="flex items-center justify-between">
              <h1>Voting Power</h1>
              <div className="flex items-center gap-1">
                <p>{parseFloat(formik.values.amount).toLocaleString()}</p>
                <Zap size={15} />
              </div>
            </div>
            <div className="flex items-center justify-between italic text-muted-foreground">
              <h1>Estimated daily return (soon)</h1>
              <div className="flex items-center gap-1">
                <p>1000 IDRX</p>
              </div>
            </div>
          </section>
        </CardContent>
        <CardFooter>
          {address ? (
            <Button
              type="submit"
              size={"lg"}
              className="w-full"
              disabled={
                !address ||
                isPending ||
                confirming ||
                confirmed ||
                Number(formik.values.amount) < 10000 ||
                Number(formik.values.amount) >
                  Number(
                    balanceIDRX ? formatUnits(balanceIDRX as bigint, 2) : "0"
                  )
              }
            >
              {isPending || confirming ? (
                <p className="flex gap-1">
                  Confirming <LoaderCircle className="animate-spin" />
                </p>
              ) : Number(formik.values.amount) >
                Number(
                  balanceIDRX ? formatUnits(balanceIDRX as bigint, 2) : "0"
                ) ? (
                <p className="text-sm text-red-500">
                  Amount exceeds your IDRX balance
                </p>
              ) : (
                "Confirm Stake"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full rounded"
              size={"lg"}
              variant={"outline"}
              onClick={() => connect({ connector: injected() })}
            >
              <Wallet className="w-10 h-10" />
              Connect Wallet
            </Button>
          )}
        </CardFooter>
        <div className="max-w-5xl mx-auto text-center space-y-2">
          {failureReason && (
            <p className="max-w-xl">Error: {failureReason?.toString()}</p>
          )}
          {isReceiptError && (
            <p className="line-clamp-1">
              Error: {receiptFailureReason?.toString()}
            </p>
          )}
          {isSuccess && confirmed && <p>Transaction approved!</p>}
          {isSuccess && !confirming && (
            <div>
              <Link
                href={`https://sepolia-blockscout.lisk.com/tx/${hash}`}
                target="_blank"
              >
                <Button type="button" variant={"outline"}>
                  View Transaction Detail
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </form>
  );
}
