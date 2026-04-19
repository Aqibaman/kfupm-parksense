import type { LiveMapBusRoute, RoutePathPoint, RouteStop } from "@/lib/types";

function stop(id: string, name: string, lat: number, lng: number, order: number): RouteStop {
  return {
    id,
    name,
    coordinates: { lat, lng },
    order
  };
}

function pathPoint(lat: number, lng: number, stopId?: string, stopName?: string): RoutePathPoint {
  return {
    coordinates: { lat, lng },
    stopId,
    stopName
  };
}

function stopPoint(routeStop: RouteStop): RoutePathPoint {
  return pathPoint(routeStop.coordinates.lat, routeStop.coordinates.lng, routeStop.id, routeStop.name);
}

function pathChain(...items: Array<RouteStop | RoutePathPoint>) {
  return items.map((item) => ("id" in item ? stopPoint(item) : item));
}

// Route geometry and timing labels sourced from the organizer files:
// - `Bus male route.pdf`
// - `Bus female route.pdf`
// - `Car Parking and Bus Stops (Latitude and Longitude)` stop coordinate tables
// The `pathPoints` arrays keep the map and bus simulation on a road-following campus path
// instead of drawing synthetic direct lines across buildings.
const maleRoute1Stops = [
  stop("station_301", "Station 301", 26.3149451, 50.1458523, 1),
  stop("station_302", "Station 302", 26.3143989, 50.1444828, 2),
  stop("station_303", "Station 303", 26.314053, 50.1431176, 3),
  stop("station_304", "Station 304", 26.3129679, 50.1395563, 4),
  stop("station_305", "Station 305", 26.3122636, 50.1415329, 5),
  stop("station_306", "Station 306", 26.3100076, 50.142875, 6),
  stop("station_311", "Station 311", 26.3084247, 50.144929, 7),
  stop("station_313", "Station 313", 26.3062346, 50.1469195, 8)
];

const maleRoute2Stops = [
  stop("station_303", "Station 303", 26.314053, 50.1431176, 1),
  stop("station_304", "Station 304", 26.3129679, 50.1395563, 2),
  stop("station_308", "Station 308", 26.3140801, 50.1488886, 3)
];

const maleRoute3Stops = [
  stop("station_316", "Station 316", 26.3091606, 50.1388651, 1),
  stop("dhahran_techno_valley", "Dhahran Techno Valley", 26.3031563, 50.1568302, 2)
];

const maleRoute4Stops = [
  stop("station_316", "Station 316", 26.3091606, 50.1388651, 1),
  stop("parking_b424", "Parking B.424", 26.3018998, 50.1564098, 2)
];

const femaleRoute1Stops = [
  stop("parking_900", "Parking 900", 26.3029416, 50.147002, 1),
  stop("parking_404", "Parking 404", 26.301609, 50.1533968, 2),
  stop("bus_stop_27", "Bus Stop 27", 26.3047455, 50.1492993, 3)
];

const femaleRoute2Stops = [
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
  stop("parking_900_return", "Parking 900", 26.3029416, 50.147002, 12)
];

const femaleRoute3Stops = [
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
  stop("parking_404_return", "Parking 404", 26.301609, 50.1533968, 11)
];

const femaleRoute4Stops = [
  stop("station_310", "Station 310", 26.3110943, 50.1479139, 1),
  stop("building_58", "Building 58", 26.3157919, 50.1487696, 2),
  stop("station_309", "Station 309", 26.313867, 50.1493237, 3)
];

const femaleRoute5Stops = [
  stop("station_319", "Station 319", 26.3129446, 50.1493728, 1),
  stop("building_58", "Building 58", 26.3157919, 50.1487696, 2),
  stop("station_309", "Station 309", 26.313867, 50.1493237, 3),
  stop("station_310", "Station 310", 26.3110943, 50.1479139, 4),
  stop("station_314", "Station 314", 26.3056621, 50.1484383, 5),
  stop("station_312", "Station 312", 26.3087453, 50.1428758, 6),
  stop("building_22", "Building 22", 26.3061394, 50.1464502, 7),
  stop("station_314_repeat", "Station 314", 26.3056621, 50.1484383, 8)
];

const femaleRoute6Stops = [
  stop("station_310", "Station 310", 26.3110943, 50.1479139, 1),
  stop("station_312", "Station 312", 26.3087453, 50.1428758, 2),
  stop("building_22", "Building 22", 26.3061394, 50.1464502, 3),
  stop("station_314", "Station 314", 26.3056621, 50.1484383, 4),
  stop("square", "Square", 26.3010283, 50.1461315, 5),
  stop("restaurant", "Restaurant", 26.3154896, 50.1482487, 6),
  stop("parking_900", "Parking 900", 26.3029416, 50.147002, 7)
];

