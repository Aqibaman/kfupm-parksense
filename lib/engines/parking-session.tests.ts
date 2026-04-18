import {
  buildSessionInputFromUser,
  getAlertsPageData,
  getParkingPageData,
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

  const smokeUser = {
    id: "smoke-user",
    name: "Smoke User",
    studentId: "20219999",
    email: "smoke@kfupm.edu.sa",
    passwordHash: "",
    gender: "male" as const,
    residencyStatus: "non-resident" as const,
    userCategory: "non-resident-male" as const,
    favoriteBuildings: ["Building 22"],
    notificationSettings: {
      push: true,
      email: false,
      sound: true,
      busAlerts: true,
      violationAlerts: true
    },
    role: "student" as const,
    createdAt: "",
    updatedAt: ""
  };

  const session = startParkingSession(buildSessionInputFromUser(smokeUser, "lot-73", "F1", "73-09", null));
  const parkingData = getParkingPageData(session, new Date("2026-04-19T21:15:00"));
  const alertsPage = getAlertsPageData(session, new Date("2026-04-19T21:15:00"));

  return {
    failures,
    smoke: {
      nearestBusStop: parkingData.guidance.nearestBusStop?.label ?? null,
      countdowns: alertsPage.countdowns.length,
      alerts: alertsPage.alerts.length
    }
  };
}

