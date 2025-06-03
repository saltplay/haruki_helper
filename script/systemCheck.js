const os = require("os");
const fs = require("fs");
const path = require("path");

try {
  // 确定配置文件路径
  const configPath = path.join(__dirname, "../runtime_config.json");
  let configData = {};

  // 安全读取并解析JSON
  if (fs.existsSync(configPath)) {
    const rawData = fs.readFileSync(configPath, "utf8");
    try {
      configData = JSON.parse(rawData);
    } catch (parseError) {
      console.warn("发现损坏的JSON配置文件，正在创建新配置...");
      // 备份损坏的文件
      fs.renameSync(configPath, configPath + ".backup" + Date.now());
    }
  }

  // 强化系统信息更新
  configData.systemType = os.type();
  configData.platform = os.platform();
  configData.arch = os.arch();

  // 安全处理路径配置
  configData.paths = configData.paths || {};

  // 设置默认路径（仅当不存在时）
  const homeDir = os.homedir();
  configData.paths.sillyTavernPath = configData.paths.sillyTavernPath ||
    path.join(homeDir, "Applications/SillyTavern");

  configData.paths.settings = configData.paths.settings ||
    path.join(configData.paths.sillyTavernPath, "data/default-user/settings.json");

  // 确保目录存在
  ["sillyTavernPath", "settings"].forEach(key => {
    const dirPath = key === "settings" ?
      path.dirname(configData.paths[key]) :
      configData.paths[key];

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`已创建缺失的目录: ${dirPath}`);
    }
  });

  // 写入更新后的配置
  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
  module.exports = 1; // 成功返回1
} catch (error) {
  console.error("systemCheck.js致命错误:", error);
  module.exports = 0; // 失败返回0
}