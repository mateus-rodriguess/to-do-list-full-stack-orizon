from rest_framework import status
from rest_framework.renderers import JSONRenderer


class ResultJSONRenderer(JSONRenderer):
    def render(self, data: dict, accepted_media_type=None, renderer_context=None):
        PAGINATED_KEYS = {"count", "result"}
        response = renderer_context.get("response") if renderer_context else None

        if (
            response is not None
            and status.HTTP_200_OK
            <= response.status_code
            < status.HTTP_300_MULTIPLE_CHOICES
        ) and not (isinstance(data, dict) and PAGINATED_KEYS.issubset(data.keys())):
            data = {"result": data}

        return super().render(data, accepted_media_type, renderer_context)
