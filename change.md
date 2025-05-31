# change.js来自Haruki JSON 维护工具

这是一个用于维护 [Haruki](https://discord.com/channels/1134557553011998840/1353870378128244791) 大佬相关 JSON 配置文件的工具。该工具可以复制和移动特定格式的 JSON 文件，并对文件名和内容进行标准化处理，确保文件结构清晰、统一。

## 📦 安装方法

1. 确保你已经安装了 [Node.js](https://nodejs.org/)（建议使用 v22.14.0 或更高版本）。
2. 克隆项目到本地：

   ```bash
   git clone https://github.com/saltplay/haruki_optimizer
   cd haruki-json-tool
   ```

3. 安装依赖（如果有的话）：

   ```bash
   npm install
   ```

## 🚀 使用方法

1. 将需要处理的 JSON 文件放入 `a_assets` 文件夹。
2. 运行主脚本：

   ```bash
   node start.js
   ``

   &&或者点击start.bat（Windows）start.sh（Linux/MacOS）

3. 工具会自动将符合条件的 JSON 文件复制到 `b_assets`，并将「预设」文件移动到 `c_assets`。

4. 最终输出结果可在 `b_assets` 和 `c_assets` 文件夹中查看。

## 🔧 设计思路与功能说明

### 1. 目录结构

- `a_assets`: 存放原始 JSON 文件。
- `b_assets`: 存放已处理的 JSON 文件，其中非「预设」文件会被保留。
- `c_assets`: 存放所有识别为「正则」的 JSON 文件。

### 2. 主要逻辑

- **复制操作**：从 `a_assets` 到 `b_assets` 是复制，以保留原始文件。
- **移动操作**：从 `b_assets` 到 `c_assets` 是移动，只处理符合「正则」的 JSON 文件。
- **文件名清洗**：自动去除重复的 `【夏瑾】` 字符串，并统一命名格式。
- **字段修复**：在 `c_assets` 中，所有 JSON 文件的 `scriptName` 字段都会被检查并添加 `【夏瑾】` 前缀。

### 3. 脚本主要功能

- 自动化分类 JSON 文件。
- 提供统一的命名规范和字段格式。
- 支持扩展，方便后续增加更多处理规则。

#### JavaScript脚本说明

- **change.js**: 负责复制和移动文件以及目录结构的创建和验证。
- **json_compression.js**: 实现JSON文件内容的压缩处理。
- **start.js**: 作为主脚本，按顺序执行配置文件中列出的所有脚本。

## 💖 鸣谢

感谢 [Haruki](https://discord.com/channels/1134557553011998840/1353870378128244791) 的开源精神和贡献，这个工具是专门为适配他的 JSON 结构而设计的。

此外，感谢 [Lingma](https://lingma.aliyun.com/) 智能编程助手，在开发过程中提供了强大支持和代码优化建议.

## 📌 总结

`haruki_helper` 项目的初衷是一键完成 Haruki 大佬的破限/正则部署，使得萌新可以直接开始玩耍，享受 Haruki 及其他大佬的技术成果。该项目保证没有安装任何依赖，也不会注册任何内容，卸载后不会留下残留文件。
