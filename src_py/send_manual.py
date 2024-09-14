# outlookを立ち上げて，手動でメール送信．宛先，本文は自動入力

import win32com.client
from dotenv import load_dotenv
import os
import json
import datetime

today = datetime.date.today()
today_str = today.strftime("(%Y/%m/%d)")

load_dotenv("./.env")
OFFICE365_ADDRESS = os.getenv('OFFICE365_ADDRESS')
OFFICE365_PASSWORD = os.getenv('OFFICE365_PASSWORD')
TO_ADDRESS = os.getenv('TO_ADDRESS')
BELONGS = os.getenv('BELONGS')
USER_NAME = os.getenv('USER_NAME')
USER_MAJOR = os.getenv('USER_MAJOR')
JSON_FILE_PATH = os.getenv('JSON_FILE_PATH')

def set_mail():
    outlook = win32com.client.Dispatch("Outlook.Application")
    mail = outlook.CreateItem(0)
    mail.to = OFFICE365_ADDRESS
    mail.subject = '本日の進捗について'+today_str
    mail.bodyFormat = 1
    return mail

def get_title(todos):
    return [f"{todo['title']}\n" for todo in todos]
def get_memos(todos):
    return "\n\n".join([f"{todo['title']}\nメモ:\n{todo['description']}" for todo in todos])

def make_mail_body(json_data):
    kanryo = [todo for todo in json_data if todo["done"] == True]
    zissityu = [todo for todo in json_data if todo["done"] == False]
    kanryo_title = get_title(kanryo)
    zissityu_title = get_title(zissityu)
    kanryo_memo = get_memos(kanryo)
    zissityu_memo = get_memos(zissityu)

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
    body += "\n\n\n"
    body += "---\n"
    body += USER_MAJOR + "\n"
    body += BELONGS + " " + USER_NAME + "\n"
    body += "<" + OFFICE365_ADDRESS + ">\n"

    return body

    
def get_todos(json_path):
    try:
        with open(json_path, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        return data
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None
    

def main():
    mail = set_mail()
    json_data = get_todos(JSON_FILE_PATH)
    mail_body = make_mail_body(json_data)
    mail.body = mail_body

    mail.display(True)


if __name__ == "__main__":
    main()