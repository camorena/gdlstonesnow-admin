import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { ThemeProvider } from "./(public)/components/theme-provider";

const heading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GDL Stone Snow LLC | Landscaping & Snow Removal Bloomington MN",
    template: "%s | GDL Stone Snow LLC",
  },
  description:
    "GDL Stone Snow LLC offers expert landscaping, masonry, lawn care & snow removal in Bloomington MN & the Twin Cities metro. Serving since 2003. Free estimates!",
  metadataBase: new URL("https://gdlstonesnow.com"),
  openGraph: {
    siteName: "GDL Stone Snow LLC",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
        alt: "GDL Stone Snow LLC - Landscaping and Snow Removal in Bloomington MN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${heading.variable} ${body.variable} font-sans antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const theme = localStorage.getItem('gdl-theme');
            const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (isDark) document.documentElement.classList.add('dark');
          } catch {}
        ` }} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
