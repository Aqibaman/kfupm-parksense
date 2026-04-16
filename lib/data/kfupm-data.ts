import { buildDemoDate } from "@/lib/utils";
import type {
  AppNotification,
  Bus,
  BusRoute,
  BusStop,
  ChallengeMetric,
  ParkingLot,
  ParkingRule,
  ParkingSession,
  ParkingSlot,
  Sensor,
  User
} from "@/lib/types";

const defaultSettings = {
  push: true,
  email: true,
  sound: true,
  busAlerts: true,
  violationAlerts: true
};

export const users: User[] = [
  {
    id: "user-rm-01",
    name: "Ahmed Al-Dossary",
    studentId: "20230101",
    email: "ahmed.dossary@kfupm.edu.sa",
    passwordHash: "demo-resident-male",
    gender: "male",
    residencyStatus: "resident",
    userCategory: "resident-male",
    favoriteBuildings: ["Building 22", "Building 58", "Student Mall"],
    notificationSettings: defaultSettings,
    role: "student",
    createdAt: buildDemoDate("07:30"),
    updatedAt: buildDemoDate("17:10")
  },
  {
    id: "user-nrm-01",
    name: "Omar Al-Mutairi",
    studentId: "20210233",
    email: "omar.mutairi@kfupm.edu.sa",
    passwordHash: "demo-non-resident-male",
    gender: "male",
    residencyStatus: "non-resident",
    userCategory: "non-resident-male",
    favoriteBuildings: ["Building 64", "Building 4", "Building 22"],
    notificationSettings: defaultSettings,
    role: "student",
    createdAt: buildDemoDate("06:45"),
    updatedAt: buildDemoDate("17:05")
  },
  {
    id: "user-rf-01",
    name: "Raghad Al-Harbi",
    studentId: "20240177",
    email: "raghad.harbi@kfupm.edu.sa",
    passwordHash: "demo-resident-female",
    gender: "female",
    residencyStatus: "resident",
    userCategory: "resident-female",
    favoriteBuildings: ["Female Housing", "University Square", "Building 58"],
    notificationSettings: defaultSettings,
    role: "student",
    createdAt: buildDemoDate("08:15"),
    updatedAt: buildDemoDate("17:11")
  },
  {
    id: "user-nrf-01",
    name: "Noura Al-Shammari",
    studentId: "20220415",
    email: "noura.shammari@kfupm.edu.sa",
    passwordHash: "demo-non-resident-female",
    gender: "female",
    residencyStatus: "non-resident",
    userCategory: "non-resident-female",
    favoriteBuildings: ["Building 64", "Building 58", "Parking 404"],
    notificationSettings: defaultSettings,
    role: "student",
    createdAt: buildDemoDate("09:00"),
    updatedAt: buildDemoDate("17:20")
  },
  {
    id: "admin-ops-01",
    name: "Sara Al-Qahtani",
    studentId: "OPS1001",
    email: "mobility.ops@kfupm.edu.sa",
    passwordHash: "demo-admin",
    gender: "female",
    residencyStatus: "resident",
    userCategory: "resident-female",
    favoriteBuildings: ["Building 64", "Security HQ"],
    notificationSettings: defaultSettings,
    role: "admin",
    createdAt: buildDemoDate("06:00"),
    updatedAt: buildDemoDate("17:30")
  }
];

