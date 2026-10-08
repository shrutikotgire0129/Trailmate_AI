# 🌿 TrailMate AI

> **Touch Grass. Make It an Adventure.**

<p align="center">
  <a href="https://trailmate-ai.vercel.app/">
    <strong>🌿 Live Demo →</strong>
  </a>
</p>

<p align="center">
  An AI-powered outdoor companion that turns your time, interests, and activity into a personalized mission designed to get you off your screen and outside.
</p>

---

## 📌 Overview

**TrailMate AI** is an AI-powered outdoor companion built for the **DEV Community Hacktoberfest 2026 "Touch Grass" challenge**.

The idea is intentionally simple:

> **Use AI to help people spend less time using technology and more time experiencing the real world.**

Users provide a personal request, choose an outdoor activity, and select how much time they have.

TrailMate AI uses **Google's open-weight Gemma model** to transform that input into a personalized outdoor mission containing:

* 🎯 A unique mission
* 💡 A personalized reason for the recommendation
* 📝 A clear outdoor plan
* 🧭 Step-by-step activities
* 🌿 A nature challenge
* 📵 Phone-free guidance
* 🛡️ Safety tips
* ✅ Mission completion tracking
* 🏆 A completion score
* 📚 Personal mission history

The application is built around a deliberate contradiction:

> **The better TrailMate AI works, the less time you should spend using it.**

---

## 🚀 Live Demo

<p align="center">
  <a href="https://trailmate-ai.vercel.app/">
    <strong>🌿 Try TrailMate AI Live</strong>
  </a>
</p>

**Live URL:** https://trailmate-ai.vercel.app/

---

# 💡 The Problem

Our phones make it easier than ever to stay connected, entertained, and occupied.

But that convenience also makes it easy to spend hours indoors without realizing how much time has passed.

Many applications are designed to maximize:

* Screen time
* Notifications
* Engagement
* Repeated interactions
* Infinite scrolling

**TrailMate AI takes the opposite approach.**

Instead of using AI to keep users inside an application, it uses AI to create a personalized reason for them to **close the application and go outside**.

---

# 🌱 The Idea

The concept behind TrailMate AI is:

```text
What if AI didn't try to keep you online?

What if AI helped you get offline instead?
```

TrailMate AI transforms a simple intention such as:

```text
"I want something relaxing after work."
```

into an actionable outdoor experience.

A user can choose:

```text
Activity:
Photography

Duration:
1 hour
```

and let Gemma create a mission tailored to that context.

The result is not another content feed.

**It is a reason to leave the screen.**

---

# ⚙️ How It Works

TrailMate AI follows a complete end-to-end workflow:

```text
┌─────────────────────────┐
│      User Input         │
│                         │
│ Request + Activity +    │
│ Available Time          │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       Gemma AI          │
│                         │
│ Generates personalized  │
│ mission content         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Content Validation    │
│                         │
│ Validate AI-generated   │
│ content and structure   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ Deterministic Mission   │
│ Builder                 │
│                         │
│ Adds predictable rules, │
│ steps, difficulty,      │
│ preparation & safety    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    Outdoor Mission      │
│                         │
│ Personalized mission    │
│ presented to the user   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    Phone-Free Mode      │
│                         │
│ Start → Explore →       │
│ Complete → Disconnect   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Mission Completion    │
│                         │
│ Steps + Nature +        │
│ Phone-Free participation│
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    Mission History      │
│                         │
│ Progress + Outdoor      │
│ Time + Phone-Free Time  │
└─────────────────────────┘
```

---

# ✨ Features

## 🤖 AI-Powered Outdoor Missions

Users can describe what they want from their outdoor experience.

Examples:

```text
"I want something peaceful."

"Give me a photography adventure."

"I have three hours this weekend."

"Something active but not too difficult."

"Surprise me."
```

TrailMate AI combines the user's request with the selected activity and duration before sending the relevant context to Gemma.

Each generated mission contains:

* Mission title
* Tagline
* Personalized reasoning
* Activity
* Duration
* Difficulty
* Mission summary
* Preparation checklist
* Three mission steps
* Nature challenge
* Phone-free tip
* Safety tips

---

## 💡 Personalized "Why This Mission?"

TrailMate AI doesn't simply generate a generic activity.

Every mission includes a dedicated:

### Why This Mission?

This explains how the generated experience fits the user's:

* Personal request
* Selected activity
* Available time

