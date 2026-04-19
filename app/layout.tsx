import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./generated.css";
import { ParkingSessionProvider } from "@/components/providers/parking-session-provider";
import { StudentProfileProvider } from "@/components/providers/student-profile-provider";

export const metadata: Metadata = {
  title: "KFUPM ParkWise",
  description: "An IoT-enabled smart parking, bus guidance, and rule-aware mobility dashboard for KFUPM."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="overflow-x-hidden">
        <StudentProfileProvider>
          <ParkingSessionProvider>{children}</ParkingSessionProvider>
        </StudentProfileProvider>
      </body>
    </html>
  );
}
