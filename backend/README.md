# Backend

Backend is based on python 3.7. It was built using [Flask](https://flask.palletsprojects.com/en/1.1.x/) framework. 

[SQLite](https://www.sqlite.org/index.html) was used as a database. 

#### Folders
- `app` - this folder consists of main backend components and a static files folder
- `backups` - (may not exists before first launch of a backup) it contains all created backups
- `db` - contains the database file


#### Important files
- `default_password.py` - if somehow root password was changed and you can't log into the website you can use this file to change it
- `error_log_backups.log` - (may not exists before first backup error) contains backup error logs
- `config.py` - contains backend config. Most of it is configured via environmental variables