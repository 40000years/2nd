import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "2nd - ของมือสองคุณภาพดี",
  description: "เว็บไซต์ขายของมือสองคุณภาพดี ราคาเป็นมิตร ปลอดภัย ไว้ใจได้",
  keywords: "ของมือสอง, second hand, ขายของ, ซื้อของ, ราคาถูก",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
