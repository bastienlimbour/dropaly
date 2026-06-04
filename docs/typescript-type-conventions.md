# TypeScript Type And Interface Conventions

Date: 2026-06-03

Status: Accepted

## Context

The monorepo currently uses both `interface` and `type` declarations. Both are valid TypeScript tools, but using them without a shared convention makes code less predictable and can lead to avoidable checker complexity.

This convention is meant to guide new code and gradual cleanup. Existing code does not need a large mechanical refactor unless it is already being touched for another reason.

## Default Rule

Use `interface` for named object shapes.

Use `type` for type composition features that interfaces cannot express well or cannot express at all.

In practice:

- Prefer `interface` for domain models, DTOs, component props, service options, configuration objects, and package-level public object contracts.
- Prefer `interface extends` when composing object shapes.
- Use `type` for unions, discriminated unions, primitive aliases, tuples, mapped types, conditional types, template literal types, utility-type results, and function signatures that are clearer as aliases.
- Do not refactor working code just to replace every `type` with `interface` or every `interface` with `type`.

## When To Use `interface`

Use `interface` when declaring a stable object shape.

```ts
interface User {
  id: string;
  email: string;
}
```

Use `interface` for exported object contracts between packages.

```ts
export interface CreateTodoInput {
  title: string;
}
```

Use `interface extends` instead of intersections when extending object shapes.

```ts
interface User {
  id: string;
  email: string;
}

interface AdminUser extends User {
  role: "admin";
}
```

This is preferred over:

```ts
type AdminUser = User & {
  role: "admin";
};
```

Use `interface` for props when the props are a named object contract.

```tsx
interface TodoItemProps {
  title: string;
  completed: boolean;
}

export function TodoItem(props: TodoItemProps) {
  // ...
}
```

## When To Use `type`

Use `type` for unions.

```ts
type TodoStatus = "open" | "completed" | "archived";
```

Use `type` for discriminated unions.

```ts
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
```

Use `type` for aliases to primitives or branded values.

```ts
type UserId = string;
```

Use `type` for tuples.

```ts
type Coordinates = [x: number, y: number];
```

Use `type` for mapped types, conditional types, and utility-type results.

```ts
type TodoPatch = Partial<Todo>;

type AsyncReturn<T> = T extends (...args: never[]) => Promise<infer R> ? R : never;
```

Use `type` when the type is not primarily an object shape.

```ts
type EventHandler<TEvent> = (event: TEvent) => void;
```

## Performance Guidance

The performance difference is not that every `interface` is meaningfully faster than every `type` alias.

The important TypeScript compiler recommendation is narrower: prefer `interface extends` over object intersections when composing object shapes.

Interfaces produce a single named object shape and their relationships can be cached more effectively by the compiler. Intersections can require checking each constituent and can produce harder-to-read errors, especially as they grow.

Prefer this:

```ts
interface Foo extends Bar, Baz {
  value: string;
}
```

Instead of this:

```ts
type Foo = Bar &
  Baz & {
    value: string;
  };
```

If a type-checking performance problem appears, measure it before performing broad style refactors. Useful commands include `tsc --extendedDiagnostics` and TypeScript performance traces.

## Declaration Merging

Interfaces can be reopened and merged. Type aliases cannot.

```ts
interface Window {
  dropaly?: unknown;
}
```

Declaration merging should be used rarely and intentionally, usually for global or third-party type augmentation. Do not rely on declaration merging for ordinary domain models.

## Migration Guidance

Apply this convention progressively.

- New object contracts should normally be `interface`.
- New unions and computed types should be `type`.
- When touching a type alias that is only an object shape, consider converting it to an interface.
- When touching `type Foo = Bar & { ... }`, consider converting it to `interface Foo extends Bar { ... }` if all constituents are object-like and the result remains clear.
- Do not convert complex `type` aliases to awkward interfaces just for consistency.
- Do not run a repository-wide conversion unless there is a measured problem or an explicit cleanup task.

## Summary

Use the right tool for the type being expressed:

- `interface` for object contracts.
- `interface extends` for object composition.
- `type` for unions, aliases, tuples, mapped types, conditional types, and other type-level computation.

This balances readability, TypeScript checker performance, and long-term maintainability across the monorepo.
