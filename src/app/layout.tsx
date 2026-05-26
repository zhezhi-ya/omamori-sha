import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const bodyFont = Noto_Sans_SC({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const displayFont = Noto_Serif_SC({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

function getMetadataBase(): URL {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return new URL("http://localhost:3000");
  }

  try {
    return new URL(siteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "御守社",
    template: "%s | 御守社",
  },
  description: "从博丽神社、红魔馆或永远亭进入明亮日式二次元签文场景，抽取今日东方Project同人风格签文。",
  applicationName: "御守社",
  category: "entertainment",
  creator: "御守社",
  publisher: "御守社",
  keywords: ["签文", "签册", "抽签", "东方Project", "二次元网页", "沉浸式前端", "幻想乡"],
  authors: [{ name: "御守社" }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/ui/app-icon.svg",
    shortcut: "/images/ui/app-icon.svg",
    apple: "/images/ui/app-icon.svg",
  },
  openGraph: {
    title: "御守社",
    description: "从博丽神社、红魔馆或永远亭进入明亮动漫风今日签文场景。",
    siteName: "御守社",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "御守社",
    description: "从博丽神社、红魔馆或永远亭进入明亮动漫风今日签文场景。",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffedf3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      data-scroll-behavior="smooth"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background-base text-ink-primary">
        <a href="#main-content" className="skip-link">
          跳到主内容
        </a>
        {children}
      </body>
    </html>
  );
}
