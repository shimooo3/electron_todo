import json
import os

# 保存するデータ
data = {
    "name": "Example",
    "tasks": [
        {"id": 1, "task": "Task 1", "completed": False},
        {"id": 2, "task": "Task 2", "completed": True}
    ]
}

# 保存するJSONファイルの名前
filename = "./src_py/tasks.json"

# カレントディレクトリに保存
with open(os.path.join(os.getcwd(), filename), 'w') as json_file:
    json.dump(data, json_file, indent=4)
