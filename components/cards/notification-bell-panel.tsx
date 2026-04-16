import Link from "next/link";
import { BellRing } from "lucide-react";
import { Card, CardTitle, StatPill } from "@/components/ui/card";
import type { AppNotification } from "@/lib/types";

export function NotificationBellPanel({ notifications }: { notifications: AppNotification[] }) {
  return (
    <Card className="bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf8_100%)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#003E51] p-3 text-white">
            <BellRing className="h-5 w-5" />
          </div>
          <CardTitle title="Notification Center" subtitle="Alerts for curfew, bus ETA, lot pressure, and special rule zones." />
        </div>
        <StatPill label="Unread" value={String(notifications.filter((item) => !item.readAt).length)} tone="red" />
      </div>
      <div className="space-y-3">
        {notifications.slice(0, 3).map((notification) => (
          <div key={notification.id} className="rounded-2xl border border-[#003E51]/10 bg-[#f8fbf9] p-3">
            <p className="font-semibold text-[#003E51]">{notification.title}</p>
            <p className="mt-1 text-sm text-[#557072]">{notification.message}</p>
          </div>
        ))}
      </div>
      <Link href="/notifications" className="mt-4 inline-flex rounded-full bg-[#008540] px-4 py-2 text-sm font-semibold text-white">
        Open all alerts
      </Link>
    </Card>
  );
}
