import logging
from typing import Any

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler

logger = logging.getLogger(__name__)


def custom_exception_handler(exc: Any, context: Any):
    response = exception_handler(exc, context)

    if response is not None:
        return Response(
            {
                "error": {
                    "code": "validation_error",
                    "message": "Request validation failed",
                    "details": response.data,
                }
            },
            status=response.status_code,
        )

    request = context.get("request")

    logger.exception(
        "Unhandled exception",
        extra={
            "path": request.path if request else None,
            "method": request.method if request else None,
            "view": context.get("view").__class__.__name__
            if context.get("view")
            else None,
        },
    )

    return Response(
        {
            "error": {
                "code": "internal_server_error",
                "message": "Unexpected server error",
                "details": None,
            }
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
