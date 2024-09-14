import smtplib
from email import message
from dotenv import load_dotenv
import os
import json
import datetime

today = datetime.date.today()
today_str = today.strftime("(%Y/%m/%d)")

load_dotenv("./.env")
TODOS_JSON_PATH = os.getenv('TODOS_JSON_PATH')
OFFICE365_ADDRESS = os.getenv('OFFICE365_ADDRESS')
OFFICE365_PASSWORD = os.getenv('OFFICE365_PASSWORD')
TO_ADDRESS = os.getenv('TO_ADDRESS')
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = os.getenv('SMTP_PORT')
BELONGS = os.getenv('BELONGS')
USER_NAME = os.getenv('USER_NAME')
USER_MAJOR = os.getenv('USER_MAJOR')
JSON_FILE_PATH = os.getenv('JSON_FILE_PATH')

smtp_server = SMTP_SERVER
smtp_port = SMTP_PORT
from_address = OFFICE365_ADDRESS
sender_password = OFFICE365_PASSWORD
# 実験用
to_address = OFFICE365_ADDRESS

def set_mail():
    message = message.EmailMessage()
    message["From"] = OFFICE365_ADDRESS
    message["To"] = OFFICE365_ADDRESS
    message["Subject"] = "テストメール"
    #message["Subject"] = "本日の進捗について"+today_str
    return message

def send_mail(message):
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.set_debuglevel(1)
            server.starttls()
            server.login(OFFICE365_ADDRESS, OFFICE365_PASSWORD)
            
            server.send_message(message)
            print("Successfully sent the mail")
    except Exception as e:
        print(f"error: {e}")

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
    body += "\n\n"
    body += "---\n"
    body += USER_MAJOR + "\n"
    body += BELONGS + " " + USER_NAME + "\n"
    body += "<" + OFFICE365_ADDRESS + ">\n"

    return body

def get_todos():
    try:
        with open(TODOS_JSON_PATH, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        return data
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None
    
def get_todos(json_path):
    try:
        with open(json_path, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        return data
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None
    

def main():
    message = set_mail()
    json_data = get_todos(JSON_FILE_PATH)
    mail_body = make_mail_body(json_data)

    message.set_content(mail_body, subtype="plain")
    send_mail(message)


if __name__ == "__main__":
    main()