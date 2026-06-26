# Database Schema

This document outlines the core data model for the RouteFlo Operations System.

## Tables

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | VARCHAR | |
| `role` | ENUM | `driver`, `office`, `welder`, `run_around` |
| `created_at` | TIMESTAMP | |

### `routes`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `driver_id` | UUID | FK → users |
| `date` | DATE | |
| `status` | ENUM | `pending`, `in_progress`, `complete` |

### `stops`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `route_id` | UUID | FK → routes |
| `address` | TEXT | |
| `sequence` | INT | Order within the route |
| `status` | ENUM | `pending`, `arrived`, `complete`, `missed` |
| `account_status` | ENUM | `active`, `suspended`, `paid` |
| `flagged_by_office` | BOOLEAN | Triggers blue highlight in driver UI |
| `completed_at` | TIMESTAMP | |
| `notes` | TEXT | |

### `repair_tickets`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `source` | ENUM | `pre_trip`, `stop_photo`, `office` |
| `stop_id` | UUID | FK → stops (nullable) |
| `assigned_to` | UUID | FK → users (welder) |
| `status` | ENUM | `open`, `in_progress`, `complete`, `pending_pickup` |
| `priority` | INT | Lower = higher priority |
| `notes` | TEXT | |
| `photo_url` | TEXT | |
| `created_at` | TIMESTAMP | |
| `completed_at` | TIMESTAMP | |

### `logistics_tickets`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `type` | ENUM | `delivery`, `pickup`, `repair_transport` |
| `repair_ticket_id` | UUID | FK → repair_tickets (nullable) |
| `assigned_to` | UUID | FK → users (run_around) |
| `status` | ENUM | `pending`, `in_progress`, `complete` |
| `created_at` | TIMESTAMP | |

### `events`
Event log powering the notification engine.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `type` | VARCHAR | e.g. `payment_cleared`, `repair_complete`, `stop_reassigned` |
| `payload` | JSONB | Event-specific data |
| `created_at` | TIMESTAMP | |

## Key Relationships

```
users ──< routes ──< stops
                      │
              repair_tickets ──< logistics_tickets
                      │
                   events
```

## Notes

- `flagged_by_office` on a stop triggers the light-blue highlight in the driver dashboard.
- `account_status` changing to `paid` fires a `payment_cleared` event, which triggers the real-time alert tone.
- Welder marking a `repair_ticket` complete sets status to `pending_pickup` and auto-creates a `logistics_ticket` for run-around.