const femaleRoute7Stops = [
  stop("station_316", "Station 316", 26.3091606, 50.1388651, 1),
  stop("parking_b424", "Parking B.424", 26.3018998, 50.1564098, 2)
];

const femaleRoute8Stops = [
  stop("station_316", "Station 316", 26.3091606, 50.1388651, 1),
  stop("station_319", "Station 319", 26.3129446, 50.1493728, 2),
  stop("station_310", "Station 310", 26.3110943, 50.1479139, 3),
  stop("dhahran_techno_valley", "Dhahran Techno Valley", 26.3031563, 50.1568302, 4)
];

const maleRoute2Path = pathChain(
  maleRoute2Stops[0],
  pathPoint(26.31395, 50.14245),
  pathPoint(26.31355, 50.1412),
  pathPoint(26.31318, 50.14015),
  maleRoute2Stops[1],
  pathPoint(26.31318, 50.14165),
  pathPoint(26.31355, 50.14495),
  pathPoint(26.31395, 50.14725),
  pathPoint(26.31403, 50.1482),
  maleRoute2Stops[2]
);

const maleRoute3Path = pathChain(
  maleRoute3Stops[0],
  pathPoint(26.30935, 50.1405),
  pathPoint(26.30958, 50.14395),
  pathPoint(26.30955, 50.1479),
  pathPoint(26.30895, 50.15165),
  pathPoint(26.30755, 50.15455),
  pathPoint(26.30545, 50.15635),
  maleRoute3Stops[1]
);

const maleRoute4Path = pathChain(
  maleRoute4Stops[0],
  pathPoint(26.30935, 50.14055),
  pathPoint(26.30955, 50.1441),
  pathPoint(26.3094, 50.14825),
  pathPoint(26.30865, 50.15245),
  pathPoint(26.30685, 50.15545),
  pathPoint(26.3042, 50.1562),
  maleRoute4Stops[1]
);

const femaleRoute1Path = pathChain(
  femaleRoute1Stops[0],
  pathPoint(26.3027, 50.14855),
  pathPoint(26.3022, 50.1512),
  femaleRoute1Stops[1],
  pathPoint(26.30215, 50.1524),
  pathPoint(26.30315, 50.15095),
  femaleRoute1Stops[2]
);

const femaleRoute2Path = pathChain(
  femaleRoute2Stops[0],
  pathPoint(26.30285, 50.14835),
  femaleRoute2Stops[1],
  pathPoint(26.30555, 50.14895),
  pathPoint(26.30745, 50.14535),
  femaleRoute2Stops[2],
  pathPoint(26.3072, 50.1449),
  pathPoint(26.3065, 50.14595),
  femaleRoute2Stops[3],
  pathPoint(26.3072, 50.14735),
  pathPoint(26.30995, 50.14895),
  femaleRoute2Stops[4],
  pathPoint(26.31435, 50.1491),
  femaleRoute2Stops[5],
  pathPoint(26.31495, 50.1491),
  femaleRoute2Stops[6],
  pathPoint(26.31225, 50.14875),
  femaleRoute2Stops[7],
  pathPoint(26.3092, 50.14585),
  femaleRoute2Stops[8],
  pathPoint(26.3066, 50.1461),
  femaleRoute2Stops[9],
  pathPoint(26.30585, 50.14725),
  femaleRoute2Stops[10],
  pathPoint(26.3041, 50.1477),
  femaleRoute2Stops[11]
);

const femaleRoute3Path = pathChain(
  femaleRoute3Stops[0],
  pathPoint(26.30325, 50.15265),
  pathPoint(26.30595, 50.14995),
  pathPoint(26.30735, 50.14555),
  femaleRoute3Stops[1],
  pathPoint(26.3066, 50.1461),
  femaleRoute3Stops[2],
  pathPoint(26.3072, 50.14735),
  pathPoint(26.30995, 50.14895),
  femaleRoute3Stops[3],
  pathPoint(26.31435, 50.1491),
  femaleRoute3Stops[4],
  pathPoint(26.31495, 50.1491),
  femaleRoute3Stops[5],
  pathPoint(26.31225, 50.14875),
  femaleRoute3Stops[6],
  pathPoint(26.3092, 50.14585),
  femaleRoute3Stops[7],
  pathPoint(26.3066, 50.1461),
  femaleRoute3Stops[8],
  pathPoint(26.30585, 50.14725),
  femaleRoute3Stops[9],
  pathPoint(26.30405, 50.15045),
  femaleRoute3Stops[10]
);

