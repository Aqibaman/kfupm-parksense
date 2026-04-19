"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [mapReady, setMapReady] = useState(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const bounds = useMemo(
    () => route.pathPoints.map((point) => [point.coordinates.lat, point.coordinates.lng] as [number, number]),
    [route]
  );

  function refreshMapViewport() {
    const map = mapRef.current;
    if (!map || !bounds.length) return;

    window.requestAnimationFrame(() => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [24, 24] });
    });
  }

  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      if (!mapElementRef.current || mapRef.current) return;

      const L = await import("leaflet");
      if (cancelled || !mapElementRef.current) return;

      leafletRef.current = L;
      const map = L.map(mapElementRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: false
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map).on("load", () => {
        if (!cancelled) {
          refreshMapViewport();
        }
      });

      routeLayerRef.current = L.layerGroup().addTo(map);
      stopLayerRef.current = L.layerGroup().addTo(map);
      busLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapReady(true);

      resizeObserverRef.current = new ResizeObserver(() => refreshMapViewport());
      resizeObserverRef.current.observe(mapElementRef.current);

      [50, 180, 450].forEach((delay) => {
        window.setTimeout(() => {
          if (!cancelled) {
            refreshMapViewport();
          }
        }, delay);
      });
    }

    initializeMap();

    return () => {
      cancelled = true;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
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
    if (!mapReady || !map || !L || !routeLayerRef.current || !stopLayerRef.current || !busLayerRef.current) return;

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
    window.requestAnimationFrame(() => {
      map.invalidateSize();
    });
  }, [buses, mapReady, route]);

  useEffect(() => {
    refreshMapViewport();
  }, [bounds, route.id]);

  return (
    <div
      ref={mapElementRef}
      className="parkwise-route-map h-[320px] w-full max-w-full rounded-[24px] border border-[#dbe9e1] sm:h-[360px] md:h-[400px] lg:h-[420px] xl:h-[520px]"
    />
  );
}