export const parkingLots: ParkingLot[] = [
  {
    id: "lot-19",
    lotCode: "19",
    lotName: "Lot 19 Academic East",
    type: "uncovered",
    zone: "Academic Perimeter",
    buildingCluster: "Buildings 4-22",
    totalSlots: 328,
    allowedCategories: ["non-resident-male", "non-resident-female"],
    timeRules: ["Student permit only", "After-hours academic parking after 5:00 PM"],
    specialNotes: ["High demand before 10:00 AM"],
    isProhibited: false,
    latitude: 26.3041,
    longitude: 50.1461,
    occupancyRate: 0.73,
    nearestStopIds: ["stop-303", "stop-312"],
    demandIndex: 86
  },
  {
    id: "lot-20",
    lotCode: "20",
    lotName: "Lot 20 Central Academic",
    type: "uncovered",
    zone: "Academic Perimeter",
    buildingCluster: "Buildings 4-22",
    totalSlots: 118,
    allowedCategories: ["non-resident-male", "non-resident-female"],
    timeRules: ["Student permit only", "After-hours academic parking after 5:00 PM"],
    specialNotes: ["Useful overflow lot for Building 4"],
    isProhibited: false,
    latitude: 26.3048,
    longitude: 50.1453,
    occupancyRate: 0.82,
    nearestStopIds: ["stop-303"],
    demandIndex: 80
  },
  {
    id: "lot-23",
    lotCode: "23",
    lotName: "Lot 23 Structured Parking",
    type: "covered",
    zone: "Academic Perimeter",
    buildingCluster: "North Academic",
    totalSlots: 471,
    allowedCategories: ["non-resident-male", "non-resident-female", "resident-female"],
    timeRules: ["Only level 3 for student permits noted in the guide"],
    specialNotes: ["Student access limited to level 3"],
    isProhibited: false,
    latitude: 26.3076,
    longitude: 50.1491,
    occupancyRate: 0.61,
    nearestStopIds: ["stop-304", "stop-319"],
    demandIndex: 74
  },
  {
    id: "lot-25",
    lotCode: "25",
    lotName: "Lot 25 Structured Parking",
    type: "covered",
    zone: "Academic Perimeter",
    buildingCluster: "North Academic",
    totalSlots: 223,
    allowedCategories: ["non-resident-male", "non-resident-female", "resident-female"],
    timeRules: ["Only level 2 for student permits noted in the guide"],
    specialNotes: ["Keep level-specific signage visible in app"],
    isProhibited: false,
    latitude: 26.308,
    longitude: 50.1495,
    occupancyRate: 0.48,
    nearestStopIds: ["stop-304", "stop-319"],
    demandIndex: 69
  },
  {
    id: "lot-39",
    lotCode: "39",
    lotName: "Physical Education Complex",
    type: "uncovered",
    zone: "Academic Perimeter",
    buildingCluster: "Sports Complex",
    totalSlots: 75,
    allowedCategories: ["non-resident-male", "resident-female", "non-resident-female"],
    timeRules: ["Standard student permit rules apply"],
    specialNotes: ["Violation hotspot in shared analytics"],
    isProhibited: false,
    latitude: 26.3029,
    longitude: 50.1542,
    occupancyRate: 0.55,
    nearestStopIds: ["stop-309"],
    demandIndex: 66
  },
  {
    id: "lot-57",
    lotCode: "57",
    lotName: "Preparatory Year Classrooms",
    type: "uncovered",
    zone: "Academic Perimeter",
    buildingCluster: "Preparatory Year",
    totalSlots: 230,
    allowedCategories: ["resident-female", "non-resident-female", "resident-male"],
    timeRules: ["Guide reference only, validate with security before deployment"],
    specialNotes: ["Mentioned as available in some guide pages"],
    isProhibited: false,
    latitude: 26.3004,
    longitude: 50.1506,
    occupancyRate: 0.58,
    nearestStopIds: ["stop-310"],
    demandIndex: 61
  },
  {
    id: "lot-59",
    lotCode: "59",
    lotName: "Lot 59 Covered",
    type: "covered",
    zone: "Academic Perimeter",
    buildingCluster: "Central Academic",
    totalSlots: 274,
    allowedCategories: ["non-resident-male", "non-resident-female", "resident-female"],
    timeRules: ["Operational use requires validation", "Shown in permits but also flagged in prohibited list"],
    specialNotes: ["Marked as conflicted source item", "Treat as restricted in rules engine"],
    isProhibited: true,
    latitude: 26.3018,
    longitude: 50.1512,
    occupancyRate: 0.92,
    nearestStopIds: ["stop-310", "stop-314"],
    demandIndex: 90
  },
  {
    id: "lot-60",
    lotCode: "60",
    lotName: "Stadium Parking",
    type: "uncovered",
    zone: "Student Services",
    buildingCluster: "Stadium and Recreation",
    totalSlots: 827,
    allowedCategories: ["resident-male", "non-resident-male", "resident-female", "non-resident-female"],
    timeRules: ["Student permit friendly", "Overflow lot for high-demand hours"],
    specialNotes: ["Good fallback when academic lots are saturated"],
    isProhibited: false,
    latitude: 26.2975,
    longitude: 50.1538,
    occupancyRate: 0.39,
    nearestStopIds: ["stop-311", "stop-900"],
    demandIndex: 58
  },
  {
    id: "lot-64",
    lotCode: "64",
    lotName: "Building 64 Multi-Level Parking",
    type: "covered",
    zone: "Building 64",
    buildingCluster: "Business and Classrooms",
    totalSlots: 575,
    allowedCategories: ["non-resident-male", "non-resident-female"],
    timeRules: ["Levels 1 and 2 are faculty/staff only", "Level 0, level 3, and uncovered 64 reserved for off-campus students"],
    specialNotes: ["Resident students are prohibited", "Highest violation hotspot in shared analytics"],
    isProhibited: false,
    latitude: 26.3062,
    longitude: 50.1518,
    occupancyRate: 0.88,
    nearestStopIds: ["stop-316", "stop-319"],
    demandIndex: 98
  },
  {
    id: "lot-71",
    lotCode: "71",
    lotName: "Lot 71 Covered",
    type: "covered",
    zone: "Student Housing Edge",
    buildingCluster: "Housing to Academic Transfer",
    totalSlots: 1170,
    allowedCategories: ["resident-male", "non-resident-male"],
    timeRules: ["Strong male-student capacity reserve"],
    specialNotes: ["High-capacity lot"],
    isProhibited: false,
    latitude: 26.2964,
    longitude: 50.1417,
    occupancyRate: 0.43,
    nearestStopIds: ["stop-301", "stop-305"],
    demandIndex: 54
  },
  {
    id: "lot-72",
    lotCode: "72",
    lotName: "Lot 72 Covered",
    type: "covered",
    zone: "Student Housing Edge",
    buildingCluster: "Housing to Academic Transfer",
    totalSlots: 1100,
    allowedCategories: ["resident-male", "non-resident-male"],
    timeRules: ["Strong male-student capacity reserve"],
    specialNotes: ["Balanced occupancy for daytime"],
    isProhibited: false,
    latitude: 26.2968,
    longitude: 50.1424,
    occupancyRate: 0.51,
    nearestStopIds: ["stop-302", "stop-305"],
    demandIndex: 57
  },
  {
    id: "lot-73",
    lotCode: "73",
    lotName: "Lot 73 Covered",
    type: "covered",
    zone: "Student Housing Edge",
    buildingCluster: "Mixed Student Access",
    totalSlots: 1108,
    allowedCategories: ["resident-male", "non-resident-male", "resident-female", "non-resident-female"],
    timeRules: ["Cross-category covered lot"],
    specialNotes: ["Common recommendation for female routes"],
    isProhibited: false,
    latitude: 26.2973,
    longitude: 50.1432,
    occupancyRate: 0.62,
    nearestStopIds: ["stop-305", "stop-900"],
    demandIndex: 71
  },
  {
    id: "lot-74",
    lotCode: "74",
    lotName: "Lot 74 Covered",
    type: "covered",
    zone: "Student Housing Edge",
    buildingCluster: "Mixed Student Access",
    totalSlots: 1155,
    allowedCategories: ["resident-male", "non-resident-male", "resident-female"],
    timeRules: ["General lot with after-hours flexibility"],
    specialNotes: ["Useful resident overflow lot"],
    isProhibited: false,
    latitude: 26.2982,
    longitude: 50.1439,
    occupancyRate: 0.57,
    nearestStopIds: ["stop-306", "stop-900"],
    demandIndex: 63
  },
  {
    id: "lot-77",
    lotCode: "77",
    lotName: "Lot 77 Covered",
    type: "covered",
    zone: "Academic Perimeter",
    buildingCluster: "Academic West",
    totalSlots: 416,
    allowedCategories: ["non-resident-male", "resident-female", "non-resident-female"],
    timeRules: ["Student access only at levels 1 and 2"],
    specialNotes: ["Level-based policy similar to the notices"],
    isProhibited: false,
    latitude: 26.3088,
    longitude: 50.1543,
    occupancyRate: 0.67,
    nearestStopIds: ["stop-314", "stop-319"],
    demandIndex: 78
  },
  {
    id: "lot-400",
    lotCode: "400",
    lotName: "Lot 400 West",
    type: "named",
    zone: "Female Access Corridor",
    buildingCluster: "West Campus",
    totalSlots: 140,
    allowedCategories: ["resident-female", "non-resident-female"],
    timeRules: ["Female-access focused parking"],
    specialNotes: ["Useful feeder lot to female bus system"],
    isProhibited: false,
    latitude: 26.2998,
    longitude: 50.1592,
    occupancyRate: 0.46,
    nearestStopIds: ["stop-404", "stop-900"],
    demandIndex: 52
  },
  {
    id: "lot-medical",
    lotCode: "27",
    lotName: "Medical Center Parking",
    type: "named",
    zone: "Medical Center",
    buildingCluster: "Clinic",
    totalSlots: 91,
    allowedCategories: ["resident-male", "non-resident-male", "resident-female", "non-resident-female"],
    timeRules: ["Shared medical access lot"],
    specialNotes: ["Small capacity, suitable for short stays"],
    isProhibited: false,
    latitude: 26.2994,
    longitude: 50.149,
    occupancyRate: 0.74,
    nearestStopIds: ["stop-311", "stop-900"],
    demandIndex: 76
  },
  {
    id: "lot-mall",
    lotCode: "MALL",
    lotName: "Student Mall Parking",
    type: "named",
    zone: "Student Services",
    buildingCluster: "Student Mall",
    totalSlots: 92,
    allowedCategories: ["resident-male", "non-resident-male", "non-resident-female"],
    timeRules: ["Mall-only purpose", "Two-hour limit in multiple notices"],
    specialNotes: ["Use only when visiting the mall"],
    isProhibited: false,
    latitude: 26.2957,
    longitude: 50.1462,
    occupancyRate: 0.69,
    nearestStopIds: ["stop-301", "stop-square"],
    demandIndex: 72
  },
  {
    id: "lot-dhahran-mosque",
    lotCode: "MOSQ-D",
    lotName: "Dhahran Grand Mosque",
    type: "named",
    zone: "Mosque Area",
    buildingCluster: "Mosque",
    totalSlots: 122,
    allowedCategories: ["resident-male", "non-resident-male"],
    timeRules: ["Male student access according to guide"],
    specialNotes: ["Useful overflow for resident males"],
    isProhibited: false,
    latitude: 26.2929,
    longitude: 50.1454,
    occupancyRate: 0.44,
    nearestStopIds: ["stop-301"],
    demandIndex: 46
  },
  {
    id: "lot-alzubair",
    lotCode: "MOSQ-Z",
    lotName: "Al-Zubair Mosque",
    type: "named",
    zone: "Mosque Area",
    buildingCluster: "Mosque",
    totalSlots: 245,
    allowedCategories: ["resident-male"],
    timeRules: ["Resident male access according to guide"],
    specialNotes: ["Longer walking distance to core classrooms"],
    isProhibited: false,
    latitude: 26.2914,
    longitude: 50.1447,
    occupancyRate: 0.31,
    nearestStopIds: ["stop-302"],
    demandIndex: 39
  },
  {
    id: "lot-female-housing",
    lotCode: "FH",
    lotName: "Female Housing Parking",
    type: "named",
    zone: "Housing Core",
    buildingCluster: "Female Housing",
    totalSlots: 180,
    allowedCategories: ["resident-female", "non-resident-female"],
    timeRules: ["Female housing permit zone"],
    specialNotes: ["Primary resident female home base"],
    isProhibited: false,
    latitude: 26.2942,
    longitude: 50.1603,
    occupancyRate: 0.47,
    nearestStopIds: ["stop-900", "stop-square"],
    demandIndex: 50
  },
  {
    id: "lot-university-square",
    lotCode: "SQUARE",
    lotName: "University Square",
    type: "named",
    zone: "Housing Core",
    buildingCluster: "University Square",
    totalSlots: 134,
    allowedCategories: ["resident-female", "non-resident-female"],
    timeRules: ["Female mobility anchor"],
    specialNotes: ["Weekend route destination"],
    isProhibited: false,
    latitude: 26.2951,
    longitude: 50.1581,
    occupancyRate: 0.53,
    nearestStopIds: ["stop-square", "stop-900"],
    demandIndex: 56
  }
];

