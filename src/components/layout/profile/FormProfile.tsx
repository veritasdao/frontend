"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/config/supabase";
import Image from "next/image";
import { useAccount } from "wagmi";
import React from "react";
import { toast } from "sonner";
import useGetProfile from "@/hooks/getProfile";

interface ProfileFormData {
  username: string;
  name: string;
  bio: string;
}

export default function FormProfile() {
  const { address } = useAccount();
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<ProfileFormData>({
    username: "",
    name: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<ProfileFormData>>({});

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof ProfileFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProfileFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (formData.bio.length > 500) {
      newErrors.bio = "Bio should be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSaveProfile() {
    if (!validateForm()) {
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      let imageUrl = null;

      if (image) {
        const data = new FormData();
        data.set("file", image);
        const uploadRequest = await fetch("/api/files", {
          method: "POST",
          body: data,
        });

        if (!uploadRequest.ok) {
          throw new Error("Failed to upload image");
        }

        const signedUrl = await uploadRequest.json();
        imageUrl = signedUrl;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: address,
        image_url: imageUrl,
        username: formData.username.trim(),
        name: formData.name.trim(),
        bio: formData.bio.trim(),
      });

      if (error) {
        throw error;
      }

      toast.success("Profile saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const { profile } = useGetProfile();
  console.log(profile);

  return (
    <section className="flex flex-col justify-center max-w-md mx-auto gap-5">
      <div>
        <h1 className="text-3xl font-bold">Create your profile</h1>
        <h2 className="text-gray-500">
          Create your profile to start investing in the best projects
        </h2>
      </div>
      <div className="space-y-2">
        <Label>Profile Image</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer"
        />
        {preview && (
          <div className="mt-2">
            <Image
              src={preview}
              alt="Profile Preview"
              width={150}
              height={150}
              className="object-cover rounded-md border border-[#1d4ed8]"
            />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label>Username</Label>
        <Input
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      <div className="space-y-2">
        <Label>Bio</Label>
        <Textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={3}
          className={`resize-none ${errors.bio ? "border-red-500" : ""}`}
          placeholder="Tell us about yourself"
        />
        {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
      </div>
      <Button
        onClick={handleSaveProfile}
        disabled={isLoading}
        className="self-end"
      >
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </section>
  );
}
