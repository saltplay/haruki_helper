#!/bin/bash

# 定义要删除的目录（相对于脚本所在目录）
dirs_to_clean=("assets/OpenAI Settings" "c_assets") # 将b_assets替换为assets/OpenAI Settings

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 遍历并清空每个目录
for dir in "${dirs_to_clean[@]}"; do
    target_dir="$SCRIPT_DIR/$dir"
    if [ -d "$target_dir" ]; then
        rm -rf "$target_dir"/*
        echo "已清空目录: $target_dir"
    else
        echo "目录不存在，跳过: $target_dir"
    fi
done
