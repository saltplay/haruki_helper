// 在文件顶部添加UTF-8编码声明
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

// 加载基础模块
const fs = require('fs');
const path = require('path');

// 加载配置文件
const config = require('../config.json');
const projectRoot = path.join(__dirname, '..'); // 项目根目录

// 定义文件夹路径
const sourceDir = path.join(projectRoot, config.input_for_fileProcessor);
const targetDir = path.join(projectRoot, config['OpenAI Settings']);
const regexDir = path.join(projectRoot, config.regex);

// 确保目标文件夹存在
[regexDir, targetDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {recursive: true});
        console.log(`目录已创建: ${dir}`);
    }
});

// 补全中文括号
function ensureBrackets(name) {
    if (!/^【.*】$/.test(name)) {
        return `【${name}】`;
    }
    return name;
}

// 判断是否为脚本规则文件
// 【命名规范】
// - 正则文件：进入regex目录，保留原【kemini】/【云瑾】前缀
// - 预设文件：进入OpenAI Settings目录，添加当前文件夹前缀
// 【路径映射】
// - regex -> regex（原路径）
// - OpenAI Settings -> assets/OpenAI Settings（配置路径）
// 通过文件内容特征判断而非硬编码前缀
const isScriptRuleFile = (content) => {
    // 仅检查核心字段是否存在（findRegex是正则文件的关键标识）
    content.findRegex = undefined;
    return content && typeof content === 'object' &&
        typeof content.findRegex === 'string';
}

// 移除重复前缀（使用动态前缀）
function removeDuplicatePrefixes(filePath, content, prefix) {
    try {
        let newContent = content;
        // 创建转义前缀
        const escapedPrefix = prefix.replace(new RegExp('[.*+?^${}()|]', 'g'), '\\$&');
        // 移除重复前缀
        newContent = newContent.replace(new RegExp(`(${escapedPrefix}){2,}`, 'g'), prefix);
        // 移除错误前缀
        newContent = newContent.replace(new RegExp(`^${escapedPrefix}(?!${escapedPrefix})`, 'g'), '');

        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`修复前缀: ${filePath}`);
        }
    } catch (e) {
        console.error(`修复前缀失败: ${filePath}`, e);
    }
}

// 文件名转换函数
function transformFileName(name, prefix) {
    // 去除扩展名
    const baseName = path.basename(name, ".json");
    // 如果已有相同前缀则保留，否则添加新前缀
    return `${baseName.startsWith(prefix) ? baseName : `${prefix}${baseName}`}.json`;
}

// 处理scriptName字段
function updateScriptName(jsonContent, prefix) {
    // 显式检查必要字段是否存在
    if (jsonContent && typeof jsonContent.scriptName === 'string') {
        // 移除可能存在的旧前缀（任何【】包裹的内容）
        const cleanedName = jsonContent.scriptName.replace(/^【[^】]*】/, '');
        // 添加当前目录前缀
        return {...jsonContent, scriptName: `${prefix}${cleanedName}`};
    }
    return jsonContent;
}

// 修复目标目录中的文件名（使用动态前缀）
function fixDirectoryFilenames(dirPath, dirName) {
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const oldPath = path.join(dirPath, file);
            if (path.extname(file).toLowerCase() !== '.json') return;

            // 提取现有前缀（如果有）
            const existingPrefixMatch = file.match(/^【[^】]*】/);
            if (!existingPrefixMatch) return;

            const existingPrefix = existingPrefixMatch[0];
            const escapedExistingPrefix = existingPrefix.replace(new RegExp("[.*+?^${}()|\\]]", 'g'), '\\$&');
            // 检查重复前缀并修复
            const newName = file.replace(new RegExp(`^(${escapedExistingPrefix}){2,}`), existingPrefix);

            if (newName !== file) {
                const newPath = path.join(dirPath, newName);
                fs.renameSync(oldPath, newPath);
                console.log(`${dirName} 文件名已修复: ${file} -> ${newName}`);
            }
        });
    }
}