const femaleRoute4Path = pathChain(
  femaleRoute4Stops[0],
  pathPoint(26.3124, 50.14825),
  pathPoint(26.3144, 50.14865),
  femaleRoute4Stops[1],
  pathPoint(26.31495, 50.14915),
  femaleRoute4Stops[2]
);

const femaleRoute5Path = pathChain(
  femaleRoute5Stops[0],
  pathPoint(26.3142, 50.14915),
  femaleRoute5Stops[1],
  pathPoint(26.31495, 50.14915),
  femaleRoute5Stops[2],
  pathPoint(26.31225, 50.14875),
  femaleRoute5Stops[3],
  pathPoint(26.30895, 50.14745),
  femaleRoute5Stops[4],
  pathPoint(26.3074, 50.14515),
  femaleRoute5Stops[5],
  pathPoint(26.3065, 50.14615),
  femaleRoute5Stops[6],
  pathPoint(26.30595, 50.14725),
  femaleRoute5Stops[7]
);

const femaleRoute6Path = pathChain(
  femaleRoute6Stops[0],
  pathPoint(26.3092, 50.14595),
  femaleRoute6Stops[1],
  pathPoint(26.3066, 50.14615),
  femaleRoute6Stops[2],
  pathPoint(26.30585, 50.14725),
  femaleRoute6Stops[3],
  pathPoint(26.30375, 50.14705),
  femaleRoute6Stops[4],
  pathPoint(26.30715, 50.14745),
  pathPoint(26.31135, 50.14795),
  pathPoint(26.3141, 50.14815),
  femaleRoute6Stops[5],
  pathPoint(26.31055, 50.14785),
  pathPoint(26.30625, 50.14735),
  femaleRoute6Stops[6]
);

const femaleRoute7Path = pathChain(
  femaleRoute7Stops[0],
  pathPoint(26.30935, 50.14055),
  pathPoint(26.30955, 50.1441),
  pathPoint(26.3094, 50.14825),
  pathPoint(26.30865, 50.15245),
  pathPoint(26.30685, 50.15545),
  pathPoint(26.3042, 50.1562),
  femaleRoute7Stops[1]
);

const femaleRoute8Path = pathChain(
  femaleRoute8Stops[0],
  pathPoint(26.30945, 50.14125),
  pathPoint(26.31045, 50.14595),
  pathPoint(26.31185, 50.14875),
  femaleRoute8Stops[1],
  pathPoint(26.31235, 50.14855),
  femaleRoute8Stops[2],
  pathPoint(26.30955, 50.14925),
  pathPoint(26.30785, 50.1518),
  pathPoint(26.30615, 50.15425),
  femaleRoute8Stops[3]
);

