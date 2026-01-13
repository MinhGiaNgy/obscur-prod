import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ //I absolutely hate this font because of Clion and I hope no one reads this
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  fallback: ["monospace"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Minh Gia Nguyen's portfolio",
  description: "Junior CS student at MSU", // hopefully no longer unemployed
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
