const fs = require('fs');
const path = require('path');

// 默认 Git 仓库配置
// noinspection JSNonASCIINames
const DEFAULT_GIT_REPOS = {
    "【云瑾】": "https://github.com/saltplay/yunjin",
    "【kemini】": "https://github.com/saltplay/kemini"
};

// 配置文件路径
const RUNTIME_CONFIG_PATH = path.join(__dirname, '..', 'runtime_config.json');

try {
    // 读取配置文件
    const runtime_config = JSON.parse(fs.readFileSync(RUNTIME_CONFIG_PATH, 'utf8'));
    JSON.parse(fs.readFileSync(RUNTIME_CONFIG_PATH, 'utf8'));
// 检查并添加 git_repositories 字段
    if (!runtime_config.git_repositories) {
        runtime_config.git_repositories = DEFAULT_GIT_REPOS;

        // 写回配置文件（保留原有格式）
        fs.writeFileSync(
            RUNTIME_CONFIG_PATH,
            JSON.stringify(runtime_config, null, 2),  // 保持 2 空格缩进格式
            'utf8'
        );

        console.log(`✅ 已添加 git_repositories 字段到 ${RUNTIME_CONFIG_PATH}`);
        console.log('新配置内容：', runtime_config.git_repositories);
    } else {
        console.log(`ℹ️ git_repositories 字段已存在，无需修改`);
    }
} catch (error) {
    console.error(`❌ 配置文件处理失败: ${error.message}`);
}

module.exports = 1;
