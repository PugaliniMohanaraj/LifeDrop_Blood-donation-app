# Backend

## Run (H2 in-memory — no PostgreSQL required)

```bash
cd backend
mvn spring-boot:run
```

API: http://localhost:8080  
Health: http://localhost:8080/api/health

## PostgreSQL (active by default)

Credentials configured in `application-postgres.yml`:

- Database: `bloodbridge_hci`
- Username: `postgres`
- Password: `2002`

```bash
cd backend
mvn spring-boot:run
```

To use in-memory H2 instead: set `spring.profiles.active: h2` in `application.yml`.


## Key endpoints

| Method | Path | Notes |
|--------|------|-------|
| POST | /api/auth/login | JWT login |
| POST | /api/auth/register/donor | Public donor signup |
| POST | /api/auth/register/recipient | Public recipient signup |
| POST | /api/organizations | Org verification request |
| GET/POST | /api/requests | Blood requests |
| GET | /api/matches | Donor matches |
| GET/POST | /api/admin/organizations/... | Admin verification |

Error responses use human-readable `title`, `message`, and `fix` fields (HCI heuristic 9).
