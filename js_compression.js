const fs = require("fs");
const path = require("path");
const Terser = require("terser");

function compressJsFile(inputPath) {
    if (!fs.existsSync(inputPath)) {
        console.error(`错误: 文件 ${inputPath} 不存在`);
        return 0;
    }

    const stats = fs.statSync(inputPath);

    const processFile = (filePath) => {
        try {
            const content = fs.readFileSync(filePath, "utf8");
            if (typeof content !== "string" || content.length === 0) {
                console.error(`错误: 文件 ${filePath} 内容为空或读取失败`);
                return 0;
            }
            const result = Terser.minify(content);
            if (result.error) {
                throw result.error;
            }
            fs.writeFileSync(filePath, result.code);
            console.log(`已压缩: ${filePath}`);
            return 1;
        } catch (e) {
            console.error(`压缩失败: ${filePath}`, e.message);
            return 0;
        }
    };

    if (stats.isFile() && inputPath.toLowerCase().endsWith(".js")) {
        return processFile(inputPath);
    } else if (stats.isDirectory()) {
        let successCount = 0;
        const files = fs.readdirSync(inputPath, {
            recursive: true,
            withFileTypes: true,
        });

        files.forEach((dirent) => {
            if (dirent.isFile() && dirent.name.toLowerCase().endsWith(".js")) {
                const filePath = path.join(dirent.path, dirent.name);
                successCount += processFile(filePath);
            }
        });
        return successCount;
    }
    return 0;
}

// 示例调用
const inputPath = process.cwd(); // 获取当前工作目录
const result = compressJsFile(inputPath);
console.log(`压缩结果: ${result}`);
