import json
import os
from dotenv import load_dotenv

load_dotenv("./.env")

def main():
    json_file_path = os.getenv('TODOS_JSON_PATH')
    if not json_file_path:
        print("Error: TODOS_JSON_PATH not set in .env file")
        return

    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        
        # send mail
        
        filename = "./nippou/hogehoge.json"
        with open(os.path.join(os.getcwd(), filename), 'w') as json_file:
            json.dump(data, json_file, indent=4)

        print("Successfully updated the JSON file")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
