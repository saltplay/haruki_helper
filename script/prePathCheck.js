const fs = require("fs");
const path = require("path");
const scriptDir = path.dirname(__filename);
const filePath = path.join(scriptDir, "SillyTavernPath.txt");
const configPath = path.join(__dirname, "../runtime_config.json");

/**
 * 检查文件路径是否有效
 * @param {string} filePath - 文件路径
 * @returns {number} - 返回状态码：0 表示有效，其他值表示错误类型
 */
function checkFilePath(filePath) {
  if (!fs.existsSync(filePath)) return 1; // 文件不存在
  const stats = fs.statSync(filePath);
  if (stats.size === 0) return 2; // 文件为空
  const fileContent = fs.readFileSync(filePath, "utf8").trim();
  if (!fileContent.endsWith("SillyTavern")) return 3; // 路径不以 SillyTavern 结尾
  if (!fs.existsSync(fileContent)) return 4; // 用户提供的路径不存在
  return 0; // 路径有效
}

/**
 * 更新 runtime_config.json 中的路径配置
 * @param {string} fileContent - 用户输入的路径
 */
function updateConfig(fileContent) {
  try {
    if (!fs.existsSync(configPath)) {
      console.error("runtime_config.json does not exist");
      return;
    }

    const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

    // 定义需要更新的路径配置
    const pathUpdates = {
      settings: path.join(fileContent, "data/default-user/settings.json"),
      "default-user": path.join(fileContent, "data/default-user"),
    };

    // 遍历并更新路径配置
    for (const [key, value] of Object.entries(pathUpdates)) {
      configData.paths[key] = value;
    }

    // 直接覆盖 sillyTavernPath
    configData.paths.sillyTavernPath = fileContent;

    // 写入更新后的配置
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
  } catch (error) {
    console.error("Failed to update config:", error);
  }
}

// 主逻辑
function main() {
  if (!fs.existsSync(configPath)) {
    console.error("runtime_config.json does not exist");
    return 1;
  }

  const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

  const result = checkFilePath(filePath);

  if (result !== 0) {
    configData.paths.sillyTavernPath = ""; // 设置为空字符串
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));

    const content = "/data/data/com.termux/files/home/SillyTavern";
    if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
      try {
        fs.writeFileSync(filePath, content);
      } catch (error) {
        console.error("Failed to write file:", error);
      }
    }
  } else {
    const fileContent = fs.readFileSync(filePath, "utf8").trim();
    updateConfig(fileContent);
  }

  return 1;
}

module.exports = main;