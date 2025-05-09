import { createClient } from "@/config/supabase";
import React from "react";
import { useAccount } from "wagmi";

type Profile = {
  id: string;
  username: string;
  name: string;
  bio: string;
  image_url: string;
};

export default function useGetProfile() {
  const { address } = useAccount();
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", address)
        .maybeSingle();

      if (error) {
        console.error(error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [address]);

  return { profile, loading };
}
