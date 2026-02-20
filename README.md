# Inspectra Web

Managing inspection workflows — from reference data setup to creating, updating, and reviewing inspections with item lots and charges.

## Project Structure

```
inspectra-web/
│
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── inspections.ts
│   │   └── references.ts
│   ├── modules/
│   │   │
│   │   ├── inspection/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   └── reference/
│   │       ├── hooks/
│   │       └── components/
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   ├── router/
│   │   └── index.ts
│   └── main.ts
└── .env.example
```

---

Base URL: `http://localhost:8000/api/v1`

## Response Envelope

Every API response is wrapped in a standard envelope:

### Success
```json
{
  "ok": true,
  "timestamp": "2026-02-20T10:00:00.000000Z",
  "message": "Inspections retrieved successfully",
  "data": { ... }
}
```

For paginated responses, a `meta` field is included:
```json
{
  "ok": true,
  "timestamp": "2026-02-20T10:00:00.000000Z",
  "message": "OK",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 15,
    "next": 2,
    "prev": null
  }
}
```

### Failure
```json
{
  "ok": false,
  "timestamp": "2026-02-20T10:00:00.000000Z",
  "message": "Validation failed",
  "errors": {
    "service_type_id": ["The service type id field is required."]
  },
  "errorCode": "validation_error"
}
```

---

### Reference Data

Reference data powers all dropdowns in the UI. Fetch these once on page load and cache them client-side. - TanstackQuery with 1 month cached

### Create Inspection

Creates a new inspection. On **Submit**, status becomes `new`. On **Save as Draft**, pass `"status": "draft"`.

```
POST /api/v1/inspections
Content-Type: application/json
```

**Request body:**

```json
{
  "service_type_id": 1,
  "scope_of_work_id": 1,
  "location_id": 1,
  "customer_id": 1,
  "is_customer_charged": true,
  "estimated_completion_date": "2025-01-01",
  "dc_code": "J78DJ",
  "note": "Lorem ipsum",
  "status": "new",
  "items": [
    {
      "item_id": 1,
      "qty_requested": 300,
      "lots": [
        {
          "lot_id": 1,
          "qty_required": 100
        },
        {
          "lot_id": 1,
          "qty_required": 100
        }
      ]
    }
  ]
}
```

### Update Inspection

Updates an existing inspection. Only inspections with status `draft` or `new` can be edited

On **Submit**, status advances to `ready_for_review`. On **Save as Draft**, pass `"status": "draft"`.

```
PUT /api/v1/inspections/{id}
Content-Type: application/json
```

> `service_type_id` cannot be changed on update

**Status logic on update:**
- `status: "draft"` → stays `draft`
- Anything else → advances to `ready_for_review`

---

## UI Flows

### Inspection Record List

The list page has three tabs - **Open**, **For Review**, and **Completed** - each filtering by status group.

---

### New Inspection Request Form

Triggered by the **+ Create Request** button. 

**Buttons:**
- **Submit** → `POST` with `status: "new"` (or omit status)
- **Cancel** → discard and go back

---

### Inspection Detail View

Triggered by clicking a row in the list. Displaying all inspection's details


> When status is `ready_for_review`, an **Approve** button is shown. When status is `new`, a **Modify** button is shown (links to the edit form).

---

### Modify Inspection Form

Triggered by the **Modify** button on the detail view. 

Same form layout as New Inspection Request. Key differences:
- Service Type field is **read-only** (cannot be changed)
- Buttons are **Submit** (advances to `ready_for_review`) and **Save as Draft** (keeps as `draft`) and **Cancel**

> Only available when `status` is `draft` or `new`. The Modify button should be hidden for other statuses.


## Author

**Urfan** — [@urfanlaode](https://github.com/urfanlaode)

---

## License

MIT
