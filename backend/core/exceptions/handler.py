from typing import Any

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc: Any, context: Any):
    response = exception_handler(exc, context)

    if response is not None:
        return response

    return Response(
        {
            "error": {
                "code": "internal_server_error",
                "message": "Unexpected server error",
            }
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
