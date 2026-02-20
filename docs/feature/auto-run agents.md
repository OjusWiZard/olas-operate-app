# Overview

## Problem to solve
Today users need to run and stop agents manually.

## Solution outlined
We want users to be able to start running an agent, and when an agent has earned its rewards it should move to the next agent available.

## Meetings/Notes

## Feature requirements

### High level feature requirements

- Users can enable or disable auto-running agents globally.
- Users can configure which agents participate in auto-run.
- By default, all configured & active (non-decommissioned) agents are included.
- Users can set the execution order of agents.
- The system runs agents sequentially, moving to the next eligible agent once one completes or becomes idle.
- A global auto-run toggle (e.g. toolbar button) allows quick start/stop.
- The UI shows which agents are currently running.
- Users can exclude specific agents from auto-run at any time.

## Technicals

### Current architecture context (from code)

- Pearl already runs only one local service at a time in practice:
	- frontend blocks start when another agent is running (`useAgentRunning`, `useServiceDeployment`) — prevents user from starting a second agent while one is active
	- backend start endpoint calls `pause_all_services()` before deploying any new agent, forcefully stopping all running services first (`/api/v2/service/{id}` in middleware) — ensures only one agent runs at a time
- Service runtime state is already available and polled:
	- deployment statuses: `BUILT` (service ready but not running), `DEPLOYING` (starting up), `DEPLOYED` (running and active), `STOPPING` (graceful shutdown in progress), `STOPPED` (stopped)
	- endpoints: `/api/v2/services` (list all), `/api/v2/services/deployment` (get active deployment), `/api/v2/service/{id}/deployment` (get specific service deployment state)
- “Rewards earned / idle for epoch” signal already exists in frontend:
	- `RewardProvider` exposes `isEligibleForRewards`
	- `useNotifyOnAgentRewards` already treats `isEligibleForRewards === true` as "agent has earned rewards for this epoch and is now idle" (ready to be stopped and swapped for the next agent)
- Persistent app settings already use Electron Store (`electron/store.js` + `StoreProvider`), which can store auto-run configuration: enabled/disabled flag, participant list, and execution order.

### High-level technical scope (not detailed spec)

1. Add global auto-run state
	 - Add persisted setting for enabled/disabled.
	 - Add runtime controller state (`running`, `stopping`, `currentAgent`, `queue`).

2. Add auto-run participant model
	 - Per-agent include/exclude flag.
	 - Default: include all configured + active agents.
	 - Exclude decommissioned/not-eligible agents from candidate queue.

3. Add ordering model
	 - Store ordered list of agent types/service IDs.
	 - Reorder from UI and persist.

4. Add orchestration loop (sequential execution)
- Start first eligible agent from the queue.
	- Poll deployment status and check if `isEligibleForRewards === true` (agent earned rewards and is idle).
	- Once idle signal detected, stop the running agent and start the next eligible agent in queue.
	- Repeat until auto-run is manually disabled or all agents in queue have run.

5. Add UI controls and observability
	 - Global toggle (toolbar/header level).
	 - Per-agent include/exclude controls.
	 - Order management UI.
	 - Running indicator in list/sidebar and active step in queue.

