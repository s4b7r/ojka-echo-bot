from telethon.tl.custom.conversation import Conversation
from telethon.tl.custom.message import Message
from .fixtures import *
import random
import string


def random_string(length=16):
    return ''.join(random.choice(string.ascii_letters) for _ in range (length))


async def test_1(conv: Conversation, anyio_backend):
    random_input = random_string()

    await conv.send_message(random_input)
    echo: Message = await conv.get_response()

    assert random_input == echo.text
