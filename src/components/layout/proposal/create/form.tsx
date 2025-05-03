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
import {
  injected,
  useAccount,
  useConnect,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { DAOABI, DAOToken, IDRXABI, IDRXToken } from "@/config/DAO";
import { parseUnits } from "viem";
import { LoaderCircle } from "lucide-react";
import useGetProfile from "@/hooks/getProfile";
import { useRouter } from "next/navigation";

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
  nameToken: string;
  symbolToken: string;
};

const VOTING_DURATION = 3 * 24 * 60 * 60; // 3 days in seconds
const FUNDRAISING_DURATION = 4 * 24 * 60 * 60; // 4 days in seconds
const DEADLINE_BUFFER = 60; // 1 minute buffer

export default function Form() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();

  const router = useRouter();
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const { profile, loading } = useGetProfile();

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

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
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
      toast("No image selected");
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
          functionName: "createCommunityProposal",
          args: [
            {
              title: values.title,
              image: signedUrl,
              github: values.github,
              whitepaper: values.whitepaper,
              ownerLink: values.ownerLink,
              description: values.description,
              motivasi: values.motivasi,
              rincian: values.rincian,
              keuntungan: values.keuntungan,
              tantangan: values.tantangan,
              dampakdanhasil: values.dampak_dan_hasil,
              name: values.nameToken,
              symbol: values.symbolToken,
              requestedAmount: parseUnits(values.amount.toString(), 2),
              votingDeadline:
                Math.floor(Date.now() / 1000) +
                VOTING_DURATION +
                DEADLINE_BUFFER,
              fundraisingDeadline:
                Math.floor(Date.now() / 1000) + FUNDRAISING_DURATION,
            },
          ],
        });
      } else {
        toast("Image not saved");
      }
    } catch (error) {
      toast(String(error));
    }
  }

  React.useEffect(() => {
    if (isSuccess && confirmed) {
      toast("Proposal created successfully!", {
        action: {
          label: "View Details",
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
      nameToken: "",
      symbolToken: "",
      amount: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please fill in the Title"),
      github: Yup.string().required("Please fill in the Github"),
      whitepaper: Yup.string().required("Please fill in the Whitepaper"),
      ownerLink: Yup.string().required("Please fill in the Owner Link"),
      description: Yup.string().required("Please fill in the Description"),
      motivasi: Yup.string().required("Please fill in the Motivation"),
      rincian: Yup.string().required("Please fill in the Project Details"),
      keuntungan: Yup.string().required("Please fill in the Benefits"),
      tantangan: Yup.string().required("Please fill in the Challenges"),
      dampak_dan_hasil: Yup.string().required(
        "Please fill in the Expected Impact & Results"
      ),
      nameToken: Yup.string().required("Please fill in the Token Name"),
      symbolToken: Yup.string().required("Please fill in the Token Symbol"),
      amount: Yup.string().required("Please fill in the Requested Funding"),
    }),
    onSubmit: createProposal,
  });

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
            Connect Account
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border rounded-md p-4 w-fit mx-auto">
        <div className="flex items-center gap-1">
          <p className="text-muted-foreground">Loading</p>
          <LoaderCircle className="animate-spin" />
        </div>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="border rounded-md p-4 w-fit mx-auto">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">Profile Required</h1>
          <p className="text-muted-foreground">
            You need to create a profile before you can submit a proposal.
          </p>
          <Button onClick={() => router.push("/profile")}>
            Create Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-8" onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section className="space-y-6">
          <div className="space-y-2">
            <Label>Proposal Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              aria-label="Proposal Image"
            />
            {preview && (
              <div className="mt-2 relative w-fit">
                <Image
                  src={preview}
                  alt="Proposal Preview"
                  width={500}
                  height={500}
                  className="object-cover rounded-md border border-blue-700"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                  aria-label="Remove Image"
                >
                  X
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Proposal Title</Label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. Blockchain Education Platform for Beginners"
              aria-invalid={!!(formik.touched.title && formik.errors.title)}
              aria-describedby="title-error"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm" id="title-error">
                {formik.errors.title}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Short Description</Label>
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Briefly describe the idea or project being proposed"
              aria-invalid={
                !!(formik.touched.description && formik.errors.description)
              }
              aria-describedby="description-error"
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-sm" id="description-error">
                {formik.errors.description}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Project Details</Label>
            <Textarea
              name="rincian"
              value={formik.values.rincian}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Details of stages, features, or implementation steps"
              aria-invalid={!!(formik.touched.rincian && formik.errors.rincian)}
              aria-describedby="rincian-error"
            />
            {formik.touched.rincian && formik.errors.rincian && (
              <div className="text-red-500 text-sm" id="rincian-error">
                {formik.errors.rincian}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Motivation</Label>
            <Textarea
              name="motivasi"
              value={formik.values.motivasi}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="What is the main reason for submitting this proposal? What problem do you want to solve?"
              aria-invalid={
                !!(formik.touched.motivasi && formik.errors.motivasi)
              }
              aria-describedby="motivasi-error"
            />
            {formik.touched.motivasi && formik.errors.motivasi && (
              <div className="text-red-500 text-sm" id="motivasi-error">
                {formik.errors.motivasi}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <Label>Benefits</Label>
            <Textarea
              name="keuntungan"
              value={formik.values.keuntungan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="What are the benefits or added value of this project for the community/ecosystem?"
              aria-invalid={
                !!(formik.touched.keuntungan && formik.errors.keuntungan)
              }
              aria-describedby="keuntungan-error"
            />
            {formik.touched.keuntungan && formik.errors.keuntungan && (
              <div className="text-red-500 text-sm" id="keuntungan-error">
                {formik.errors.keuntungan}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Challenges</Label>
            <Textarea
              name="tantangan"
              value={formik.values.tantangan}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="What challenges or obstacles might be faced?"
              aria-invalid={
                !!(formik.touched.tantangan && formik.errors.tantangan)
              }
              aria-describedby="tantangan-error"
            />
            {formik.touched.tantangan && formik.errors.tantangan && (
              <div className="text-red-500 text-sm" id="tantangan-error">
                {formik.errors.tantangan}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Expected Impact & Results</Label>
            <Textarea
              name="dampak_dan_hasil"
              value={formik.values.dampak_dan_hasil}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Describe the positive impact and concrete results you want to achieve"
              aria-invalid={
                !!(
                  formik.touched.dampak_dan_hasil &&
                  formik.errors.dampak_dan_hasil
                )
              }
              aria-describedby="dampak-error"
            />
            {formik.touched.dampak_dan_hasil &&
              formik.errors.dampak_dan_hasil && (
                <div className="text-red-500 text-sm" id="dampak-error">
                  {formik.errors.dampak_dan_hasil}
                </div>
              )}
          </div>
          <section className="grid xl:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Github Link</Label>
              <Input
                name="github"
                value={formik.values.github}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://github.com/projectname"
                aria-invalid={!!(formik.touched.github && formik.errors.github)}
                aria-describedby="github-error"
              />
              {formik.touched.github && formik.errors.github && (
                <div className="text-red-500 text-sm" id="github-error">
                  {formik.errors.github}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Whitepaper/Documentation Link</Label>
              <Input
                name="whitepaper"
                value={formik.values.whitepaper}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://gitbook.com/ or docs link"
                aria-invalid={
                  !!(formik.touched.whitepaper && formik.errors.whitepaper)
                }
                aria-describedby="whitepaper-error"
              />
              {formik.touched.whitepaper && formik.errors.whitepaper && (
                <div className="text-red-500 text-sm" id="whitepaper-error">
                  {formik.errors.whitepaper}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Social Media/Personal Link</Label>
              <Input
                name="ownerLink"
                value={formik.values.ownerLink}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://twitter.com/username or https://linkedin.com/in/username"
                aria-invalid={
                  !!(formik.touched.ownerLink && formik.errors.ownerLink)
                }
                aria-describedby="ownerLink-error"
              />
              {formik.touched.ownerLink && formik.errors.ownerLink && (
                <div className="text-red-500 text-sm" id="ownerLink-error">
                  {formik.errors.ownerLink}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Requested Funding (IDRX)</Label>
              <Input
                name="amount"
                type="number"
                min={1}
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. 2500"
                aria-invalid={!!(formik.touched.amount && formik.errors.amount)}
                aria-describedby="amount-error"
              />
              {formik.touched.amount && formik.errors.amount && (
                <div className="text-red-500 text-sm" id="amount-error">
                  {formik.errors.amount}
                </div>
              )}
            </div>
            <hr className="col-span-2" />
            <div className="space-y-5 col-span-2">
              <p className="text-muted-foreground font-semibold">
                Community Token (if approved)
              </p>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Token Name</Label>
                  <Input
                    name="nameToken"
                    value={formik.values.nameToken}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. IDRX"
                    aria-invalid={
                      !!(formik.touched.nameToken && formik.errors.nameToken)
                    }
                    aria-describedby="nameToken-error"
                  />
                  {formik.touched.nameToken && formik.errors.nameToken && (
                    <div className="text-red-500 text-sm" id="nameToken-error">
                      {formik.errors.nameToken}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Token Symbol</Label>
                  <Input
                    name="symbolToken"
                    value={formik.values.symbolToken}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. IDRX"
                    aria-invalid={
                      !!(
                        formik.touched.symbolToken && formik.errors.symbolToken
                      )
                    }
                    aria-describedby="symbolToken-error"
                  />
                  {formik.touched.symbolToken && formik.errors.symbolToken && (
                    <div
                      className="text-red-500 text-sm"
                      id="symbolToken-error"
                    >
                      {formik.errors.symbolToken}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          {isSuccess && confirmed && (
            <div className="flex justify-end mt-6">
              <p className="text-muted-foreground font-semibold">
                Proposal created successfully!
              </p>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button
              size={"lg"}
              disabled={uploading || isPending || confirming || isSuccess}
              type="submit"
              aria-busy={uploading || isPending || confirming || isSuccess}
            >
              {uploading || isPending || confirming ? (
                <div className="flex items-center gap-2">
                  Validating Proposal <LoaderCircle className="animate-spin" />
                </div>
              ) : (
                "Save Proposal"
              )}
            </Button>
          </div>
        </section>
      </div>
    </form>
  );
}
