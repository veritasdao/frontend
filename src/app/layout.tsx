import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Web3Provider } from "@/config/Web3Provider";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  display: "swap",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Veritas DAO",
  description:
    "Veritas adalah platform web3 DAO crowdfunding dan pendanaan publik berbasis donasi yang dibangun di atas jaringan LISK dengan token IDRX.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Web3Provider>{children}</Web3Provider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