export const LIVE_BUS_ROUTES: LiveMapBusRoute[] = [
  {
    id: "male_route_1",
    code: "M1",
    network: "male",
    name: "Male Route 1",
    timingLabel: "6:30 AM to 5:30 PM",
    stops: maleRoute1Stops,
    pathPoints: [
      stopPoint(maleRoute1Stops[0]),
      pathPoint(26.31482, 50.14515),
      stopPoint(maleRoute1Stops[1]),
      pathPoint(26.31422, 50.14375),
      stopPoint(maleRoute1Stops[2]),
      pathPoint(26.31375, 50.1413),
      pathPoint(26.31318, 50.1401),
      stopPoint(maleRoute1Stops[3]),
      pathPoint(26.31262, 50.14015),
      pathPoint(26.31242, 50.14095),
      stopPoint(maleRoute1Stops[4]),
      pathPoint(26.31142, 50.14192),
      stopPoint(maleRoute1Stops[5]),
      pathPoint(26.30925, 50.14388),
      stopPoint(maleRoute1Stops[6]),
      pathPoint(26.30735, 50.14618),
      stopPoint(maleRoute1Stops[7])
    ],
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Main daytime shuttle loop across the academic core.",
    defaultBusNumbers: ["738", "739", "740", "741"],
    segmentTravelSeconds: 28,
    dwellSeconds: 10
  },
  {
    id: "male_route_2",
    code: "M2",
    network: "male",
    name: "Male Route 2",
    timingLabel: "6:30 AM to 5:30 PM",
    stops: maleRoute2Stops,
    pathPoints: maleRoute2Path,
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "North academic shuttle with a shorter campus cycle.",
    defaultBusNumbers: ["742", "743", "744"],
    segmentTravelSeconds: 30,
    dwellSeconds: 10
  },
  {
    id: "male_route_3",
    code: "M3",
    network: "male",
    name: "Male Route 3",
    timingLabel: "8:00 AM to 4:00 PM",
    stops: maleRoute3Stops,
    pathPoints: maleRoute3Path,
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
    segmentTravelSeconds: 54,
    dwellSeconds: 12
  },
  {
    id: "male_route_4",
    code: "M4",
    network: "male",
    name: "Male Route 4",
    timingLabel: "8:00 AM to 4:00 PM",
    stops: maleRoute4Stops,
    pathPoints: maleRoute4Path,
    schedule: { serviceWindow: { start: "08:00", end: "16:00" } },
    serviceNote: "Parking B.424 connector for scheduled daytime transfers.",
    defaultBusNumbers: ["748", "749", "750"],
    segmentTravelSeconds: 52,
    dwellSeconds: 12
  },
  {
    id: "female_route_1",
    code: "F1",
    network: "female",
    name: "Female Route 1",
    timingLabel: "6:30 AM to 5:30 PM",
    stops: femaleRoute1Stops,
    pathPoints: femaleRoute1Path,
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Short shuttle between parking hubs and Bus Stop 27.",
    defaultBusNumbers: ["751", "752", "753"],
    segmentTravelSeconds: 28,
    dwellSeconds: 10
  },
  {
    id: "female_route_2",
    code: "F2",
    network: "female",
    name: "Female Route 2",
    timingLabel: "6:30 AM to 5:30 PM",
    stops: femaleRoute2Stops,
    pathPoints: femaleRoute2Path,
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Main daytime female loop serving Building 22 and Building 58.",
    defaultBusNumbers: ["754", "755", "756", "757"],
    segmentTravelSeconds: 30,
    dwellSeconds: 10
  },
  {
    id: "female_route_3",
    code: "F3",
    network: "female",
    name: "Female Route 3",
    timingLabel: "6:30 AM to 5:30 PM",
    stops: femaleRoute3Stops,
    pathPoints: femaleRoute3Path,
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Parking 404 origin variant for the daytime female academic loop.",
    defaultBusNumbers: ["758", "759", "760"],
    segmentTravelSeconds: 30,
    dwellSeconds: 10
  },
  {
    id: "female_route_4",
    code: "F4",
    network: "female",
    name: "Female Route 4",
    timingLabel: "6:30 AM to 5:30 PM",
    stops: femaleRoute4Stops,
    pathPoints: femaleRoute4Path,
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Compact Building 58 shuttle branch.",
    defaultBusNumbers: ["761", "762", "763"],
    segmentTravelSeconds: 28,
    dwellSeconds: 10
  },
  {
    id: "female_route_5",
    code: "F5",
    network: "female",
    name: "Female Route 5",
    timingLabel: "6:30 AM to 5:30 PM",
    stops: femaleRoute5Stops,
    pathPoints: femaleRoute5Path,
    schedule: { serviceWindow: { start: "06:30", end: "17:30" } },
    serviceNote: "Secondary daytime loop serving Building 58, Building 22, and Station 314.",
    defaultBusNumbers: ["764", "765", "766"],
    segmentTravelSeconds: 30,
    dwellSeconds: 10
  },
  {
    id: "female_route_6",
    code: "F6",
    network: "female",
    name: "Female Route 6",
    timingLabel: "2:30 PM to 9:30 PM",
    stops: femaleRoute6Stops,
    pathPoints: femaleRoute6Path,
    schedule: { serviceWindow: { start: "14:30", end: "21:30" } },
    serviceNote: "Evening service linking Station 310, central stops, Square, Restaurant, and Parking 900.",
    defaultBusNumbers: ["767", "768", "769"],
    segmentTravelSeconds: 32,
    dwellSeconds: 10
  },
  {
    id: "female_route_7",
    code: "F7",
    network: "female",
    name: "Female Route 7",
    timingLabel: "8:00 AM to 4:00 PM",
    stops: femaleRoute7Stops,
    pathPoints: femaleRoute7Path,
    schedule: { serviceWindow: { start: "08:00", end: "16:00" } },
    serviceNote: "Parking B.424 connector for female students during the daytime schedule.",
    defaultBusNumbers: ["770", "771", "772"],
    segmentTravelSeconds: 52,
    dwellSeconds: 12
  },
  {
    id: "female_route_8",
    code: "F8",
    network: "female",
    name: "Female Route 8",
    timingLabel: "8:00 AM to 4:00 PM",
    stops: femaleRoute8Stops,
    pathPoints: femaleRoute8Path,
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
    segmentTravelSeconds: 54,
    dwellSeconds: 12
  }
];

export const LIVE_BUS_ROUTE_MAP = Object.fromEntries(LIVE_BUS_ROUTES.map((route) => [route.id, route])) as Record<string, LiveMapBusRoute>;
