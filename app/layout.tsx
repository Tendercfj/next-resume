import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Resume",
  description: "一份基于 Next.js、Neon 和 shadcn/ui 构建的个人简历。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
