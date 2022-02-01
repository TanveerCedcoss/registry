export interface OpenAPI3Schema {
  type: "openapi-v3";
  versionName: string;
  value: unknown;
}

export type SchemaPackage = OpenAPI3Schema;

export interface Provider {
  getVersions: () => Promise<string[]>;
  getSchema: (version: string) => Promise<SchemaPackage>;
}
