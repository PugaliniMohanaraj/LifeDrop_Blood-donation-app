# Blood Bridge — HCI User Flows

## Design Principles Applied Per Flow

Every flow below is evaluated against Nielsen’s heuristics (visibility, real-world language, control, consistency, error prevention, recognition, efficiency, minimalism, error recovery, help).

---

## 1. Public Visitor

```
Landing Page
  ├─ How It Works (learn before acting)
  ├─ Find Blood → Register as Recipient / Login
  ├─ Become a Donor → Register as Donor / Login
  └─ Request Emergency Blood → Auth gate → Emergency request form
```

**HCI focus:** Clear hierarchy, primary CTAs visible, no role overload on first visit.

---

## 2. Donor

```
Register (Donor) → Inline validation → Success → Login
  → Donor Dashboard (status, availability, nearby requests)
  → View Blood Requests → Request Detail
  → Accept / Decline (confirm) → Confirmation toast
  → History / Notifications / Profile / Availability toggle
```

**Dashboard answers immediately:**
1. What is my status?
2. Who needs my blood?
3. What can I do now?

---

## 3. Recipient

```
Register (Recipient) → Login → Recipient Dashboard
  → Request Blood (multi-step + progress)
  → Confirm (extra confirm if Emergency)
  → Finding Donors (status visible)
  → View Matches → Send Request to donor
  → Track Request → Completed / Cancelled
```

**HCI focus:** Progress indicator, recognition (dropdowns), emergency confirmation, cancel anytime.

---

## 4. Organization (Hospital / Blood Bank)

```
Landing → Organization Registration
  → Explain why verification is required
  → Submit for Verification
  → Pending Verification status (visible)
  → Admin Approve / Reject (with reason)
  → Login → Role dashboard (Hospital or Blood Bank)
```

**HCI focus:** Public users never pick “Hospital Staff” in normal register. Verification status always visible.

---

## 5. Hospital Staff (Verified)

```
Login → Hospital Dashboard (requests + stock status)
  → Blood Requests / Find Donors / Blood Stock / Notifications
```

Stock uses **icon + text + color** (Available / Low / Critical).

---

## 6. Blood Bank Staff (Verified)

```
Login → Blood Bank Dashboard
  → Blood Stock / Donations / Requests / Reports
```

Same design language as hospital (consistency).

**Demo note:** Blood Stock and Requests use live APIs. **Donations** and **Reports** are UI prototypes with sample data (not live backend).

---

## 7. Admin

```
Login → Admin Dashboard
  → Verify Organizations → View Details
  → Approve | Reject (reason required)
  → Users / Reports / Settings
```

**Demo note:** Organization verification is live. **Users** and **Reports** are UI prototypes with sample data (not live backend).

---

## Public contact & password recovery

- **Contact** and **Share story** open a `mailto:` draft (honest hand-off to the user’s email client).
- **Forgot password** returns a safe generic message; email delivery is simulated for this HCI demo.

---

## Role-Specific Navigation (cognitive load)

| Role        | Menu items                                                                 |
|-------------|----------------------------------------------------------------------------|
| Donor       | Dashboard, Profile, Availability, Requests, Notifications, History, Logout |
| Recipient   | Dashboard, Request Blood, My Requests, Matches, Notifications, Logout      |
| Hospital    | Dashboard, Blood Requests, Blood Stock, Find Donors, Notifications, Logout |
| Blood Bank  | Dashboard, Blood Stock, Requests, Donations, Reports, Logout               |
| Admin       | Dashboard, Verify Organizations, Users, Reports, Settings, Logout          |

Irrelevant items are never shown.
