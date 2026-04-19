"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { useStudentProfile } from "@/components/providers/student-profile-provider";
import {
  buildSessionInputFromUser,
  endParkingSession,
  getAlertsPageData,
  getParkingModalData,
  getParkingPageData,
  startParkingSession,
  type Coordinates,
  type ParkingPageData,
  type ParkingModalData,
  type UserParkingSession
} from "@/lib/engines/parking-session";
import { haversineDistanceMeters, normalizeLotId } from "@/lib/engines/preferred-building-guidance";
import { parkingLocations } from "@/lib/data/parking-locations";
import type { FloorKey } from "@/lib/engines/lot-detail";

type ParkingSessionContextValue = {
  activeSession: UserParkingSession | null;
  now: Date;
  modalData: ParkingModalData | null;
  alertsPageData: ReturnType<typeof getAlertsPageData> | null;
  parkingPageData: ParkingPageData | null;
  modalOpen: boolean;
  locationState: "idle" | "capturing" | "captured" | "denied" | "fallback";
  startSession: (input: { lotId: string; floorKey?: FloorKey; slotId: string; fallbackCoordinates?: Coordinates | null }) => Promise<void>;
  stopSession: () => void;
  dismissModal: () => void;
};

const ParkingSessionContext = createContext<ParkingSessionContextValue | null>(null);
const storageKey = "kfupm-parkwise-active-session";

function readStoredSession() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserParkingSession;
  } catch {
    return null;
  }
}

function getLotFallbackCoordinates(lotId: string): Coordinates | null {
  return parkingLocations.find((lot) => normalizeLotId(lot.id) === normalizeLotId(lotId))?.coordinates ?? null;
}

function requestCurrentPosition(): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 30000 }
    );
  });
}

function resolveSessionCoordinates(captured: Coordinates | null, fallback: Coordinates | null) {
  if (!captured) return fallback ?? null;
  if (!fallback) return captured;

  // If the browser-reported position is far from the selected lot, keep the lot
  // coordinates as the source of truth for parking guidance.
  return haversineDistanceMeters(captured, fallback) <= 1200 ? captured : fallback;
}

export function ParkingSessionProvider({ children }: { children: ReactNode }) {
  const { user } = useStudentProfile();
  const [activeSession, setActiveSession] = useState<UserParkingSession | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [locationState, setLocationState] = useState<ParkingSessionContextValue["locationState"]>("idle");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const stored = readStoredSession();
    if (stored?.userId === user.id && stored.isActive) {
      const fallbackCoordinates = getLotFallbackCoordinates(stored.lotId);
      setActiveSession({
        ...stored,
        parkedCoordinates: resolveSessionCoordinates(stored.parkedCoordinates, fallbackCoordinates) ?? stored.parkedCoordinates
      });
    }
  }, [user.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (activeSession?.isActive) {
      window.localStorage.setItem(storageKey, JSON.stringify(activeSession));
    } else {
      window.localStorage.removeItem(storageKey);
    }
  }, [activeSession]);

  useEffect(() => {
    if (!activeSession?.isActive) return;
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, [activeSession?.isActive]);

  const value = useMemo<ParkingSessionContextValue>(() => {
    const modalData = activeSession ? getParkingModalData(activeSession, now) : null;
    const alertsPageData = activeSession ? getAlertsPageData(activeSession, now) : null;
    const parkingPageData = activeSession ? getParkingPageData(activeSession, now) : null;

    return {
      activeSession,
      now,
      modalData,
      alertsPageData,
      parkingPageData,
      modalOpen,
      locationState,
      startSession: async ({ lotId, floorKey, slotId, fallbackCoordinates }) => {
        setLocationState("capturing");
        const coordinates = await requestCurrentPosition();
        const finalCoordinates = resolveSessionCoordinates(coordinates, fallbackCoordinates ?? null);
        setLocationState(
          coordinates && finalCoordinates === coordinates
            ? "captured"
            : fallbackCoordinates
              ? "fallback"
              : "denied"
        );
        const session = startParkingSession(buildSessionInputFromUser(user, lotId, floorKey, slotId, finalCoordinates));
        setActiveSession(session);
        setNow(new Date());
        setModalOpen(true);
      },
      stopSession: () => {
        if (!activeSession) return;
        endParkingSession(activeSession.id);
        setActiveSession(null);
        setModalOpen(false);
        setLocationState("idle");
      },
      dismissModal: () => setModalOpen(false)
    };
  }, [activeSession, locationState, modalOpen, now, user]);

  return <ParkingSessionContext.Provider value={value}>{children}</ParkingSessionContext.Provider>;
}

export function useParkingSession() {
  const context = useContext(ParkingSessionContext);
  if (!context) {
    throw new Error("useParkingSession must be used within ParkingSessionProvider");
  }

  return context;
}
