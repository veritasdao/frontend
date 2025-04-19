"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { DAOABI, DAOToken, IDRXABI, IDRXToken } from "@/config/DAO";
import { parseUnits } from "viem";
import { LoaderCircle } from "lucide-react";

type valuesFormType = {
  title: string;
  github: string;
  whitepaper: string;
  ownerLink: string;
  description: string;
  motivasi: string;
  rincian: string;
  keuntungan: string;
  tantangan: string;
  dampak_dan_hasil: string;
  amount: string;
};

export default function Form() {
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const {
    data: hash,
    writeContractAsync,
    isPending,
    isSuccess,
  } = useWriteContract();

  const { isLoading: confirming, isSuccess: confirmed } =
    useWaitForTransactionReceipt({
      hash: hash,
    });

  async function createProposal(values: valuesFormType) {
    if (!image) {
      toast("Tidak ada foto yang dipilih");
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.set("file", image);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      setUploading(false);

      if (signedUrl) {
        await writeContractAsync({
          abi: IDRXABI,
          address: IDRXToken,
          functionName: "approve",
          args: [DAOToken, parseUnits(values.amount.toString(), 2)],
        });

        await writeContractAsync({
          abi: DAOABI,
          address: DAOToken,
          functionName: "createProposal",
          args: [
            values.title,
            signedUrl,
            values.github,
            values.whitepaper,
            values.ownerLink,
            values.description,
            values.motivasi,
            values.rincian,
            values.keuntungan,
            values.tantangan,
            values.dampak_dan_hasil,
            parseUnits(values.amount.toString(), 2),
          ],
        });
      } else {
        toast("Foto belum tersimpan");
      }
    } catch (error) {
      toast(String(error));
    }
  }

  React.useEffect(() => {
    if (isSuccess && confirmed) {
      toast("Proposal berhasil dibuat!", {
        action: {
          label: "Lihat Detail",
          onClick: () =>
            window.open(
              `https://sepolia-blockscout.lisk.com/tx/${hash}`,
              "_blank"
            ),
        },
      });
    }
  }, [isSuccess, confirmed, hash]);

  const formik = useFormik({
    initialValues: {
      title: "",
      github: "",
      whitepaper: "",
      ownerLink: "",
      description: "",
      motivasi: "",
      rincian: "",
      keuntungan: "",
      tantangan: "",
      dampak_dan_hasil: "",
      amount: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Mohon mengisikan Title"),
      github: Yup.string().required("Mohon mengisikan github"),
      whitepaper: Yup.string().required("Mohon mengisikan whitepaper"),
      ownerLink: Yup.string().required("Mohon mengisikan ownerLink"),
      description: Yup.string().required("Mohon mengisikan description"),
      motivasi: Yup.string().required("Mohon mengisikan motivasi"),
      rincian: Yup.string().required("Mohon mengisikan rincian"),
      keuntungan: Yup.string().required("Mohon mengisikan keuntungan"),
      tantangan: Yup.string().required("Mohon mengisikan tantangan"),
      dampak_dan_hasil: Yup.string().required(
        "Mohon mengisikan dampak dan hasil"
      ),
      amount: Yup.string().required(
        "Mohon mengisikan jumlah dana yang di inginkan"
      ),
    }),
    onSubmit: createProposal,
  });

  return (
    <form className="space-y-5" onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-2 gap-10">
        <section className="space-y-5">
          <div className="space-y-2">
            <Label>Foto Proposal</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <div className="mt-2">
                <Image
                  src={preview}
                  alt="Preview Proposal"
                  width={500}
                  height={500}
                  className="object-cover rounded-md border border-[#1d4ed8]"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Judul Proposal</Label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Contoh: Platform Edukasi Blockchain untuk Pemula"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Deskripsi Singkat</Label>
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Jelaskan secara ringkas tentang ide atau project yang diajukan"
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-sm">
                {formik.errors.description}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Rincian Project</Label>
            <Textarea
              name="rincian"
              value={formik.values.rincian}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Rincian tahapan, fitur, atau langkah-langkah implementasi"
            />
            {formik.touched.rincian && formik.errors.rincian && (
              <div className="text-red-500 text-sm">
                {formik.errors.rincian}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Motivasi</Label>
            <Textarea
              name="motivasi"
              value={formik.values.motivasi}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Apa alasan utama kamu mengajukan proposal ini? Masalah apa yang ingin diselesaikan?"
            />
            {formik.touched.motivasi && formik.errors.motivasi && (
              <div className="text-red-500 text-sm">
                {formik.errors.motivasi}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-5">
          <div className="space-y-2">
            <Label>Keuntungan/Manfaat</Label>
            <Textarea
              name="keuntungan"
              value={formik.values.keuntungan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Apa manfaat atau nilai tambah project ini bagi komunitas/ekosistem?"
            />
            {formik.touched.keuntungan && formik.errors.keuntungan && (
              <div className="text-red-500 text-sm">
                {formik.errors.keuntungan}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Tantangan</Label>
            <Textarea
              name="tantangan"
              value={formik.values.tantangan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Apa saja tantangan atau hambatan yang mungkin dihadapi?"
            />
            {formik.touched.tantangan && formik.errors.tantangan && (
              <div className="text-red-500 text-sm">
                {formik.errors.tantangan}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Dampak & Hasil yang Diharapkan</Label>
            <Textarea
              name="dampak_dan_hasil"
              value={formik.values.dampak_dan_hasil}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Ceritakan dampak positif dan hasil konkret yang ingin dicapai"
            />
            {formik.touched.dampak_dan_hasil &&
              formik.errors.dampak_dan_hasil && (
                <div className="text-red-500 text-sm">
                  {formik.errors.dampak_dan_hasil}
                </div>
              )}
          </div>
          <section className="grid xl:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Link Github</Label>
              <Input
                name="github"
                value={formik.values.github}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://github.com/namaproject"
              />
              {formik.touched.github && formik.errors.github && (
                <div className="text-red-500 text-sm">
                  {formik.errors.github}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Link Whitepaper/Dokumentasi</Label>
              <Input
                name="whitepaper"
                value={formik.values.whitepaper}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://gitbook.com/ atau link docs"
              />
              {formik.touched.whitepaper && formik.errors.whitepaper && (
                <div className="text-red-500 text-sm">
                  {formik.errors.whitepaper}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Link Social Media/Personal</Label>
              <Input
                name="ownerLink"
                value={formik.values.ownerLink}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://twitter.com/username atau https://linkedin.com/in/username"
              />
              {formik.touched.ownerLink && formik.errors.ownerLink && (
                <div className="text-red-500 text-sm">
                  {formik.errors.ownerLink}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Jumlah Dana yang Diminta (IDRX)</Label>
              <Input
                name="amount"
                type="number"
                min={1}
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Contoh: 2500"
              />
              {formik.touched.amount && formik.errors.amount && (
                <div className="text-red-500 text-sm">
                  {formik.errors.amount}
                </div>
              )}
            </div>
          </section>
          <div className="flex justify-end">
            <Button
              size={"lg"}
              disabled={uploading || isPending || confirming}
              type="submit"
            >
              {uploading || isPending || confirming ? (
                <div className="flex items-center gap-1">
                  memvalidasi Proposal <LoaderCircle className="animate-spin" />
                </div>
              ) : (
                "Simpan Proposal"
              )}
            </Button>
          </div>
        </section>
      </div>
    </form>
  );
}
