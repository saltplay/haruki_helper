const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../assets');
const configPath = path.join(__dirname, '../runtime_config.json');

/**
 * 更新 assets 文件夹中的路径到 runtime_config.json 的 move 字段
 */
function updateAssetsPaths() {
    try {
        // 读取 runtime_config.json
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        // 获取 default-user 路径
        const defaultUserPath = configData.paths['default-user'];

        // 读取 assets 文件夹下的目录
        const assetsFolders = fs.readdirSync(assetsDir).filter(folder => {
            return fs.statSync(path.join(assetsDir, folder)).isDirectory();
        });

        // 更新 move 字段，避免覆盖之前已有的配置
        const newMoveConfig = {};
        assetsFolders.forEach(folder => {
            newMoveConfig[`assets/${folder}`] = path.join(defaultUserPath, folder);
        });
        configData.move = Object.assign({}, configData.move, newMoveConfig);

        // 写入更新后的配置
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
        console.log('Assets paths updated successfully.');
        return 1; // 返回1表示运行正常
    } catch (error) {
        console.error('Failed to update assets paths:', error);
        return 0; // 返回0表示运行失败
    }
}

// 执行更新
module.exports = updateAssetsPaths();