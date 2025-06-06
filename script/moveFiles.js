// 暂时换成了copy.js没有问题的话,就考虑删除move,js

const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../runtime_config.json");

/**
 * 根据 config 中的 move 配置，将文件夹下的文件全部移动
 */
function moveFiles() {
    try {
        // 读取 runtime_config.json
        const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

        // 获取 move 配置
        const moveConfig = configData.move;

        // 遍历 move 配置
        for (const [source, destination] of Object.entries(moveConfig)) {
            const sourcePath = path.join(__dirname, "../", source);
            const destinationPath = destination;

            // 检查源路径是否存在
            if (!fs.existsSync(sourcePath)) {
                console.error(`Source path does not exist: ${sourcePath}`);
                continue;
            }

            // 创建目标路径（如果不存在）
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }

            // 读取源路径下的所有文件
            const files = fs.readdirSync(sourcePath);

            // 移动文件
            files.forEach((file) => {
                const sourceFile = path.join(sourcePath, file);
                const destinationFile = path.join(destinationPath, file);

                // 移动文件
                fs.renameSync(sourceFile, destinationFile);
                console.log(`Moved: ${sourceFile} -> ${destinationFile}`);
            });
        }

        console.log("All files moved successfully.");
        return 1; // 返回1表示运行正常
    } catch (error) {
        console.error("Failed to move files:", error);
        return 0; // 返回0表示运行失败
    }
}

// 执行移动操作
module.exports = moveFiles();
