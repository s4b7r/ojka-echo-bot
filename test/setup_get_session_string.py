from telethon import TelegramClient
from telethon.sessions import StringSession
from dotenv import dotenv_values
from pathlib import Path


test_root = Path(__file__)
config = dotenv_values(test_root / '..' / '.env')
api_id = config.get('TELEGRAM_APP_API_ID')
api_hash = config.get('TELEGRAM_APP_API_HASH')

with TelegramClient(StringSession(), api_id, api_hash) as client:
    print('Session string:', client.session.save())
