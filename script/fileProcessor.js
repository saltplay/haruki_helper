const fs = require("fs");
const path = require("path");

// 使用 __dirname 获取当前脚本路径
// 引入配置文件
const config = require("../config.json");

// 明确定义项目根目录
const projectRoot = path.join(__dirname, '..'); // 从 script 目录上溯到项目根目录

// 添加 PREFIX 和 ESCAPED_PREFIX 定义
const PREFIX = "【夏瑾】";
const ESCAPED_PREFIX = PREFIX.replace(/[.*+?^${}()|[\\]/g, '\\\\$&'); // 转义特殊字符用于正则表达式

// 使用项目根目录定义路径
const sourceDir = path.join(projectRoot, config.input_for_fileProcessor);
const targetDir = path.join(projectRoot, config['OpenAI Settings']);
const cTargetDir = path.join(projectRoot, config.regex); // 使用点符号访问属性

// 新增通用文件处理函数
function processFile(oldPath, newPath, cTargetDir) {
    try {
        fs.copyFileSync(oldPath, newPath);
        console.log(`已复制: ${path.basename(oldPath)} -> ${path.basename(newPath)}`);

        const data = fs.readFileSync(newPath, 'utf8');
        let jsonContent;
        try {
            jsonContent = JSON.parse(data);
        } catch (e) {
            console.error(`解析JSON失败: ${newPath}`, e);
            return;
        }

        if (isScriptRuleFile(jsonContent)) {
            const cNewPath = path.join(cTargetDir, path.basename(newPath));
            try {
                fs.renameSync(newPath, cNewPath);
                console.log(`已移动到 【正则】文件夹regex: ${path.basename(newPath)}`);
            } catch (renameError) {
                console.error(`移动文件失败: ${path.basename(newPath)}`, renameError);
            }
        }

    } catch (error) {
        console.error(`复制文件失败: ${path.basename(oldPath)} -> ${path.basename(newPath)}`, error);
    }
}

// 确保源目录存在
if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, {recursive: true});
    console.log(`源目录已创建: ${sourceDir}`);
}

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, {recursive: true});
    console.log(`目标目录已创建: ${targetDir}`);
} else {
    console.log(`目标目录已存在: ${targetDir}`);
}

// 新增：确保 【正则】文件夹regex文件夹regex目录存在
if (!fs.existsSync(cTargetDir)) {
    fs.mkdirSync(cTargetDir, {recursive: true});
    console.log(`【正则】文件夹regex 目录已创建: ${cTargetDir}`);
} else {
    console.log(`【正则】文件夹regex 目录已存在: ${cTargetDir}`);
}

// 自动补全中文括号函数
// 新增辅助函数
function ensureBrackets(dirName) {
    if (!/^【.*】$/.test(dirName)) {
        return `【${dirName}】`;
    }
    return dirName;
}

// 将文件名转换函数改为接收prefix参数
function transformFileName(name, prefix) {
    // 去除扩展名
    const baseName = path.basename(name, ".json");

    // 去除空格和特殊字符
    let newName = baseName
        .replace(/\s+/g, "")
        .replace(/-Beta\s+(\d+)/, "-Beta$1")
        .replace(/V(\d+\.\d+)/, "V$1")
        .replace(/\$\d+$/, "") // 删除结尾的 [数字]
        .replace(/\$\d+$/, "") // 新增：删除结尾的 (数字)
        .replace(/\(\d+\)/g, ""); // 新增：删除所有位置的 (数字)

    // 添加目录名作为前缀并重新添加扩展名
    return `${prefix}${newName}.json`;
}

// 新增：遍历二级目录处理
const subDirs = fs.readdirSync(sourceDir, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory());

subDirs.forEach(dirent => {
    const originalSubDirName = dirent.name;
    const subDirPath = path.join(sourceDir, originalSubDirName);

    // 自动补全中文括号
    const bracketedSubDirName = ensureBrackets(originalSubDirName);
    const bracketedSubDirPath = path.join(sourceDir, bracketedSubDirName);

    if (originalSubDirName !== bracketedSubDirName) {
        fs.renameSync(subDirPath, bracketedSubDirPath);
        console.log(`子目录名称已修正: ${originalSubDirName} -> ${bracketedSubDirName}`);
    }

    const currentSubDirPath = bracketedSubDirPath;
    const prefix = bracketedSubDirName; // 用目录名作为前缀

    // 获取该目录下的所有文件
    const files = fs.readdirSync(currentSubDirPath).filter(file =>
        path.extname(file).toLowerCase() === ".json"
    );

    // 文件名转换规则（已提前定义）
    /* 已移除重复定义的transformFileName函数 */

    // 处理文件逻辑
    files.forEach(file => {
        const oldPath = path.join(currentSubDirPath, file);
        const newName = transformFileName(file, prefix);
        const newPath = path.join(targetDir, newName);

        // 替换二级目录文件处理逻辑
        processFile(oldPath, newPath, cTargetDir);

    });
});

// 新增函数：确保 scriptName 以 【夏瑾】 开头
function ensureScriptNamePrefix(jsonContent) {
    if (jsonContent.scriptName && !jsonContent.scriptName.startsWith(PREFIX)) {
        jsonContent.scriptName = `${PREFIX}` + jsonContent.scriptName;
    }
    return jsonContent;
}