6. Add safety guardrails
- Cooldown/debounce between stop/start transitions (e.g., wait 2-5 seconds after stopping Agent A before starting Agent B to let system stabilize).
	- Retry policy for failed starts (if Agent B fails to deploy, retry N times with exponential backoff before skipping to next agent).
	- Auto-run skip on safety checks (pause auto-run immediately if wallet balance drops below minimum, Safe is not deployed, user's geolocation is restricted, or agent staking rank is no longer eligible).

### Candidate implementation plans

#### Plan A: Frontend orchestrator (quickest)

Implement auto-run loop entirely in renderer (React context/hooks), using existing `ServicesService` start/stop APIs and React Query polling.

- Main changes
	- New `AutoRunProvider` in frontend.
	- New store keys in Electron Store for auto-run settings.
	- Reuse existing hooks (`useAgentRunning`, `useServiceDeployment`, `RewardProvider`).

- Pros
	- Fastest to implement.
	- Minimal backend change.
	- Reuses existing reward eligibility logic already implemented per agent type in frontend.

- Cons
	- Orchestration lifecycle tied to renderer process.
	- Harder to guarantee robustness across renderer refresh/crash edge cases.
	- More business logic in UI layer.

#### Plan B: Middleware orchestrator (backend-owned) — two phases

Add an auto-run manager in middleware (state machine + queue) that owns all orchestration logic, and expose control/status APIs for frontend to query and display.

**Phase 1: Extract and migrate reward/idle logic to backend**
- Identify all "eligible for rewards" checks currently in frontend agent service modules (Trader, Polystrat, etc.).
- Create backend API endpoint: `/api/v2/service/{id}/is-eligible-for-rewards` that runs the same logic on backend.
- Update frontend to query this endpoint instead of running its own checks.
- Deliverable: Centralized reward/idle detection logic in backend as source of truth.

**Phase 2: Build auto-run orchestrator on top of Phase 1**
- New middleware module (e.g., `operate/services/auto_run_manager.py`) that owns the entire auto-run loop: participant selection, sequencing, reward/idle detection, start/stop transitions.
- Build on Phase 1's centralized `/api/v2/service/{id}/is-eligible-for-rewards` endpoint for eligibility checks.
- New endpoints: `/api/v2/auto-run/start`, `/api/v2/auto-run/stop`, `/api/v2/auto-run/status`, `/api/v2/auto-run/config` (set queue order, enable/disable agents).
- Frontend becomes a client UI layer only: sends user config to backend, polls for status, displays current running agent and queue order.

- Main changes
	- Phase 1: Extract and centralize reward eligibility logic from frontend to backend API.
	- Phase 2: Build auto-run orchestrator using Phase 1 infrastructure.

- Pros
	- Most robust and process-stable orchestration (backend daemon runs loop independently, not tied to renderer lifecycle).
	- Best separation of concerns (all domain logic in backend, frontend is read-only client).
	- Easier to test orchestration behavior headlessly (backend tests don't depend on React/UI).
	- All eligibility and sequencing logic centralized in one place (single source of truth for reward/idle checks).
	- Phased approach reduces risk: Phase 1 delivers centralized eligibility API (reusable for other features), Phase 2 builds orchestrator on solid foundation.

- Cons
	- Highest overall implementation effort: Phase 1 (extract and migrate logic), then Phase 2 (build orchestrator).
	- Larger API and state migration surface (many new endpoints; frontend and backend state must stay perfectly in sync or UI will show stale info).
	- Phase 1 must be completed and vetted before Phase 2 begins (sequential dependency; longer total timeline).

#### Plan C: Hybrid (frontend config + backend executor)

Frontend owns user configuration and sends queue/config to backend; backend executes sequencing loop and returns state/events. This is a middle ground between Plans A and B.

- Main changes
	- Backend adds queue executor + status endpoint(s).
	- Frontend owns UX/settings and passes desired queue.
	- Reward/idle trigger source unified incrementally.

- Pros
	- Better long-term architecture than Plan A (cleaner separation: backend handles orchestration, frontend owns UI).
	- Lower migration risk than Plan B if done incrementally (you don't move *all* backend logic at once; start with Plan A quick-and-dirty, then gradually migrate pieces to backend as confidence grows).
	- UI remains responsive while backend handles execution (backend daemon runs the orchestration loop independently; even if user closes UI window or renders stalls, auto-run loop keeps running on backend without depending on React thread).

- Cons
	- Medium-high complexity due to split ownership.
	- Requires careful contract design between UI and backend states.

### Comparison (high level)

| Plan | Feasibility (near-term) | Effort | Performance | Maintainability |
|---|---|---|---|---|
| A. Frontend orchestrator | High | Low-Medium | Good (small queue sizes) | Medium-Low |
| B. Middleware orchestrator | Medium | High | Good-High | High |
| C. Hybrid | Medium-High | Medium-High | High | High |

### Recommended direction

Two viable paths:

**Path 1 (Quick MVP): Plan A → Plan C** — Fastest to market
- Phase 1 (faster release): implement Plan A to validate UX and sequencing behavior with minimal backend changes.
- Phase 2 (hardening): migrate executor responsibilities toward Plan C backend ownership for resilience and cleaner boundaries.
- Pros: Ship auto-run to users quickly, then harden incrementally.
- Cons: Renderer-bound orchestration in Phase 1; requires state sync design for Phase 2.

**Path 2 (Foundation-first): Plan B Phase 1 → Plan B Phase 2** — Best long-term foundation
- Phase 1 (foundation): Extract and centralize reward/idle eligibility logic in backend API. Reusable for other features beyond auto-run.
- Phase 2 (auto-run): Build orchestrator on top of Phase 1 foundation with full rigor.
- Pros: Single source of truth for eligibility; cleaner separation of concerns; easier CI/testing.
- Cons: Longer time to first auto-run feature release; higher upfront effort.

**Recommendation:** Choose Path 1 for user-facing MVP velocity, Path 2 if maintainability and centralized logic are higher priority.

### Next steps for detailed spec

- Detailed API schema and payload contracts.
- Exact state-machine transitions and retry timings.
- Full UI wireframes/components.
- Exhaustive test matrix.
