import {
  busRoutes,
  busStops,
  buses,
  notifications,
  parkingLots,
  parkingRules,
  parkingSessions,
  parkingSlots,
  sensors,
  users
} from "@/lib/data/kfupm-data";

export function buildSeedPayload() {
  return {
    users,
    parkingLots,
    parkingSlots,
    sensors,
    busRoutes,
    busStops,
    buses,
    parkingRules,
    parkingSessions,
    notifications
  };
}

export function getSeedSummary() {
  return {
    users: users.length,
    lots: parkingLots.length,
    slots: parkingSlots.length,
    sensors: sensors.length,
    routes: busRoutes.length,
    stops: busStops.length,
    buses: buses.length,
    rules: parkingRules.length,
    sessions: parkingSessions.length,
    notifications: notifications.length
  };
}