const slotTemplates = [
  { lotId: "lot-64", prefix: "64", levels: ["L0", "L1", "L2", "L3", "U"] },
  { lotId: "lot-73", prefix: "73", levels: ["C1", "C2"] },
  { lotId: "lot-60", prefix: "60", levels: ["G"] },
  { lotId: "lot-19", prefix: "19", levels: ["G"] },
  { lotId: "lot-77", prefix: "77", levels: ["L1", "L2"] }
];

export const parkingSlots: ParkingSlot[] = slotTemplates.flatMap((template, lotIndex) =>
  template.levels.flatMap((level, levelIndex) =>
    Array.from({ length: 8 }, (_, index) => {
      const statusCycle = ["vacant", "occupied", "vacant", "occupied", "vacant", "vacant", "offline", "occupied"] as const;
      const status = statusCycle[(index + levelIndex + lotIndex) % statusCycle.length];
      return {
        id: `${template.lotId}-slot-${level}-${index + 1}`,
        lotId: template.lotId,
        slotCode: `${template.prefix}-${level}-${String(index + 1).padStart(2, "0")}`,
        floorLevel: level,
        isAccessible: index === 0 || index === 5,
        status,
        sensorId: `${template.lotId}-sensor-${level}-${index + 1}`,
        updatedAt: buildDemoDate(`17:${String(10 + index).padStart(2, "0")}`)
      };
    })
  )
);

