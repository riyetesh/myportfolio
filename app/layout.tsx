import type { Metadata, Viewport } from "next";
import { Grand_Hotel } from "next/font/google";
import "./globals.css";

// Instagram-wordmark-style script for the site wordmark.
const instagramScript = Grand_Hotel({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instagram",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Riteshfolio · Ritesh Yadav",
    template: "%s | Riteshfolio",
  },
  description: "Ritesh Yadav is a software engineer focused on ICT, data analytics, systems and thoughtful products.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f7f4",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={instagramScript.variable}>
      <body>{children}</body>
    </html>
  );
}
