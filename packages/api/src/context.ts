export interface Actor {
  userId: string;
  email: string;
  name: string;
}

export interface RequestContext {
  actor: Actor | null;
}
