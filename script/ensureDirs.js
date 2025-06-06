const fs = require('fs');
const path = require('path');

// 获取项目根目录
const projectRoot = path.dirname(path.dirname(__filename));

// 读取配置文件
let config;
try {
    const configPath = path.join(projectRoot, 'config.json');
    const configData = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(configData);
} catch (error) {
    console.error('读取配置文件失败:', error.message);
    process.exit(1);
}

// 获取三个文件夹路径
const requiredPaths = [
    'input_for_fileProcessor',
    'OpenAI Settings',
    'regex'
];

// 验证配置
requiredPaths.forEach(key => {
    if (!config.hasOwnProperty(key)) {
        console.error(`配置文件缺少必要字段: ${key}`);
        process.exit(1);
    }
});

// 确保目录存在函数
function ensureDirectoryExists(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, {recursive: true});
            console.log(`目录已创建: ${dirPath}`);
            return false;
        }
        console.log(`目录已存在: ${dirPath}`);
        return true;
    } catch (error) {
        console.error(`目录操作失败 (${dirPath}): ${error.message}`);
        return false;
    }
}

// 主程序
console.log('开始维护目录结构...');

requiredPaths.forEach(key => {
    const dirPath = path.join(projectRoot, config[key]);
    ensureDirectoryExists(dirPath);
});

console.log('目录维护完成！');

module.exports = 1;
