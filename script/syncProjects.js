const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取配置路径
const configPath = path.join(__dirname, '../config.json');
const runtimeConfigPath = path.join(__dirname, '../runtime_config.json');

// 读取配置文件
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const runtimeConfig = JSON.parse(fs.readFileSync(runtimeConfigPath, 'utf-8'));

// 目标基础路径 - 修正为绝对路径
const baseDir = path.join(__dirname, '../', config.input_for_fileProcessor);

// 确保目标目录存在
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// 目录规范化处理函数
function normalizeDirectoryName(name) {
  // 自动补全中文括号
  if (name.startsWith('【') && !name.endsWith('】')) {
    name += '】';
  }
  
  // 清理特殊字符和非打印字符
  name = name.replace(/[\x00-\x1F\x7F\x2F\x5C\x3A\x2A\x3F\x22\x3C\x3E\x7C\x2C\x2E\x2D]/g, '_');
  
  // 合并连续下划线
  name = name.replace(/_+/g, '_');
  
  // 严格校验格式
  const isValid = /^【[^【】]*】$/.test(name);
  if (!isValid) {
    throw new Error(`Invalid directory name format: ${name}`);
  }
  
  return name;
}

// 执行Git同步
function syncRepository(repoUrl, folderName) {
  try {
    const targetDir = path.join(baseDir, folderName);
    
    // 检查目录是否存在
    if (fs.existsSync(targetDir)) {
      console.log(`Resetting and pulling into ${targetDir}`);
      execSync('git reset --hard', { cwd: targetDir });
      execSync('git pull', { cwd: targetDir });
    } else {
      console.log(`Cloning into ${targetDir}`);
      execSync(`git clone ${repoUrl} "${targetDir}"`);
    }
    
    // 验证目录规范化
    try {
      const stats = fs.statSync(targetDir);
      if (!stats.isDirectory()) {
        console.error(`Sync failed: ${targetDir} is not a directory`);
        return false;
      }
    } catch (error) {
      console.error(`Directory validation error: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error syncing repository: ${error.message}`);
    // 清理残留目录
    if (fs.existsSync(targetDir)) {
      fs.rmdirSync(targetDir, { recursive: true });
    }
    return false;
  }
}

// 主程序
try {
  // 遍历所有仓库
  const repositories = runtimeConfig.git_repositories;
  let successCount = 0;
  
  for (const [folderName, repoUrl] of Object.entries(repositories)) {
    try {
      const normalizedFolderName = normalizeDirectoryName(folderName);
      const success = syncRepository(repoUrl, normalizedFolderName);
      if (success) successCount++;
    } catch (error) {
      console.error(`Failed to process repository ${folderName}: ${error.message}`);
    }
  }
  
  // 输出统计信息
  console.log(`\nSuccessfully synced ${successCount}/${Object.keys(repositories).length} repositories`);
  
  // 返回执行状态码
  module.exports = successCount === Object.keys(repositories).length ? 1 : 0;
} catch (error) {
  console.error(`Critical error in sync process: ${error.message}`);
  module.exports = 0;
}