import type { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

import type { Auth } from "@dropaly/auth/server";
import type { Db } from "@dropaly/db";

interface DependenciesPluginOptions {
  db: Db;
  auth: Auth;
}

const dependenciesPlugin: FastifyPluginAsync<DependenciesPluginOptions> = async (
  app,
  options,
) => {
  app.decorate("db", options.db);
  app.decorate("auth", options.auth);
};

export const dependencies = fastifyPlugin(dependenciesPlugin);
