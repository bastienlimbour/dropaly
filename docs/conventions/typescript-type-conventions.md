# TypeScript Type Conventions

## Default Rule

- Use `interface` for named object shapes.
- Use `interface extends` when composing object shapes.
- Use `type` for unions, aliases, tuples, mapped types, conditional types, template literal types, and other type-level computation.

## Use `interface` For Object Contracts

Prefer `interface` for domain models, DTOs, component props, service options, configuration objects, and exported package contracts.

```ts
interface TodoItemProps {
  title: string;
  completed: boolean;
}
```

Prefer `interface extends` over object intersections when extending object shapes.

```ts
interface AdminUser extends User {
  role: "admin";
}
```

Avoid this when a clear `interface extends` works:

```ts
type AdminUser = User & {
  role: "admin";
};
```

## Use `type` For Type Expressions

Use `type` when the construct is not mainly a named object shape.

```ts
type TodoStatus = "open" | "completed" | "archived";

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type Coordinates = [x: number, y: number];

type TodoPatch = Partial<Todo>;

type EventHandler<TEvent> = (event: TEvent) => void;
```

## Performance Note

The useful TypeScript performance rule is narrow: prefer `interface extends` over large object intersections when composing object shapes.

Interfaces create named object shapes that TypeScript can cache more effectively. Intersections can produce slower checks and harder-to-read errors as they grow.

Measure before doing broad style refactors. Useful tools include `tsc --extendedDiagnostics` and TypeScript performance traces.

## Declaration Merging

Interfaces can be reopened and merged. Type aliases cannot.

Use declaration merging rarely and intentionally, usually for global or third-party type augmentation.

```ts
interface Window {
  dropaly?: unknown;
}
```

Do not rely on declaration merging for ordinary domain models.

## Migration Guidance

- Apply this convention progressively.
- New object contracts should normally be `interface`.
- New unions and computed types should be `type`.
- When touching `type Foo = { ... }`, consider converting it to `interface Foo`.
- When touching `type Foo = Bar & { ... }`, consider converting it to `interface Foo extends Bar { ... }` if all parts are object-like and the result remains clear.
- Do not convert complex `type` aliases to awkward interfaces just for consistency.
- Do not run repository-wide conversions unless there is a measured problem or an explicit cleanup task.

## Agent Guidance

When generating or editing TypeScript code:

- Follow this convention for new code.
- Preserve nearby style when consistency in a local file is more valuable than a small convention cleanup.
- Avoid unrelated type-style churn in files you are touching.
- Prefer the smallest correct change.
