const { spawn } = require("child_process");
const path = require("path");

function startScript() {
    const startScriptPath = path.join(__dirname, "start.js");
    const child = spawn("node", [startScriptPath]);

    child.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
    });

    child.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    child.on("close", (code) => {
        console.log(`子进程退出，退出码 ${code}`);
        askForRestart();
    });
}

function askForRestart() {
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.question("start.js 已停止，是否要重新启动？(y/n) ", (answer) => {
        if (answer.toLowerCase() === "y") {
            console.log("重新启动 start.js...");
            startScript();
        } else {
            console.log("监控结束。");
        }
        readline.close();
    });
}

// 首次启动 start.js
startScript();
