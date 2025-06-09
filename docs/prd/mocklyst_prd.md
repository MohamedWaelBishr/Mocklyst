# 📝 Mocklyst - Instant API Mocking Tool
## Product Requirements Document (PRD)

---

## 1. Overview

### Problem Statement

Developers and QA teams often face bottlenecks:

* Waiting for backend teams to build real APIs.
* Manually creating/fiddling with mock data for frontend or integration testing.
* Managing or syncing stale mock endpoints as APIs evolve.

### Solution

A **no-login, instant mock API generator** website where users:

1. Define their mock data schema (object/array/primitive).
2. Instantly receive a unique, temporary API endpoint.
3. Use it in their app for development/testing.
4. Each mock endpoint self-destructs after 7 days (auto-cleanup).

---

## 2. Product Objectives

* **Zero friction**: No authentication, no install, no clutter.
* **Fast**: 30 seconds from landing on the site to a working endpoint.
* **Realistic**: Flexible schema definition, real JSON structures.
* **Clean**: Automatic expiry and deletion after 7 days.

---

## 3. Features & Requirements

### 3.1 Core Features

| Feature              | Description                                                  | Priority |
| -------------------- | ------------------------------------------------------------ | -------- |
| Schema Designer      | UI to design response shape (object, array, primitive types) | P0       |
| Array Length Control | Set number of array items if "array" type selected           | P0       |
| Dynamic Endpoints    | Generates unique mock API endpoint (e.g., `/api/mock/xy12z`) | P0       |
| Temp Config Storage  | Saves config in a temp file/DB; auto-deletes after 7 days    | P0       |
| No Authentication    | No login or signup required                                  | P0       |
| Simple Docs Page     | Brief docs on how to use endpoints                           | P1       |

### 3.2 Advanced/Future Features

| Feature         | Description                                       | Priority |
| --------------- | ------------------------------------------------- | -------- |
| Nested Objects  | Support for nested keys/objects in schema         | P1       |
| Data Faker      | Option to auto-populate with random names/emails  | P2       |
| Rate Limiting   | Prevent API abuse (e.g., 100 req/hr per endpoint) | P2       |
| Expiry Reminder | Banner indicating time left before mock expires   | P2       |
| Export/Import   | Download/upload schema as JSON                    | P2       |

---

## 4. User Flow

```mermaid
flowchart TD
    A[User lands on site] --> B[Selects response type]
    B --> C{Is type "array"?}
    C -- Yes --> D[Set array length]
    C -- No  --> E[Define object keys/types]
    D --> F[Review JSON preview]
    E --> F
    F --> G[Generate endpoint]
    G --> H[Copy endpoint URL]
    H --> I[Use in app / fetch mock data]
    I --> J[Endpoint auto-deletes after 7 days]
```

---

## 5. Technical Design

### 5.1 System Architecture

* **Frontend**: React (Next.js) / TailwindCSS.
* **Backend**: Node.js (Express or Next.js API routes).
* **Storage**:
  * Configs stored as JSON files or in a simple key-value DB (Redis or SQLite).
  * Each config tagged with creation timestamp.
* **Cleanup**:
  * Cronjob (runs daily): removes configs older than 7 days.

### 5.2 API Endpoints

| Endpoint           | Method | Description                                    |
| ------------------ | ------ | ---------------------------------------------- |
| `/api/create-mock` | POST   | Create a new mock config, returns endpoint URL |
| `/api/mock/[id]`   | GET    | Returns the mock data per config               |

#### Example Request/Response

**POST `/api/create-mock`**

```json
{
  "type": "array",
  "length": 3,
  "fields": [{ "key": "id", "type": "number" }]
}
```

**Response:**

```json
{
  "endpoint": "/api/mock/ab12xy"
}
```

**GET `/api/mock/ab12xy`**

```json
[
  { "id": 1 },
  { "id": 2 },
  { "id": 3 }
]
```

---

### 5.3 Database Schema

```sql
CREATE TABLE mock_endpoints (
    id TEXT PRIMARY KEY,
    config JSON NOT NULL,
    endpoint TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 5.4 Mock Data Generation Logic

* Input: User schema (object/array/primitive, keys/types, array length)
* Output: JSON with matching structure and static/sample values (advanced: auto-faked values)

#### Example

**Input:**

```json
{
  "type": "object",
  "fields": [
    { "key": "username", "type": "string" },
    { "key": "age", "type": "number" }
  ]
}
```

**Output:**

```json
{
  "username": "string",
  "age": 123
}
```

---

### 5.5 Cleanup (Cronjob)

```js
// Runs daily at midnight
DELETE FROM mock_endpoints WHERE createdAt < NOW() - INTERVAL '7 days';
```

or (for file storage):

* Scheduled script scans temp folder and deletes files older than 7 days.

---

## 6. UI/UX

* **Homepage:**
  * Brief headline and explainer (1 sentence).
  * Schema builder: type picker (object/array/primitive), keys, types, array length, live JSON preview.
  * "Generate Endpoint" button.
  * Show/shareable endpoint URL with copy button, expiry countdown.

* **Docs/Help page:**
  * Example requests, code snippets (cURL, JS fetch).
  * FAQ.

---

## 7. Success Metrics

* ⏱ < 30 seconds to first mock endpoint (goal: super-fast onboarding)
* 🧑‍💻 Weekly active users (target: 1k+ after launch)
* 🗑 100% of expired mocks deleted after 7 days (no server bloat)
* 📝 User feedback: At least 80% rate the tool "easy" or "very easy" to use

---

## 8. Open Questions

* Should users be able to "renew" or "extend" a mock endpoint before expiry?
* Is HTTPS enforced for all endpoints?
* Are there plans for pro accounts with longer expiry or saved schemas?

---

## 9. Out of Scope

* Authentication, user accounts, billing, or payment.
* Persistent, never-expiring endpoints.
* Advanced data relationships or RESTful operations (POST/PUT/DELETE).

---

## 10. Appendix

**Competitors:**

* [Mocky.io](https://mocky.io/)
* [Beeceptor](https://beeceptor.com/)
* [MockAPI](https://mockapi.io/)

**Why us?**

* 0 friction, ephemeral, faster, no tracking.

---

**End of PRD**