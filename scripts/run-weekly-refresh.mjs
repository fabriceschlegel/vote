import { spawn } from "node:child_process";

const steps = [
  {
    label: "Build official record archive",
    command: "node",
    args: ["scripts/generate-official-record-archive.mjs"],
  },
  {
    label: "Fetch manifest sources",
    command: "node",
    args: ["scripts/fetch-winchester-sources.mjs"],
  },
  {
    label: "Build derived audit outputs",
    command: process.env.PYTHON ?? "python3",
    args: ["scripts/build-data-harness.py"],
  },
];

function runStep(step) {
  return new Promise((resolve, reject) => {
    console.log(`\n==> ${step.label}`);

    const child = spawn(step.command, step.args, {
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      const detail = signal ? `signal ${signal}` : `exit code ${code}`;
      reject(new Error(`${step.command} ${step.args.join(" ")} failed with ${detail}`));
    });
  });
}

for (const step of steps) {
  await runStep(step);
}
