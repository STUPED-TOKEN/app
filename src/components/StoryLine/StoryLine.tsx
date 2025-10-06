import React, { useEffect } from "react";
import { Arrow } from "../../assets/icons/Arrow";
import { RedX } from "../../assets/icons/RedX";
import s from "./StoryLine.module.css";
import type { Address, Dictionary } from "@ton/core";

type ISOish = string | Date;

export type StoryPoint = {
  id: string;
  label: string;
  start: ISOish;
  end?: ISOish;
  dict: Dictionary<bigint, Address>;
  address: Address;
  durationMs?: number;
};

type StoryLineProps = {
  points: StoryPoint[];
  className?: string;
  setCurrentPoint?: React.Dispatch<React.SetStateAction<EnrichedStoryPoint | null>>;
};

export interface EnrichedStoryPoint {
  start: number;
  end: number;
  status: Status;
  timer: string;
  id: string;
  label: string;
  dict: Dictionary<bigint, Address>;
  address: Address;
  durationMs?: number;
}

type Status = "End" | "Live" | "Start in";

const toDate = (v: ISOish) => (v instanceof Date ? v : new Date(v));

function decideWindow(p: StoryPoint) {
  const start = toDate(p.start).getTime();
  const end = p.end ? toDate(p.end).getTime() : start + (p.durationMs ?? 60 * 60 * 1000);
  return { start, end };
}

function formatHMS(ms: number) {
  const sTotal = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(sTotal / 3600)).padStart(2, "0");
  const mm = String(Math.floor((sTotal % 3600) / 60)).padStart(2, "0");
  const ss = String(sTotal % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function useNow(tickMs = 1000) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);
  return now;
}

export const StoryLine: React.FC<StoryLineProps> = ({ points, className, setCurrentPoint }) => {
  const now = useNow(1000);

  const enriched = points.map((p) => {
    const { start, end } = decideWindow(p);
    const status: Status = now < start ? "Start in" : now >= end ? "End" : "Live";
    const ms = status === "Start in" ? start - now : status === "Live" ? end - now : 0;
    return { ...p, start, end, status, timer: formatHMS(ms) };
  });

  useEffect(() => {
    const index = enriched.findIndex((p) => p.status === "Live");
    const current = enriched[index];
    const storyLine = document.getElementById("storyline");
    const currentPoint = current ? document.getElementById(`point-${current.id}`) : null;

    if (storyLine && currentPoint) {
      const offset = currentPoint.offsetLeft + currentPoint.offsetWidth / 2 - storyLine.offsetWidth / 2;

      storyLine.scrollTo({
        left: offset,
        behavior: "smooth",
      });
    }
  }, []);
  React.useEffect(() => {
    const current = enriched.find((p) => p.status === "Live");

    if (setCurrentPoint) {
      setCurrentPoint(current ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  return (
    <div
      className={`${s.wrapper} ${className ?? ""}`}
      id="storyline">
      {enriched.map((p, i) => (
        <React.Fragment key={i}>
          <PointCard point={p} />
          {i < enriched.length - 1 && <Arrow className={s.arrow} />}
        </React.Fragment>
      ))}
    </div>
  );
};

type PointCardData = ReturnType<typeof decideWindow> & {
  id: string;
  label: string;
  status: Status;
  timer: string;
};

const PointCard: React.FC<{ point: PointCardData }> = ({ point }) => {
  const statusClass = point.status === "Live" ? s.live : point.status === "Start in" ? s.upcoming : s.ended;

  return (
    <div
      className={`${s.card} ${statusClass}`}
      id={`point-${point.id}`}>
      {point.status == "End" && <RedX className={s.redX} />}
      <div className={s.title}>
        {point.label} - {point.status}
      </div>
      <div className={s.time}>{point.status === "End" ? "00:00:00" : point.timer}</div>
    </div>
  );
};

export default StoryLine;
