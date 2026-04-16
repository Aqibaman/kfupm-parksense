import type { UserCategory } from "@/lib/types";

export const appName = "KFUPM ParkSense";
export const appDescription = "An IoT-enabled smart parking, bus guidance, and rule-aware mobility dashboard for KFUPM.";

export const categoryMeta: Record<
  UserCategory,
  {
    label: string;
    shortLabel: string;
    color: string;
    accent: string;
    buttonClass: string;
    chipClass: string;
    previewClass: string;
    primary: string;
    soft: string;
    border: string;
    text: string;
  }
> = {
  "resident-male": {
    label: "Resident Male Students",
    shortLabel: "RM",
    color: "bg-[#d8efe4] text-[#003E51] border-[#008540]/20",
    accent: "from-[#008540] to-[#0f6c3a]",
    buttonClass: "border-[#008540] bg-[#e8f5ee] text-[#003E51] hover:bg-[#d8efe4]",
    chipClass: "bg-[#008540]",
    previewClass: "bg-[#008540]",
    primary: "#008540",
    soft: "#e8f5ee",
    border: "#8bc79f",
    text: "#003E51"
  },
  "non-resident-male": {
    label: "Non-Resident (Commuter) Male Students",
    shortLabel: "NRM",
    color: "bg-[#ece4f4] text-[#003E51] border-[#7c4d99]/20",
    accent: "from-[#7c4d99] to-[#6a3b8e]",
    buttonClass: "border-[#7c4d99] bg-[#f5effb] text-[#003E51] hover:bg-[#ece4f4]",
    chipClass: "bg-[#7c4d99]",
    previewClass: "bg-[#7c4d99]",
    primary: "#7c4d99",
    soft: "#f5effb",
    border: "#c9aed8",
    text: "#003E51"
  },
  "resident-female": {
    label: "Resident Female Students",
    shortLabel: "RF",
    color: "bg-[#fde4ee] text-[#003E51] border-[#f25f96]/20",
    accent: "from-[#f25f96] to-[#ef4f86]",
    buttonClass: "border-[#f25f96] bg-[#fff0f6] text-[#003E51] hover:bg-[#fde4ee]",
    chipClass: "bg-[#f25f96]",
    previewClass: "bg-[#f25f96]",
    primary: "#f25f96",
    soft: "#fff0f6",
    border: "#f7a5c1",
    text: "#003E51"
  },
  "non-resident-female": {
    label: "Non-Resident (Commuter) Female Students",
    shortLabel: "NRF",
    color: "bg-[#fff1f7] text-[#003E51] border-[#f48ab1]/25",
    accent: "from-[#f48ab1] to-[#f25f96]",
    buttonClass: "border-[#f48ab1] bg-[repeating-linear-gradient(135deg,#fff6f9_0px,#fff6f9_10px,#ffdbe9_10px,#ffdbe9_20px)] text-[#003E51] hover:bg-[repeating-linear-gradient(135deg,#fff1f7_0px,#fff1f7_10px,#ffd1e3_10px,#ffd1e3_20px)]",
    chipClass: "bg-[repeating-linear-gradient(135deg,#f25f96_0px,#f25f96_7px,#ffd1e3_7px,#ffd1e3_14px)]",
    previewClass: "bg-[repeating-linear-gradient(135deg,#fff6f9_0px,#fff6f9_10px,#f48ab1_10px,#f48ab1_20px)]",
    primary: "#f48ab1",
    soft: "#fff1f7",
    border: "#f7b9cf",
    text: "#003E51"
  }
};

export const kfupmTheme = {
  background: "#ffffff",
  surface: "#D9DAE4",
  petrol: "#003E51",
  green: "#008540",
  ink: "#111111"
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
