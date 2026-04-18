export interface BusStop {
  id: string;
  name: string;
  gender: "male" | "female";
  routeId: string;
  routeName: string;
  coordinates: { lat: number; lng: number };
  timingLabel?: string;
}

// Bus stop coordinates sourced from `Car Parking and Bus Stops (Latitude and Longitude).xlsx`.
export const busStops: BusStop[] = [
  { id: "station_301", name: "Station 301", gender: "male", routeId: "male_route_1", routeName: "Male Route One", coordinates: { lat: 26.3149451, lng: 50.1458523 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_302", name: "Station 302", gender: "male", routeId: "male_route_1", routeName: "Male Route One", coordinates: { lat: 26.3143989, lng: 50.1444828 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_303", name: "Station 303", gender: "male", routeId: "male_route_1", routeName: "Male Route One", coordinates: { lat: 26.314053, lng: 50.1431176 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_304", name: "Station 304", gender: "male", routeId: "male_route_1", routeName: "Male Route One", coordinates: { lat: 26.3129679, lng: 50.1395563 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_305", name: "Station 305", gender: "male", routeId: "male_route_1", routeName: "Male Route One", coordinates: { lat: 26.3122636, lng: 50.1415329 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_306", name: "Station 306", gender: "male", routeId: "male_route_1", routeName: "Male Route One", coordinates: { lat: 26.3100076, lng: 50.142875 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_311", name: "Station 311", gender: "male", routeId: "male_route_1", routeName: "Male Route One", coordinates: { lat: 26.3084247, lng: 50.144929 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_313", name: "Station 313", gender: "male", routeId: "male_route_1", routeName: "Male Route One", coordinates: { lat: 26.3062346, lng: 50.1469195 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_308", name: "Station 308", gender: "male", routeId: "male_route_2", routeName: "Male Route Two", coordinates: { lat: 26.3140801, lng: 50.1488886 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_316", name: "Station 316", gender: "male", routeId: "male_route_3", routeName: "Male DTV Connector", coordinates: { lat: 26.3091606, lng: 50.1388651 }, timingLabel: "8:00 AM to 4:00 PM" },
  { id: "dhahran_techno_valley", name: "Dhahran Techno Valley", gender: "male", routeId: "male_route_3", routeName: "Male DTV Connector", coordinates: { lat: 26.3031563, lng: 50.1568302 }, timingLabel: "8:00 AM to 4:00 PM" },
  { id: "parking_b424", name: "Parking B.424", gender: "male", routeId: "male_route_4", routeName: "Male B.424 Connector", coordinates: { lat: 26.3018998, lng: 50.1564098 }, timingLabel: "8:00 AM to 4:00 PM" },

  { id: "parking_900", name: "Parking 900", gender: "female", routeId: "female_route_1", routeName: "Female Route One", coordinates: { lat: 26.3029416, lng: 50.147002 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "parking_404_stop", name: "Parking 404", gender: "female", routeId: "female_route_1", routeName: "Female Route One", coordinates: { lat: 26.301609, lng: 50.1533968 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "bus_stop_27", name: "Bus Stop 27", gender: "female", routeId: "female_route_2", routeName: "Female Route Two", coordinates: { lat: 26.3047455, lng: 50.1492993 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_312", name: "Station 312", gender: "female", routeId: "female_route_2", routeName: "Female Route Two", coordinates: { lat: 26.3087453, lng: 50.1428758 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "building_22_stop", name: "Building 22 Stop", gender: "female", routeId: "female_route_3", routeName: "Female Route Three", coordinates: { lat: 26.3061394, lng: 50.1464502 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_319", name: "Station 319", gender: "female", routeId: "female_route_3", routeName: "Female Route Three", coordinates: { lat: 26.3129446, lng: 50.1493728 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_310", name: "Station 310", gender: "female", routeId: "female_route_4", routeName: "Female Route Four", coordinates: { lat: 26.3110943, lng: 50.1479139 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_309", name: "Station 309", gender: "female", routeId: "female_route_4", routeName: "Female Route Four", coordinates: { lat: 26.313867, lng: 50.1493237 }, timingLabel: "6:30 AM to 5:30 PM" },
  { id: "station_314", name: "Station 314", gender: "female", routeId: "female_route_6", routeName: "Female Route Six", coordinates: { lat: 26.3056621, lng: 50.1484383 }, timingLabel: "2:30 PM to 9:30 PM" },
  { id: "square", name: "Square", gender: "female", routeId: "female_route_6", routeName: "Female Route Six", coordinates: { lat: 26.3010283, lng: 50.1461315 }, timingLabel: "2:30 PM to 9:30 PM" },
  { id: "restaurant", name: "Restaurant", gender: "female", routeId: "female_route_6", routeName: "Female Route Six", coordinates: { lat: 26.3154896, lng: 50.1482487 }, timingLabel: "2:30 PM to 9:30 PM" },
  { id: "dhahran_techno_valley_female", name: "Dhahran Techno Valley", gender: "female", routeId: "female_route_8", routeName: "Female Route Eight", coordinates: { lat: 26.3031563, lng: 50.1568302 }, timingLabel: "8:00 AM to 4:00 PM" },
  { id: "parking_b424_female", name: "Parking B.424", gender: "female", routeId: "female_route_7", routeName: "Female Route Seven", coordinates: { lat: 26.3018998, lng: 50.1564098 }, timingLabel: "8:00 AM to 4:00 PM" },
  { id: "building_58_stop", name: "Building 58", gender: "female", routeId: "female_route_5", routeName: "Female Route Five", coordinates: { lat: 26.3157919, lng: 50.1487696 }, timingLabel: "6:30 AM to 5:30 PM" }
];
