const os = require("os");
const path = require("path");
const fs = require("fs");
const scriptDir = path.dirname(__filename);
const filePath = path.join(scriptDir, "SillyTavernPath.txt");

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
 * 生成并写入 SillyTavernPath.txt 文件（强制覆盖）
 * @param {string} filePath - SillyTavernPath.txt 文件的完整路径
 * @param {string} defaultContent - 默认写入的内容
 * @returns {void}
 */
function generateAndWriteSillyTavernPath(filePath, defaultContent) {
  try {
    // 直接覆盖写入文件
    fs.writeFileSync(filePath, defaultContent);
    console.log("SillyTavernPath.txt 文件已成功覆盖写入。");
  } catch (error) {
    console.error("写入文件失败:", error);
  }
}

if (os.type() === "Linux") {
  const result = checkFilePath(filePath);
  if (result === 0) {
    // 如果路径有效，仍然强制覆盖写入
    const defaultContent = "/data/data/com.termux/files/home/SillyTavern"; // 默认内容
    generateAndWriteSillyTavernPath(filePath, defaultContent);
  } else {
    // 如果路径无效，生成并写入文件
    const defaultContent = "/data/data/com.termux/files/home/SillyTavern"; // 默认内容
    generateAndWriteSillyTavernPath(filePath, defaultContent);
  }
}

module.exports = 1;
