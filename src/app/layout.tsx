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
    "Veritas is a web3 DAO crowdfunding and public funding platform based on donations built on the LISK network with IDRX token.",
  openGraph: {
    title: "Veritas DAO",
    description:
      "Veritas is a web3 DAO crowdfunding and public funding platform based on donations built on the LISK network with IDRX token.",
    url: "https://www.veritasdao.xyz",
    type: "website",
    images: [
      {
        url: "https://brown-glamorous-bear-418.mypinata.cloud/ipfs/bafkreiewce7qrp3hpg3fagiq6fegtcyzkkxkfhfsbfcdo2rh5qjgii5qiu", // URL gambar untuk Open Graph
        alt: "Veritas DAO",
        width: 1200,
        height: 630,
      },
    ],
  },
  authors: [
    {
      name: "Kazuya Team",
      url: "https://www.veritasdao.xyz",
    },
  ],

  keywords:
    "crowdfunding, public funding, DAO, LISK, IDRX, donations, web3, blockchain, crowdfunding platform, public funding platform, DAO platform, LISK network, IDRX token, donations platform, crowdfunding platform, public funding platform, DAO platform, LISK network, IDRX token, donations platform",
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