For example:

```text
This mission provides a focused photography
experience for a single hour of exploration
and observation.
```

This makes the AI recommendation feel intentional and personalized rather than arbitrary.

---

## 📵 Phone-Free Mode

Phone-Free Mode is one of the core ideas behind TrailMate AI.

Once a mission begins, users can start a phone-free session and focus on completing the outdoor experience instead of continuously interacting with the application.

The mode supports the core product philosophy:

```text
Generate the mission.
        ↓
Put the phone away.
        ↓
Go outside.
        ↓
Complete the mission.
```

TrailMate AI records the time spent in the phone-free session so outdoor progress can be measured.

---

## 🏆 Mission Completion Score

After completing the mission, TrailMate AI calculates a score out of 100.

The score rewards:

```text
Mission steps completed
        +
Nature challenge completion
        +
Phone-free participation
```

The completion experience intentionally ends with:

> **You touched grass. 🌿**

The score provides lightweight motivation without turning outdoor activity into another endless digital competition.

The real achievement is:

> **The time you chose to spend outside.**

---

## 📚 Mission History

Completed missions are stored locally in the browser.

The Mission History dashboard tracks:

* Missions completed
* Total time outside
* Total phone-free time
* Individual completed missions
* Completion dates

Users can search and organize previous missions using:

### Search

Search by:

* Mission title
* Activity
* Tagline

### Activity Filter

Filter by:

* All activities
* Walking
* Hiking
* Cycling
* Nature
* Photography

### Sorting

Sort by:

* Newest first
* Oldest first
* Title A–Z
* Title Z–A

History can also be cleared when desired.

---

# 🖥️ Screenshots

## 🏠 Home

The landing page introduces the TrailMate AI concept and allows users to configure their outdoor mission.

<p align="center">
  <img src="./public/screenshots/Home.png" alt="TrailMate AI Home Page" width="900">
</p>

---

## ⚙️ Mission Generation

Users provide their request, choose an activity, select their available time, and generate a personalized outdoor mission.

<p align="center">
  <img src="./public/screenshots/Working.png" alt="TrailMate AI Mission Generation" width="900">
</p>

---

## 🤖 Gemma-Powered Mission

Gemma generates the creative and personalized components of the outdoor experience, which are then combined with deterministic application logic.

<p align="center">
  <img src="./public/screenshots/Gemma.png" alt="TrailMate AI Gemma Integration" width="900">
</p>

---

## 📚 Mission History

The history dashboard provides an overview of completed missions, outdoor time, phone-free time, search, filtering, and sorting.

<p align="center">
  <img src="./public/screenshots/History.png" alt="TrailMate AI Mission History" width="900">
</p>

---

# 🧠 Built with Gemma

Gemma is the core AI component of TrailMate AI.

The application uses:

**Gemma 4 26B A4B IT**

to generate the creative and personalized parts of each outdoor mission.

The model is not treated as a replacement for application logic.

Instead, TrailMate AI gives Gemma a focused responsibility:

> **Generate useful, personalized outdoor experiences.**

The application handles predictable structure and business rules itself.

---

## Why Gemma?

Gemma is a natural fit for TrailMate AI because the project requires an AI system capable of generating varied, natural-language outdoor experiences while fitting the challenge's focus on open-weight AI.

Instead of relying on a fixed collection of predefined activities, Gemma allows the same application to create different experiences based on the user's intent.

For example:

```text
Activity: Photography
Duration: 1 hour
```

can produce completely different missions depending on the user's request.

---

# 🏗️ AI Architecture

One of the important technical decisions in TrailMate AI is the separation between **generative content** and **deterministic application logic**.

Instead of asking Gemma to generate the entire deeply nested mission object, the application asks it for a smaller set of concise creative fields.

Gemma generates content such as:

```text
title
whyThisMission
tagline
summary
step1
step2
step3
natureChallenge
phoneFreeTip
```

The application then constructs the complete mission.

---

## AI Generation Pipeline

```text
User Request
     │
     ▼
Prompt Construction
     │
     ▼
Gemma
     │
     ▼
Structured AI Content
     │
     ▼
Validation
     │
     ├── Required fields
     ├── Non-empty content
     ├── Repeated-content detection
     └── Invalid-response detection
     │
     ▼
Deterministic Mission Builder
     │
     ├── Step durations
     ├── Difficulty
     ├── Preparation
     ├── Safety tips
     └── Mission structure
     │
     ▼
Validated Outdoor Mission
     │
     ▼
User
```

