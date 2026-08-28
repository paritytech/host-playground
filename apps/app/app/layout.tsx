import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Host Playground",
  description: "Interactive playground for testing the Polkadot Product SDK",
};

// viewportFit cover lets env(safe-area-inset-*) resolve inside a notched Host
// webview so the mobile bar and log sheet clear the notch and home indicator.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {process.env.NODE_ENV === "development" && (
          // Bridge to a local `truapi-host dev` signing host,
          //  so the playground runs in a plain browser tab
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src="http://127.0.0.1:9955/bootstrap.js" />
        )}
        {children}
      </body>
    </html>
  );
}