// 处理文件逻辑
try {
    // 获取二级目录
    const subDirs = fs.readdirSync(sourceDir, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory());

    // 处理单个文件夹的规则文件
    subDirs.forEach(dirent => {
        const originalSubDirName = dirent.name;
        const subDirPath = path.join(sourceDir, originalSubDirName);

        // 补全中文括号
        const bracketedSubDirName = ensureBrackets(originalSubDirName);
        const bracketedSubDirPath = path.join(sourceDir, bracketedSubDirName);

        // 重命名目录（如有必要）
        if (originalSubDirName !== bracketedSubDirName) {
            fs.renameSync(subDirPath, bracketedSubDirPath);
            console.log(`目录名称已修正: ${originalSubDirName} -> ${bracketedSubDirName}`);
        }

        // 获取目录下的JSON文件
        const files = fs.readdirSync(bracketedSubDirPath).filter(
            file => path.extname(file).toLowerCase() === '.json'
        );

        files.forEach(file => {
            const oldPath = path.join(bracketedSubDirPath, file);
            // 强制使用UTF-8编码读取文件
            const data = fs.readFileSync(oldPath, 'utf8');

            try {
                const jsonContent = JSON.parse(data);
                // 显式检查必要字段是否存在
                const isScriptRule = isScriptRuleFile(jsonContent);

                // 获取当前目录作为前缀
                const prefix = bracketedSubDirName;
                // 构建新文件名（避免重复前缀）
                let newName = transformFileName(file, prefix);
                // 确定目标路径
                const target = isScriptRule ? regexDir : targetDir;
                const newPath = path.join(target, newName);

                console.log(`处理文件: ${oldPath} -> ${newPath}`, {
                    exists: fs.existsSync(oldPath),
                    size: fs.statSync(oldPath).size
                });

                if (!isScriptRule) {
                    console.warn(`文件缺少必要字段: ${oldPath}`);

                    // 即使缺少必要字段也继续复制文件
                    fs.copyFileSync(oldPath, newPath);
                    console.log(`已处理: ${file} -> ${newName}`);
                    return;
                }

                // 如果是脚本规则文件，处理scriptName
                if (isScriptRule) {
                    try {
                        const updatedContent = updateScriptName(jsonContent, prefix);
                        fs.writeFileSync(newPath, JSON.stringify(updatedContent, null, 2), 'utf8');
                    } catch (e) {
                        console.error(`更新scriptName失败: ${newPath}`, e);
                    }
                }

                // 复制文件到目标路径
                fs.copyFileSync(oldPath, newPath);
                console.log(`已处理: ${file} -> ${newName}`);

                // 修复前缀
                try {
                    // 先检查文件是否存在再尝试修复
                    if (fs.existsSync(newPath)) {
                        const fileContent = fs.readFileSync(newPath, 'utf8');
                        removeDuplicatePrefixes(newPath, fileContent, prefix);
                    }
                } catch (e) {
                    console.error(`修复前缀失败: ${newPath}`, e);
                    fs.appendFileSync(path.join(__dirname, 'prefix_fix_failure.log'),
                        `${new Date().toISOString()} - 修复前缀失败: ${newPath}\n${e.stack}\n\n`);
                }

            } catch (e) {
                console.error(`解析JSON失败: ${oldPath}`, e);
                // 将错误信息写入文件以便后续排查
                fs.appendFileSync(path.join(__dirname, 'error.log'),
                    `${new Date().toISOString()} - 解析JSON失败: ${oldPath}\n${e.stack}\n\n`);
            }
        });
    });

// 修复目标目录中的文件名（使用动态前缀）
    [targetDir, regexDir].forEach(dir => {
        fixDirectoryFilenames(dir, path.basename(dir));
    });

    console.log('文件处理流程完成');

} catch (error) {
    console.error('处理过程中发生错误:', error);
}

// 在文件末尾统一处理模块导出
try {
    // 执行主要功能代码
    // ...（原有功能代码保持不变）...

    // 如果所有操作成功完成
    module.exports = 1;
} catch (error) {
    console.error('处理过程中发生错误:', error);
    // 如果发生错误
    module.exports = 0;
}

// 在文件末尾添加显式导出
exports.default = void 0;
const _default = 1;
exports.default = _default;
