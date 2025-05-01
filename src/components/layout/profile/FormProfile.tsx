"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React from "react";

export default function FormProfile() {
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  // const [uploading, setUploading] = React.useState<boolean>(false);

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
  return (
    <section className="flex flex-col justify-center max-w-md mx-auto h-[calc(100vh-10rem)] gap-5">
      <div>
        <h1 className="text-3xl font-bold">Create your profile</h1>
        <h2 className="text-gray-500">
          Create your profile to start investing in the best projects
        </h2>
      </div>
      <div className="space-y-2">
        <Label>Profile Image</Label>
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
        <Label>Username</Label>
        <Input />
      </div>
      <div className="space-y-2">
        <Label>Name</Label>
        <Input />
      </div>
      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea rows={3} className="resize-none" />
      </div>
      <Button className="self-end">Save Profile</Button>
    </section>
  );
}