export const sensors: Sensor[] = parkingSlots.slice(0, 22).map((slot, index) => ({
  id: slot.sensorId,
  sensorType: index % 2 === 0 ? "VL53L4CX" : "IR",
  deviceGroup: `Node-${Math.floor(index / 4) + 1}`,
  esp32Id: `ESP32-${(index % 2) + 1}`,
  raspberryPiId: "RPI4-GW-01",
  lotId: slot.lotId,
  slotId: slot.id,
  lastSeen: buildDemoDate(`17:${String((index * 2) % 60).padStart(2, "0")}`),
  status: index % 9 === 0 ? "warning" : index % 11 === 0 ? "offline" : "online",
  calibrationMeta: index % 2 === 0 ? "Range calibrated, confidence 98%" : "IR baseline calibrated, confidence 95%"
}));

export const busStops: BusStop[] = [
  {
    id: "stop-301",
    stopCode: "301",
    stopName: "Station 301",
    arabicName: "محطة 301",
    latitude: 26.2961,
    longitude: 50.1451,
    nearbyLots: ["lot-71", "lot-mall", "lot-dhahran-mosque"],
    servedBuildings: ["Student Mall", "Buildings 4-22"]
  },
  {
    id: "stop-302",
    stopCode: "302",
    stopName: "Station 302",
    arabicName: "محطة 302",
    latitude: 26.2966,
    longitude: 50.1444,
    nearbyLots: ["lot-72", "lot-alzubair"],
    servedBuildings: ["Housing", "Buildings 4-22"]
  },
  {
    id: "stop-303",
    stopCode: "303",
    stopName: "Station 303",
    arabicName: "محطة 303",
    latitude: 26.3046,
    longitude: 50.1456,
    nearbyLots: ["lot-19", "lot-20"],
    servedBuildings: ["Building 4", "Building 22", "Academic Core"]
  },
  {
    id: "stop-304",
    stopCode: "304",
    stopName: "Station 304",
    arabicName: "محطة 304",
    latitude: 26.3077,
    longitude: 50.1498,
    nearbyLots: ["lot-23", "lot-25"],
    servedBuildings: ["North Academic", "Building 22", "Building 58"]
  },
  {
    id: "stop-305",
    stopCode: "305",
    stopName: "Station 305",
    arabicName: "محطة 305",
    latitude: 26.2976,
    longitude: 50.1425,
    nearbyLots: ["lot-71", "lot-72", "lot-73"],
    servedBuildings: ["Housing", "Transfer Loop"]
  },
  {
    id: "stop-306",
    stopCode: "306",
    stopName: "Station 306",
    arabicName: "محطة 306",
    latitude: 26.2982,
    longitude: 50.1437,
    nearbyLots: ["lot-74"],
    servedBuildings: ["Housing", "Academic Connector"]
  },
  {
    id: "stop-309",
    stopCode: "309",
    stopName: "Station 309",
    arabicName: "محطة 309",
    latitude: 26.3027,
    longitude: 50.1551,
    nearbyLots: ["lot-39", "lot-57"],
    servedBuildings: ["Sports Complex", "Building 58"]
  },
  {
    id: "stop-310",
    stopCode: "310",
    stopName: "Station 310",
    arabicName: "محطة 310",
    latitude: 26.3017,
    longitude: 50.1521,
    nearbyLots: ["lot-57", "lot-59"],
    servedBuildings: ["Building 58", "Building 22", "Square"]
  },
  {
    id: "stop-311",
    stopCode: "311",
    stopName: "Station 311",
    arabicName: "محطة 311",
    latitude: 26.2989,
    longitude: 50.1527,
    nearbyLots: ["lot-60", "lot-medical"],
    servedBuildings: ["Medical Center", "Stadium", "Academic Core"]
  },
  {
    id: "stop-312",
    stopCode: "312",
    stopName: "Station 312",
    arabicName: "محطة 312",
    latitude: 26.3038,
    longitude: 50.1487,
    nearbyLots: ["lot-19", "lot-57"],
    servedBuildings: ["Building 22", "Academic Core"]
  },
  {
    id: "stop-314",
    stopCode: "314",
    stopName: "Station 314",
    arabicName: "محطة 314",
    latitude: 26.3034,
    longitude: 50.1533,
    nearbyLots: ["lot-59", "lot-77"],
    servedBuildings: ["Building 58", "Academic West"]
  },
  {
    id: "stop-316",
    stopCode: "316",
    stopName: "Station 316",
    arabicName: "محطة 316",
    latitude: 26.3059,
    longitude: 50.1515,
    nearbyLots: ["lot-64"],
    servedBuildings: ["Building 64", "DTV Shuttle", "Parking B.424"]
  },
  {
    id: "stop-319",
    stopCode: "319",
    stopName: "Station 319",
    arabicName: "محطة 319",
    latitude: 26.3066,
    longitude: 50.1538,
    nearbyLots: ["lot-64", "lot-23", "lot-77"],
    servedBuildings: ["Building 58", "Building 64", "Academic North"]
  },
  {
    id: "stop-404",
    stopCode: "404",
    stopName: "Parking 404",
    arabicName: "موقف 404",
    latitude: 26.2995,
    longitude: 50.1597,
    nearbyLots: ["lot-400"],
    servedBuildings: ["B404", "Female Loop"]
  },
  {
    id: "stop-900",
    stopCode: "900",
    stopName: "Parking 900",
    arabicName: "موقف 900",
    latitude: 26.2955,
    longitude: 50.1608,
    nearbyLots: ["lot-female-housing", "lot-73", "lot-74"],
    servedBuildings: ["Female Housing", "Clinic", "Building 22"]
  },
  {
    id: "stop-square",
    stopCode: "SQ",
    stopName: "University Square",
    arabicName: "ساحة الجامعة",
    latitude: 26.2953,
    longitude: 50.1585,
    nearbyLots: ["lot-university-square", "lot-female-housing", "lot-mall"],
    servedBuildings: ["Square", "Restaurant", "Housing"]
  }
];

