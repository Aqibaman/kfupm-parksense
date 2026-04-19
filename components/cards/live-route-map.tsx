"use client";

import { useEffect, useMemo, useRef } from "react";
import type { ActiveBus, LiveMapBusRoute } from "@/lib/types";

type LeafletModule = typeof import("leaflet");

function getStopShortLabel(name: string) {
  if (name.startsWith("Station ")) return name.replace("Station ", "");
  if (name.startsWith("Parking ")) return name.replace("Parking ", "");
  if (name.startsWith("Building ")) return name.replace("Building ", "B");
  if (name === "Dhahran Techno Valley") return "DTV";
  if (name === "Bus Stop 27") return "27";
  if (name === "Square") return "SQ";
  if (name === "Restaurant") return "R";
  return name.slice(0, 3).toUpperCase();
}

export function LiveRouteMap({
  route,
  buses
}: {
  route: LiveMapBusRoute;
  buses: ActiveBus[];
}) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const routeLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const stopLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const busLayerRef = useRef<import("leaflet").LayerGroup | null>(null);

  const bounds = useMemo(
    () => route.pathPoints.map((point) => [point.coordinates.lat, point.coordinates.lng] as [number, number]),
    [route]
  );

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      if (!mapElementRef.current || mapRef.current) return;

      const L = await import("leaflet");
      if (cancelled || !mapElementRef.current) return;

      leafletRef.current = L;
      const map = L.map(mapElementRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      routeLayerRef.current = L.layerGroup().addTo(map);
      stopLayerRef.current = L.layerGroup().addTo(map);
      busLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
    }

    initializeMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
      stopLayerRef.current = null;
      busLayerRef.current = null;
      leafletRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L || !routeLayerRef.current || !stopLayerRef.current || !busLayerRef.current) return;

    routeLayerRef.current.clearLayers();
    stopLayerRef.current.clearLayers();
    busLayerRef.current.clearLayers();

    const polyline = L.polyline(
      route.pathPoints.map((point) => [point.coordinates.lat, point.coordinates.lng] as [number, number]),
      {
        color: "#0b5b72",
        weight: 5,
        opacity: 0.8
      }
    );

    polyline.addTo(routeLayerRef.current);

    route.stops.forEach((stop) => {
      const marker = L.marker([stop.coordinates.lat, stop.coordinates.lng], {
        icon: L.divIcon({
          className: "parkwise-map-icon-wrapper",
          html: `<div class="parkwise-stop-icon">${getStopShortLabel(stop.name)}</div>`
        })
      });

      marker.bindPopup(
        `<div class="parkwise-map-popup"><strong>${stop.name}</strong><br/>${route.name}<br/>${stop.coordinates.lat.toFixed(6)}, ${stop.coordinates.lng.toFixed(6)}</div>`
      );

      marker.addTo(stopLayerRef.current!);
    });

    buses.forEach((bus) => {
      const marker = L.marker([bus.currentCoordinates.lat, bus.currentCoordinates.lng], {
        icon: L.divIcon({
          className: "parkwise-map-icon-wrapper",
          html: `<div class="parkwise-bus-icon">🚌</div>`
        })
      });

      marker.bindPopup(
        `<div class="parkwise-map-popup"><strong>Bus ${bus.busNumber}</strong><br/>${route.name}<br/>Status: ${
          bus.status === "boarding" ? "Boarding" : bus.status === "inactive" ? "Inactive" : "Running"
        }<br/>Next stop: ${bus.nextStopName ?? "Not available"}</div>`
      );

      marker.addTo(busLayerRef.current!);
    });

    if (bounds.length) {
      map.fitBounds(bounds, { padding: [28, 28] });
    }
  }, [bounds, buses, route]);

  return (
    <div
      ref={mapElementRef}
      className="parkwise-route-map h-[260px] w-full max-w-full rounded-[24px] border border-[#dbe9e1] sm:h-[320px] md:h-[360px] lg:h-[420px] xl:h-[520px]"
    />
  );
}
