import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Autonomy, we build the automations your business runs on",
  description:
    "Your tools, your data, your process. We connect them so the work your team repeats every day happens without anyone doing it. Our own AI, hosted in Ireland.",
  openGraph: {
    title: "Autonomy, we build the automations your business runs on",
    description:
      "We connect the tools you already own so the work your team repeats every day happens without anyone doing it.",
    locale: "en_IE",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IE" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