export const busRoutes: BusRoute[] = [
  {
    id: "route-m1",
    routeCode: "M1",
    networkType: "male",
    routeName: "Male Route 1 Main Loop",
    startTime: "06:30",
    endTime: "17:30",
    frequencyText: "Every 10 minutes",
    notes: "Circular route covering stations 301, 302, 303, 304, 305, 306, and 311.",
    stopIds: ["stop-301", "stop-302", "stop-303", "stop-304", "stop-305", "stop-306", "stop-311"],
    servedBuildings: ["Building 4", "Building 22", "Student Mall", "Medical Center"]
  },
  {
    id: "route-m2",
    routeCode: "M2",
    networkType: "male",
    routeName: "Male Route 2 North Academic",
    startTime: "06:30",
    endTime: "17:30",
    frequencyText: "According to schedule",
    notes: "Runs mainly between stations 303, 304, and 308 as shown in the poster summary.",
    stopIds: ["stop-303", "stop-304", "stop-312"],
    servedBuildings: ["North Academic", "Building 22"]
  },
  {
    id: "route-m3",
    routeCode: "M3",
    networkType: "male",
    routeName: "Male Route 3 DTV Shuttle",
    startTime: "08:00",
    endTime: "16:00",
    frequencyText: "Table 1 departures",
    notes: "Station 316 to Dhahran Techno Valley and back.",
    stopIds: ["stop-316"],
    servedBuildings: ["Dhahran Techno Valley"]
  },
  {
    id: "route-m4",
    routeCode: "M4",
    networkType: "male",
    routeName: "Male Route 4 Parking B.424",
    startTime: "08:00",
    endTime: "16:00",
    frequencyText: "Scheduled service",
    notes: "Station 316 to Parking B.424 and return.",
    stopIds: ["stop-316"],
    servedBuildings: ["Parking B.424"]
  },
  {
    id: "route-f1",
    routeCode: "F1",
    networkType: "female",
    routeName: "Female Route 1 Clinic Connector",
    startTime: "06:30",
    endTime: "17:30",
    frequencyText: "Every 10 minutes",
    notes: "Parking 900 to Parking 404 to clinic area and return.",
    stopIds: ["stop-900", "stop-404", "stop-311"],
    servedBuildings: ["Clinic", "Female Housing", "B404"]
  },
  {
    id: "route-f2",
    routeCode: "F2",
    networkType: "female",
    routeName: "Female Route 2 Long Loop",
    startTime: "06:30",
    endTime: "17:30",
    frequencyText: "Every 10 minutes",
    notes: "Long loop including station 312, building 22, station 319, building 58, station 309, station 310, station 314.",
    stopIds: ["stop-900", "stop-311", "stop-312", "stop-319", "stop-309", "stop-310", "stop-314"],
    servedBuildings: ["Building 22", "Building 58", "Square"]
  },
  {
    id: "route-f6",
    routeCode: "F6",
    networkType: "female",
    routeName: "Female Route 6 Evening Loop",
    startTime: "14:30",
    endTime: "21:30",
    frequencyText: "Every 10 minutes",
    notes: "Evening service between station 310, station 312, building 22, station 314, square, restaurant, and parking 900.",
    stopIds: ["stop-310", "stop-312", "stop-314", "stop-square", "stop-900"],
    servedBuildings: ["Building 22", "Square", "Restaurant", "Female Housing"]
  },
  {
    id: "route-f8",
    routeCode: "F8",
    networkType: "female",
    routeName: "Female Route 8 DTV Shuttle",
    startTime: "08:00",
    endTime: "16:00",
    frequencyText: "Table 1 departures",
    notes: "Station 316 to station 319 to station 310 to DTV.",
    stopIds: ["stop-316", "stop-319", "stop-310"],
    servedBuildings: ["Dhahran Techno Valley", "Building 64", "Building 58"]
  }
];

