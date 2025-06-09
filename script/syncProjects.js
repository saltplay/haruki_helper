const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');

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
    fs.mkdirSync(baseDir, {recursive: true});
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
    let targetDir = '';
    try {
        targetDir = path.join(baseDir, folderName);

        console.log(`开始处理仓库: ${targetDir}`);

        // 检查目录是否存在
        let dirExists = fs.existsSync(targetDir);
        const gitDir = path.join(targetDir, '.git');
        const gitDirExists = fs.existsSync(gitDir);

        if (dirExists && !gitDirExists) {
            // 目录存在但不是 Git 仓库，删除目录以便重新克隆
            fs.rmdirSync(targetDir, {recursive: true});
            console.log(`Removed invalid directory (not a git repo): ${targetDir}`);
            // 清理后重置状态
            dirExists = false;
        }

        if (!dirExists) {
            console.log(`目录不存在，准备克隆: ${targetDir}`);
            // 克隆新仓库
            console.log(`Cloning into ${targetDir}`);
            execSync(`git clone ${repoUrl} \"${targetDir}\"`);
            return true;
        } else {
            console.log(`Resetting and pulling into ${targetDir}`);
            execSync('git reset --hard', {cwd: targetDir});
            execSync('git pull', {cwd: targetDir});
            return true;
        }
    } catch (error) {
        console.error(`Error syncing repository: ${error.message}`);
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
