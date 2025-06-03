# haruki_helper

## 安装

1. 确保你已经安装了 [SillyTavern](https://github.com/SillyTavern/SillyTavern)
2. 本项目不区分系统，全平台通用

     ```bash
     git clone https://github.com/saltplay/haruki_helper.git && cd haruki_helper && npm start
     ```

3. 如果一次没有成功,请输入以下启动命令

     ```bash
     npm start
     ```

4. 一定不要反复输入安装指令!!!因为他会反复在更深的路径创建文件夹,而不会保留旧的配置.启动命令则是会保留配置项

5. 安装完成之后,记得刷新酒馆,让酒馆加载部署好的【夏瑾】预设/破限

---

## 更新

1. 确保你已经安装了haruki_helper
2. 输入以下命令

     ```bash
     git pull
     ```

---

## 卸载

1. 确保你已经安装了haruki_helper
2. Windows/mac, 直接在 资源管理器/访达 卸载掉整个haruki_helper文件夹.
3. Linux可以自行卸载haruki_helper文件夹,或者使用以下命令

     ```bash
     cd .. && rm -rf haruki_helper
     ```

   或者你可以自行来到haruki_helper的父目录,运行以下命令

     ```bash
     rm -rf haruki_helper
     ```

---

## 运行逻辑

1. **配置驱动**：所有路径通过`config.json`集中管理
2. **文件处理**：`fileProcessor.js`负责文件重命名、格式转换和目录整理
3. **清理机制**：`rm*.sh`系列脚本实现目录内容清除
4. **格式规范**：通过正则表达式统一文件命名规则
5. **动态适配**：支持前缀配置自动更新（自动补全【】符号）

---

## 项目思路

采用模块化设计实现以下目标：

- **可维护性**：配置与逻辑分离，修改路径只需改配置文件
- **易用性**：提供一键式脚本操作，降低使用门槛
- **灵活性**：通过脚本组合实现多种清理策略
- **健壮性**：自动处理路径异常和配置错误
- **可扩展性**：预留目录结构支持未来功能扩展

---

## 开发计划

### Web GUI开发

我们计划开发一个现代化的Web界面来提升用户体验，主要特性包括：

- 可视化配置编辑器（支持实时预览配置效果）
- 拖拽式文件处理界面
- 实时日志监控面板
- 主题切换功能（暗色/亮色模式）
- 多语言支持框架

### 技术选型

- 前端：React + Tailwind CSS
- 后端：Node.js Express
- 跨平台：Electron.js打包

### 参与方式

欢迎有兴趣的开发者参与GUI开发：

1. 查看[issue#web-gui](https://github.com/saltplay/haruki_helper/issues/web-gui)获取当前任务
2. 加入Discord频道讨论设计原型
3. 提交PR时请遵循[贡献指南](CONTRIBUTING.md)

---

## 核心JS功能说明

- `fileProcessor.js`：主处理逻辑，实现文件重命名、格式转换和目录整理
- `json_compression.js`：JSON文件压缩工具
- `script/systemCheck.js`：系统环境检测
- `script/pathCheck.js`：路径有效性验证
- `script/updateAssetsPaths.js`：资源路径同步更新
- `script/copyFiles.js`：文件复制工具
- `regexExtractor.js`：正则表达式提取器

---

## 鸣谢

  > [点此查看 haruki 大佬的发布地址](https://discord.com/channels/1134557553011998840/1353870378128244791)

  对原作品的名称进行了修改(用来符合正则插件的规范),但是没有修改原作品的内容

---

## 免责声明（叠甲）

- 如果任何人因为这个项目，感受到冒犯/侵权，请立刻联系我，我得知后，会立刻删掉这个仓库(或者您有特别的需求，也可以要求我归档)。
- 如果有其她技术问题，请在issue留言
- 留言请规范格式
- 但是我基本不会在线，所以没有受理也不要失望
- 正则和破限规则的版权属于 haruki，k一串大佬 大佬
