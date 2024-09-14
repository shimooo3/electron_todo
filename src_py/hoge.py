import json
import os
from dotenv import load_dotenv

load_dotenv("./.env")
BELONGS = os.getenv('BELONGS')
USER_NAME = os.getenv('USER_NAME')
USER_MAJOR = os.getenv('USER_MAJOR')
OFFICE365_ADDRESS = os.getenv('OFFICE365_ADDRESS')

def get_title(todos):
    return [f"{todo['title']}\n" for todo in todos]
def get_memos(todos):
    return "\n\n".join([f"{todo['title']}\nメモ:\n{todo['description']}" for todo in todos])

def make_mail_body(kanryo_title, zissityu_title, kanryo_memo, zissityu_memo):
    body = BELONGS + "の皆様"
    body += "\n\n"
    body += BELONGS + "の" + USER_NAME + "です。\n"
    body += "本日の進捗を共有させていただきます。\n\n"
    body += "------実施中，完了，------\n"
    body += "【実施中】\n"
    body += "".join(zissityu_title)
    body += "\n【完了】\n"
    body += "".join(kanryo_title)
    body += "--------------------------\n\n"
    body += "Memo:"
    body += "".join([kanryo_memo, zissityu_memo])
    body += "\n\n"
    body += "---\n"
    body += USER_MAJOR + "\n"
    body += BELONGS + " " + USER_NAME + "\n"
    body += "<" + OFFICE365_ADDRESS + ">\n"


    return body

def main():
    json_file_path = os.getenv('TODOS_JSON_PATH')
    if not json_file_path:
        print("Error: TODOS_JSON_PATH not set in .env file")
        return

    try:
        with open(json_file_path, 'r', encoding='utf-8') as json_file:
            json_data = json.load(json_file)
        
        kanryo = [todo for todo in json_data if todo["done"] == True]
        zissityu = [todo for todo in json_data if todo["done"] == False]

        kanryo_title = get_title(kanryo)
        zissityu_title = get_title(zissityu)
        kanryo_memo = get_memos(kanryo)
        zissityu_memo = get_memos(zissityu)

        mail_body = make_mail_body(kanryo_title, zissityu_title, kanryo_memo, zissityu_memo)

        
        filename = "../nippou/hogehoge.txt"
        with open(os.path.join(os.getcwd(), filename), 'w', encoding='utf-8') as txt_file:
            txt_file.write(json.dumps(mail_body, ensure_ascii=False, indent=4))

        print("Successfully updated the JSON file")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
