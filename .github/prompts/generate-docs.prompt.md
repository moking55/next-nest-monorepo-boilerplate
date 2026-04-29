---
agent: agent
description: This prompt is used to add comprehensive Swagger (OpenAPI) documentation to NestJS controllers and DTOs.
---
Act as a senior NestJS developer and API documentation expert.

Your task is to take the provided NestJS controller and DTOs and add comprehensive, production-ready Swagger (OpenAPI) documentation using `@nestjs/swagger` decorators.

**Instructions:**

1.  **Controller:** Add `@ApiTags()` to the class.
2.  **Endpoints:**
    * Add `@ApiOperation()` with a clear `summary` for each route.
    * Add `@ApiResponse()` for all relevant status codes (e.g., 200, 201, 400, 404, 500). Include the `description` and, for success responses, the `type` (pointing to the DTO).
    * Add `@ApiParam()` for any path parameters (like `:id`).
    * Add `@ApiQuery()` for any query parameters.
3.  **DTOs:**
    * Add `@ApiProperty()` to **every** field.
    * Include a helpful `description` and an `example` for each property.
    * Use `@ApiPropertyOptional()` for fields that are not required.
4.  **Security:** If security is specified, add the appropriate decorator (e.g., `@ApiBearerAuth()`) to protected routes or the entire controller.
5.  **Output:** Provide **only** the complete, updated code blocks for the controller and DTOs. Do not add explanations.

---