# Database ER Diagram

## Entity Relationship Diagram

```
┌─────────────┐
│    users    │
├─────────────┤
│ id (PK)     │
│ name        │
│ email (UK)  │
│ password_   │
│   hash      │
│ locale      │
│ is_admin    │
│ created_at  │
│ updated_at  │
└──────┬──────┘
       │
       │ 1:N
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌──────────────┐  ┌──────────────┐
│ user_devices │  │ alert_rules  │
├──────────────┤  ├──────────────┤
│ id (PK)      │  │ id (PK)      │
│ user_id (FK) │  │ user_id (FK) │
│ fcm_token    │  │ name         │
│ platform     │  │ keywords_    │
│ created_at   │  │   json       │
└──────────────┘  │ exam_names_  │
                  │   json       │
                  │ types_json   │
                  │ locations_   │
                  │   json       │
                  │ min_trust_   │
                  │   level      │
                  │ frequency    │
                  │ active       │
                  │ created_at   │
                  │ updated_at   │
                  └──────┬───────┘
                         │
                         │ 1:N
                         │
                         ▼
                  ┌──────────────┐
                  │notifications │
                  ├──────────────┤
                  │ id (PK)      │
                  │ user_id (FK) │
                  │ item_id (FK) │
                  │ alert_rule_  │
                  │   id (FK)    │
                  │ sent_via     │
                  │ status       │
                  │ created_at   │
                  └──────┬───────┘
                         │
                         │ N:1
                         │
                         ▼
                  ┌──────────────┐
                  │    items     │
                  ├──────────────┤
                  │ id (PK)      │
                  │ title        │
                  │ body         │
                  │ published_at │
                  │ url          │
                  │ source_id    │
                  │   (FK)       │
                  │ type         │
                  │ tags (JSONB) │
                  │ short_       │
                  │   summary    │
                  │ long_        │
                  │   summary    │
                  │ dedupe_hash  │
                  │   (UK)       │
                  │ extracted_   │
                  │   entities   │
                  │   (JSONB)    │
                  │ created_at   │
                  └──────┬───────┘
                         │
                         │ N:1
                         │
                         ▼
                  ┌──────────────┐
                  │   sources    │
                  ├──────────────┤
                  │ id (PK)      │
                  │ name         │
                  │ url          │
                  │ source_type  │
                  │ trust_level  │
                  │ poll_        │
                  │   interval_  │
                  │   minutes    │
                  │ last_fetch   │
                  │ active       │
                  │ created_at   │
                  │ updated_at   │
                  └──────┬───────┘
                         │
                         │ 1:N
                         │
                         ▼
                  ┌──────────────┐
                  │  raw_items   │
                  ├──────────────┤
                  │ id (PK)      │
                  │ source_id    │
                  │   (FK)       │
                  │ raw_json     │
                  │   (JSONB)    │
                  │ fetched_at   │
                  └──────────────┘
```

## Relationships

1. **users** → **user_devices** (1:N)
   - One user can have multiple devices for push notifications

2. **users** → **alert_rules** (1:N)
   - One user can create multiple alert rules

3. **users** → **notifications** (1:N)
   - One user can receive multiple notifications

4. **alert_rules** → **notifications** (1:N)
   - One alert rule can trigger multiple notifications

5. **items** → **notifications** (1:N)
   - One item can generate multiple notifications (to different users)

6. **sources** → **items** (1:N)
   - One source can have multiple items

7. **sources** → **raw_items** (1:N)
   - One source can have multiple raw items before processing

## Key Constraints

- `users.email` is UNIQUE
- `items.dedupe_hash` is UNIQUE (prevents duplicates)
- `user_devices` has composite unique constraint on (user_id, fcm_token)
- Foreign keys have CASCADE delete where appropriate

## Indexes

- `items.type` - for filtering by item type
- `items.published_at` - for sorting by date
- `items.dedupe_hash` - for duplicate detection
- `notifications(user_id, status)` - for querying user notifications
- `notifications.item_id` - for querying item notifications