---

## Why Separate AI from Deterministic Logic?

Generative AI is useful for:

* Creative writing
* Personalization
* Natural-language generation
* Generating varied experiences

Application code is better suited for:

* Predictable durations
* Difficulty rules
* Required structure
* Safety defaults
* Data validation
* Application state

TrailMate AI combines both:

```text
AI
+
Deterministic Logic
+
Validation
=
Reliable Personalized Experience
```

This approach avoids making the model responsible for every application rule.

---

# 🧪 Example Mission

Suppose a user enters:

```text
Request:
I want something peaceful after a stressful day.

Activity:
Photography

Duration:
1 hour
```

Gemma can transform the request into something like:

```text
Lens of the Wild

Capture the small details.

Spend an hour slowing down and observing
textures, light, plants, and small moments
around you.
```

The application then builds the complete experience:

```text
Activity:
Photography

Duration:
1 hour

Difficulty:
Easy
```

### Mission

```text
1. Find a quiet outdoor location.

2. Photograph five overlooked details.

3. Finish with one intentional photo.
```

### Nature Challenge

```text
Find one natural pattern you would normally
walk past without noticing.
```

### Phone-Free Tip

```text
Put your phone away between photographs
and focus on what is around you.
```

The exact mission changes based on the user's request.

---

# 🛠️ Technical Implementation

## Frontend

TrailMate AI uses the **Next.js App Router** with React and TypeScript.

The interface manages:

* User input
* Activity selection
* Duration selection
* Mission generation
* Mission display
* Step completion
* Phone-Free Mode
* Mission scoring
* Mission history

---

## Backend

AI generation is handled through a Next.js server route:

```text
app/api/generate-mission/route.ts
```

The client sends the user's mission requirements to the server.

The server:

1. Builds the Gemma prompt.
2. Calls the Gemma API.
3. Validates the response.
4. Builds the final mission structure.
5. Returns the mission to the client.

This keeps the AI API key on the server rather than exposing it in client-side code.

---

# 💾 Data Storage

TrailMate AI currently uses browser `localStorage` for mission history.

This keeps the application lightweight and removes the need for:

* User accounts
* Database infrastructure
* Authentication
* Backend persistence for history

The stored history includes:

```text
Mission
Completed date
Phone-free minutes
```

This is appropriate for the current challenge scope because the core product experience does not require an account.

---

# 🎨 Design Philosophy

TrailMate AI is intentionally designed to avoid becoming another application that demands attention.

The user journey is:

```text
Choose
   ↓
Generate
   ↓
Go Outside
   ↓
Disconnect
   ↓
Complete
   ↓
Reflect
```

The interface provides the information needed to begin the mission.

Then it encourages the user to stop interacting with the interface.

This is fundamentally different from traditional engagement-focused applications.

---

# 🌎 What Makes TrailMate AI Different?

Most AI products try to answer:

> "How can we make users spend more time with our product?"

TrailMate AI asks:

> **"How can AI help users spend less time with our product?"**

That distinction is at the center of the application.

**Gemma** provides personalization.

**TrailMate AI** provides structure.

**Phone-Free Mode** encourages disconnection.

**Mission History** measures progress.

**The outdoors is the actual destination.**

---

# 🧰 Tech Stack

| Category       | Technology                |
| -------------- | ------------------------- |
| Framework      | Next.js 16                |
| UI             | React 19                  |
| Language       | TypeScript                |
| Styling        | Tailwind CSS              |
| Architecture   | Next.js App Router        |
| API            | Next.js Route Handlers    |
| AI Model       | Google Gemma 4 26B A4B IT |
| AI SDK         | `@google/genai`           |
| AI Platform    | Google AI Studio          |
| Client Storage | Browser `localStorage`    |
| Deployment     | Vercel                    |

---

# 📁 Project Structure

