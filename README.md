# Blood Bridge — Blood Donation & Emergency Donor Matching

HCI-first web application demonstrating Nielsen’s usability heuristics in a blood donation matching platform.

## Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React
- **Backend:** Spring Boot, Spring Security, JWT, JPA (see `backend/`)
- **Database:** PostgreSQL

## Quick start (frontend)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Demo accounts

| Role       | Email                       | Password     |
|------------|-----------------------------|--------------|
| Donor      | donor@bloodbridge.com       | password123  |
| Recipient  | recipient@bloodbridge.com   | password123  |
| Hospital   | hospital@bloodbridge.com    | password123  |
| Blood Bank | bloodbank@bloodbridge.com   | password123  |
| Admin      | admin@bloodbridge.com       | password123  |

## HCI documentation

See [docs/USER_FLOWS.md](docs/USER_FLOWS.md) for role-based flows and heuristic mapping.

## Design priorities

1. HCI quality (status, language, control, consistency, error prevention, accessibility)
2. Usable frontend flows
3. Supporting backend APIs
