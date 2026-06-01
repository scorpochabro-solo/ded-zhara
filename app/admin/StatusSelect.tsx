"use client";

import { useTransition } from "react";
import { updateLeadStatus } from "./actions";
import { STATUSES, STATUS_LABELS, type LeadStatus } from "@/lib/validation";
import { cn } from "@/lib/cn";

const ring: Record<LeadStatus, string> = {
  new: "border-copper/60 text-copper-bright",
  in_progress: "border-wood-light/60 text-wood-light",
  booked: "border-leaf-light/70 text-leaf-light",
  done: "border-line-strong text-muted",
  rejected: "border-ember/50 text-ember-bright",
};

export function StatusSelect({ id, value }: { id: string; value: string }) {
  const [pending, start] = useTransition();
  const v = (STATUSES as readonly string[]).includes(value)
    ? (value as LeadStatus)
    : "new";

  return (
    <select
      value={v}
      disabled={pending}
      aria-label="Статус заявки"
      onChange={(e) => {
        const next = e.target.value;
        start(() => {
          void updateLeadStatus(id, next);
        });
      }}
      className={cn(
        "rounded-lg border bg-surface px-2.5 py-1.5 text-sm transition-opacity focus:outline-none focus:ring-1 focus:ring-copper",
        ring[v],
        pending && "opacity-50",
      )}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-surface text-cream">
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
