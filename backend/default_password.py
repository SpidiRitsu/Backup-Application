import sys
from config import Config
import requests

if __name__ == '__main__':
  new_password = 'IS2017'

  headers = {
    "Token": Config.CRON_TOKEN,
  }

  r = requests.patch(f'http://127.0.0.1:5000/user?id=1&username=root&password={new_password}', headers=headers)
  
  if r.status_code == 200:
    print('Password for root user was updated!')
  else:
    print(r.__dict__)
    print('An error occured! Read message above for more information...')