from . import ma

class BackupSchema(ma.Schema):
    class Meta:
        fields = ("id", "database_id", "environment", "filename", "build", "size", "created",
                  "finished", "status", "error")

class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "username", "password", "api_key")

class DatabaseSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "environment", "host", "port", "database", "user",
                  "password", "last_for", "created", "updated", "cron",
                  "active")

class DatasourceSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "host", "port", "user",
                  "password", "path", "created", "updated", "active")

backups_schema = BackupSchema(many=True)
user_schema = UserSchema(many=True)
database_schema = DatabaseSchema(many=True)
datasource_schema = DatasourceSchema(many=True)