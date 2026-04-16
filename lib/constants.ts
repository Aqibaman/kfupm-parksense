import type { UserCategory } from "@/lib/types";

export const appName = "KFUPM ParkSense";
export const appDescription = "An IoT-enabled smart parking, bus guidance, and rule-aware mobility dashboard for KFUPM.";

export const categoryMeta: Record<
  UserCategory,
  { label: string; shortLabel: string; color: string; accent: string }
> = {
  "resident-male": {
    label: "Resident Male Student",
    shortLabel: "RM",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    accent: "from-emerald-500 to-emerald-700"
  },
  "non-resident-male": {
    label: "Non-Resident Male Student",
    shortLabel: "NRM",
    color: "bg-violet-100 text-violet-800 border-violet-200",
    accent: "from-violet-500 to-violet-700"
  },
  "resident-female": {
    label: "Resident Female Student",
    shortLabel: "RF",
    color: "bg-pink-100 text-pink-800 border-pink-200",
    accent: "from-pink-500 to-rose-600"
  },
  "non-resident-female": {
    label: "Non-Resident Female Student",
    shortLabel: "NRF",
    color: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    accent: "from-fuchsia-500 to-pink-700"
  }
};

export const mainNavigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/parking", label: "Parking" },
  { href: "/buses", label: "Buses" },
  { href: "/recommendations", label: "AI Guide" },
  { href: "/notifications", label: "Alerts" },
  { href: "/rules", label: "Rules" },
  { href: "/profile", label: "Profile" }
] as const;

export const adminNavigation = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/sensors", label: "Sensors" },
  { href: "/admin/lots", label: "Lots" },
  { href: "/admin/rules", label: "Rules Engine" },
  { href: "/admin/buses", label: "Bus Ops" },
  { href: "/admin/analytics", label: "Analytics" }
] as const;

export const projectSections = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/architecture", label: "Architecture" },
  { href: "/implementation", label: "Implementation" },
  { href: "/competition-insights", label: "Competition Insights" }
] as const;

export const hardwareInventory = [
  "VL53L4CX sensor - 4 pcs",
  "IR sensor - 4 pcs",
  "ESP32 (MON32R8V) - 2 pcs",
  "Raspberry Pi 4 Model B - 1 pc",
  "RPi adaptor, 32GB microSD, HDMI to microHDMI cable",
  "Jumper wires - 15 to 20 pcs"
];

export const systemPipeline = [
  "Parking Slot Sensor",
  "ESP32",
  "Raspberry Pi Gateway",
  "Cloud Backend / Database",
  "API",
  "Web App Dashboard / Mobile View"
];

export const prohibitedLots = ["5", "11", "14", "18", "21", "59", "68"];
