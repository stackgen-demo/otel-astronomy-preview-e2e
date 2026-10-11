# otel-astronomy-preview-e2e

Five Playwright smoke tests for the [OpenTelemetry Demo](https://opentelemetry.io/docs/demo/) (Astronomy Shop) on a **Shipyard** Ready preview.

Generic invoke pattern (any Shipyard app endpoint):

```bash
npm ci
npx playwright install chromium
PREVIEW_BASE_URL=https://ephimeral-env-demo.dev.stackgen-demo.shipyard.host \
  SHIPYARD_TOKEN="<bypass from mcp-shipyard get_environment — never commit>" \
  npm test

# Quoteable coverage summary for Aiden Evidence Bar:
npm run test:coverage
cat coverage.md
```

| # | Test |
|---|---|
| 1 | Home `/` — 200, title matches Otel Demo |
| 2 | Catalog listing visible |
| 3 | Product detail `/product/…` |
| 4 | Cart `/cart` |
| 5 | `/api/products` (or home HTML fallback) |

Used by Aiden persona `preview-env-engineer` after Shipyard Ready: **PR → Shipyard → test → show coverage → human merge**.
