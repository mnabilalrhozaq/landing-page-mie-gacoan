import type { Metadata, Viewport } from "next";
import { Amatic_SC, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const amaticSC = Amatic_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-amatic",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Mie Gacoan - Restoran Mie Pedas No. 1 di Indonesia",
  description: "Mie Gacoan adalah jaringan restoran mie pedas No. 1 di Indonesia. Nikmati menu mie pedas, dimsum lezat, dan minuman segar dengan harga terjangkau.",
  keywords: ["Mie Gacoan", "Mie Pedas", "Mie Setan", "Mie Iblis", "Dimsum Gacoan", "Kuliner Indonesia", "Makanan Pedas"],
  authors: [{ name: "Mie Gacoan Team" }],
  openGraph: {
    title: "Mie Gacoan - Restoran Mie Pedas No. 1 di Indonesia",
    description: "Mie Gacoan adalah jaringan restoran mie pedas No. 1 di Indonesia. Nikmati menu mie pedas, dimsum lezat, dan minuman segar dengan harga terjangkau.",
    url: "https://miegacoan.com",
    siteName: "Mie Gacoan",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mie Gacoan - Restoran Mie Pedas No. 1 di Indonesia",
    description: "Mie Gacoan adalah jaringan restoran mie pedas No. 1 di Indonesia. Nikmati menu mie pedas, dimsum lezat, dan minuman segar dengan harga terjangkau.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${amaticSC.variable} ${plusJakartaSans.variable} scroll-smooth`}
    >
      <body className="bg-light text-dark font-body antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
