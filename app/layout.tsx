import type { Metadata } from "next";
import "./generated.css";
import { StudentProfileProvider } from "@/components/providers/student-profile-provider";

export const metadata: Metadata = {
  title: "KFUPM ParkSense",
  description: "An IoT-enabled smart parking, bus guidance, and rule-aware mobility dashboard for KFUPM."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <StudentProfileProvider>{children}</StudentProfileProvider>
      </body>
    </html>
  );
}
