interface Coordinate {
  lat: number;
  lng: number;
}

export interface AcademicBuilding {
  id: string;
  name: string;
  coordinates: Coordinate;
  googleMapsUrl?: string;
  source: "excel_google_maps" | "supplemental_destination";
}

// Excel-derived academic building coordinates normalized from
// `Academic Building location.xlsx` Google Maps links.
export const academicBuildings: AcademicBuilding[] = [
  { id: "building_1", name: "Building 1", coordinates: { lat: 26.3091398, lng: 50.1406306 }, source: "excel_google_maps" },
  { id: "building_2", name: "Building 2", coordinates: { lat: 26.309694, lng: 50.1409535 }, source: "excel_google_maps" },
  { id: "building_3", name: "Building 3", coordinates: { lat: 26.3094737, lng: 50.1415543 }, source: "excel_google_maps" },
  { id: "building_4", name: "Building 4", coordinates: { lat: 26.3092128, lng: 50.142256 }, source: "excel_google_maps" },
  { id: "building_5", name: "Building 5", coordinates: { lat: 26.3088521, lng: 50.1428595 }, source: "excel_google_maps" },
  { id: "building_6", name: "Building 6", coordinates: { lat: 26.3080599, lng: 50.1435341 }, source: "excel_google_maps" },
  { id: "building_7", name: "Building 7", coordinates: { lat: 26.3075489, lng: 50.1436277 }, source: "excel_google_maps" },
  { id: "building_8", name: "Building 8", coordinates: { lat: 26.3072516, lng: 50.144419 }, source: "excel_google_maps" },
  { id: "building_9", name: "Building 9", coordinates: { lat: 26.3066893, lng: 50.1445797 }, source: "excel_google_maps" },
  { id: "building_10", name: "Building 10", coordinates: { lat: 26.3059503, lng: 50.1446442 }, source: "excel_google_maps" },
  { id: "building_11", name: "Building 11", coordinates: { lat: 26.3052518, lng: 50.1454012 }, source: "excel_google_maps" },
  { id: "building_14", name: "Building 14", coordinates: { lat: 26.3065646, lng: 50.1428115 }, source: "excel_google_maps" },
  { id: "building_15", name: "Building 15", coordinates: { lat: 26.3072451, lng: 50.1415489 }, source: "excel_google_maps" },
  { id: "building_16", name: "Building 16", coordinates: { lat: 26.308839, lng: 50.1421284 }, source: "excel_google_maps" },
  { id: "building_17", name: "Building 17", coordinates: { lat: 26.3066587, lng: 50.1437778 }, source: "excel_google_maps" },
  { id: "building_19", name: "Building 19", coordinates: { lat: 26.3057004, lng: 50.1434545 }, source: "excel_google_maps" },
  { id: "building_20", name: "Building 20", coordinates: { lat: 26.3051376, lng: 50.1440648 }, source: "excel_google_maps" },
  { id: "building_21", name: "Building 21", coordinates: { lat: 26.3063714, lng: 50.1451662 }, source: "excel_google_maps" },
  { id: "building_22", name: "Building 22", coordinates: { lat: 26.3057261, lng: 50.1465801 }, source: "excel_google_maps" },
  { id: "building_23", name: "Building 23", coordinates: { lat: 26.3057365, lng: 50.146348 }, source: "excel_google_maps" },
  { id: "building_24", name: "Building 24", coordinates: { lat: 26.3045623, lng: 50.1469465 }, source: "excel_google_maps" },
  { id: "building_26", name: "Building 26", coordinates: { lat: 26.310047, lng: 50.140276 }, source: "excel_google_maps" },
  { id: "building_27", name: "Building 27", coordinates: { lat: 26.3055554, lng: 50.1499536 }, source: "excel_google_maps" },
  { id: "building_28", name: "Building 28", coordinates: { lat: 26.3038035, lng: 50.1489989 }, source: "excel_google_maps" },
  { id: "building_29", name: "Building 29", coordinates: { lat: 26.3013998, lng: 50.1428639 }, source: "excel_google_maps" },
  { id: "building_34", name: "Building 34", coordinates: { lat: 26.3027119, lng: 50.1514527 }, source: "excel_google_maps" },
  { id: "building_39", name: "Building 39", coordinates: { lat: 26.3098235, lng: 50.1469043 }, source: "excel_google_maps" },
  { id: "building_41", name: "Building 41", coordinates: { lat: 26.3119637, lng: 50.1427905 }, source: "excel_google_maps" },
  { id: "building_42", name: "Building 42", coordinates: { lat: 26.3107937, lng: 50.1487225 }, source: "excel_google_maps" },
  { id: "building_44", name: "Building 44", coordinates: { lat: 26.3149011, lng: 50.1518137 }, source: "excel_google_maps" },
  { id: "building_47", name: "Building 47", coordinates: { lat: 26.3130419, lng: 50.1513703 }, source: "excel_google_maps" },
  { id: "building_54", name: "Building 54", coordinates: { lat: 26.3072743, lng: 50.1543595 }, source: "excel_google_maps" },
  { id: "building_55", name: "Building 55", coordinates: { lat: 26.3087837, lng: 50.1397575 }, source: "excel_google_maps" },
  { id: "building_57", name: "Building 57", coordinates: { lat: 26.3145071, lng: 50.149325 }, source: "excel_google_maps" },
  { id: "building_58", name: "Building 58", coordinates: { lat: 26.314603, lng: 50.1486155 }, source: "excel_google_maps" },
  { id: "building_59", name: "Building 59", coordinates: { lat: 26.3082462, lng: 50.1450479 }, source: "excel_google_maps" },
  { id: "building_60", name: "Building 60", coordinates: { lat: 26.3072597, lng: 50.153404 }, source: "excel_google_maps" },
  { id: "building_61", name: "Building 61", coordinates: { lat: 26.3113781, lng: 50.1492616 }, source: "excel_google_maps" },
  { id: "building_63", name: "Building 63", coordinates: { lat: 26.3107663, lng: 50.1410108 }, source: "excel_google_maps" },
  { id: "building_68", name: "Building 68", coordinates: { lat: 26.3095464, lng: 50.1439358 }, source: "excel_google_maps" },
  { id: "building_70", name: "Building 70", coordinates: { lat: 26.3134525, lng: 50.1493153 }, source: "excel_google_maps" },
  { id: "building_75", name: "Building 75", coordinates: { lat: 26.310015, lng: 50.1411097 }, source: "excel_google_maps" },
  { id: "building_76", name: "Building 76", coordinates: { lat: 26.3057063, lng: 50.1478756 }, source: "excel_google_maps" },
  { id: "building_78", name: "Building 78", coordinates: { lat: 26.306204, lng: 50.1484667 }, source: "excel_google_maps" },
  { id: "medical_center_building", name: "Medical Center", coordinates: { lat: 26.3054876, lng: 50.1497133 }, source: "supplemental_destination" },
  { id: "student_mall_building", name: "Student Mall", coordinates: { lat: 26.3120485, lng: 50.1393328 }, source: "supplemental_destination" },
  { id: "female_housing", name: "Female Housing", coordinates: { lat: 26.301265, lng: 50.147433 }, source: "supplemental_destination" },
  { id: "university_square", name: "University Square", coordinates: { lat: 26.3010283, lng: 50.1461315 }, source: "supplemental_destination" }
];
