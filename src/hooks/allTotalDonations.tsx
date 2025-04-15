import { useGetTotalDonations } from "./getTotalDonations";

export default function useAllTotalDonations(length: number) {
  const donations = Array.from({ length }, (_, i) => useGetTotalDonations({ index: i }));
  return donations;
}
