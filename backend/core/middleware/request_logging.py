import logging
import time

from rest_framework.response import Response

logger = logging.getLogger("api.request")


class RequestLoggingMiddleware:
    def __init__(self, get_response: Response):
        self.get_response = get_response

    def __call__(self, request):

        start_time = time.time()

        response = self.get_response(request)

        duration = (time.time() - start_time) * 1000
        logger.info(
            "%s %s %s %sms",
            request.method,
            request.get_full_path(),
            response.status_code,
            round(duration, 2),
        )

        return response
