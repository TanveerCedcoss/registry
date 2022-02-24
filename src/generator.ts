import { Provider, SchemaPackage } from "./provider";
import providers from "./providers";
import openAPIParser from "@readme/openapi-parser";
import path from "path";
import fs from "fs";
import { OpenAPIV3 } from "openapi-types";
import { mock } from "./util";
import { markdownTable } from "markdown-table";

interface Schema {
  name: string;
  schema: unknown;
}

async function listVersions(providerName: keyof typeof providers) {
  return await providers[providerName].getVersions();
}

async function unbundle(bundle: SchemaPackage): Promise<Schema[]> {
  switch (bundle.type) {
    case "openapi-v3":
      const dereferenced = await openAPIParser.dereference(bundle.value as any);
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
  const baseDir = path.join(rootPath, providerName, version);
  const folderExists = !fs.mkdirSync(baseDir, { recursive: true });
  if (folderExists) {
    console.log(`Skipping [${providerName}, ${version}]...`);
    return;
  }
  const bundle = await providers[providerName].getSchema(version);
  const schemas = await unbundle(bundle);

  const markdownTableRows: string[][] = [];
  console.log(`Generating [${providerName}, ${version}]...`);

  for (const schema of schemas) {
    const target = path.join(baseDir, `${schema.name}.json`);
    schema.schema = providers[providerName].getSchemaWithoutCircularReferences(
      schema.schema as OpenAPIV3.SchemaObject
    );
    (schema.schema as any)["default"] = mock(
      schema.schema as OpenAPIV3.SchemaObject
    );
    fs.writeFileSync(target, JSON.stringify(schema.schema, null, 2));

    markdownTableRows.push([
      `${schema.name}.json`,
      runOnStediButtonWithSource(target),
    ]);
  }

  const readmeFileContents = markdownTable([
    ["Source Schema", "Map on Stedi"],
    ...markdownTableRows,
  ]);
  fs.writeFileSync(path.join(baseDir, `README.md`), readmeFileContents);
}

function runOnStediButtonWithSource(target: string) {
  return `[![Run on Stedi](../../RunOnStedi.svg)](https://terminal.stedi.com/mappings/import?source_json=https://raw.githubusercontent.com/Stedi/registry/main/${target}`;
}

export async function generateAll(
  rootPath: string,
  providerName: keyof typeof providers
) {
  const versions = await listVersions(providerName);
  for (const version of versions) {
    await generateForVersion(rootPath, providerName, version);
  }
}

(async () => {
  await generateAll("./schemas", "stripe");
  await generateAll("./schemas", "ramp");
})();