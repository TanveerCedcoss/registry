import { EntitySchema, OpenAPI3Schema } from "../provider";
import _ from "lodash";
import axios from "axios";
import openAPIParser from "@readme/openapi-parser";

export interface OpenAPIProviderProps {
  versions: string[];
  baseUrl?: string;
  entities?: string[];
  sanitizeSchema?: (schema: unknown) => unknown;
}

export class OpenAPIProvider {
  /**
   * Versions of the provider's API that are fetched
   */
  public readonly versions: string[];
  /**
   * URL where the OpenAPI definition is located.
   */
  public readonly baseUrl?: string;
  /**
   * Optional array of entity names that should be included in the schemas.
   * If undefined, all entities will be included.
   */
  public readonly entities?: string[];
  /**
   * Custom function to sanitize the schema, e.g. remove unsupported keywords or custom formats.
   */
  private readonly sanitizeSchemaFunction?: (schema: unknown) => unknown;

  constructor({
    versions,
    baseUrl,
    entities,
    sanitizeSchema,
  }: OpenAPIProviderProps) {
    this.versions = versions;
    this.baseUrl = baseUrl;
    this.entities = entities;
    this.sanitizeSchemaFunction = sanitizeSchema;
  }

  /**
   * Returns status of provider. Enabled by default. If disables, provider will not processed.
   * This function can be used to check if necessary environment variables are provided and skip processing if they aren't.
   */
  isEnabled(): boolean {
    return true;
  }

  /**
   * Returns versions of the provider's API that are fetched
   * @returns array of versions
   */
  async getVersions(): Promise<string[]> {
    return this.versions;
  }

  /**
   * Fetches OpenAPI definition from the provider's base URL and returns it
   * @returns OpenAPI3Schema object containing the OpenAPI definition with the entities to be processed
   */
  async getSchema(version: string): Promise<OpenAPI3Schema> {
    if (!this.baseUrl) {
      throw new Error(
        'Neither "baseUrl" wasn\'t provided, nor method "getSchema" was overriden'
      );
    }

    const definition = await axios.get(this.baseUrl);

    return {
      type: "openapi-v3",
      versionName: version,
      value: definition.data,
      entities: this.entities,
    };
  }

  /**
   * Unbundles OpenAPI components, dereferences them, and returns them as an array of EntitySchema objects
   */
  async unbundle(bundle: OpenAPI3Schema): Promise<EntitySchema[]> {
    const dereferenced = await openAPIParser.dereference(bundle.value as any);

    const hasComponents = "components" in dereferenced;
    if (!hasComponents) throw new Error("Expected components");

    const components =
      (dereferenced.components as any).models ??
      dereferenced.components?.schemas;

    return Object.entries(components ?? {})
      .filter(([key]) => !bundle.entities || bundle.entities.includes(key))
      .map(([key, value]) => ({
        name: key,
        schema: this.sanitizeSchemaFunction
          ? this.sanitizeSchemaFunction(value)
          : sanitizeSchema(value),
      }));
  }
}

function sanitizeSchema(schema: unknown) {
  return JSON.parse(
    JSON.stringify(schema, (_, value) => {
      return value;
    })
  );
}