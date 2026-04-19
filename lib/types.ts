export type Gender = "male" | "female";
export type ResidencyStatus = "resident" | "non-resident";
export type UserCategory =
  | "resident-male"
  | "non-resident-male"
  | "resident-female"
  | "non-resident-female";
export type SystemRole = "student" | "admin";
export type LotType = "covered" | "uncovered" | "named";
export type SlotStatus = "occupied" | "vacant" | "offline" | "unknown";
export type SensorType = "VL53L4CX" | "IR";
export type DeviceStatus = "online" | "offline" | "warning";
export type BusNetworkType = "male" | "female";
export type NotificationSeverity = "info" | "warning" | "critical" | "success";
export type SessionStatus = "active" | "completed" | "violating" | "warning";

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  sound: boolean;
  busAlerts: boolean;
  violationAlerts: boolean;
}

export interface User {
  id: string;
  name: string;
  studentId: string;
  email: string;
  passwordHash: string;
  gender: Gender;
  residencyStatus: ResidencyStatus;
  userCategory: UserCategory;
  favoriteBuildings: string[];
  notificationSettings: NotificationSettings;
  role: SystemRole;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingLot {
  id: string;
  lotCode: string;
  lotName: string;
  type: LotType;
  zone: string;
  buildingCluster: string;
  totalSlots: number;
  allowedCategories: UserCategory[];
  timeRules: string[];
  specialNotes: string[];
  isProhibited: boolean;
  latitude: number;
  longitude: number;
  occupancyRate: number;
  nearestStopIds: string[];
  demandIndex: number;
}

export interface ParkingSlot {
  id: string;
  lotId: string;
  slotCode: string;
  floorLevel: string;
  isAccessible: boolean;
  status: SlotStatus;
  sensorId: string;
  updatedAt: string;
}

export interface Sensor {
  id: string;
  sensorType: SensorType;
  deviceGroup: string;
  esp32Id: string;
  raspberryPiId: string;
  lotId: string;
  slotId: string;
  lastSeen: string;
  status: DeviceStatus;
  calibrationMeta: string;
}

export interface BusRoute {
  id: string;
  routeCode: string;
  networkType: BusNetworkType;
  routeName: string;
  startTime: string;
  endTime: string;
  frequencyText: string;
  notes: string;
  stopIds: string[];
  servedBuildings: string[];
}

export interface BusStop {
  id: string;
  stopCode: string;
  stopName: string;
  arabicName: string;
  latitude: number;
  longitude: number;
  nearbyLots: string[];
  servedBuildings: string[];
}

export interface Bus {
  id: string;
  busCode: string;
  networkType: BusNetworkType;
  routeId: string;
  currentStopId: string;
  currentLat: number;
  currentLng: number;
  etaMeta: string;
  status: DeviceStatus;
}

export interface ParkingRule {
  id: string;
  category: UserCategory | "all";
  lotId: string;
  levelRule: string;
  allowedFrom: string;
  allowedUntil: string;
  specialRestriction: string;
  notes: string;
}

export interface ParkingSession {
  id: string;
  userId: string;
  lotId: string;
  slotId: string;
  startedAt: string;
  expectedEndAt: string;
  actualEndAt: string | null;
  currentStatus: SessionStatus;
  violationRisk: "low" | "medium" | "high";
  nearestStopId: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  createdAt: string;
  readAt: string | null;
  actionUrl: string;
}

export interface RecommendationResult {
  recommendedLotId: string | null;
  recommendedSlotId: string | null;
  alternatives: string[];
  nearestStopId: string | null;
  suggestedRouteId: string | null;
  warning: string | null;
  score: number;
  explanation: string[];
  shouldUseBus: boolean;
}

export interface ChallengeMetric {
  label: string;
  value: number;
}

export type RouteNetwork = "male" | "female";

export interface RouteStop {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  order: number;
}

export interface RoutePathPoint {
  coordinates: { lat: number; lng: number };
  stopId?: string;
  stopName?: string;
}

export interface RouteServiceWindow {
  start: string;
  end: string;
}

export interface RouteSchedule {
  serviceWindow: RouteServiceWindow;
  specialTimetable?: Array<{
    label: string;
    departure: string;
    return?: string;
  }>;
}

export interface LiveMapBusRoute {
  id: string;
  code: string;
  network: RouteNetwork;
  name: string;
  timingLabel: string;
  stops: RouteStop[];
  pathPoints: RoutePathPoint[];
  schedule: RouteSchedule;
  serviceNote?: string;
  defaultBusNumbers: string[];
  segmentTravelSeconds: number;
  dwellSeconds: number;
}

export interface ActiveBus {
  id: string;
  busNumber: string;
  routeId: string;
  segmentIndex: number;
  progress: number;
  direction: 1 | -1;
  status: "running" | "boarding" | "layover" | "inactive";
  currentCoordinates: { lat: number; lng: number };
  nextStopId?: string;
  currentStopId?: string;
  nextStopName?: string;
  currentStopName?: string;
  phaseSeconds: number;
}

export interface BusSimulationState {
  routeId: string;
  buses: ActiveBus[];
  inService: boolean;
  lastUpdatedIso: string;
  nextStopSummary: string[];
}
