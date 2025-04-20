import subprocess
import os


def compress_json_with_jq(input_path):
    # 检查输入文件是否存在
    if not os.path.exists(input_path):
        print(f"错误: 文件 {input_path} 不存在。")
        return
    if os.path.isfile(input_path) and input_path.lower().endswith('.json'):
        try:
            # 构建 jq 命令，将结果输出到临时文件
            temp_file = input_path + ".tmp"
            command = f'jq -c "." "{input_path}" > "{temp_file}"'
            subprocess.run(command, shell=True, check=True)

            # 覆盖原文件
            os.replace(temp_file, input_path)
            print(f"JSON 文件 {input_path} 已成功压缩并覆盖原文件。")
        except subprocess.CalledProcessError as e:
            print(f"执行 jq 命令时出错: {e}")
            # 删除临时文件
            if os.path.exists(temp_file):
                os.remove(temp_file)
        except Exception as e:
            print(f"发生未知错误: {e}")
    elif os.path.isdir(input_path):
        # 处理文件夹中的所有 JSON 文件
        for root, dirs, files in os.walk(input_path):
            for file in files:
                if file.lower().endswith('.json'):
                    file_path = os.path.join(root, file)
                    try:
                        # 构建 jq 命令，将结果输出到临时文件
                        temp_file = file_path + ".tmp"
                        command = f'jq -c "." "{file_path}" > "{temp_file}"'
                        subprocess.run(command, shell=True, check=True)

                        # 覆盖原文件
                        os.replace(temp_file, file_path)
                        print(f"JSON 文件 {file_path} 已成功压缩并覆盖原文件。")
                    except subprocess.CalledProcessError as e:
                        print(f"执行 jq 命令时出错，文件: {file_path}, 错误信息: {e}")
                        # 删除临时文件
                        if os.path.exists(temp_file):
                            os.remove(temp_file)
                    except Exception as e:
                        print(f"发生未知错误，文件: {file_path}, 错误信息: {e}")
    else:
        print(f"错误: {input_path} 不是有效的 JSON 文件或文件夹。")


if __name__ == "__main__":
    input_path = input("请输入要压缩的 JSON 文件或文件夹的路径: ")
    compress_json_with_jq(input_path)
    