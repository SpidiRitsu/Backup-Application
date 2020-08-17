from os import environ
from gevent.pywsgi import WSGIServer
from app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(environ['PORT']) if 'PORT' in environ and environ['PORT'] != '' else 5000
    http_server = WSGIServer(('', port), app)
    http_server.serve_forever()