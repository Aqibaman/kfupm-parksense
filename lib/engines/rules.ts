import { parkingLots, parkingRules } from "@/lib/data/kfupm-data";
import { prohibitedLots } from "@/lib/constants";
import { buildDemoDate, formatTimeLabel } from "@/lib/utils";
import type { ParkingLot, User, UserCategory } from "@/lib/types";

export function getUserCategoryFromProfile(gender: User["gender"], residencyStatus: User["residencyStatus"]): UserCategory {
  if (gender === "male" && residencyStatus === "resident") return "resident-male";
  if (gender === "male" && residencyStatus === "non-resident") return "non-resident-male";
  if (gender === "female" && residencyStatus === "resident") return "resident-female";
  return "non-resident-female";
}

export function getLotPermission(user: User, lot: ParkingLot, currentTime = "17:30") {
  const reasons: string[] = [];
  const categoryAllowed = lot.allowedCategories.includes(user.userCategory);

  if (lot.isProhibited || prohibitedLots.includes(lot.lotCode)) {
    return {
      allowed: false,
      reasons: ["This lot is listed as prohibited or restricted in the shared parking documents."]
    };
  }

  if (lot.id === "lot-64") {
    if (user.residencyStatus === "resident") {
      return {
        allowed: false,
        reasons: ["Building 64 student-access areas are reserved for off-campus students. Residents are prohibited."]
      };
    }

    reasons.push("Allowed only at level 0, level 3, and uncovered 64.");
    reasons.push("Levels 1 and 2 remain faculty and staff only.");
  }

  if (!categoryAllowed) {
    return {
      allowed: false,
      reasons: ["Your permit category is not assigned to this parking lot."]
    };
  }

  if (user.residencyStatus === "non-resident") {
    reasons.push("You must leave campus by 10:00 PM.");
  }

  if (currentTime >= "17:00" || currentTime <= "07:00") {
    reasons.push(`After-hours academic access window is active (${formatTimeLabel("17:00")} to ${formatTimeLabel("07:00")}) where applicable.`);
  }

  lot.specialNotes.forEach((note) => reasons.push(note));

  return { allowed: true, reasons };
}

export function getRuleSummaryForUser(user: User) {
  return parkingRules.filter((rule) => rule.category === "all" || rule.category === user.userCategory);
}

export function getPermissionWindow(user: User) {
  if (user.residencyStatus === "non-resident") {
    return {
      safeUntil: buildDemoDate("22:00"),
      summary: "You are permitted until 10:00 PM because you are an off-campus student."
    };
  }

  return {
    safeUntil: buildDemoDate("23:59"),
    summary: "Your main restriction is lot allocation rather than the 10:00 PM commuter curfew."
  };
}

export function getAllowedLotsForUser(user: User) {
  return parkingLots.filter((lot) => getLotPermission(user, lot).allowed);
}

