const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../runtime_config.json");

/**
 * 根据 config 中的 copy 配置，将文件夹下的文件全部复制
 */
function copyFiles() {
    try {
        // 读取 runtime_config.json
        const configData = JSON.parse(fs.readFileSync(configPath, "utf8"));

        // 获取 copy 配置
        const copyConfig = configData.copy || configData.move; // 兼容原配置字段

        // 遍历 copy 配置
        for (const [source, destination] of Object.entries(copyConfig)) {
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

            // 复制文件
            files.forEach((file) => {
                const sourceFile = path.join(sourcePath, file);
                const destinationFile = path.join(destinationPath, file);

                // 复制文件（保留原文件）
                fs.copyFileSync(sourceFile, destinationFile);
                console.log(`Copied: ${sourceFile} -> ${destinationFile}`);
            });
        }

        console.log("All files copied successfully.");
        return 1; // 返回1表示运行正常
    } catch (error) {
        console.error("Failed to copy files:", error);
        return 0; // 返回0表示运行失败
    }
}

// 执行复制操作
module.exports = copyFiles();
