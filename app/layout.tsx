import type { Metadata } from "next";
import "./generated.css";

export const metadata: Metadata = {
  title: "KFUPM ParkSense",
  description: "An IoT-enabled smart parking, bus guidance, and rule-aware mobility dashboard for KFUPM."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
