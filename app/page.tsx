"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { OutdoorMission } from "@/types/mission";
import { MissionHistoryItem } from "@/types/history";

const activities = [
  "Walking",
  "Hiking",
  "Cycling",
  "Nature",
  "Photography",
  "Surprise me",
];

const durations = ["1 hour", "3 hours", "5 hours", "10 hours"];

export default function Home() {
  const [request, setRequest] = useState("");
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mission, setMission] = useState<OutdoorMission | null>(null);
  const [error, setError] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [phoneFreeMode, setPhoneFreeMode] = useState(false);
  const [phoneFreeCountdown, setPhoneFreeCountdown] = useState(5);
  const [phoneFreeStartedAt, setPhoneFreeStartedAt] = useState<number | null>(
    null,
  );
  const [phoneFreeElapsedMs, setPhoneFreeElapsedMs] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMission(null);
    setCompletedSteps([]);
    setPhoneFreeMode(false);
    setPhoneFreeCountdown(5);
    setPhoneFreeStartedAt(null);
    setPhoneFreeElapsedMs(0);

    if (!request.trim()) {
      setError("Tell us what kind of outdoor experience you want.");
      return;
    }

    if (!activity) {
      setError("Choose an activity first.");
      return;
    }

    if (!duration) {
      setError("Choose how much time you have.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-mission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userRequest: request.trim(),
          activity,
          duration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create your outdoor mission.");
      }

      if (!data.mission) {
        throw new Error("The AI did not return a mission.");
      }

      setMission(data.mission);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while creating your mission.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function toggleStep(index: number) {
    setCompletedSteps((current) =>
      current.includes(index)
        ? current.filter((stepIndex) => stepIndex !== index)
        : [...current, index],
    );
  }

  function getMissionScore() {
    if (!mission) {
      return 0;
    }

    const stepScore = Math.round(
      (completedSteps.length / mission.steps.length) * 60,
    );

    const natureScore = completedSteps.length === mission.steps.length ? 20 : 0;
    const phoneFreeScore =
      phoneFreeStartedAt !== null || phoneFreeElapsedMs > 0 ? 20 : 0;

    return Math.min(100, stepScore + natureScore + phoneFreeScore);
  }

  function saveMissionToHistory() {
    if (!mission) {
      return;
    }

    const totalPhoneFreeMs =
      phoneFreeElapsedMs +
      (phoneFreeStartedAt !== null ? Date.now() - phoneFreeStartedAt : 0);

    const phoneFreeMinutes =
      totalPhoneFreeMs > 0
        ? Math.max(1, Math.round(totalPhoneFreeMs / 60000))
        : 0;

    const historyItem: MissionHistoryItem = {
      id: crypto.randomUUID(),
      mission,
      completedAt: new Date().toISOString(),
      phoneFreeMinutes,
    };

    const savedHistory = localStorage.getItem("trailmate-mission-history");

    let existingHistory: MissionHistoryItem[] = [];

    if (savedHistory) {
      try {
        existingHistory = JSON.parse(savedHistory) as MissionHistoryItem[];
      } catch {
        existingHistory = [];
      }
    }

    localStorage.setItem(
      "trailmate-mission-history",
      JSON.stringify([historyItem, ...existingHistory]),
    );
    window.dispatchEvent(new Event("storage"));
  }

  useEffect(() => {
    if (!phoneFreeMode || phoneFreeCountdown <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setPhoneFreeCountdown((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [phoneFreeMode, phoneFreeCountdown]);

  if (phoneFreeMode && mission) {
    return (
      <main className="min-h-screen bg-[#f5f7f2] px-6 py-10 text-[#172018]">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#31572c]">
                Phone-Free Mode
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Stay outside. Stay present.
              </h1>
            </div>

            <button
              type="button"
              onClick={() => {
                if (phoneFreeStartedAt !== null) {
                  setPhoneFreeElapsedMs(
                    (current) => current + (Date.now() - phoneFreeStartedAt),
                  );
                }

                setPhoneFreeStartedAt(null);
                setPhoneFreeMode(false);
                setPhoneFreeCountdown(5);
              }}
              className="rounded-lg border border-[#31572c] px-3 py-2 text-xs font-semibold text-[#31572c]"
            >
              Exit
            </button>
          </div>

          {phoneFreeCountdown > 0 ? (
            <div className="mb-6 rounded-2xl border border-[#c9d7c5] bg-[#edf5ea] p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-[#31572c]">
                Get ready to go offline
              </p>

              <p className="mt-2 text-4xl font-bold text-[#31572c]">
                {phoneFreeCountdown}
              </p>

              <p className="mt-1 text-sm text-[#526052]">
                Put your phone down when the countdown ends.
              </p>
            </div>
          ) : (
            <div className="mb-6 rounded-2xl bg-[#31572c] p-5 text-center text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-[#dcebd8]">
                Phone-Free Mode
              </p>

              <p className="mt-2 text-xl font-bold">
                Phone down. Adventure on.
              </p>

              <p className="mt-1 text-sm text-[#dcebd8]">
                You know the mission. Now enjoy the outdoors.
              </p>
            </div>
          )}

          <div className="rounded-3xl border border-[#d8dfd4] bg-white p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#31572c]">
                  {completedSteps.length} / {mission.steps.length} completed
                </p>

                <p className="text-sm text-gray-500">{mission.duration}</p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e2e8df]">
                <div
                  className="h-full rounded-full bg-[#31572c] transition-all duration-500"
                  style={{
                    width: `${
                      (completedSteps.length / mission.steps.length) * 100
                    }%`,
                  }}
                />
              </div>

              {completedSteps.length === mission.steps.length && (
                <div className="mt-4 rounded-2xl border border-[#b8d2b2] bg-[#edf5ea] p-4 text-center">
                  <p className="text-sm font-bold text-[#31572c]">
                    Mission complete.
                  </p>

                  <p className="mt-1 text-sm text-[#526052]">
                    You made it outside. Now take a moment to enjoy where you
                    are.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold">{mission.title}</h2>

              <p className="mt-2 text-gray-600">{mission.tagline}</p>
            </div>

            <div className="mt-8 space-y-4">
              {mission.steps.map((step, index) => {
                const completed = completedSteps.includes(index);

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleStep(index)}
                    className={`w-full rounded-2xl border p-5 text-left transition ${
                      completed
                        ? "border-[#31572c] bg-[#edf5ea]"
                        : "border-[#d8dfd4] bg-[#fafbf9]"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                          completed
                            ? "border-[#31572c] bg-[#31572c] text-white"
                            : "border-[#aab5a6] text-[#31572c]"
                        }`}
                      >
                        {completed ? "✓" : index + 1}
                      </div>

                      <div>
                        <h3
                          className={`font-bold ${
                            completed ? "text-[#31572c]" : "text-[#172018]"
                          }`}
                        >
                          {step.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          {step.description}
                        </p>

                        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                          {step.duration}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {completedSteps.length === mission.steps.length && (
              <div className="mt-6 rounded-2xl bg-[#31572c] p-6 text-center text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-[#dcebd8]">
                  Mission complete
                </p>

                <h3 className="mt-2 text-2xl font-bold">You touched grass.</h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#dcebd8]">
                  Put your phone away and enjoy the rest of your time outside.
                </p>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Your phone is only here to guide you. Now look up.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7f2] text-[#172018]">
      <nav className="mx-auto max-w-6xl px-5 py-5">
        <div className="flex items-center justify-between rounded-full border border-[#d8dfd4] bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm sm:px-6">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/logo.png"
              alt="TrailMate AI logo"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />

            <span className="text-lg font-bold tracking-tight text-[#31572c]">
              TrailMate AI
            </span>
          </Link>

          <div className="flex items-center gap-5 text-sm font-semibold text-[#526052] sm:gap-8">
            <a
              href="#how-it-works"
              className="transition-colors hover:text-[#31572c] hover:translate-x-0.5 hover:scale-105"
            >
              How it works
            </a>

            <Link
              href="/history"
              className="transition-colors hover:text-[#31572c] hover:translate-x-0.5 hover:scale-105"
            >
              Mission History
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9d7c5] bg-white px-4 py-2 text-sm font-medium text-[#31572c] shadow-sm">
            <span>●</span>
            AI-powered outdoor adventures
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Touch Grass.
          </h1>
          <h2 className="text-[#31572c] text-5xl font-bold">
            Make it an adventure.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#526052]">
            Tell TrailMate what kind of outdoor experience you want. Our AI
            creates a personalized mission that gets you outside, exploring, and
            away from your screen.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-3xl rounded-3xl border border-[#d8dfd4] bg-white p-6 shadow-xl shadow-[#31572c]/5 sm:p-8"
        >
          <label
            htmlFor="activity-request"
            className="mb-3 block text-sm font-semibold"
          >
            What kind of outdoor experience are you looking for?
          </label>

          <textarea
            id="activity-request"
            value={request}
            onChange={(event) => setRequest(event.target.value)}
            placeholder="Example: I have 2 hours this Sunday and want a relaxing nature experience..."
            className="min-h-32 w-full resize-none rounded-2xl border border-[#d8dfd4] bg-[#fafbf9] p-4 text-sm outline-none transition placeholder:text-[#8b9688] focus:border-[#31572c] focus:ring-2 focus:ring-[#31572c]/10"
          />

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">Choose an activity</p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {activities.map((item) => {
                const selected = activity === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActivity(item)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      selected
                        ? "border-[#31572c] bg-[#31572c] text-white"
                        : "border-[#d8dfd4] bg-white text-[#526052] hover:border-[#31572c] hover:bg-[#f5f7f2] hover:text-[#31572c]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">
              How much time do you have?
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {durations.map((item) => {
                const selected = duration === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDuration(item)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      selected
                        ? "border-[#31572c] bg-[#31572c] text-white"
                        : "border-[#d8dfd4] bg-white text-[#526052] hover:border-[#31572c] hover:bg-[#f5f7f2] hover:text-[#31572c]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isGenerating}
            className="mt-8 w-full rounded-xl bg-[#31572c] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#264723] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating
              ? "Creating your mission..."
              : "Create My Outdoor Mission"}
          </button>

          {mission && (
            <div className="mt-6 rounded-2xl border border-[#c9d7c5] bg-[#f5f7f2] p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#31572c]">
                Your outdoor mission
              </p>

              <h2 className="mt-3 text-2xl font-bold">{mission.title}</h2>

              <p className="mt-2 text-sm italic text-[#526052]">
                {mission.tagline}
              </p>

              <div className="mt-5 rounded-2xl border border-[#c9d7c5] bg-[#f8faf6] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#31572c]">
                  Why this mission?
                </p>

                <p className="mt-2 text-sm leading-6 text-[#526052]">
                  {mission.whyThisMission}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium">
                  {mission.activity}
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium">
                  {mission.duration}
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium">
                  {mission.difficulty}
                </span>
              </div>

              <p className="mt-5 text-sm leading-6 text-[#526052]">
                {mission.summary}
              </p>

              <div className="mt-6">
                <h3 className="font-semibold">Before you go</h3>

                <ul className="mt-3 space-y-2 text-sm text-[#526052]">
                  {mission.preparation.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">Your mission</h3>

                    <span className="text-xs font-medium text-[#526052]">
                      {completedSteps.length}/{mission.steps.length} completed
                    </span>
                  </div>

                  {completedSteps.length < mission.steps.length && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhoneFreeMode(true);
                        setPhoneFreeCountdown(5);
                        setPhoneFreeStartedAt(Date.now());
                      }}
                      className="w-full rounded-lg border border-[#31572c] px-3 py-2 text-xs font-semibold text-[#31572c] transition hover:bg-[#31572c] hover:text-white sm:w-auto"
                    >
                      Start Phone-Free Mode
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-3">
                  {mission.steps.map((step, index) => {
                    const completed = completedSteps.includes(index);

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleStep(index)}
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          completed
                            ? "border-[#31572c] bg-[#e8f1e5]"
                            : "border-[#d8dfd4] bg-white hover:border-[#31572c]"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                              completed
                                ? "border-[#31572c] bg-[#31572c] text-white"
                                : "border-[#aeb9aa] bg-white text-[#526052]"
                            }`}
                          >
                            {completed ? "✓" : index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <h4
                                className={`font-semibold ${
                                  completed
                                    ? "text-[#31572c]"
                                    : "text-[#172018]"
                                }`}
                              >
                                {step.title}
                              </h4>

                              <span className="shrink-0 text-xs font-medium text-[#31572c]">
                                {step.duration}
                              </span>
                            </div>

                            <p
                              className={`mt-2 text-sm leading-6 ${
                                completed ? "text-[#687466]" : "text-[#526052]"
                              }`}
                            >
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {completedSteps.length === mission.steps.length && (
                <div className="mt-6">
                  <div className="rounded-2xl bg-[#31572c] p-6 text-center text-white">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#dcebd8]">
                      Mission complete
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">
                      You touched grass.
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#dcebd8]">
                      You finished your outdoor mission. Take a moment to
                      appreciate where you are before heading back to your
                      screen.
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-[#c9d7c5] bg-[#f8faf6] p-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#31572c]">
                      Mission score
                    </p>

                    <div className="mt-3 flex items-end justify-center gap-2">
                      <span className="text-4xl font-bold">
                        {getMissionScore()}
                      </span>

                      <span className="pb-1 text-sm text-[#687466]">/ 100</span>
                    </div>

                    <div className="mx-auto mt-4 h-2 max-w-md overflow-hidden rounded-full bg-[#dfe7dc]">
                      <div
                        className="h-full rounded-full bg-[#31572c] transition-all"
                        style={{ width: `${getMissionScore()}%` }}
                      />
                    </div>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#526052]">
                      The real score is the time you chose to spend outside.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        saveMissionToHistory();
                        setMission(null);
                        setCompletedSteps([]);
                        setPhoneFreeMode(false);
                        setPhoneFreeCountdown(5);
                        setPhoneFreeStartedAt(null);
                        setPhoneFreeElapsedMs(0);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="mt-5 rounded-xl bg-[#31572c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#264723]"
                    >
                      Generate another mission
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl bg-[#31572c] p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-[#dcebd8]">
                  Nature challenge
                </p>

                <p className="mt-2 text-sm leading-6 text-[#f0f6ee]">
                  {mission.natureChallenge}
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-[#d8dfd4] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#31572c]">
                  Phone-free tip
                </p>

                <p className="mt-2 text-sm leading-6 text-[#526052]">
                  {mission.phoneFreeTip}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">Safety tips</h3>

                <ul className="mt-3 space-y-2 text-sm text-[#526052]">
                  {mission.safetyTips.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </form>
      </section>

      <section id="how-it-works" className="border-y border-[#d8dfd4] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#31572c]">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Less scrolling. More exploring.
            </h2>

            <p className="mt-4 leading-7 text-[#526052]">
              TrailMate turns your available time and interests into a simple
              outdoor mission you can actually complete.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Tell us what you want",
                description:
                  "Share your interests, available time, and the kind of experience you're looking for.",
              },
              {
                number: "02",
                title: "Get your mission",
                description:
                  "Our open-source AI creates a personalized outdoor activity with simple achievable goals.",
              },
              {
                number: "03",
                title: "Go outside",
                description:
                  "Put your phone away, complete the mission, and discover something around you.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-[#d8dfd4] bg-[#f8faf6] p-6"
              >
                <span className="text-sm font-bold text-[#31572c]">
                  {step.number}
                </span>

                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-6 text-[#526052]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d8dfd4] bg-[#f8faf6]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#31572c]">
              Powered by Gemma
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              AI that helps you use your screen less.
            </h2>

            <p className="mt-4 leading-7 text-[#526052]">
              TrailMate uses open-weight Gemma to turn your interests and
              available time into a personalized outdoor mission. Once your
              mission is ready, the goal is simple: put the phone away and go.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              {
                title: "Personalized",
                description:
                  "Gemma adapts the mission to what you want to do and how much time you have.",
              },
              {
                title: "Structured",
                description:
                  "AI-generated content is validated and combined with application-controlled mission logic.",
              },
              {
                title: "Open-weight",
                description:
                  "Built around Gemma as the open-weight AI engine behind the experience.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#d8dfd4] bg-white p-6"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-[#526052]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-[#31572c] px-6 py-12 text-center text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#dcebd8]">
            Your next adventure
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Your phone can help you go outside.
            <br />
            It does not have to keep you inside.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#dcebd8]">
            TrailMate is designed to be used briefly, create your plan, and then
            get out of the way.
          </p>
        </div>
      </section>

      <footer className="border-t border-[#d8dfd4] px-6 py-8 text-center text-sm text-[#687466]">
        Built for Hacktoberfest 2026 · TrailMate AI
      </footer>
    </main>
  );
}
