const os = require("os");
const fs = require("fs");
const path = require("path");

try {
  // 读取现有配置文件
  const configPath = path.join(__dirname, "../runtime_config.json");
  let configData = {};
  if (fs.existsSync(configPath)) {
    configData = JSON.parse(fs.readFileSync(configPath, "utf8"));
  }

  // 更新系统类型，保留原有paths配置
  configData.systemType = os.type();

  // 确保paths对象存在
  if (!configData.paths) {
    configData.paths = {};
  }

  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
  module.exports = 1; // 成功返回1
} catch (error) {
  module.exports = 0; // 失败返回0
}
