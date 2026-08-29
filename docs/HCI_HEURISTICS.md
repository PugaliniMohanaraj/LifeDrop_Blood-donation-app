# HCI Heuristics Mapping (LifeDrop)

Maps Nielsen’s 10 usability heuristics to concrete LifeDrop screens and behaviors.

| # | Heuristic | Where it shows up |
|---|-----------|-------------------|
| 1 | Visibility of system status | Request status badges (`FINDING_DONORS` → `DONOR_ACCEPTED` → `COMPLETED`); loading spinners on matches/notifications; toast confirmations after invite / accept / decline |
| 2 | Match between system and real world | Plain language (“Send Request”, “Decline”, “Need Blood Urgently?”); blood-group labels; distance in km; relative notification times (“Just now”) |
| 3 | User control and freedom | Cancel request; decline invite; dismiss notifications; confirmation dialogs before accept/decline |
| 4 | Consistency and standards | Shared `AppShell`, `StatusBadge`, `PageHeader`, red/navy LifeDrop brand across roles |
| 5 | Error prevention | Confirm before accept/decline; disable “Send Request” when donor unavailable or already invited; org reject requires a reason |
| 6 | Recognition rather than recall | Role dashboards with primary next actions; match score + availability badges on donor cards; nav labels by role |
| 7 | Flexibility and efficiency of use | Direct CTAs on landing (Find Blood / Become a Donor); emergency request deep-link; matches filtered by active request blood group |
| 8 | Aesthetic and minimalist design | One job per section; hero without clutter; status via badges instead of dense tables where possible |
| 9 | Help users recognize, diagnose, recover from errors | API `title` / `message` / `form` errors surfaced in toasts; empty states with recovery actions (“Create request”) |
| 10 | Help and documentation | Match-score tooltip (not a medical guarantee); FAQ on landing; pending-org wait messaging |

## Critical path (invite loop)

1. Recipient creates a blood request → status visible on requests list  
2. Recipient opens Matches → invites a donor → donor + recipient get notifications  
3. Donor opens request → Accept or Decline (with confirm) → recipient notified  
4. Landing / dashboards refresh live counts from `GET /api/stats`
