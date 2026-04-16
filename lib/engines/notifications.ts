import { notifications, parkingSessions, users } from "@/lib/data/kfupm-data";
import { getPermissionWindow } from "@/lib/engines/rules";

export function getNotificationsForUser(userId: string) {
  return notifications.filter((notification) => notification.userId === userId);
}

export function getAlertState(userId: string) {
  const user = users.find((item) => item.id === userId);
  const session = parkingSessions.find((item) => item.userId === userId && item.actualEndAt === null);

  if (!user) {
    return { title: "No user selected", severity: "info", countdownTo: null };
  }

  const permissionWindow = getPermissionWindow(user);

  if (!session) {
    return {
      title: "No active parking session",
      severity: "success",
      countdownTo: permissionWindow.safeUntil
    };
  }

  return {
    title: session.violationRisk === "high" ? "Move your vehicle soon" : "Session active",
    severity: session.violationRisk === "high" ? "critical" : "warning",
    countdownTo: session.expectedEndAt
  };
}

