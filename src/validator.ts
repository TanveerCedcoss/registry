import { readFileSync } from "fs";
import glob from "glob";
import { validateSchema } from "./validate";

type PathErrorPair = [string, Error];

async function validateAll() {
  const errors: PathErrorPair[] = [];
  const paths = glob.sync("schemas/**/*.json");

  paths.forEach((path: string) => {
    try {
      validateSchema(readFileSync(path, "utf-8"));
    } catch (e) {
      errors.push([path, e as Error]);
      console.error(`${path} failed validation: `);
      console.error(e);
    }
  });

  if (errors.length > 0) {
    console.error(`${errors.length} errors found.`);
    process.exit(1);
  }
}

(async () => {
  await validateAll();
})();