export const buses: Bus[] = [
  {
    id: "bus-m1-a",
    busCode: "M-101",
    networkType: "male",
    routeId: "route-m1",
    currentStopId: "stop-303",
    currentLat: 26.3046,
    currentLng: 50.1458,
    etaMeta: "5 min to Station 304",
    status: "online"
  },
  {
    id: "bus-m3-a",
    busCode: "M-301",
    networkType: "male",
    routeId: "route-m3",
    currentStopId: "stop-316",
    currentLat: 26.3059,
    currentLng: 50.1515,
    etaMeta: "Departs 9:00 AM DTV run",
    status: "warning"
  },
  {
    id: "bus-f2-a",
    busCode: "F-202",
    networkType: "female",
    routeId: "route-f2",
    currentStopId: "stop-319",
    currentLat: 26.3065,
    currentLng: 50.1537,
    etaMeta: "4 min to Station 309",
    status: "online"
  },
  {
    id: "bus-f6-a",
    busCode: "F-606",
    networkType: "female",
    routeId: "route-f6",
    currentStopId: "stop-square",
    currentLat: 26.2953,
    currentLng: 50.1585,
    etaMeta: "Starts evening loop at 2:30 PM",
    status: "online"
  }
];

export const parkingRules: ParkingRule[] = [
  {
    id: "rule-core-after-hours",
    category: "all",
    lotId: "all-academic",
    levelRule: "General academic lots",
    allowedFrom: "17:00",
    allowedUntil: "07:00",
    specialRestriction: "Does not override permanently prohibited lots.",
    notes: "Parking in academic building lots is generally allowed after 5:00 PM until 7:00 AM."
  },
  {
    id: "rule-curfew-commuters",
    category: "non-resident-male",
    lotId: "all",
    levelRule: "Campus curfew",
    allowedFrom: "00:00",
    allowedUntil: "22:00",
    specialRestriction: "Must leave by 10:00 PM.",
    notes: "Applies to non-resident male students."
  },
  {
    id: "rule-curfew-commuters-female",
    category: "non-resident-female",
    lotId: "all",
    levelRule: "Campus curfew",
    allowedFrom: "00:00",
    allowedUntil: "22:00",
    specialRestriction: "Must leave by 10:00 PM.",
    notes: "Applies to non-resident female students."
  },
  {
    id: "rule-64-offcampus",
    category: "non-resident-male",
    lotId: "lot-64",
    levelRule: "L0, L3, uncovered",
    allowedFrom: "00:00",
    allowedUntil: "22:00",
    specialRestriction: "Levels 1 and 2 faculty/staff only.",
    notes: "Building 64 special notice for off-campus students."
  },
  {
    id: "rule-64-offcampus-female",
    category: "non-resident-female",
    lotId: "lot-64",
    levelRule: "L0, L3, uncovered",
    allowedFrom: "00:00",
    allowedUntil: "22:00",
    specialRestriction: "Levels 1 and 2 faculty/staff only.",
    notes: "Building 64 special notice for off-campus students."
  },
  {
    id: "rule-64-residents-block",
    category: "resident-male",
    lotId: "lot-64",
    levelRule: "All student-access levels blocked",
    allowedFrom: "00:00",
    allowedUntil: "00:00",
    specialRestriction: "Resident students prohibited.",
    notes: "Resident students cannot park in Building 64 areas reserved for off-campus students."
  },
  {
    id: "rule-64-residents-block-female",
    category: "resident-female",
    lotId: "lot-64",
    levelRule: "All student-access levels blocked",
    allowedFrom: "00:00",
    allowedUntil: "00:00",
    specialRestriction: "Resident students prohibited.",
    notes: "Resident students cannot park in Building 64 areas reserved for off-campus students."
  }
];

