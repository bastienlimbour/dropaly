export const queryKeys = {
  health: () => ["health"] as const,
  privateData: () => ["private-data"] as const,
  todos: {
    all: () => ["todos"] as const,
  },
};
