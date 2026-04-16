import {
  busRoutes,
  busStops,
  buses,
  challengeThemes,
  monthlyViolations,
  notifications,
  parkingLots,
  parkingSessions,
  parkingSlots,
  parkingRules,
  rootCauses,
  sensors,
  sqlSchema,
  users,
  violationHotspots
} from "@/lib/data/kfupm-data";
import { generateRecommendation } from "@/lib/engines/recommendations";
import { getAllowedLotsForUser } from "@/lib/engines/rules";

export function getDemoUser(userId = "user-nrm-01") {
  return users.find((user) => user.id === userId) ?? users[1];
}

export function getDashboardSnapshot(userId?: string) {
  const user = getDemoUser(userId);
  return {
    user,
    allowedLots: getAllowedLotsForUser(user),
    lots: parkingLots,
    sessions: parkingSessions.filter((session) => session.userId === user.id),
    notifications: notifications.filter((notification) => notification.userId === user.id),
    buses,
    routes: busRoutes,
    stops: busStops,
    recommendation: generateRecommendation({
      user,
      destination: user.favoriteBuildings[0] ?? "Building 22",
      expectedDurationHours: 3
    })
  };
}

export function getAdminSnapshot() {
  const occupiedCount = parkingSlots.filter((slot) => slot.status === "occupied").length;
  const availableCount = parkingSlots.filter((slot) => slot.status === "vacant").length;

  return {
    totals: {
      lots: parkingLots.length,
      slots: parkingLots.reduce((sum, lot) => sum + lot.totalSlots, 0),
      occupiedCount,
      availableCount,
      sensorsOnline: sensors.filter((sensor) => sensor.status === "online").length,
      sensorsOffline: sensors.filter((sensor) => sensor.status !== "online").length,
      busesActive: buses.filter((bus) => bus.status === "online").length,
      activeAlerts: notifications.filter((notification) => notification.readAt === null).length
    },
    challengeThemes,
    rootCauses,
    monthlyViolations,
    violationHotspots,
    rules: parkingRules,
    lots: parkingLots,
    slots: parkingSlots,
    sensors,
    buses,
    routes: busRoutes,
    stops: busStops,
    schema: sqlSchema
  };
}
