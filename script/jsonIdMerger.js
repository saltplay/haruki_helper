const fs = require("fs");
const path = require('path');

// 读取config.json获取regex路径
const projectRoot = path.join(__dirname, '..'); // 确保 projectRoot 指向项目根目录
const configPath = path.join(projectRoot, 'config.json');
const rawConfig = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(rawConfig);

// 修正路径拼接方式
const regexDir = path.join(projectRoot, config.regex);

// 读取目录内容
const files = fs.readdirSync(regexDir);

// 收集所有id
const ids = [];

// 遍历每个JSON文件
files.forEach(file => {
    const filePath = path.join(regexDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // 检查id字段是否存在
    if (data.id) {
        ids.push({file, id: data.id});
    }
});

// 读取运行时配置
let runtimeConfig;
try {
    const configContent = fs.readFileSync(path.join(projectRoot, 'runtime_config.json'), 'utf-8');
    // 移除JSON中的注释和非法逗号
    const sanitizedContent = configContent
        .replace(/\/\*[^*]*\*+([^\/*][^*]*\*+)*\//g, '')
        .replace(/([^:]\s*)\/\/.*$/gm, '$1')
        .replace(/,\s*(?=\})/g, '')
        .replace(/,\s*(?=\])/g, '');

    runtimeConfig = JSON.parse(sanitizedContent);
} catch (error) {
    console.error(`无法读取runtime_config.json: ${error.message}`);
    process.exit(1);
}

const settingsPath = runtimeConfig.paths?.settings || './settings.json';

// 读取当前设置
let settings;
try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
} catch (error) {
    console.error(`settings.json解析失败: ${error.message}`);
    console.log('将使用默认结构继续执行');
    settings = {extension_settings: {regex: []}};
}

// 创建id到索引的映射
const settingsMap = new Map();
settings.extension_settings.regex.forEach((item, index) => {
    if (item.id) settingsMap.set(item.id, index);
});

// 合并数据并记录冲突
const conflicts = [];
ids.forEach(({file, id}) => {
    const filePath = path.join(regexDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (settingsMap.has(id)) {
        // 替换已有条目
        conflicts.push({
            id,
            oldFile: settings.extension_settings.regex[settingsMap.get(id)].scriptName,
            newFile: content.scriptName
        });
        settings.extension_settings.regex[settingsMap.get(id)] = content;
    } else {
        // 添加新条目
        settings.extension_settings.regex.push(content);
    }
});

// 按scriptName排序
settings.extension_settings.regex.sort((a, b) => {
    const nameA = a.scriptName || '';
    const nameB = b.scriptName || '';
    return nameA.localeCompare(nameB);
});

// 写回文件
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');

// 打印结果
console.log('提取到的ID列表：');
ids.forEach(({file, id}) => {
    console.log(`${file}: ${id}`);
});

console.log('\n冲突记录：', conflicts.length ? conflicts : '无');

// 符合核心js:"script/star.js"对于返回参数的格式要求
module.exports = 1
