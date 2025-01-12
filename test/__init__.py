from dotenv import dotenv_values
from pathlib import Path


test_root = Path(__file__)
config = dotenv_values(test_root / '..' / '.env')
