import "@/styles/globals.css";

import { poppins } from "@/lib/fonts";
import { type Metadata } from "next";
import { Toaster } from "sonner";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Rag Worm",
  description: "Talk to PDF's with the RAGWORM AI.",
  icons: [{ rel: "icon", url: "/worm.jpeg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <Toaster richColors />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