export const parkingSessions: ParkingSession[] = [
  {
    id: "session-01",
    userId: "user-nrm-01",
    lotId: "lot-64",
    slotId: "lot-64-slot-L0-2",
    startedAt: buildDemoDate("16:40"),
    expectedEndAt: buildDemoDate("21:55"),
    actualEndAt: null,
    currentStatus: "warning",
    violationRisk: "high",
    nearestStopId: "stop-316"
  },
  {
    id: "session-02",
    userId: "user-rf-01",
    lotId: "lot-73",
    slotId: "lot-73-slot-C1-1",
    startedAt: buildDemoDate("15:05"),
    expectedEndAt: buildDemoDate("18:10"),
    actualEndAt: null,
    currentStatus: "active",
    violationRisk: "low",
    nearestStopId: "stop-900"
  }
];

export const notifications: AppNotification[] = [
  {
    id: "notif-01",
    userId: "user-nrm-01",
    type: "violation-warning",
    title: "Commuter curfew approaching",
    message: "You are parked in Building 64. You must leave before 10:00 PM to avoid a violation.",
    severity: "critical",
    createdAt: buildDemoDate("21:25"),
    readAt: null,
    actionUrl: "/parking/session"
  },
  {
    id: "notif-02",
    userId: "user-nrm-01",
    type: "bus-arrival",
    title: "Bus arriving near Building 64",
    message: "Station 316 has a shuttle expected in 6 minutes.",
    severity: "info",
    createdAt: buildDemoDate("17:18"),
    readAt: null,
    actionUrl: "/buses"
  },
  {
    id: "notif-03",
    userId: "user-rm-01",
    type: "lot-status",
    title: "Lot 71 has good availability",
    message: "Lot 71 is only 43% occupied and is a strong option for resident male students.",
    severity: "success",
    createdAt: buildDemoDate("17:01"),
    readAt: buildDemoDate("17:12"),
    actionUrl: "/parking/lot-71"
  },
  {
    id: "notif-04",
    userId: "user-rf-01",
    type: "special-rule",
    title: "Building 64 restricted",
    message: "Resident students are prohibited from the student-access areas of Building 64.",
    severity: "warning",
    createdAt: buildDemoDate("16:52"),
    readAt: null,
    actionUrl: "/rules"
  }
];

