# Playwright Automation & Test Pyramid Reference

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when authoring Playwright e2e browser tests, integrating accessibility scanning with axe-core, or establishing CI test sharding.

---

## 1. Foundations: Playwright Web-First Assertions

Playwright includes automatic retry-until-timeout logic. Never use manual sleeps.

```typescript
import { test, expect } from '@playwright/test';

test('user can log in and view dashboard', async ({ page }) => {
  // 1. Arrange & Navigate
  await page.goto('/login');

  // 2. Act using user-facing semantic locators
  await page.getByLabel('Email address').fill('user@example.com');
  await page.getByLabel('Password').fill('SecurePassword123!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // 3. Assert using web-first auto-waiting assertion
  await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 2. Professional Practice: Automated Accessibility Test Runner

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Audits', () => {
  test('navigation and main content meet WCAG 2.2 AA', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
```

---

## 3. Advanced Practice: The Flaky Test Quarantine Protocol & CI Execution

### CI Configuration Guardrails (Peer Review 09-devops-infra)
- Always pass `--forbid-only` in CI scripts to prevent accidental commits containing `test.only()` from passing silently.
- Set `trace: 'retain-on-failure'` and `screenshot: 'only-on-failure'` in `playwright.config.ts` to prevent gigabytes of redundant CI artifact storage.
- Use GitHub Actions matrix sharding (`--shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}`) when test runs exceed 5 minutes.

### The Quarantine Protocol
When a test fails intermittently in CI:
1. **Move Immediately to Quarantine:** Move the test file to `tests/quarantine/` or annotate with `test.fixme()` / `@quarantine` tag.
2. **Prevent Red Build Fatigue:** CI main branch must stay green. Quarantined tests run in a separate informational CI job that does not block deployment.
3. **Diagnose Root Causes:**
   - Timing / Animation: Replace CSS transitions with `page.clock` or disable CSS animations during test runs.
   - Network Race: Use `page.waitForResponse('/api/data')` instead of guessing response time.
   - Shared Database Pollution: Ensure unique test fixtures (`user_${Date.now()}@test.local`) or transaction rollbacks.
