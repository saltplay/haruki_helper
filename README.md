# haruki_helper

> **重要通知**：项目即将推出基于Git的预设/正则管理功能重大更新，当前教程未对现有功能做详细说明是正常现象，所有核心功能均能正常使用。请放心使用并关注后续更新日志。

## 项目简介

haruki_helper 是一个专为 SillyTavern 设计的预设/正则文件批量处理工具，提供文件重命名、格式转换、目录整理等功能的一站式解决方案。

## 功能特性

1. 批量处理预设/正则文件
2. 文件重命名与格式转换
3. 目录结构自动整理
4. 支持正则表达式命名规范
5. 自动补全【】符号前缀，符合标签化脚本要求的命名规范

## 系统要求

- Node.js v18+
- npm 或 yarn 包管理器
- SillyTavern 运行环境

## 安装指南

1. 确保已安装 [SillyTavern](https://github.com/SillyTavern/SillyTavern)
2. 全平台通用安装命令：
   ```bash
   git clone https://github.com/saltplay/haruki_helper.git && cd haruki_helper && npm install
   ```
3. 启动项目：

   ```bash
   npm start
   ```

## 使用说明

1. 一键安装脚本会自动完成初始配置
2. 后续启动方式：
    - Windows: 双击 `start.bat`
    - macOS/Linux: 运行 `./start.sh`
3. 配置更新后请刷新 SillyTavern 加载新设置

## 目录结构

```
├── assets              # 资源文件
├── input_for_fileProcessor # 输入文件处理目录
├── regex               # 正则规则文件
├── script              # 核心脚本目录
├── config.json         # 主配置文件
└── README.md         # 本文件
```

## 配置说明

通过 `config.json` 实现路径集中管理，支持以下配置项：

- 文件存储路径
- 正则规则前缀
- 系统环境参数

## 核心模块

- `fileProcessor.js`: 文件处理核心逻辑
- `systemCheck.js`: 系统环境检测
- `pathCheck.js`: 路径有效性验证
- `json_compression.js`: JSON文件压缩工具

## 开发计划

### Web GUI开发

- 可视化配置编辑器（实时预览）
- 拖拽式文件处理界面

### 技术选型

- 前端：React + Tailwind CSS
- 后端：Node.js Express
- 跨平台：Electron.js打包

## 更新维护

```bash
git pull origin main  # 获取最新更新
```

## 卸载方法

- Windows/macOS: 删除整个项目文件夹
- Linux: 执行 `rm -rf haruki_helper`

## 版权声明

> [预设/正则作者 haruki 地址](https://discord.com/channels/1134557553011998840/1353870378128244791)

> [预设/正则作者 kitsch 地址](https://discord.com/channels/1134557553011998840/1339853575295209482)

> [标签化脚本作者 青空莉想做舞台少女的狗 地址](https://discord.com/channels/1291925535324110879/1344362686900605043)

## 免责声明

本项目不包含任何侵权内容，若存在争议请及时联系删除。正则和破限规则版权属于原作者 haruki 和 k一串大佬。
