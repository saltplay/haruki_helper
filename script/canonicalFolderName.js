// 加强目录名称处理逻辑，解决异常命名问题
const fs = require('fs');
const path = require('path');

// 工具函数：清理目录名
function cleanDirectoryName(name) {
    // 移除所有括号和特殊字符，保留字母数字和基本符号
    let cleaned = name.replace(/[\u3000\s【】\[\]]/g, '_');
    // 使用正则表达式移除其他非打印字符
    cleaned = cleaned.replace(/[^\x20-\x7E]/g, '');
    // 替换连续下划线为单个下划线
    cleaned = cleaned.replace(/_+/g, '_');
    // 移除首尾可能存在的下划线
    cleaned = cleaned.trim('_');
    // 如果名称为空则使用默认名称
    return cleaned || 'unnamed_folder';
}


// 工具函数：验证目录名是否符合规范
function isValidDirectoryName(name) {
    // 严格验证格式：必须以【开头和】结尾，中间不含其他括号
    return /^【[^【】]*】$/.test(name);
}

// 1. 读取配置文件
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
const sourceDir = path.join(__dirname, '..', config.input_for_fileProcessor);

// 2. 遍历检查二级目录
try {
    const items = fs.readdirSync(sourceDir, {withFileTypes: true});
    const dirs = items.filter(item => item.isDirectory());

    dirs.forEach(dirent => {
        const originalName = dirent.name;
        const fullPath = path.join(sourceDir, originalName);

        // 3. 处理异常目录名
        if (!isValidDirectoryName(originalName)) {
            // 清理并重建目录名
            const cleanedName = cleanDirectoryName(originalName);
            const newName = `【${cleanedName}】`;
            const newFullPath = path.join(sourceDir, newName);

            // 防止重复重命名
            if (originalName !== newName) {
                try {
                    fs.renameSync(fullPath, newFullPath);
                    console.log(`目录重命名成功: ${originalName} -> ${newName}`);
                } catch (error) {
                    console.error(`目录重命名失败: ${originalName}`, error);
                }
            } else {
                console.log(`目录格式已正确: ${originalName}`);
            }
        } else {
            console.log(`目录格式已正确: ${originalName}`);
        }
    });

} catch (error) {
    console.error('读取目录时发生错误:', error);
}

module.exports = 1;
