from config.settings import *  # type: ignore

# ------------------------------------------------------------------------------
# Test configuration
# !!!
# This settings file overrides the default database configuration to use
# an in-memory SQLite database. It is intended exclusively for automated
# tests (pytest) so that tests can run quickly and without requiring an
# active PostgreSQL instance.
# ------------------------------------------------------------------------------


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
