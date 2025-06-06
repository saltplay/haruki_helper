const fs = require("fs");
const path = require("path");

// 使用 __dirname 获取当前脚本路径
const scriptDir = __dirname;

// 引入配置文件
const config = require("../config.json");

// 从配置文件获取前缀
let PREFIX = config.prefix;
// 增强逻辑：检查并自动补充中文括号
if (PREFIX && typeof PREFIX === 'string' && !/^【.*】$/.test(PREFIX)) {
    PREFIX = `【${PREFIX}】`;
    // 将更新后的prefix写回配置文件
    config.prefix = PREFIX;
    fs.writeFileSync(
        path.join(scriptDir, 'config.json'),
        JSON.stringify(config, null, 2),
        'utf8'
    );
}
const ESCAPED_PREFIX = PREFIX.replace(/[$()\[\]{}]/g, '\\$&');

// 明确定义项目根目录
const projectRoot = path.join(__dirname, '..'); // 从 script 目录上溯到项目根目录

// 使用项目根目录定义路径
const sourceDir = path.join(projectRoot, config.input_for_fileProcessor);
const targetDir = path.join(projectRoot, config['OpenAI Settings']);
const cTargetDir = path.join(projectRoot, config.regex);

// 验证源目录是否存在
if (!fs.existsSync(sourceDir)) {
    console.error(`源目录不存在: ${sourceDir}`);
    process.exit(1);
}

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, {recursive: true});
    console.log(`目标目录已创建: ${targetDir}`);
} else {
    console.log(`目标目录已存在: ${targetDir}`);
}

// 新增：确保 【正则】文件夹regex文件夹cassets 目录存在
if (!fs.existsSync(cTargetDir)) {
    fs.mkdirSync(cTargetDir, {recursive: true});
    console.log(`【正则】文件夹regex 目录已创建: ${cTargetDir}`);
} else {
    console.log(`【正则】文件夹regex 目录已存在: ${cTargetDir}`);
}

// 获取源目录中的所有文件
const files = fs.readdirSync(sourceDir);
console.log(`找到 ${files.length} 个文件`);

// 定义文件名转换规则
function transformFileName(name) {
    // 去除扩展名
    const baseName = path.basename(name, ".json");

    // 替换空格和特殊字符
    let newName = baseName
        .replace(/\s+/g, "")
        .replace(/-Beta\s+(\d+)/, "-Beta$1")
        .replace(/V(\d+\.\d+)/, "V$1")
        .replace(/\$\d+$/, "") // 删除结尾的 [数字]
        .replace(/\$\d+$/, "") // 新增：删除结尾的 (数字)
        .replace(/\(\d+\)/g, ""); // 新增：删除所有位置的 (数字)

    // 添加前缀并重新添加扩展名
    newName = `${PREFIX}${newName}.json`;

    // 修复：删除多余的“夏瑾”字符串（使用转义前缀）
    newName = newName.replace(new RegExp(`${ESCAPED_PREFIX}夏瑾`, 'g'), PREFIX);

    // 新增：修复重复的“【夏瑾】【夏瑾】”（使用转义前缀）
    newName = newName.replace(new RegExp(`${ESCAPED_PREFIX}{2,}`, 'g'), PREFIX);

    return newName;
}

// 新增函数：确保 scriptName 以 【夏瑾】 开头
function ensureScriptNamePrefix(jsonContent) {
    if (jsonContent.scriptName && !jsonContent.scriptName.startsWith(PREFIX)) {
        jsonContent.scriptName = `${PREFIX}` + jsonContent.scriptName;
    }
    return jsonContent;
}

// 判断是否是脚本规则类文件
function isScriptRuleFile(jsonContent) {
    return jsonContent.scriptName && jsonContent.findRegex && jsonContent.replaceString !== undefined && jsonContent.id;
}

// 遍历文件并进行处理
files.forEach((file) => {
    if (path.extname(file).toLowerCase() === ".json") {
        const oldPath = path.join(sourceDir, file);
        const newName = transformFileName(file);
        const newPath = path.join(targetDir, newName);

        // 检查新旧文件名是否相同
        if (oldPath === newPath) {
            console.log(`文件名未改变: ${file}`);
            return;
        }

        try {
            // 复制文件（原逻辑为移动）
            fs.copyFileSync(oldPath, newPath);
            console.log(`已复制: ${file} -> ${newName}`);

            // 新增：读取 JSON 内容以判断是否是脚本规则类文件
            const data = fs.readFileSync(newPath, 'utf8');
            let jsonContent;
            try {
                jsonContent = JSON.parse(data);
            } catch (e) {
                console.error(`解析JSON失败: ${newPath}`, e);
                return;
            }

            // 判断是否是脚本规则类文件（根据 scriptName、findRegex 和 replaceString 字段）
            if (isScriptRuleFile(jsonContent)) {
                const cNewPath = path.join(cTargetDir, newName);
                // 修改：将复制改为移动操作
                fs.renameSync(newPath, cNewPath);
                console.log(`已移动到 【正则】文件夹regex: ${newName}`);
            }

        } catch (error) {
            console.error(`复制文件失败: ${file} -> ${newName}`, error);
        }
    }
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

        // 修正文件名，删除多余的“夏瑾”以及重复的“【夏瑾】【夏瑾】”
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
function fixCAssetsScriptNames() {
    const cFiles = fs.readdirSync(cTargetDir);
    console.log(`开始修复 【正则】文件夹regex 中的 ${cFiles.length} 个 JSON 文件的 scriptName`);

    cFiles.forEach((file) => {
        const filePath = path.join(cTargetDir, file);
        if (path.extname(file).toLowerCase() !== ".json") return;

        // 读取 JSON 内容
        const data = fs.readFileSync(filePath, 'utf8');
        let jsonContent;
        try {
            jsonContent = JSON.parse(data);
        } catch (e) {
            console.error(`解析JSON失败: ${filePath}`, e);
            return;
        }

        // 确保 scriptName 以 【夏瑾】 开头
        jsonContent = ensureScriptNamePrefix(jsonContent);

        // 写回文件
        fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2), 'utf8');
        console.log(`已修复 scriptName: ${file}`);
    });
}

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