```text
trailmate_ai/
│
├── app/
│   ├── api/
│   │   └── generate-mission/
│   │       └── route.ts
│   │
│   ├── history/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── public/
│   ├── screenshots/
│   │   ├── Home.png
│   │   ├── Working.png
│   │   ├── Gemma.png
│   │   └── History.png
│   │
│   └── logo.png
│
├── types/
│   ├── history.ts
│   └── mission.ts
│
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js 20+
* npm
* A Google AI Studio API key

---

## Clone the Repository

```bash
git clone https://github.com/shrutikotgire0129/Trailmate_AI.git
cd Trailmate_AI
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_google_ai_studio_api_key
```

> ⚠️ Never commit your API key to GitHub.

---

## Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# ✅ Production Validation

Before deployment, validate the project with:

```bash
npm run lint
```

and:

```bash
npm run build
```

The production build validates:

* ESLint
* TypeScript
* Next.js compilation
* Route compilation
* Static page generation
* Production optimization

---

# ☁️ Deployment

TrailMate AI is deployed using **Vercel**.

### Production URL

https://trailmate-ai.vercel.app/

The deployment requires the following environment variable:

```text
GEMINI_API_KEY
```

The API key should be configured through the deployment platform's environment variable settings rather than committed to source control.

---

# 🔐 Data & Privacy

TrailMate AI does not require an account for the core experience.

Completed mission history is stored locally in the user's browser.

Because history is stored locally:

* Clearing browser storage removes saved missions.
* History does not automatically transfer between devices.
* Different browsers maintain separate histories.
* No account is required to track local progress.

The Gemma request is handled through the application's server-side API route so the Gemini API key is not directly exposed to the browser.

---

# 🛡️ Safety

Outdoor activities should always be adapted to the user's:

* Environment
* Physical ability
* Weather conditions
* Local conditions

TrailMate AI provides safety guidance as part of generated missions, but users should use their own judgment and avoid unsafe situations.

The application is intended to provide inspiration and structure for outdoor activities, not professional medical, emergency, or wilderness advice.

---

# 🏆 Challenge Context

TrailMate AI was created for the **DEV Community Hacktoberfest 2026 "Touch Grass" challenge**.

The challenge focuses on using open-source or open-weight AI to create products that encourage people to spend less time on screens and more time outside.

TrailMate AI addresses that goal directly:

```text
AI creates the mission.
        ↓
The user leaves the screen.
        ↓
The user explores outside.
        ↓
The mission gets completed.
```

AI is not used simply because AI is available.

It is used because personalization makes outdoor missions more relevant, varied, and engaging.

---

# ❤️ Why This Project Matters

Technology is increasingly good at keeping people inside digital environments.

TrailMate AI explores the opposite possibility:

> **Can technology help people disconnect from technology?**

The project uses AI as a **bridge rather than a destination**.

Gemma generates the personalized experience.

The application provides enough structure to make it actionable.

Phone-Free Mode encourages the user to put the device away.

The result is an AI product whose success is measured partly by the user's willingness to stop using it.

---

# 🧠 Engineering Decisions

## Structured AI Output

Rather than relying on the model to produce a large, deeply nested object, TrailMate AI asks Gemma for a smaller set of creative fields.

This reduces the amount of structured output generated by the model and allows the application to control predictable data.

---

## Validation & Retry

AI-generated content is validated before being converted into the final mission.

The application checks for:

* Missing required content
* Empty responses
* Repeated text
* Invalid generated content

The generation flow also supports controlled retry behavior when an AI response does not satisfy the required format.

---

## Deterministic Mission Rules

Predictable application behavior remains in application code.

For example, mission duration determines step duration and difficulty rather than asking the AI to arbitrarily decide these values.

This creates a clear separation:

```text
Gemma
→ Creative personalization

Application logic
→ Deterministic behavior

Validation
→ Reliability
```

---

# 🔮 Future Possibilities

TrailMate AI could eventually expand with:

* 📍 Location-aware mission generation
* 🌦️ Weather-aware recommendations
* 🗺️ GPS-based outdoor missions
* 👥 Community-created missions
* 👫 Group adventures
* 🏅 Outdoor achievement tracking
* 📅 Calendar integration
* 🎯 Richer activity personalization
* 📊 Advanced progress analytics

These features are intentionally outside the current core scope.

The fundamental experience remains:

> **Generate a mission. Go outside.**

---

# 🛣️ Roadmap Philosophy

Future development should follow one principle:

> **Add technology only when it improves the outdoor experience.**

A feature should not be added simply because it makes the application more complex.

The goal is not to build another platform that users spend hours inside.

The goal is to build a tool that gives them a reason to step away.

---

# 👩‍💻 Author

Shruti Hiraman Kotgire

<p align="center">
  <strong>🌿 Generate a mission. Touch grass. Come back when you're done.</strong>
</p>