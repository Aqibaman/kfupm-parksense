import {
  buildAlertsFromRules,
  buildSmartGuidance,
  BUS_STOP_LOCATIONS,
  BUILDING_DESTINATIONS,
  evaluateParkingRules,
  getAlertsPageData,
  getParkingModalData,
  PARKING_LOT_LOCATIONS,
  parkingSessionTests,
  startParkingSession
} from "@/lib/engines/parking-session";

export const parkingSessionTestResults = parkingSessionTests.map((test) => ({
  name: test.name,
  passed: test.run()
}));

export function runParkingSessionAssertions() {
  const failures = parkingSessionTestResults.filter((result) => !result.passed);

  if (failures.length) {
    throw new Error(`Parking session assertions failed: ${failures.map((failure) => failure.name).join(", ")}`);
  }

  const smokeSession = startParkingSession({
    userId: "smoke-user",
    category: "non_resident_male",
    lotId: "lot-25",
    floorKey: "F2",
    slotId: "lot-25-F2-03",
    parkedAt: new Date("2026-04-18T21:15:00").toISOString(),
    parkedCoordinates: { lat: 26.308, lng: 50.1495 },
    preferredDestinationBuildingId: "building_22"
  });

  const rules = evaluateParkingRules(smokeSession, new Date("2026-04-18T21:20:00"));
  const alerts = buildAlertsFromRules(smokeSession, rules, new Date("2026-04-18T21:20:00"));
  const modal = getParkingModalData(smokeSession, new Date("2026-04-18T21:20:00"));
  const alertsPage = getAlertsPageData(smokeSession, new Date("2026-04-18T21:20:00"));
  const guidance = buildSmartGuidance(smokeSession, PARKING_LOT_LOCATIONS, BUS_STOP_LOCATIONS, BUILDING_DESTINATIONS);

  return {
    failures,
    smoke: {
      alerts: alerts.length,
      modalLotName: modal.lotName,
      alertsPageCountdowns: alertsPage.countdowns.length,
      nearestBusStop: guidance.nearestBusStop?.label ?? null
    }
  };
}
