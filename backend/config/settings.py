import os
from pathlib import Path

import environ  # type: ignore

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()

environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")
DEBUG = env.bool("DEBUG", default=False)

ALLOWED_HOSTS = ["*"]

# ⚠️ DEVELOPMENT ONLY
# Essas configurações liberam CORS para qualquer origem.
# Isso é útil apenas em ambiente de desenvolvimento para facilitar testes
# entre frontend e backend. NÃO utilizar em produção por motivos de segurança.

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "django_filters",
    "drf_spectacular",
    "apps.users.apps.UsersConfig",
    "apps.tasks.apps.TasksConfig",
]

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ("core.middleware.renderers.ResultJSONRenderer",),
    "DEFAULT_PAGINATION_CLASS": "core.pagination.ResultPageNumberPagination",
    "PAGE_SIZE": 50,
    "EXCEPTION_HANDLER": "core.exceptions.handler.custom_exception_handler",
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.TokenAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_FILTER_BACKENDS": ["django_filters.rest_framework.DjangoFilterBackend"],
}

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "core.middleware.request_logging.RequestLoggingMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("DATABASE_NAME"),
        "USER": env("DATABASE_USER"),
        "PASSWORD": env("DATABASE_PASSWORD"),
        "HOST": env("DATABASE_HOST"),
        "PORT": env("DATABASE_PORT"),
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


LANGUAGE_CODE = "pt-br"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

APPEND_SLASH = False

SPECTACULAR_SETTINGS = {
    "TITLE": "To-do list API - Orizon",
    "DESCRIPTION": "API Testing for Orizons To-do list project",
    "VERSION": "1.0.0",
    "POSTPROCESSING_HOOKS": [
        "drf_spectacular.hooks.postprocess_schema_enums",
        "core.spectacular_hooks.result_wrapper_postprocessing_hook",
    ],
    "COMPONENT_SPLIT_REQUEST": True,
    "SECURITY_SCHEMES": {
        "TokenAuth": {
            "type": "apiKey",
            "in": "header",
            "name": "Authorization",
        }
    },
}

LOG_DIR = BASE_DIR / "logs"
os.makedirs(LOG_DIR, exist_ok=True)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "detailed": {
            "format": (
                "%(levelname)s | %(asctime)s | %(name)s | "
                "%(module)s:%(lineno)d | %(message)s"
            ),
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
        "request": {"format": ("%(levelname)s | %(asctime)s | %(message)s")},
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "detailed",
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOG_DIR / "api.log",
            "maxBytes": 1024 * 1024 * 10,
            "backupCount": 5,
            "formatter": "detailed",
        },
        "request_file": {
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOG_DIR / "requests.log",
            "maxBytes": 1024 * 1024 * 10,
            "backupCount": 5,
            "formatter": "request",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["console", "file"],
            "level": "ERROR",
            "propagate": False,
        },
        "api.request": {
            "handlers": ["request_file", "console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}
