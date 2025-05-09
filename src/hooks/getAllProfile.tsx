import { createClient } from "@/config/supabase";
import React from "react";

type Profile = {
  id: string;
  username: string;
  name: string;
  bio: string;
  image_url: string;
};

export default function useGetAllProfile() {
  const [profile, setProfile] = React.useState<Profile[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error(error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { profile, loading };
}
