import { busRoutes, busStops, buses, parkingLots } from "@/lib/data/kfupm-data";
import type { BusNetworkType, ParkingLot } from "@/lib/types";

export function getNearestStopsForLot(lotId: string) {
  return busStops.filter((stop) => stop.nearbyLots.includes(lotId));
}

export function getRoutesForNetwork(networkType: BusNetworkType) {
  return busRoutes.filter((route) => route.networkType === networkType);
}

export function getBusesForNetwork(networkType: BusNetworkType) {
  return buses.filter((bus) => bus.networkType === networkType);
}

export function findBestBusOption(lotId: string, networkType: BusNetworkType) {
  const stops = getNearestStopsForLot(lotId);
  const routes = getRoutesForNetwork(networkType).filter((route) => route.stopIds.some((stopId) => stops.some((stop) => stop.id === stopId)));
  return {
    stops,
    routes,
    buses: getBusesForNetwork(networkType).filter((bus) => routes.some((route) => route.id === bus.routeId))
  };
}

export function findLotByDestination(destination: string) {
  return parkingLots.filter((lot) => lot.buildingCluster.toLowerCase().includes(destination.toLowerCase()) || lot.lotName.toLowerCase().includes(destination.toLowerCase()));
}

export function getNearestStopName(lot: ParkingLot) {
  const stop = busStops.find((item) => item.id === lot.nearestStopIds[0]);
  return stop?.stopName ?? "Station data pending";
}

