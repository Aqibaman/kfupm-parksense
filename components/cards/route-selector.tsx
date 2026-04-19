"use client";

import type { LiveMapBusRoute } from "@/lib/types";

export function RouteSelector({
  routes,
  selectedRouteId,
  onSelect
}: {
  routes: LiveMapBusRoute[];
  selectedRouteId: string;
  onSelect: (routeId: string) => void;
}) {
  return (
    <div className="rounded-[28px] border border-[#dbe9e1] bg-white p-4 shadow-[0_18px_50px_rgba(0,62,81,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#008540]">Choose route</p>
          <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">Select a live route to follow</h3>
        </div>
        <span className="rounded-full bg-[#eef8f2] px-3 py-1 text-xs font-semibold text-[#0b5b72]">
          {routes.length} routes
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 xl:flex xl:flex-nowrap">
        {routes.map((route) => {
          const active = route.id === selectedRouteId;
          return (
            <button
              key={route.id}
              type="button"
              onClick={() => onSelect(route.id)}
              className={`min-w-0 rounded-[22px] border px-3 py-3 text-left transition sm:px-4 xl:min-w-[180px] ${
                active
                  ? "border-[#0b5b72] bg-[linear-gradient(135deg,#0b5b72_0%,#008540_100%)] text-white shadow-[0_18px_40px_rgba(0,62,81,0.16)]"
                  : "border-[#dbe9e1] bg-[#f9fcfa] text-[#0f172a] hover:border-[#8ac4a1]"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${active ? "bg-white/16 text-white" : "bg-[#eef8f2] text-[#0b5b72]"}`}>
                  {route.code}
                </span>
                <span className={`text-[11px] leading-5 sm:text-xs ${active ? "text-white/82" : "text-slate-500"}`}>{route.timingLabel}</span>
              </div>
              <p className={`mt-3 text-sm font-semibold leading-6 ${active ? "text-white" : "text-[#0f172a]"}`}>{route.name}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
