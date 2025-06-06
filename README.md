# haruki_helper

## 项目简介

### 全自动安装预设/正则并符合【标签化】要求的通用工具

下面是自以为冗余的说法

haruki_helper 是一个专为 SillyTavern
设计的预设/正则文件批量处理工具，提供定位SillyTavern、文件重命名、格式转换、目录整理、文件分类处理、文件粘贴、json正则写入、可扩展、模块化等功能的一站式解决方案。

## 功能特性

1. 基于Git的预设/正则版本管理（支持第三方仓库集成）
2. 支持远程仓库同步与回滚
3. 批量处理预设/正则文件
4. 文件重命名与格式转换
5. 目录结构自动整理
6. 支持正则表达式命名规范
7. 自动补全【】符号前缀，符合标签化脚本要求的命名规范
8. 动态仓库配置管理（通过runtime_config.json配置git_repositories）
9. 多仓库并行同步与异常隔离处理

## 安装指南

1. 确保已安装 [SillyTavern](https://github.com/SillyTavern/SillyTavern)
2. 全平台通用，安装并启动命令：
   ```bash
   git clone https://github.com/saltplay/haruki_helper.git && cd haruki_helper && npm start
   ```

## 使用说明

1. 修改预设/正则源：
   - 编辑 runtime_config.json 中的 git_repositories 字段
   - 示例格式：
     ```json
     {
       "git_repositories": {
         "【云瑾】": "https://github.com/saltplay/yunjin",
         "【kemini】": "https://github.com/saltplay/kemini"
       }
     }
     ```
2. 启动项目的命令：
   ```bash
   npm start
   ```
3. 其他启动方式：
    - Windows: 双击 `start.bat`
    - macOS/Linux: 运行 `./start.sh`
4. 配置更新后请刷新 SillyTavern 加载新设置

## 目录结构

```
├── assets              # 预设文件
├── input_for_fileProcessor # 本地工作区
├── regex               # 正则规则文件
├── script              # 核心脚本目录
├── config.json         # 主配置文件
└── README.md         # 本文件
```

## 简述各个模块

- start.js: 根据config.json配置启动核心服务，主程序入口
- monitor.js: 文件系统监视器，自动重启崩溃脚本并记录日志
- LinuxRun.js: Linux系统守护进程管理器
- pathCheck.js: 多平台路径兼容性验证工具
- updateAssetsPaths.js: 动态更新资源引用路径
- copyFiles.js: 跨平台文件批量复制引擎
- jsonIdMerger.js: JSON数据ID智能合并工具
- systemCheck.js: 系统环境检测与兼容性报告
- ensureDirs.js: 基础目录结构维护工具，确保必要目录存在并符合规范
- canonicalFolderName.js: 二级目录名称规范化工具，自动补全【】符号前缀
- processScriptRuleFiles.js: 核心文件处理器，实现预设/正则文件智能分发、命名规范化、scriptName字段修复及重复前缀处理
- json_compression.js: JSON文件压缩优化工具
- syncProjects.js: Git仓库同步管理器，支持动态仓库配置、多仓库并行同步、异常自动恢复

## 开发计划

### Web GUI开发（进行中）

- Git版本控制可视化界面
- 拖拽式文件处理界面
- 实时预览与冲突检测

### 技术选型

- 前端：React + Tailwind CSS
- 后端：Node.js Express + Git库
- 跨平台：Electron.js打包

## 更新维护

```
# 获取最新更新
$ git reset --hard && git pull origin main

```

## 卸载方法

- Windows/macOS: 删除整个项目文件夹
- Linux: 执行 `rm -rf haruki_helper`

## 版权声明

> [预设/正则作者 haruki 地址](https://discord.com/channels/1134557553011998840/1353870378128244791)

> [预设/正则作者 kitsch 地址](https://discord.com/channels/1134557553011998840/1339853575295209482)

> [标签化脚本作者 青空莉想做舞台少女的狗 地址](https://discord.com/channels/1291925535324110879/1344362686900605043)

## 免责声明

本项目不包含任何侵权内容，均已得到作者本人授权，若存在争议请及时联系删除。
正则和破限规则版权属于原作者 haruki大佬 & kitsch大佬 。
标签化脚本版权属于 青空莉想做舞台少女的狗大佬。
