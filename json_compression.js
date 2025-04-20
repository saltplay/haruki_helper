const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

function compressJsonWithJq(inputPath) {
    // 检查输入文件是否存在
    if (!fs.existsSync(inputPath)) {
        console.error(`错误: 文件 ${inputPath} 不存在。`);
        return 0; // 返回0表示失败
    }

    const stats = fs.statSync(inputPath);

    if (stats.isFile() && inputPath.toLowerCase().endsWith(".json")) {
        const tempFile = inputPath + ".tmp";
        const command = `jq -c "." "${inputPath}" > "${tempFile}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行 jq 命令时出错: ${error.message}`);
                if (fs.existsSync(tempFile)) {
                    fs.unlinkSync(tempFile);
                }
                return 0; // 返回0表示失败
            }

            fs.renameSync(tempFile, inputPath);
            console.log(`JSON 文件 ${inputPath} 已成功压缩并覆盖原文件。`);
            return 1; // 返回1表示成功
        });
    } else if (stats.isDirectory()) {
        // 处理文件夹中的所有 JSON 文件
        const files = fs.readdirSync(inputPath, { recursive: true });

        files.forEach((file) => {
            if (file.toLowerCase().endsWith(".json")) {
                const filePath = `${inputPath}/${file}`;
                const tempFile = filePath + ".tmp";
                const command = `jq -c "." "${filePath}" > "${tempFile}"`;

                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(
                            `执行 jq 命令时出错，文件: ${filePath}, 错误信息: ${error.message}`
                        );
                        if (fs.existsSync(tempFile)) {
                            fs.unlinkSync(tempFile);
                        }
                        return 0; // 返回0表示失败
                    }

                    fs.renameSync(tempFile, filePath);
                    console.log(
                        `JSON 文件 ${filePath} 已成功压缩并覆盖原文件。`
                    );
                    return 1; // 返回1表示成功
                });
            }
        });
    } else {
        console.error(`错误: ${inputPath} 不是有效的 JSON 文件或文件夹。`);
        return 0; // 返回0表示失败
    }
}

if (require.main === module) {
    const inputPath = process.cwd(); // 获取当前工作目录
    const result = compressJsonWithJq(inputPath);
    module.exports = result; // 返回执行结果
} else {
    const inputPath = process.cwd(); // 获取当前工作目录
    const result = compressJsonWithJq(inputPath);
    module.exports = result; // 返回执行结果
}
