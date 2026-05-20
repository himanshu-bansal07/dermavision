import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatAssistant from "@/components/ChatAssistant";

export const metadata: Metadata = {
  title: "DermaVision AI — Medical-Grade AI Skincare Insights",
  description: "Upload a selfie to receive instant, browser-side AI skincare analyses, health score mapping, and personalized routines using TensorFlow.js and clinical rules.",
  keywords: ["skincare AI", "dermatology analysis", "acne checker", "skin scan", "skincare routines"],
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-cyber-dark dark:bg-cyber-dark light:bg-slate-50 text-foreground transition-all duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col relative bg-grid-cyber">
            {/* ambient glow bubbles */}
            <div className="pointer-events-none absolute top-[-100px] left-[-100px] h-[500px] w-[500px] bg-radial-gradient blur-3xl opacity-60 dark:opacity-60 light:opacity-20" />
            <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-[500px] w-[500px] bg-radial-gradient blur-3xl opacity-40 dark:opacity-40 light:opacity-10" />

            <Header />
            
            <main className="flex-1 flex flex-col relative z-10">
              {children}
            </main>

            <ChatAssistant />
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
