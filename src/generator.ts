import { SchemaPackage } from "./provider";
import providers from "./providers";
import openAPIParser from "@readme/openapi-parser";
import refParser, { JSONSchema } from "@apidevtools/json-schema-ref-parser";
import { OpenAPIV3 } from "openapi-types";
import path from "path";
import fs from "fs";

type Schema = {
  name: string;
  schema: unknown;
};

async function listVersions(providerName: keyof typeof providers) {
  return await providers[providerName].getVersions();
}

// function extractSchemas(definition: OpenAPIV3.Document): JSONSchema {
//   const dereferenced = openAPIParser.dereference(definition, {
//     dereference: { circular: "ignore" },
//   });
//   const schemas: OpenAPIV3.ComponentsObject["schemas"] =
//     definition.components?.schemas ?? {};
// }

async function unbundle(bundle: SchemaPackage): Promise<Schema[]> {
  switch (bundle.type) {
    case "openapi-v3":
      const dereferenced = await openAPIParser.dereference(
        bundle.value as any,
        { dereference: { circular: "ignore" } }
      );
      if (!("components" in dereferenced))
        throw new Error("Expected components");
      return Object.entries(dereferenced.components?.schemas ?? {}).map(
        ([k, v]) => ({
          name: k,
          schema: v,
        })
      );
  }
}

export async function generateForVersion(
  rootPath: string,
  providerName: keyof typeof providers,
  version: string
) {
  const bundle = await providers[providerName].getSchema(version);
  const schemas = await unbundle(bundle);
  const baseDir = path.join(rootPath, providerName, bundle.versionName);
  fs.mkdirSync(baseDir, { recursive: true });
  for (const schema of schemas) {
    fs.writeFileSync(
      path.join(baseDir, `${schema.name}.json`),
      JSON.stringify(schema.schema, null, 2)
    );
  }
}

export async function generateAll(
  rootPath: string,
  providerName: keyof typeof providers
) {
  const versions = await listVersions(providerName);
  for (const version of versions) {
    console.log(`Generating [${providerName}, ${version}]...`);
    await generateForVersion(rootPath, providerName, version);
  }
}

(async () => {
  await generateAll("./schemas", "stripe");
})();
