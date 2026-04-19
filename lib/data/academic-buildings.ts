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

// Academic building coordinates sourced from the organizer's
// `Academic building location.pdf` / Excel-derived campus mapping.
export const academicBuildings: AcademicBuilding[] = [
  { id: "building_1", name: "Building 1", coordinates: { lat: 26.3091352, lng: 50.1391756 }, source: "excel_google_maps" },
  { id: "building_2", name: "Building 2", coordinates: { lat: 26.3097766, lng: 50.1400965 }, source: "excel_google_maps" },
  { id: "building_3", name: "Building 3", coordinates: { lat: 26.309539, lng: 50.1407785 }, source: "excel_google_maps" },
  { id: "building_4", name: "Building 4", coordinates: { lat: 26.3092749, lng: 50.1411163 }, source: "excel_google_maps" },
  { id: "building_5", name: "Building 5", coordinates: { lat: 26.3088365, lng: 50.1424827 }, source: "excel_google_maps" },
  { id: "building_6", name: "Building 6", coordinates: { lat: 26.3080599, lng: 50.1409538 }, source: "excel_google_maps" },
  { id: "building_7", name: "Building 7", coordinates: { lat: 26.3075489, lng: 50.1436277 }, source: "excel_google_maps" },
  { id: "building_8", name: "Building 8", coordinates: { lat: 26.3072564, lng: 50.1418441 }, source: "excel_google_maps" },
  { id: "building_9", name: "Building 9", coordinates: { lat: 26.3065266, lng: 50.143945 }, source: "excel_google_maps" },
  { id: "building_10", name: "Building 10", coordinates: { lat: 26.3059582, lng: 50.1420809 }, source: "excel_google_maps" },
  { id: "building_11", name: "Building 11", coordinates: { lat: 26.3052518, lng: 50.1454012 }, source: "excel_google_maps" },
  { id: "building_14", name: "Building 14", coordinates: { lat: 26.3064475, lng: 50.1415 }, source: "excel_google_maps" },
  { id: "building_15", name: "Building 15", coordinates: { lat: 26.3072451, lng: 50.1415489 }, source: "excel_google_maps" },
  { id: "building_16", name: "Building 16", coordinates: { lat: 26.3066452, lng: 50.1016116 }, source: "excel_google_maps" },
  { id: "building_17", name: "Building 17", coordinates: { lat: 26.3064402, lng: 50.1433088 }, source: "excel_google_maps" },
  { id: "building_19", name: "Building 19", coordinates: { lat: 26.3057004, lng: 50.1434545 }, source: "excel_google_maps" },
  { id: "building_20", name: "Building 20", coordinates: { lat: 26.3051376, lng: 50.1434141 }, source: "excel_google_maps" },
  { id: "building_21", name: "Building 21", coordinates: { lat: 26.3063714, lng: 50.1451662 }, source: "excel_google_maps" },
  { id: "building_22", name: "Building 22", coordinates: { lat: 26.3057261, lng: 50.1465801 }, source: "excel_google_maps" },
  { id: "building_23", name: "Building 23", coordinates: { lat: 26.3057365, lng: 50.146348 }, source: "excel_google_maps" },
  { id: "building_24", name: "Building 24", coordinates: { lat: 26.3045623, lng: 50.1469465 }, source: "excel_google_maps" },
  { id: "building_26", name: "Building 26", coordinates: { lat: 26.3103518, lng: 50.139585 }, source: "excel_google_maps" },
  { id: "building_27", name: "Building 27", coordinates: { lat: 26.3214931, lng: 50.1190135 }, source: "excel_google_maps" },
  { id: "building_28", name: "Building 28", coordinates: { lat: 26.3038035, lng: 50.1489989 }, source: "excel_google_maps" },
  { id: "building_29", name: "Building 29", coordinates: { lat: 26.3079471, lng: 50.0972964 }, source: "excel_google_maps" },
  { id: "building_34", name: "Building 34", coordinates: { lat: 26.303049, lng: 50.1449822 }, source: "excel_google_maps" },
  { id: "building_39", name: "Building 39", coordinates: { lat: 26.3091056, lng: 50.1443601 }, source: "excel_google_maps" },
  { id: "building_41", name: "Building 41", coordinates: { lat: 26.3125434, lng: 50.1383662 }, source: "excel_google_maps" },
  { id: "building_42", name: "Building 42", coordinates: { lat: 26.3104263, lng: 50.1460146 }, source: "excel_google_maps" },
  { id: "building_44", name: "Building 44", coordinates: { lat: 26.3154555, lng: 50.1458382 }, source: "excel_google_maps" },
  { id: "building_47", name: "Building 47", coordinates: { lat: 26.3132036, lng: 50.1470522 }, source: "excel_google_maps" },
  { id: "building_54", name: "Building 54", coordinates: { lat: 26.3072743, lng: 50.1543595 }, source: "excel_google_maps" },
  { id: "building_55", name: "Building 55", coordinates: { lat: 26.3087955, lng: 50.139372 }, source: "excel_google_maps" },
  { id: "building_57", name: "Building 57", coordinates: { lat: 26.3145071, lng: 50.149325 }, source: "excel_google_maps" },
  { id: "building_58", name: "Building 58", coordinates: { lat: 26.3118574, lng: 50.1463794 }, source: "excel_google_maps" },
  { id: "building_59", name: "Building 59", coordinates: { lat: 26.3082773, lng: 50.142757 }, source: "excel_google_maps" },
  { id: "building_60", name: "Building 60", coordinates: { lat: 26.3083009, lng: 50.1350322 }, source: "excel_google_maps" },
  { id: "building_61", name: "Building 61", coordinates: { lat: 26.3109956, lng: 50.1468019 }, source: "excel_google_maps" },
  { id: "building_63", name: "Building 63", coordinates: { lat: 26.3107663, lng: 50.1410108 }, source: "excel_google_maps" },
  { id: "building_68", name: "Building 68", coordinates: { lat: 26.3095464, lng: 50.1439358 }, source: "excel_google_maps" },
  { id: "building_70", name: "Building 70", coordinates: { lat: 26.3134525, lng: 50.1493153 }, source: "excel_google_maps" },
  { id: "building_75", name: "Building 75", coordinates: { lat: 26.310015, lng: 50.1411097 }, source: "excel_google_maps" },
  { id: "building_76", name: "Building 76", coordinates: { lat: 26.2494241, lng: 50.1974704 }, source: "excel_google_maps" },
  { id: "building_78", name: "Building 78", coordinates: { lat: 26.3062557, lng: 50.1483667 }, source: "excel_google_maps" },
  { id: "medical_center_building", name: "Medical Center", coordinates: { lat: 26.3054876, lng: 50.1497133 }, source: "supplemental_destination" },
  { id: "student_mall_building", name: "Student Mall", coordinates: { lat: 26.3120485, lng: 50.1393328 }, source: "supplemental_destination" },
  { id: "female_housing", name: "Female Housing", coordinates: { lat: 26.301265, lng: 50.147433 }, source: "supplemental_destination" },
  { id: "university_square", name: "University Square", coordinates: { lat: 26.3010283, lng: 50.1461315 }, source: "supplemental_destination" }
];
