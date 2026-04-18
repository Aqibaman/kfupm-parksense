import type { StudentCategory } from "@/lib/engines/rules";
import { PARKING_RULES_CONFIG, type CanonicalParkingLotId } from "@/lib/data/parking-rules";

export interface ParkingLocation {
  id: string;
  canonicalId: CanonicalParkingLotId;
  name: string;
  coordinates: { lat: number; lng: number };
  type: "numbered_lot" | "named_location";
  zone?: string;
  categoryPresence: StudentCategory[];
  restrictionBadges?: string[];
  isProhibited?: boolean;
  isNamedLocation?: boolean;
}

function getCategoryPresence(canonicalId: CanonicalParkingLotId) {
  return (Object.entries(PARKING_RULES_CONFIG) as [StudentCategory, (typeof PARKING_RULES_CONFIG)[StudentCategory]][])
    .filter(([, config]) => config.allowedLots.includes(canonicalId))
    .map(([category]) => category);
}

// Parking coordinates sourced from `Car Parking and Bus Stops (Latitude and Longitude).xlsx`.
export const parkingLocations: ParkingLocation[] = [
  { id: "dhahran_mosque", canonicalId: "dhahran_mosque", name: "Dhahran Mosque", coordinates: { lat: 26.3120805, lng: 50.1356997 }, type: "named_location", zone: "Mosque Zone", categoryPresence: getCategoryPresence("dhahran_mosque"), isNamedLocation: true },
  { id: "al_zubair_mosque", canonicalId: "al_zubair_mosque", name: "Al-Zubair Mosque", coordinates: { lat: 26.3154623, lng: 50.0745419 }, type: "named_location", zone: "Mosque Zone", categoryPresence: getCategoryPresence("al_zubair_mosque"), isNamedLocation: true },
  { id: "student_mall", canonicalId: "student_mall", name: "Student Mall Parking", coordinates: { lat: 26.3120485, lng: 50.1393328 }, type: "named_location", zone: "Student Mall", categoryPresence: getCategoryPresence("student_mall"), isNamedLocation: true },
  { id: "medical_center", canonicalId: "medical_center", name: "Medical Center Parking", coordinates: { lat: 26.3054876, lng: 50.1497133 }, type: "named_location", zone: "Medical Center", categoryPresence: getCategoryPresence("medical_center"), isNamedLocation: true },
  { id: "parking_60", canonicalId: "parking_60", name: "Parking 60", coordinates: { lat: 26.3058487, lng: 50.1491292 }, type: "numbered_lot", zone: "Central Services", categoryPresence: getCategoryPresence("parking_60") },
  { id: "parking_71", canonicalId: "parking_71", name: "Parking 71", coordinates: { lat: 26.3135156, lng: 50.1376396 }, type: "numbered_lot", zone: "Housing Edge", categoryPresence: getCategoryPresence("parking_71") },
  { id: "parking_72", canonicalId: "parking_72", name: "Parking 72", coordinates: { lat: 26.316084, lng: 50.1451491 }, type: "numbered_lot", zone: "Housing Edge", categoryPresence: getCategoryPresence("parking_72") },
  { id: "parking_73", canonicalId: "parking_73", name: "Parking 73", coordinates: { lat: 26.3129852, lng: 50.1426181 }, type: "numbered_lot", zone: "Housing Edge", categoryPresence: getCategoryPresence("parking_73") },
  { id: "parking_74", canonicalId: "parking_74", name: "Parking 74", coordinates: { lat: 26.3114716, lng: 50.1432806 }, type: "numbered_lot", zone: "Housing Edge", categoryPresence: getCategoryPresence("parking_74") },
  { id: "parking_59", canonicalId: "parking_59", name: "Parking 59", coordinates: { lat: 26.3072714, lng: 50.1455503 }, type: "numbered_lot", zone: "Academic Ring", categoryPresence: getCategoryPresence("parking_59") },
  { id: "parking_64", canonicalId: "parking_64", name: "Parking 64", coordinates: { lat: 26.3112126, lng: 50.137706 }, type: "numbered_lot", zone: "Building 64", categoryPresence: getCategoryPresence("parking_64") },
  { id: "parking_19", canonicalId: "parking_19", name: "Parking 19", coordinates: { lat: 26.304532, lng: 50.1411472 }, type: "numbered_lot", zone: "North Academic", categoryPresence: getCategoryPresence("parking_19") },
  { id: "parking_20", canonicalId: "parking_20", name: "Parking 20", coordinates: { lat: 26.304721, lng: 50.14435 }, type: "numbered_lot", zone: "North Academic", categoryPresence: getCategoryPresence("parking_20") },
  { id: "parking_23", canonicalId: "parking_23", name: "Parking 23", coordinates: { lat: 26.30521, lng: 50.1465665 }, type: "numbered_lot", zone: "North Academic", categoryPresence: getCategoryPresence("parking_23") },
  { id: "parking_25", canonicalId: "parking_25", name: "Parking 25", coordinates: { lat: 26.3048617, lng: 50.1462574 }, type: "numbered_lot", zone: "North Academic", categoryPresence: getCategoryPresence("parking_25") },
  { id: "parking_39", canonicalId: "parking_39", name: "Parking 39", coordinates: { lat: 26.3101433, lng: 50.1439196 }, type: "numbered_lot", zone: "Sports / Activity", categoryPresence: getCategoryPresence("parking_39") },
  { id: "female_student_housing", canonicalId: "female_student_housing", name: "Female Student Housing", coordinates: { lat: 26.301265, lng: 50.147433 }, type: "named_location", zone: "Female Housing", categoryPresence: getCategoryPresence("female_student_housing"), isNamedLocation: true },
  { id: "family_mall", canonicalId: "family_mall", name: "Family Mall", coordinates: { lat: 26.3001574, lng: 50.1470658 }, type: "named_location", zone: "Family Mall", categoryPresence: getCategoryPresence("family_mall"), isNamedLocation: true },
  { id: "parking_57", canonicalId: "parking_57", name: "Parking 57", coordinates: { lat: 26.3153762, lng: 50.1493113 }, type: "numbered_lot", zone: "Preparatory Year", categoryPresence: getCategoryPresence("parking_57") },
  { id: "parking_400", canonicalId: "parking_400", name: "Parking 400", coordinates: { lat: 26.3015311, lng: 50.1530982 }, type: "numbered_lot", zone: "Female Access", categoryPresence: getCategoryPresence("parking_400") },
  { id: "parking_404", canonicalId: "parking_400", name: "Parking 404 / 400", coordinates: { lat: 26.3015311, lng: 50.1530982 }, type: "numbered_lot", zone: "Female Access", categoryPresence: getCategoryPresence("parking_400") },
  { id: "parking_75", canonicalId: "parking_77", name: "Parking 75 / 77", coordinates: { lat: 26.3127859, lng: 50.1447215 }, type: "numbered_lot", zone: "Academic West", categoryPresence: getCategoryPresence("parking_77"), restrictionBadges: ["Alias for parking_77"] },
  { id: "parking_77", canonicalId: "parking_77", name: "Parking 77", coordinates: { lat: 26.3127859, lng: 50.1447215 }, type: "numbered_lot", zone: "Academic West", categoryPresence: getCategoryPresence("parking_77") }
];

