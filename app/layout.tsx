import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CircuitEvolve | Repository-Scale RTL Evolution",
  description:
    "A monochromatic technical interface for CircuitEvolve: LLM-guided RTL mutation, closed-loop EDA verification, and PPA-benchmarked hardware architecture reconstruction.",
  applicationName: "CircuitEvolve",
  authors: [{ name: "CircuitEvolve" }],
  keywords: [
    "CircuitEvolve",
    "RTL evolution",
    "EDA",
    "Yosys",
    "OpenROAD",
    "Synopsys Design Compiler",
    "PPA benchmarking",
    "LLM mutation graphs",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
