import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const metadata = {
  title: "Syncrodes | AI DevOps Platform",
  description: "AI-powered incident response and predictive operations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
