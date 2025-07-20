import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { shadesOfPurple } from "@clerk/themes";

import { Toaster } from "sonner";
import Header from "./components/Header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "%s | Domestic",
    default: "Domestic",
  },
  description: "A platform connecting domestic workers and employers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      dynamic
      appearance={{
        baseTheme: shadesOfPurple,
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#000",
          colorInputBackground: "#2D3748",
          colorInputText: "#F3F4F6",
        },
        elements: {
          formButtonPrimary: "bg-indigo-800 hover:bg-indigo-900 text-white",
          card: "gradient-background2",
          headerTitle: "text-indigo-800",
          headerSubtitle: "text-purple-700",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          {/* Animated Background */}
          <div className="animated-bg fixed -z-10 inset-0 opacity-90" />
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            {/* HEADER */}
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
            <footer className="gradient-background2 py-12 bg-opacity-20">
              <div className="mx-auto px-4 text-center text-gray-300">
                <p>
                  © {new Date().getFullYear()} CodeNow101. All Rights Reserved
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
