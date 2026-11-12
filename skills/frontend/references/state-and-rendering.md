# Frontend State Management & Rendering Strategy Reference

> **Loading Level:** L2 Reference Document  
> **Load Condition:** Load when choosing client-side state architectures, structuring Server vs Client Component trees, or diagnosing re-rendering bottlenecks.

---

## 1. Foundations: The 3 Layers of Frontend State

Never mix these three orthogonal state layers into a single monolithic store:

1. **Server Cache State (Remote Truth):**
   - Data owned by backend datastore (user profile, project list, order history).
   - Tooling: React Server Components, TanStack Query, SWR.
   - Characteristics: Needs deduplication, cache expiration, optimistic updates, and background revalidation.
2. **Global Client State (Ephemeral App Truth):**
   - Data spanning multiple components but not persisted on server (sidebar toggle, active modal, theme).
   - Tooling: Zustand, Jotai, nanostores, or React Context (for low-frequency updates).
   - Invariant: Never mirror server entity collections here.
3. **Local Component State (Interactive Truth):**
   - Transient input state (accordion open/close, form input focus, hover coordinates).
   - Tooling: `useState`, `useReducer`.

---

## 2. Professional Practice: Accessible 5-State Component Blueprint

```tsx
// Complete 5-State Async UI Pattern
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';

export function UserOrdersSection({ userId }: { userId: string }) {
  return (
    <ErrorBoundary fallback={(error, reset) => <OrdersError error={error} retry={reset} />}>
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersListContainer userId={userId} />
      </Suspense>
    </ErrorBoundary>
  );
}

// Skeleton component with accessibility metadata
export function OrdersSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-4 animate-pulse">
      <span className="sr-only">Loading recent orders...</span>
      <div className="h-10 bg-slate-200 rounded" />
      <div className="h-10 bg-slate-200 rounded" />
    </div>
  );
}

// Error Focus Management (Peer Review 03-ux-ui-design)
export function OrdersError({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div role="alert" tabIndex={-1} ref={(el) => el?.focus()} className="p-4 bg-red-50 border border-red-200 rounded">
      <h3 className="text-red-800 font-semibold">Unable to load orders</h3>
      <p className="text-red-700 text-sm mt-1">{error.message}</p>
      <button type="button" onClick={retry} className="mt-3 px-3 py-1.5 min-h-[44px] min-w-[44px] bg-red-600 text-white rounded">
        Retry
      </button>
    </div>
  );
}
```

---

## 3. Advanced Practice: INP Optimization & Keystroke Latency

- **Avoid Controlled Heavy Forms:** On complex forms with 20+ fields, controlled components firing `onChange` on every keystroke cause main-thread jank and fail Interaction to Next Paint (INP > 200ms).
- **Use Uncontrolled + Delegation:** Use native forms with `useActionState` or React Hook Form with `mode: 'onBlur'`.
- **Transitions:** Wrap non-urgent state updates in `startTransition(() => setSearchQuery(e.target.value))` to allow keystroke inputs to render with high priority.
