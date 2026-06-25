import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import openapiTS, { astToString } from "openapi-typescript";

const currentDir = dirname(fileURLToPath(import.meta.url));
const contractPath = resolve(currentDir, "../../../apps/api/openapi/openapi.json");
const outputPath = resolve(currentDir, "../src/schema.d.ts");

const schema = JSON.parse(await readFile(contractPath, "utf8"));
const ast = await openapiTS(schema, {
  rootTypes: true,
  rootTypesNoSchemaPrefix: true,
});

await writeFile(outputPath, astToString(ast));
