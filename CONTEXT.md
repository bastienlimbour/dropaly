# Dropaly Context

Canonical domain language for Dropaly.

## Language

### Access

**AuthenticatedUser**:
A user derived from a valid authenticated session. Use **AuthenticatedUser** when an operation requires a user-owned resource or user role.
_Avoid_: Actor, UserActor, Session User

### Todos

**Todo**:
A task owned by a user. When a **Todo** is absent or belongs to another user, callers receive the same not-found result so the existence of another user's **Todo** is not revealed.
_Avoid_: Task
