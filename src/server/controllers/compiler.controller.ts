import { spawn } from "child_process";
import { TCode } from "../../schemas/code";

export const runCodeController = (input: TCode): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Spawn a child process to run the code
    const runner = spawn("node", ["-e", input.content]);

    // Collect the output from the runner
    let runnerOutput = "";
    runner.stdout.on("data", (data) => {
      runnerOutput += data.toString()
    });

    runner.stderr.on("data", (data) => {
      runnerOutput += data.toString();
    });

    runner.on("close", (code) => {
      if (code === 0) {
                console.log('Asdas',runnerOutput)
        resolve(runnerOutput);
      } else {
        resolve(`Error:${runnerOutput}`);
      }
    });
  });
};
