import pytest
from telethon import TelegramClient
from telethon.sessions import StringSession
from telethon.tl.custom.conversation import Conversation
from . import config


@pytest.fixture(scope='session')
def anyio_backend():
    return 'asyncio'


@pytest.fixture(scope='session')
async def telegram_client(anyio_backend):
    api_id = int(config.get('TELEGRAM_APP_API_ID'))
    api_hash = config.get('TELEGRAM_APP_API_HASH')
    session_str = config.get('TELEGRAM_APP_SESSION_STRING')

    client = TelegramClient(
        StringSession(session_str), api_id, api_hash, sequential_updates=True
    )
    await client.connect()
    if not await client.is_user_authorized():
        raise RuntimeError('The session string is invalid or expired.')

    await client.get_me()
    await client.get_dialogs()

    yield client

    await client.disconnect()
    await client.disconnected


@pytest.fixture(scope='session')
async def conv(telegram_client, anyio_backend) -> Conversation:
    async with telegram_client.conversation(
        config.get('BOT_NAME'), timeout=10, max_messages=10000
    ) as conv:
        conv: Conversation

        await conv.send_message('Wake up')
        await conv.get_response()
        yield conv
