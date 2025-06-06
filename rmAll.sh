#!/bin/bash

# 进入脚本所在目录
cd "$(dirname "$0")"

# 从config.json读取路径配置

sourceDir=$(node -p "require('./config.json').input_for_fileProcessor")
targetDir=$(node -p "require('./config.json')['OpenAI Settings']")
cTargetDir=$(node -p "require('./config.json').regex")

# 定义要删除的目录（使用配置中的完整路径）
dirs_to_clean=("$sourceDir" "$targetDir" "$cTargetDir") # 可以添加更多目录

# 遍历并清空每个目录
for dir in "${dirs_to_clean[@]}"; do
    if [ -d "$dir" ]; then
        rm -rf "$dir"/*
        echo "已清空目录: $dir"
    else
        echo "目录不存在，跳过: $dir"
    fi
done
