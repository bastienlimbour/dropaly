import { createApiQueries } from "@dropaly/api-queries";

import { apiClient } from "./api-client";

export const api = createApiQueries(apiClient);
