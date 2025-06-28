# haruki_helper

## 可以做什么？

### 自动安装/更新 预设/正则，赋予【标签化】

无感知.为您自动更新最新的 预设/正则,解放您宝贵的时间

haruki_helper 是一个专为 [SillyTavern](https://github.com/SillyTavern/SillyTavern) 设计的预设/正则文件批量处理工具，提供定位SillyTavern、文件重命名、格式转换、目录整理、文件分类处理、文件粘贴、json正则写入、可扩展、模块化等功能的一站式解决方案。

## 安装

### 前置条件

确保 [SillyTavern](https://github.com/SillyTavern/SillyTavern)可以运行

### 安装并启动

全平台通用，安装并启动命令：

```bash
git clone https://github.com/saltplay/haruki_helper.git && cd haruki_helper && npm start
```

## 单纯安装

```bash
git clone https://github.com/saltplay/haruki_helper.git
```

## 使用说明

### 直接使用

1. 其他启动方式：
2. - Windows: 双击 `start.bat`
   - macOS/Linux: 运行 `./start.sh`
3. 配置更新后请刷新 SillyTavern 加载新设置

### 进阶使用-从命令行启动

cd 到 haruki_helper 目录下,执行以下命令

```bash
npm start
```

### 进阶使用-集成到脚本中（推荐）

单次运行（singleRun）的命令

```bash
npm run singleRun --prefix /xxx/haruki_helper
```

集成到启动脚本的示例(抛砖引玉,您想要怎么写都可以,根据您的系统来,萌新可以问ai求教)

```bash
npm run singleRun --prefix /xxx/haruki_helper && /xxx/SillyTavern/UpdateAndStart.bat 
```

也可以集成到维护SillyTavern的脚本.

您可以让ai帮助您生成脚本,让您的SillyTavern娱乐更加灵活自由.

### 进阶使用-修改仓库

- 修改预设/正则源：
  
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

如果您不满足于鄙人维护的 预设/正则 仓库,希望用更新/更潮的预设/正则
您可以自行添加
仓库配置格式：根文件下放置所有文件.
就是这么简单.
如果您乐意分享的话,完全可以让更多人使用您维护的 预设/正则 仓库.

## 更新本项目

一般不需要更新.

```
# 获取最新更新
$ git reset --hard && git pull origin main
```

## 卸载方法

- Windows/macOS: 删除整个项目文件夹
- Linux: 删除整个项目文件夹(可以在父目录执行 `rm -rf haruki_helper`)

所有的文件和脚本都在 `haruki_helper` 文件夹中,不用担心残留文件

## 版权声明

> [预设/正则作者 haruki 地址](https://discord.com/channels/1134557553011998840/1353870378128244791)已授权

> [预设/正则作者 kitsch 地址](https://discord.com/channels/1134557553011998840/1339853575295209482)已授权

> [标签化脚本作者 青空莉想做舞台少女的狗 地址](https://discord.com/channels/1291925535324110879/1344362686900605043)未使用其代码,仅相关

## 免责声明

本项目不包含任何侵权内容，均已得到作者本人授权，若存在争议请及时联系删除。
正则和破限规则版权属于原作者 haruki大佬 & kitsch大佬 。
标签化脚本版权属于 青空莉想做舞台少女的狗大佬。
二创请看[致开发者](other/致开发者.md)
对于文件删除等后果概不负责,请自行承担使用/修改本项目的后果
数据安全第一,请做好备份