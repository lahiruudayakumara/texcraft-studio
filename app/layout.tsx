import type { Metadata } from "next";
import { AppBootSplash } from "@/components/providers/AppBootSplash";
import { LocalWorkspaceProvider } from "@/components/providers/LocalWorkspaceProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TexCraft Studio",
  description: "A folder-based LaTeX workspace with smarter revision flows and a richer UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LocalWorkspaceProvider>
          <AppBootSplash>{children}</AppBootSplash>
        </LocalWorkspaceProvider>
      </body>
    </html>
  );
}