export const challengeThemes: ChallengeMetric[] = [
  { label: "Resident parking restrictions", value: 129 },
  { label: "Parking far from buildings", value: 100 },
  { label: "Lots full / no spaces", value: 74 },
  { label: "Restricted empty areas", value: 72 },
  { label: "Unclear rules / violations", value: 41 },
  { label: "Traffic congestion", value: 29 },
  { label: "Faculty-only allocation", value: 20 }
];

export const rootCauses: ChallengeMetric[] = [
  { label: "Resident car usage", value: 21 },
  { label: "Insufficient capacity", value: 17 },
  { label: "Growing student body", value: 11 },
  { label: "Empty restricted zones", value: 9 },
  { label: "Poor planning and layout", value: 9 },
  { label: "Faculty over-allocation", value: 7 }
];

export const monthlyViolations: ChallengeMetric[] = [
  { label: "Jul 2025", value: 151 },
  { label: "Aug 2025", value: 44 },
  { label: "Sep 2025", value: 733 },
  { label: "Oct 2025", value: 430 },
  { label: "Nov 2025", value: 349 },
  { label: "Dec 2025", value: 378 },
  { label: "Jan 2026", value: 841 },
  { label: "Feb 2026", value: 223 }
];

export const violationHotspots: ChallengeMetric[] = [
  { label: "Parking Building 64", value: 728 },
  { label: "Student Complex Parking", value: 383 },
  { label: "Parking No. 11", value: 318 },
  { label: "Parking Building 59", value: 221 },
  { label: "Parking Building 68", value: 179 },
  { label: "Physical Education Complex / 39", value: 100 }
];

export const sqlSchema = `create table users (
  id text primary key,
  name text not null,
  student_id text not null unique,
  email text not null unique,
  password_hash text not null,
  gender text not null,
  residency_status text not null,
  user_category text not null,
  favorite_buildings jsonb not null default '[]',
  notification_settings jsonb not null default '{}',
  role text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create table parking_lots (
  id text primary key,
  lot_code text not null unique,
  lot_name text not null,
  type text not null,
  zone text not null,
  building_cluster text not null,
  total_slots integer not null,
  allowed_categories jsonb not null,
  time_rules jsonb not null,
  special_notes jsonb not null,
  is_prohibited boolean not null default false,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null
);

create table parking_slots (
  id text primary key,
  lot_id text not null references parking_lots(id),
  slot_code text not null,
  floor_level text not null,
  is_accessible boolean not null default false,
  status text not null,
  sensor_id text not null,
  updated_at timestamptz not null
);

create table sensors (
  id text primary key,
  sensor_type text not null,
  device_group text not null,
  esp32_id text not null,
  raspberry_pi_id text not null,
  lot_id text not null references parking_lots(id),
  slot_id text not null references parking_slots(id),
  last_seen timestamptz not null,
  status text not null,
  calibration_meta text not null
);

create table bus_routes (
  id text primary key,
  route_code text not null,
  network_type text not null,
  route_name text not null,
  start_time text not null,
  end_time text not null,
  frequency_text text not null,
  notes text not null
);

create table bus_stops (
  id text primary key,
  stop_code text not null,
  stop_name text not null,
  arabic_name text not null,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  nearby_lots jsonb not null,
  served_buildings jsonb not null
);

create table buses (
  id text primary key,
  bus_code text not null,
  network_type text not null,
  route_id text not null references bus_routes(id),
  current_stop_id text not null references bus_stops(id),
  current_lat numeric(9,6) not null,
  current_lng numeric(9,6) not null,
  eta_meta text not null,
  status text not null
);

create table parking_rules (
  id text primary key,
  category text not null,
  lot_id text not null,
  level_rule text not null,
  allowed_from text not null,
  allowed_until text not null,
  special_restriction text not null,
  notes text not null
);

create table parking_sessions (
  id text primary key,
  user_id text not null references users(id),
  lot_id text not null references parking_lots(id),
  slot_id text not null references parking_slots(id),
  started_at timestamptz not null,
  expected_end_at timestamptz not null,
  actual_end_at timestamptz,
  current_status text not null,
  violation_risk text not null,
  nearest_stop_id text not null references bus_stops(id)
);

create table notifications (
  id text primary key,
  user_id text not null references users(id),
  type text not null,
  title text not null,
  message text not null,
  severity text not null,
  created_at timestamptz not null,
  read_at timestamptz,
  action_url text not null
);`;