// 判断是否是脚本规则类文件
function isScriptRuleFile(jsonContent) {
    return (
        jsonContent.scriptName &&
        jsonContent.hasOwnProperty('findRegex') &&
        jsonContent.hasOwnProperty('replaceString') &&
        jsonContent.id !== undefined
    );
}


// 遍历文件并进行处理
const rootFiles = fs.readdirSync(sourceDir).filter(file =>
    path.extname(file).toLowerCase() === ".json"
);

rootFiles.forEach((file) => {
    const oldPath = path.join(sourceDir, file);
    const newName = transformFileName(file, "");
    const newPath = path.join(targetDir, newName);

    // 检查新旧文件名是否相同
    if (oldPath === newPath) {
        console.log(`文件名未改变: ${file}`);
        return;
    }

    // 替换根目录文件处理逻辑
    processFile(oldPath, newPath, cTargetDir);

});

console.log("文件名调整完成！");

// 新增业务逻辑：修复目标目录中的文件名
const targetFiles = fs.readdirSync(targetDir);
console.log(`开始修复目标目录中的 ${targetFiles.length} 个文件名`);

targetFiles.forEach((file) => {
    const oldPath = path.join(targetDir, file);

    // 修正文件名，删除多余的“夏瑾”以及重复的“【夏瑾】【夏瑾】”
    let newName = file.replace(new RegExp(`${ESCAPED_PREFIX}夏瑾`, 'g'), PREFIX);
    newName = newName.replace(new RegExp(`${ESCAPED_PREFIX}{2,}`, 'g'), PREFIX);

    const newPath = path.join(targetDir, newName);

    // 如果文件名未改变，则跳过
    if (oldPath === newPath) {
        console.log(`文件名无需修复: ${file}`);
        return;
    }

    try {
        // 重命名文件以修复文件名
        fs.renameSync(oldPath, newPath);
        console.log(`已修复文件名: ${file} -> ${newName}`);
    } catch (error) {
        console.error(`修复文件名失败: ${file} -> ${newName}`, error);
    }
});

console.log("目标目录文件名修复完成！");

// 新增函数：修复指定目录中的文件名
function fixDirectoryFilenames(dirPath, dirName) {
    const files = fs.readdirSync(dirPath);
    console.log(`开始修复 ${dirName} 中的 ${files.length} 个文件名`);

    files.forEach((file) => {
        const oldPath = path.join(dirPath, file);

        // 修正文件名，删除多余的“夏瑾”以及重复的“【夏瑾】【夏瑾】
        let newName = file.replace(new RegExp(`(${ESCAPED_PREFIX})+夏瑾`, 'g'), PREFIX);
        newName = newName.replace(new RegExp(`(${ESCAPED_PREFIX}){2,}`, 'g'), PREFIX);

        const newPath = path.join(dirPath, newName);

        // 如果文件名未改变，则跳过
        if (oldPath === newPath) {
            console.log(`文件名无需修复: ${file}`);
            return;
        }

        try {
            // 重命名文件以修复文件名
            fs.renameSync(oldPath, newPath);
            console.log(`${dirName} 文件名已修复: ${file} -> ${newName}`);
        } catch (error) {
            console.error(`${dirName} 修复文件名失败: ${file} -> ${newName}`, error);
        }
    });
}

// 修复 【预设】文件夹assets/OpenAI Settings 中的文件名
fixDirectoryFilenames(targetDir, path.basename(targetDir));

// 修复 【正则】文件夹regex 中的文件名
if (fs.existsSync(cTargetDir)) {
    fixDirectoryFilenames(cTargetDir, path.basename(cTargetDir));
}

// 新增函数：修复 【正则】文件夹regex 中所有 JSON 文件的 scriptName
// 在脚本最后新增：将 【预设】文件夹assets/OpenAI Settings 中的脚本规则类文件移动到 【正则】文件夹regex
// 在脚本末尾调用双重修复
function removeDuplicatePrefixes() {
    const dirsToCheck = [targetDir, cTargetDir].filter(dir => fs.existsSync(dir));

    dirsToCheck.forEach(dir => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const oldPath = path.join(dir, file);
            if (path.extname(file).toLowerCase() !== ".json") return;

            let newName = file.replace(new RegExp(`(${ESCAPED_PREFIX})+`, 'g'), PREFIX);
            const newPath = path.join(dir, newName);

            // 新增：始终使用最新路径
            const currentPath = fs.existsSync(newPath) ? newPath : oldPath;

            if (newName !== file) {
                try {
                    fs.renameSync(oldPath, newPath);
                    console.log(`双重修复: ${file} -> ${newName}`);
                } catch (error) {
                    console.error(`双重修复失败: ${file} -> ${newName}`, error);
                }
            }

            // 修改：使用currentPath进行scriptName修复
            if (dir === cTargetDir) {
                try {
                    const data = fs.readFileSync(currentPath, 'utf8');
                    let jsonContent = JSON.parse(data);
                    jsonContent = ensureScriptNamePrefix(jsonContent);
                    fs.writeFileSync(currentPath, JSON.stringify(jsonContent, null, 2), 'utf8');
                } catch (e) {
                    console.error(`强制修复scriptName失败: ${file}`, e);
                }
            }
        });
    });
}

// 在脚本末尾调用双重修复
removeDuplicatePrefixes();

// 符合核心js:"script/star.js"对于返回参数的格式要求
module.exports = 1
