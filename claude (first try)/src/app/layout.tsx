import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
})

const title = "Autonomy | We automate what your team repeats"
const description =
  "We design, build, and run business automations across 1,000+ tools. Live in 2-6 weeks and hosted in Ireland."

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, locale: "en_IE", type: "website" },
}

export const viewport: Viewport = {
  themeColor: "#0a0b0c",
  colorScheme: "dark",
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
