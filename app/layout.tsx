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
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
try {
  const key = 'next-resume-theme';
  const stored = localStorage.getItem(key);
  const theme = stored === 'light' || stored === 'dark'
    ? stored
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
} catch {}
`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col print:block print:min-h-0">
        {children}
      </body>
    </html>
  );
}
