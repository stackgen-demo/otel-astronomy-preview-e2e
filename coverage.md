# Test coverage

- Suite: https://github.com/stackgen-demo/otel-astronomy-preview-e2e
- Result: **5/5 expected** (run against Ready Shipyard app endpoint)

1. home returns Otel Demo
2. catalog listing visible on home
3. product detail page loads
4. cart page loads
5. frontend-proxy API products smoke

```bash
PREVIEW_BASE_URL=https://<ready-host> SHIPYARD_TOKEN=<from mcp-shipyard; never log> npm test
npm run test:coverage   # refreshes this file from Playwright JSON
```
