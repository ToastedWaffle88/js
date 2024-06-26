import { $ } from "bun";
import fs from "node:fs/promises";
import ora from "ora";

const fixtures = await fs.readdir("./fixtures");

const spinner = ora("Running fixtures: ").start();

for (const fixture of fixtures) {
  spinner.suffixText = fixture;
  try {
    await $`node fixtures/${fixture}`.text();
  } catch (error) {
    if (error.exitCode !== 0) {
      console.error(error);
      spinner.fail("Failed to run fixture: " + fixture);
      process.exit(1);
    }
  }
}

spinner.succeed("All fixtures ran successfully");
