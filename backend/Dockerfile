FROM python:3.7

RUN apt-get -qq update && apt-get install -qq -y default-mysql-client && apt-get install -qq -y cron && apt-get install -qq -y sshpass

COPY requirements.txt /requirements.txt

RUN pip install -r requirements.txt

RUN rm -rf /requirements.txt

WORKDIR /app

EXPOSE 5000

ENTRYPOINT [ "python", "wsgi.py" ]
