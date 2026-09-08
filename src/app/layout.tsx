import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Maverick Barbería",
  description: "Sistema de Fidelización Maverick Barbería",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased bg-[#050505] text-white min-h-[100dvh] relative overflow-x-clip selection:bg-white/30`}
      >
        {/* Fondo Dinámico Global */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-160 h-160 bg-zinc-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse duration-8000" />
          <div className="absolute bottom-[-20%] right-[-10%] w-200 h-200 bg-zinc-800/20 rounded-full mix-blend-screen filter blur-[120px] animate-pulse duration-10000" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Contenido de la Aplicación */}
        <div className="relative z-10 w-full min-h-[100dvh]">
          {children}
        </div>
        <Toaster theme="dark" position="top-center" />

        {/* Registro del Service Worker para PWA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
