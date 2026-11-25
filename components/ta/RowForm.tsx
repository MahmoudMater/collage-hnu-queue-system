"use client";

import { useState } from "react";
import { dayLabel, ta } from "@/lib/strings";
import type { RowInput, TableRow } from "@/lib/ta-types";

const DAYS = Object.keys(dayLabel);

/** Add or edit one row of the table. It only collects the fields; the server validates them. */
export function RowForm({
  initial,
  onSave,
  onCancel,
  busy,
}: {
  initial?: TableRow;
  onSave: (input: RowInput) => void;
  onCancel: () => void;
  busy: boolean;
}) {
  const [team, setTeam] = useState(initial ? String(initial.team) : "");
  const [leaderName, setLeaderName] = useState(initial?.leaderName ?? "");
  const [leaderId, setLeaderId] = useState(initial?.leaderUniversityId ?? "");
  const [day, setDay] = useState(initial?.day ?? DAYS[0]);
  const [time, setTime] = useState(initial?.time ?? "");

  const input = "mt-1 block w-full rounded-lg border border-line bg-background px-3 py-2 text-base";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          team: Number(team),
          leaderName,
          leaderUniversityId: leaderId.trim() === "" ? null : leaderId.trim(),
          day,
          time,
        });
      }}
      className="space-y-3 rounded-lg bg-accent-soft p-3"
    >
      <label className="block text-sm">
        {ta.session.fields.team}
        <input value={team} onChange={(e) => setTeam(e.target.value)} inputMode="numeric" className={input} />
      </label>
      <label className="block text-sm">
        {ta.session.fields.leaderName}
        <input value={leaderName} onChange={(e) => setLeaderName(e.target.value)} className={input} />
      </label>
      <label className="block text-sm">
        {ta.session.fields.leaderUniversityId}
        <input value={leaderId} onChange={(e) => setLeaderId(e.target.value)} inputMode="numeric" className={input} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          {ta.session.fields.day}
          <select value={day} onChange={(e) => setDay(e.target.value)} className={input}>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {dayLabel[d]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          {ta.session.fields.time}
          <input
            dir="ltr"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder={ta.session.timePlaceholder}
            className={`${input} text-left`}
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-background">
          {busy ? "…" : ta.session.save}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-line px-4 py-2 text-sm">
          {ta.session.cancel}
        </button>
      </div>
    </form>
  );
}
