import { createApiQueries } from "@dropaly/api-query";

import { apiClient } from "./api-client";

export const api = createApiQueries(apiClient);
