import type { LiveMapBusRoute, RouteStop } from "@/lib/types";

function stop(id: string, name: string, lat: number, lng: number, order: number): RouteStop {
  return {
    id,
    name,
    coordinates: { lat, lng },
    order
  };
}

// Route geometry and timing labels sourced from the organizer files:
// - `Bus male route.pdf`
// - `Bus female route.pdf`
// - `Car Parking and Bus Stops (Latitude and Longitude)` stop coordinate tables
export const LIVE_BUS_ROUTES: LiveMapBusRoute[] = [
  {
    id: "male_route_1",
    code: "M1",
    network: "male",
    name: "Male Route 1",
    timingLabel: "6:30 AM to 5:30 PM",
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Main daytime shuttle loop across the academic core.",
    defaultBusNumbers: ["738", "739", "740", "741"],
    segmentTravelSeconds: 40,
    dwellSeconds: 12,
    stops: [
      stop("station_301", "Station 301", 26.3149451, 50.1458523, 1),
      stop("station_302", "Station 302", 26.3143989, 50.1444828, 2),
      stop("station_303", "Station 303", 26.314053, 50.1431176, 3),
      stop("station_304", "Station 304", 26.3129679, 50.1395563, 4),
      stop("station_305", "Station 305", 26.3122636, 50.1415329, 5),
      stop("station_306", "Station 306", 26.3100076, 50.142875, 6),
      stop("station_311", "Station 311", 26.3084247, 50.144929, 7),
      stop("station_313", "Station 313", 26.3062346, 50.1469195, 8),
      stop("station_301_loop", "Station 301", 26.3149451, 50.1458523, 9)
    ]
  },
  {
    id: "male_route_2",
    code: "M2",
    network: "male",
    name: "Male Route 2",
    timingLabel: "6:30 AM to 5:30 PM",
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "North academic shuttle with a shorter campus cycle.",
    defaultBusNumbers: ["742", "743", "744"],
    segmentTravelSeconds: 45,
    dwellSeconds: 12,
    stops: [
      stop("station_303", "Station 303", 26.314053, 50.1431176, 1),
      stop("station_304", "Station 304", 26.3129679, 50.1395563, 2),
      stop("station_308", "Station 308", 26.3140801, 50.1488886, 3),
      stop("station_303_loop", "Station 303", 26.314053, 50.1431176, 4)
    ]
  },
  {
    id: "male_route_3",
    code: "M3",
    network: "male",
    name: "Male Route 3",
    timingLabel: "8:00 AM to 4:00 PM",
    schedule: {
      serviceWindow: { start: "08:00", end: "16:00" },
      specialTimetable: [
        { label: "Departure from University", departure: "08:00" },
        { label: "Departure from University", departure: "09:00" },
        { label: "Departure from University", departure: "11:00" },
        { label: "Departure from University", departure: "13:00" },
        { label: "Return from DTV", departure: "10:00" },
        { label: "Return from DTV", departure: "12:00" },
        { label: "Return from DTV", departure: "14:00" },
        { label: "Return from DTV", departure: "16:00" }
      ]
    },
    serviceNote: "Special Dhahran Techno Valley service with scheduled departures.",
    defaultBusNumbers: ["745", "746", "747"],
    segmentTravelSeconds: 85,
    dwellSeconds: 16,
    stops: [
      stop("station_316", "Station 316", 26.3091606, 50.1388651, 1),
      stop("dhahran_techno_valley", "Dhahran Techno Valley", 26.3031563, 50.1568302, 2),
      stop("station_316_return", "Station 316", 26.3091606, 50.1388651, 3)
    ]
  },
  {
    id: "male_route_4",
    code: "M4",
    network: "male",
    name: "Male Route 4",
    timingLabel: "8:00 AM to 4:00 PM",
    schedule: { serviceWindow: { start: "08:00", end: "16:00" } },
    serviceNote: "Parking B.424 connector for scheduled daytime transfers.",
    defaultBusNumbers: ["748", "749", "750"],
    segmentTravelSeconds: 82,
    dwellSeconds: 16,
    stops: [
      stop("station_316", "Station 316", 26.3091606, 50.1388651, 1),
      stop("parking_b424", "Parking B.424", 26.3018998, 50.1564098, 2),
      stop("station_316_return", "Station 316", 26.3091606, 50.1388651, 3)
    ]
  },
  {
    id: "female_route_1",
    code: "F1",
    network: "female",
    name: "Female Route 1",
    timingLabel: "6:30 AM to 5:30 PM",
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Short shuttle between parking hubs and Bus Stop 27.",
    defaultBusNumbers: ["751", "752", "753"],
    segmentTravelSeconds: 40,
    dwellSeconds: 12,
    stops: [
      stop("parking_900", "Parking 900", 26.3029416, 50.147002, 1),
      stop("parking_404", "Parking 404", 26.301609, 50.1533968, 2),
      stop("bus_stop_27", "Bus Stop 27", 26.3047455, 50.1492993, 3),
      stop("parking_900_loop", "Parking 900", 26.3029416, 50.147002, 4)
    ]
  },
  {
    id: "female_route_2",
    code: "F2",
    network: "female",
    name: "Female Route 2",
    timingLabel: "6:30 AM to 5:30 PM",
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Main daytime female loop serving Building 22 and Building 58.",
    defaultBusNumbers: ["754", "755", "756", "757"],
    segmentTravelSeconds: 42,
    dwellSeconds: 12,
    stops: [
      stop("parking_900", "Parking 900", 26.3029416, 50.147002, 1),
      stop("bus_stop_27", "Bus Stop 27", 26.3047455, 50.1492993, 2),
      stop("station_312", "Station 312", 26.3087453, 50.1428758, 3),
      stop("building_22", "Building 22", 26.3061394, 50.1464502, 4),
      stop("station_319", "Station 319", 26.3129446, 50.1493728, 5),
      stop("building_58", "Building 58", 26.3157919, 50.1487696, 6),
      stop("station_309", "Station 309", 26.313867, 50.1493237, 7),
      stop("station_310", "Station 310", 26.3110943, 50.1479139, 8),
      stop("station_312_repeat", "Station 312", 26.3087453, 50.1428758, 9),
      stop("building_22_repeat", "Building 22", 26.3061394, 50.1464502, 10),
      stop("station_314", "Station 314", 26.3056621, 50.1484383, 11),
      stop("parking_900_loop", "Parking 900", 26.3029416, 50.147002, 12)
    ]
  },
  {
    id: "female_route_3",
    code: "F3",
    network: "female",
    name: "Female Route 3",
    timingLabel: "6:30 AM to 5:30 PM",
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Parking 404 origin variant for the daytime female academic loop.",
    defaultBusNumbers: ["758", "759", "760"],
    segmentTravelSeconds: 44,
    dwellSeconds: 12,
    stops: [
      stop("parking_404", "Parking 404", 26.301609, 50.1533968, 1),
      stop("station_312", "Station 312", 26.3087453, 50.1428758, 2),
      stop("building_22", "Building 22", 26.3061394, 50.1464502, 3),
      stop("station_319", "Station 319", 26.3129446, 50.1493728, 4),
      stop("building_58", "Building 58", 26.3157919, 50.1487696, 5),
      stop("station_309", "Station 309", 26.313867, 50.1493237, 6),
      stop("station_310", "Station 310", 26.3110943, 50.1479139, 7),
      stop("station_312_repeat", "Station 312", 26.3087453, 50.1428758, 8),
      stop("building_22_repeat", "Building 22", 26.3061394, 50.1464502, 9),
      stop("station_314", "Station 314", 26.3056621, 50.1484383, 10),
      stop("parking_404_loop", "Parking 404", 26.301609, 50.1533968, 11)
    ]
  },
  {
    id: "female_route_4",
    code: "F4",
    network: "female",
    name: "Female Route 4",
    timingLabel: "6:30 AM to 5:30 PM",
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Compact Building 58 shuttle branch.",
    defaultBusNumbers: ["761", "762", "763"],
    segmentTravelSeconds: 40,
    dwellSeconds: 12,
    stops: [
      stop("station_310", "Station 310", 26.3110943, 50.1479139, 1),
      stop("building_58", "Building 58", 26.3157919, 50.1487696, 2),
      stop("station_309", "Station 309", 26.313867, 50.1493237, 3),
      stop("station_310_loop", "Station 310", 26.3110943, 50.1479139, 4)
    ]
  },
  {
    id: "female_route_5",
    code: "F5",
    network: "female",
    name: "Female Route 5",
    timingLabel: "6:30 AM to 5:30 PM",
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Secondary daytime loop serving Building 58, Building 22, and Station 314.",
    defaultBusNumbers: ["764", "765", "766"],
    segmentTravelSeconds: 40,
    dwellSeconds: 12,
    stops: [
      stop("station_319", "Station 319", 26.3129446, 50.1493728, 1),
      stop("building_58", "Building 58", 26.3157919, 50.1487696, 2),
      stop("station_309", "Station 309", 26.313867, 50.1493237, 3),
      stop("station_310", "Station 310", 26.3110943, 50.1479139, 4),
      stop("station_314", "Station 314", 26.3056621, 50.1484383, 5),
      stop("station_312", "Station 312", 26.3087453, 50.1428758, 6),
      stop("building_22", "Building 22", 26.3061394, 50.1464502, 7),
      stop("station_314_repeat", "Station 314", 26.3056621, 50.1484383, 8)
    ]
  },
  {
    id: "female_route_6",
    code: "F6",
    network: "female",
    name: "Female Route 6",
    timingLabel: "2:30 PM to 9:30 PM",
    schedule: { serviceWindow: { start: "14:30", end: "21:30" } },
    serviceNote: "Evening service linking Station 310, central stops, Square, Restaurant, and Parking 900.",
    defaultBusNumbers: ["767", "768", "769"],
    segmentTravelSeconds: 44,
    dwellSeconds: 14,
    stops: [
      stop("station_310", "Station 310", 26.3110943, 50.1479139, 1),
      stop("station_312", "Station 312", 26.3087453, 50.1428758, 2),
      stop("building_22", "Building 22", 26.3061394, 50.1464502, 3),
      stop("station_314", "Station 314", 26.3056621, 50.1484383, 4),
      stop("square", "Square", 26.3010283, 50.1461315, 5),
      stop("restaurant", "Restaurant", 26.3154896, 50.1482487, 6),
      stop("parking_900", "Parking 900", 26.3029416, 50.147002, 7)
    ]
  },
  {
    id: "female_route_7",
    code: "F7",
    network: "female",
    name: "Female Route 7",
    timingLabel: "8:00 AM to 4:00 PM",
    schedule: { serviceWindow: { start: "08:00", end: "16:00" } },
    serviceNote: "Parking B.424 connector for female students during the daytime schedule.",
    defaultBusNumbers: ["770", "771", "772"],
    segmentTravelSeconds: 82,
    dwellSeconds: 16,
    stops: [
      stop("station_316", "Station 316", 26.3091606, 50.1388651, 1),
      stop("parking_b424", "Parking B.424", 26.3018998, 50.1564098, 2),
      stop("station_316_return", "Station 316", 26.3091606, 50.1388651, 3)
    ]
  },
  {
    id: "female_route_8",
    code: "F8",
    network: "female",
    name: "Female Route 8",
    timingLabel: "8:00 AM to 4:00 PM",
    schedule: {
      serviceWindow: { start: "08:00", end: "16:00" },
      specialTimetable: [
        { label: "Departure from University", departure: "08:00" },
        { label: "Departure from University", departure: "09:00" },
        { label: "Departure from University", departure: "11:00" },
        { label: "Departure from University", departure: "13:00" },
        { label: "Return from DTV", departure: "10:00" },
        { label: "Return from DTV", departure: "12:00" },
        { label: "Return from DTV", departure: "14:00" },
        { label: "Return from DTV", departure: "16:00" }
      ]
    },
    serviceNote: "Dhahran Techno Valley service via Station 319 and Station 310.",
    defaultBusNumbers: ["773", "774", "775"],
    segmentTravelSeconds: 84,
    dwellSeconds: 16,
    stops: [
      stop("station_316", "Station 316", 26.3091606, 50.1388651, 1),
      stop("station_319", "Station 319", 26.3129446, 50.1493728, 2),
      stop("station_310", "Station 310", 26.3110943, 50.1479139, 3),
      stop("dhahran_techno_valley", "Dhahran Techno Valley", 26.3031563, 50.1568302, 4)
    ]
  }
];

export const LIVE_BUS_ROUTE_MAP = Object.fromEntries(LIVE_BUS_ROUTES.map((route) => [route.id, route])) as Record<string, LiveMapBusRoute>;
