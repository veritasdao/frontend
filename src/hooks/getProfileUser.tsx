import { createClient } from "@/config/supabase";
import React from "react";

type Profile = {
  id: string;
  username: string;
  name: string;
  bio: string;
  image_url: string;
};

export default function useGetProfileUser({
  userAddress,
}: {
  userAddress: string;
}) {
  const [profile, setProfile] = React.useState<Profile | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!userAddress) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userAddress)
        .single();

      if (error) {
        console.error(error);
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [userAddress]);

  return { profile };
}
