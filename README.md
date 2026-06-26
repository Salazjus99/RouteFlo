# RouteFlo Operations System

An integrated management platform for waste hauling operations — connecting drivers, office staff, mechanics, welders, and run-around logistics in real time.

## User Roles

| Role | Responsibilities |
|---|---|
| **Driver** | Pre-trip inspections, route completion, stop logging, photo attachments |
| **Office / Dispatch** | Route management, note generation, real-time stop reassignment |
| **Mechanic / Welder** | Repair ticket queue, damaged dumpster workflow |
| **Run-Around** | Delivery, pickup, and repair-transport logistics |

## Core Features

### Driver Dashboard
- **Pre-Trip Inspection** — form submission auto-generates repair tickets for mechanics/welders
- **Geofencing** — 50-yard radius triggers mark stop arrivals automatically
- **Route Progress** — progress bar (top-right) shows % complete and ETA based on average stop times
- **Stop Highlighting** — light blue for office-flagged stops; green for suspended/unpaid accounts
- **Payment Alerts** — real-time alert tone when a suspended account clears payment
- **Stop Actions** — Complete Stop, attach photos (blocked/missed), log extra trash by volume or tote count
- **Reassignment** — dynamically reassign route segments between drivers mid-route

### Office / Dispatch Dashboard
- Central control over all active routes
- Generate and push stop notes directly to driver dashboards
- Reassign individual stops or route segments in real time

### Welder / Mechanic Dashboard
- Priority-sorted repair ticket queue (oldest and most urgent at top)
- Completed tab for finished work
- Optional photo and note on job completion
- Completion event auto-notifies run-around for pickup

### Run-Around Dashboard
- Automated tickets for delivery, pickup, and repair transport
- Pending status for items awaiting welder completion
- Smart sort: oldest/most urgent tasks first

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   RouteFlo Platform                  │
├──────────────┬──────────────┬────────────────────────┤
│   Driver App │  Office App  │  Maintenance & Logistics│
│              │              │  (Welder + Run-Around)  │
└──────┬───────┴──────┬───────┴────────────┬───────────┘
       │              │                    │
       └──────────────┴────────────────────┘
                      │
            ┌─────────▼─────────┐
            │   Notification    │
            │     Engine        │
            │  (event-driven)   │
            └─────────┬─────────┘
                      │
            ┌─────────▼─────────┐
            │     Database      │
            │  (real-time state │
            │   across roles)   │
            └───────────────────┘
```

## Development Priorities

1. **Database Schema** — real-time state changes across all user roles
2. **Notification Engine** — event-based triggers (payment updates, welder completion, route reassignment)
3. **UI/UX** — high-visibility status indicators (blue/green flagging) and priority-based task sorting

## Project Structure

```
routeflo/
├── docs/           # Architecture decisions and schema design
├── src/
│   ├── driver/     # Driver dashboard
│   ├── office/     # Office/dispatch dashboard
│   ├── maintenance/# Welder and run-around dashboards
│   └── core/       # Shared notification engine and database layer
└── README.md
```

## Getting Started

> Setup instructions will be added as the stack is finalized.
