# LifeDrop (Blood Bridge) — Blood Donation & Emergency Donor Matching

HCI-first web application demonstrating Nielsen’s usability heuristics in a blood donation matching platform.  
**UI brand:** LifeDrop · **Codebase / module name:** Blood Bridge

## Screenshots

### Home

<img src="docs/screenshots/home.jpg" alt="LifeDrop home page with blood inventory and donation camps" width="720" />

### About Us

<img src="docs/screenshots/about-us.jpg" alt="About Us page with mission, vision, and story" width="720" />

### Stories

<img src="docs/screenshots/stories.jpg" alt="Stories page with donor and organiser stories" width="720" />

### Log in

<img src="docs/screenshots/login.png" alt="Login page with demo accounts" width="720" />

### Register

<img src="docs/screenshots/register.jpg" alt="Donor and recipient registration page" width="720" />

### Donor dashboard

<img src="docs/screenshots/donor-dashboard.png" alt="Donor dashboard for Arun Kumar" width="720" />

### Donation availability

<img src="docs/screenshots/donor-availability.png" alt="Donor availability status page" width="720" />

### Recipient dashboard

<img src="docs/screenshots/recipient-dashboard.png" alt="Recipient dashboard with an active blood request" width="720" />

## Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide React
- **Backend:** Spring Boot 3, Spring Security, JWT, JPA
- **Database:** PostgreSQL (default profile) · H2 optional for quick demos

## Prerequisites

- Node.js 18+ and npm
- Java 21 and Maven
- PostgreSQL running locally with database `bloodbridge_hci`  
  (default credentials in `backend/src/main/resources/application-postgres.yml`: user `postgres`, password `2002`)

## Quick start

### 1. Backend (port 8080)

```bash
# Create DB once (psql or pgAdmin):
#   CREATE DATABASE bloodbridge_hci;

cd backend
mvn spring-boot:run
```

- API: http://localhost:8080  
- Health: http://localhost:8080/api/health  

Optional in-memory H2 (no Postgres): set `spring.profiles.active: h2` in `backend/src/main/resources/application.yml`.  
More detail: [docs/BACKEND.md](docs/BACKEND.md)

### 2. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173  
Vite proxies `/api` → `http://localhost:8080`.

### 3. Smoke test (optional)

With the backend running:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/smoke-backend.ps1
```

### Demo accounts

| Role       | Email                       | Password     |
|------------|-----------------------------|--------------|
| Donor      | donor@bloodbridge.com       | password123  |
| Recipient  | recipient@bloodbridge.com   | password123  |
| Hospital   | hospital@bloodbridge.com    | password123  |
| Blood Bank | bloodbank@bloodbridge.com   | password123  |
| Admin      | admin@bloodbridge.com       | password123  |

**Note:** Registration requires a `@gmail.com` address. Demo logins use `@bloodbridge.com` (see Login → Demo accounts).

## What to demo (live API)

These flows talk to the Spring Boot API and are suitable for marking:

1. Public home → blood availability search  
2. Login / register (donor or recipient)  
3. Recipient: create blood request → matches / invite  
4. Donor: view requests → accept / decline → availability toggle  
5. Hospital / blood bank: stock dashboard  
6. Admin: organization verification (approve / reject)

## Demo scope / known limitations

Honest HCI submission note — do **not** present these as fully live backend features:

| Area | Behaviour |
|------|-----------|
| Admin → Users | Static illustration of user management UI |
| Admin → Reports | Static / sample reporting UI |
| Blood Bank → Reports | Static / sample reporting UI |
| Blood Bank → Donations | Static / sample donation list UI |
| Contact form | Delivered to `pugalpugalini00001@gmail.com` (FormSubmit); mailto fallback |
| Forgot password | API acknowledges request; email delivery is simulated |
| Share story | Opens `mailto:` for review |

Contact details (phone, email, social links) are configured in `frontend/src/config/contact.ts`.

## HCI documentation

- [docs/USER_FLOWS.md](docs/USER_FLOWS.md) — role-based flows and heuristic mapping  
- [docs/HCI_HEURISTICS.md](docs/HCI_HEURISTICS.md) — Nielsen heuristics applied  
- [docs/BACKEND.md](docs/BACKEND.md) — API overview  

## Design priorities

1. HCI quality (status, language, control, consistency, error prevention, accessibility)  
2. Usable frontend flows  
3. Supporting backend APIs  
