const fs = require("fs");
const path = require("path");

// 读取配置文件中的脚本列表
const configPath = path.join(__dirname, "../config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const scripts = config.scripts;

let allPassed = true;

// 按顺序执行每个脚本
for (const scriptPath of scripts) {
  try {
    const result = require(path.resolve(scriptPath));
    if (result !== 1) {
      console.error(`脚本 ${scriptPath} 返回 ${result}，停止执行。`);
      allPassed = false;
      break;
    }
  } catch (error) {
    console.error(`执行脚本 ${scriptPath} 时出错：`, error);
    allPassed = false;
    break;
  }
}

if (allPassed) {
  console.log("所有脚本执行成功!");
  // 这里可以添加后续的逻辑
} else {
  console.log("由于脚本失败，执行停止。");
}