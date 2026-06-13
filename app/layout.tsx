import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-var",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
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
  applicationName: "circuitEvolve",
  authors: [{ name: "circuitEvolve" }],
  keywords: [
    "circuitEvolve",
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
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
