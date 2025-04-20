const fs = require("fs");
const path = require("path");

function processSingleFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, "utf8");
        const compressed = JSON.stringify(JSON.parse(content));

        const tempFile = path.join(
            path.dirname(filePath),
            `${path.basename(filePath, ".json")}_temp.json`
        );

        fs.writeFileSync(tempFile, compressed);
        fs.renameSync(tempFile, filePath);

        console.log(`JSON 文件 ${filePath} 压缩成功`);
        return 1;
    } catch (error) {
        console.error(`压缩失败 [${filePath}]: ${error.message}`);
        return 0;
    }
}

function compressJson(inputPath) {
    try {
        const stats = fs.statSync(inputPath);

        if (stats.isFile() && inputPath.toLowerCase().endsWith(".json")) {
            return processSingleFile(inputPath);
        } else if (stats.isDirectory()) {
            return processDirectory(inputPath);
        } else {
            console.error(`错误: ${inputPath} 不是有效的 JSON 文件或文件夹。`);
            return 0;
        }
    } catch (error) {
        console.error(`操作失败: ${error.message}`);
        return 0;
    }
}

function processDirectory(dirPath) {
    let successCount = 0;
    let failCount = 0;

    // 修改后的递归遍历函数
    function walk(currentDir) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath); // 递归处理子目录
            } else if (
                fullPath.toLowerCase().endsWith(".json") &&
                !fullPath.includes("node_modules") && // 过滤依赖目录
                path.basename(fullPath) !== "package.json" // 过滤项目配置文件
            ) {
                try {
                    const result = processSingleFile(fullPath);
                    result ? successCount++ : failCount++;
                } catch (error) {
                    console.error(
                        `处理文件失败 [${fullPath}]: ${error.message}`
                    );
                    failCount++;
                }
            }
        }
    }

    walk(dirPath); // 初始调用

    console.log(`处理完成: 成功 ${successCount} 个, 失败 ${failCount} 个`);
    return successCount > 0 ? 1 : 0;
}

// 保持原有调用方式
if (require.main === module) {
    const inputPath = process.cwd();
    const result = compressJson(inputPath);
    module.exports = result;
} else {
    const inputPath = process.cwd();
    const result = compressJson(inputPath);
    module.exports = result;
}
