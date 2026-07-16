import type { Metadata } from "next";
import { Inter, Sarabun } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { ErrorBoundary, Toasts } from "@/components/ui";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบการเงินคริสตจักรชีวิตสุขสันต์กาฬสินธุ์",
  description:
    "ระบบบริหารจัดการรายรับ-รายจ่ายสำหรับคริสตจักร ครบวงจร ใช้งานง่าย",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${inter.variable} ${sarabun.variable}`}
    >
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <AppProvider>
              {children}
              <Toasts />
            </AppProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
