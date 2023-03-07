import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";
import {  TFile } from "../../schemas/code";


export const runCode = ({
  files,
  current,
}: {
  files: TFile;
  current: string;
}): Promise<string> => {
  return new Promise((resolve, reject) => {
        console.log("@@@@@@",files,current)
    const tempFolder = path.join(os.tmpdir(), "coeditor");
    if (!fs.existsSync(tempFolder)) {
      fs.mkdirSync(tempFolder);
    }
        console.log("TU")
    files.map((file) => {
      let filePath = path.join(tempFolder, file.title);
      fs.writeFile(filePath, file.content, (err) => {
        if (err) throw err;
      });
    });
    // Spawn a child process to run the code
    const runner = spawn("node", ["-e", current], {
      cwd: tempFolder,
    });

    // Collect the output from the runner
    let runnerOutput = "";
    runner.stdout.on("data", (data) => {
      runnerOutput += data.toString();
    });

    runner.stderr.on("data", (data) => {
      runnerOutput += data.toString();
    });

    runner.on("close", (code) => {
      if (code === 0) {
        resolve(runnerOutput);
        fs.rmSync(tempFolder, { recursive: true, force: true });
      } else {
        resolve(`Error:${runnerOutput}`);
      }
    });
  });
};
