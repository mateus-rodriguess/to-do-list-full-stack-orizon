from rest_framework import status


def is_paginated_ref(schema: dict, components: dict) -> bool:

    if not isinstance(schema, dict):
        return False

    ref = schema.get("$ref", "")
    if ref:
        schema_name = ref.split("/")[-1]
        if schema_name.startswith("Paginated"):
            return True
        resolved = components.get("schemas", {}).get(schema_name, {})
        properties = resolved.get("properties", {})
        if "count" in properties and "result" in properties:
            return True

    properties = schema.get("properties", {})
    return bool("count" in properties and "result" in properties)


def result_wrapper_postprocessing_hook(result: dict, generator, request, public):
    components = result.get("components", {})

    for _, methods in result.get("paths", {}).items():
        for _, operation in methods.items():
            responses = operation.get("responses", {})
            for status_code, response in responses.items():
                try:
                    code = int(status_code)
                except (ValueError, TypeError):
                    continue

                if not (status.HTTP_200_OK <= code < status.HTTP_300_MULTIPLE_CHOICES):
                    continue

                content = response.get("content", {})
                for _, media in content.items():
                    schema = media.get("schema")
                    if not schema:
                        continue

                    if is_paginated_ref(schema, components):
                        media["schema"] = schema.get("properties", {}).get(
                            "result", schema
                        )
                        if "$ref" in schema.get("properties", {}).get("result", {}):
                            media["schema"] = schema["properties"]["result"]
                        else:
                            media["schema"] = schema
                        continue

                    media["schema"] = {
                        "type": "object",
                        "required": ["result"],
                        "properties": {
                            "result": schema,
                        },
                    }

    return result
