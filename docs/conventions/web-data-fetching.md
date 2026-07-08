# Web Data Fetching Conventions

## Default Model

- TanStack Query is the single source of truth for server-state caching.
- TanStack Router loaders start important queries early during navigation and link preloading.
- Components read their own data with `useSuspenseQuery` or `useQuery`.
- Pages compose layout, `Suspense` boundaries, error boundaries, and components. They do not own fetched data just to pass it down.

## Router Setup

Pass the same `QueryClient` instance to Router context and `QueryClientProvider`.

```tsx
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: { queryClient },
  Wrap: ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ),
});
```

`defaultPreloadStaleTime: 0` keeps Router from becoming a second cache. Query decides freshness through `staleTime` and `gcTime`.

## Query Options

Define query keys and query options in `@dropaly/api-query`, grouped by API domain.

```ts
const keys = {
  all: () => ["todos"] as const,
  list: () => [...keys.all(), "list"] as const,
};

const queries = {
  list: () =>
    queryOptions({
      queryKey: keys.list(),
      queryFn: fetchTodos,
    }),
};
```

Routes and components must reuse the same query option factory. Do not duplicate query keys inline.

## Loader Pattern

Use loaders as prefetch event handlers. They should usually start queries and return no data.

```tsx
export const Route = createFileRoute("/todos")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(api.todos.queryOptions.list());
  },
  component: TodosPage,
});
```

Use `await queryClient.ensureQueryData(...)` only when navigation must wait for that data before the route can render.

Avoid `Route.useLoaderData()` for Query-managed data. Components must create Query observers with `useSuspenseQuery` or `useQuery`, so invalidation, background refetching, and garbage collection keep working correctly.

## Page Composition

Pages design the loading sequence with `Suspense`.

```tsx
function TodosPage() {
  return (
    <Card>
      <TodoForm />
      <Suspense fallback={<TodoListSkeleton />}>
        <TodoList />
      </Suspense>
    </Card>
  );
}
```

Prefer multiple boundaries when regions can load independently. Group boundaries when separate pop-in would feel noisy or cause layout shift.

## Component Data Ownership

Components fetch the data they render.

```tsx
function TodoList() {
  const { data: todos } = useSuspenseQuery(api.todos.queryOptions.list());
  return <ul>{todos.map((todo) => <TodoRow key={todo.id} todo={todo} />)}</ul>;
}
```

Pass minimal props such as IDs, callbacks, or already-available parent data. Do not lift server state into pages just to thread it through props.

## Skeletons

Place skeletons next to the component they represent and export them from the same file.

```tsx
export function TodoListSkeleton() {
  return <ul>{/* same outer shape as TodoList */}</ul>;
}
```

Skeletons should mirror the rendered component structure closely enough to avoid layout shift.

## Mutations

Use `mutationOptions` from `@dropaly/api-query` and invalidation metadata instead of ad hoc invalidation in pages.

```ts
mutationOptions({
  meta: { invalidates: [keys.lists()] },
  mutationFn: createTodo,
});
```

Mutation components may live near the UI that triggers them. Query invalidation keeps subscribed components up to date.

## Use `useQuery` For Deferred Data

Use `useSuspenseQuery` for data that belongs to the page loading sequence. Use `useQuery` for non-critical widgets that can render their own inline pending state after the main content appears.

## Avoid

- Direct fetches in route components when a query option should exist.
- Returning Query-managed data from loaders and reading it with `useLoaderData`.
- Duplicating data fetching in both a page and a child component.
- Creating a second `QueryClient` for Router or importing a hidden global in loaders.
- Adding skeletons in a distant shared folder where they drift from their component.
