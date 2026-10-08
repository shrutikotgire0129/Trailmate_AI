"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useSyncExternalStore, useState } from "react";
import { MissionHistoryItem } from "@/types/history";

const activities = [
  "All",
  "Walking",
  "Hiking",
  "Cycling",
  "Nature",
  "Photography",
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title A–Z" },
  { value: "title-desc", label: "Title Z–A" },
];

function getHistorySnapshot(): string {
  if (typeof window === "undefined") {
    return "[]";
  }

  return localStorage.getItem("trailmate-mission-history") || "[]";
}

function getServerSnapshot(): string {
  return "[]";
}

function subscribeToHistory(callback: () => void) {
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("storage", callback);
  };
}

function parseHistory(value: string): MissionHistoryItem[] {
  try {
    return JSON.parse(value) as MissionHistoryItem[];
  } catch {
    return [];
  }
}

export default function HistoryPage() {
  const historySnapshot = useSyncExternalStore(
    subscribeToHistory,
    getHistorySnapshot,
    getServerSnapshot,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const missionHistory = useMemo(
    () => parseHistory(historySnapshot),
    [historySnapshot],
  );

  const totalMinutesOutside = missionHistory.reduce((total, item) => {
    const duration = item.mission.duration.toLowerCase();

    if (duration.includes("10 hours")) {
      return total + 600;
    }

    if (duration.includes("5 hours")) {
      return total + 300;
    }

    if (duration.includes("3 hours")) {
      return total + 180;
    }

    if (duration.includes("1 hour")) {
      return total + 60;
    }

    return total;
  }, 0);

  const hoursOutside = Math.floor(totalMinutesOutside / 60);
  const minutesOutside = totalMinutesOutside % 60;

  const totalPhoneFreeMinutes = missionHistory.reduce(
    (total, item) => total + (item.phoneFreeMinutes || 0),
    0,
  );

  const phoneFreeHours = Math.floor(totalPhoneFreeMinutes / 60);
  const phoneFreeMinutes = totalPhoneFreeMinutes % 60;

  const filteredHistory = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = missionHistory.filter((item) => {
      const matchesSearch =
        !query ||
        item.mission.title.toLowerCase().includes(query) ||
        item.mission.activity.toLowerCase().includes(query) ||
        item.mission.tagline.toLowerCase().includes(query);

      const matchesActivity =
        activityFilter === "All" || item.mission.activity === activityFilter;

      return matchesSearch && matchesActivity;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "oldest") {
        return (
          new Date(a.completedAt).getTime() -
          new Date(b.completedAt).getTime()
        );
      }

      if (sortBy === "title-asc") {
        return a.mission.title.localeCompare(b.mission.title);
      }

      if (sortBy === "title-desc") {
        return b.mission.title.localeCompare(a.mission.title);
      }

      return (
        new Date(b.completedAt).getTime() -
        new Date(a.completedAt).getTime()
      );
    });
  }, [missionHistory, searchQuery, activityFilter, sortBy]);

  function clearHistory() {
    localStorage.removeItem("trailmate-mission-history");
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <main className="min-h-screen bg-[#f5f7f2] text-[#172018]">
      <nav className="mx-auto max-w-6xl px-6 py-5">
        <div className="flex items-center justify-between rounded-full border border-[#d8dfd4] bg-white/90 px-5 py-3 shadow-sm backdrop-blur-sm sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="TrailMate AI logo"
              width={36}
              height={36}
              className="rounded-full object-cover"
            />

            <span className="text-lg font-bold tracking-tight text-[#172018]">
              TrailMate AI
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-full border border-[#31572c] px-4 py-2 text-sm font-semibold text-[#31572c] transition-colors hover:bg-[#31572c] hover:text-white"
          >
            Create Mission
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-12">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#31572c]">
            Your progress
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Mission History
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#526052]">
            Every mission you complete is time you chose to spend outside.
          </p>
        </div>

        {missionHistory.length > 0 ? (
          <>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#c9d7c5] bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#31572c]">
                  Missions completed
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {missionHistory.length}
                </p>
              </div>

              <div className="rounded-2xl border border-[#c9d7c5] bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#31572c]">
                  Time outside
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {hoursOutside > 0 && `${hoursOutside}h `}
                  {minutesOutside > 0 && `${minutesOutside}m`}
                  {hoursOutside === 0 && minutesOutside === 0 && "0m"}
                </p>
              </div>

              <div className="rounded-2xl border border-[#c9d7c5] bg-white p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#31572c]">
                  Phone-free time
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {phoneFreeHours > 0 && `${phoneFreeHours}h `}
                  {phoneFreeMinutes > 0 && `${phoneFreeMinutes}m`}
                  {phoneFreeHours === 0 &&
                    phoneFreeMinutes === 0 &&
                    "0m"}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-[#c9d7c5] bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Completed missions</h2>

                  <p className="mt-1 text-sm text-[#687466]">
                    Your outdoor adventures so far.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearHistory}
                  className="w-full rounded-lg border border-[#d8dfd4] px-3 py-2 text-xs font-semibold text-[#687466] transition hover:border-red-300 hover:text-red-600 sm:w-auto"
                >
                  Clear history
                </button>
              </div>

              <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search missions..."
                  className="h-11 w-full rounded-xl border border-[#d8dfd4] bg-[#fafbf9] px-4 text-sm text-[#172018] outline-none transition placeholder:text-[#8b9688] focus:border-[#31572c] focus:ring-2 focus:ring-[#31572c]/10"
                  aria-label="Search missions"
                />

                <select
                  value={activityFilter}
                  onChange={(event) => setActivityFilter(event.target.value)}
                  className="h-11 rounded-xl border border-[#d8dfd4] bg-[#fafbf9] px-4 text-sm font-medium text-[#526052] outline-none transition focus:border-[#31572c] focus:ring-2 focus:ring-[#31572c]/10"
                  aria-label="Filter missions by activity"
                >
                  {activities.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? "All activities" : item}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-11 rounded-xl border border-[#d8dfd4] bg-[#fafbf9] px-4 text-sm font-medium text-[#526052] outline-none transition focus:border-[#31572c] focus:ring-2 focus:ring-[#31572c]/10"
                  aria-label="Sort missions"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-xs font-medium text-[#687466]">
                  {filteredHistory.length}{" "}
                  {filteredHistory.length === 1 ? "mission" : "missions"} found
                </p>

                {(searchQuery || activityFilter !== "All") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActivityFilter("All");
                    }}
                    className="text-xs font-semibold text-[#31572c] transition hover:text-[#264723]"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {filteredHistory.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-[#d8dfd4] bg-[#f5f7f2] p-4 transition hover:border-[#c9d7c5]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold">
                            {item.mission.title}
                          </h3>

                          <p className="mt-1 text-sm text-[#526052]">
                            {item.mission.activity} · {item.mission.duration}
                          </p>

                          <p className="mt-2 text-xs text-[#687466]">
                            {item.mission.tagline}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs text-[#687466]">
                          {new Date(item.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-[#c9d7c5] bg-[#f8faf6] p-8 text-center">
                  <p className="font-semibold text-[#31572c]">
                    No matching missions
                  </p>

                  <p className="mt-2 text-sm text-[#687466]">
                    Try a different search term or activity filter.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[#d8dfd4] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf5ea] text-2xl">
              →
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              No completed missions yet.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#526052]">
              Create your first outdoor mission, complete it, and your progress
              will appear here.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-xl bg-[#31572c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#264723]"
            >
              Create your first mission
            </Link>
          </div>
        )}
      </section>

      <footer className="border-t border-[#d8dfd4] px-6 py-8 text-center text-sm text-[#687466]">
        Built for Hacktoberfest 2026 · TrailMate AI
      </footer>
    </main>
  );
}