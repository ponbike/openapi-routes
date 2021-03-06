# OpenAPI routes

## Example usage

```javascript
import express from 'express'
import { ApiRoutes } from '@ponbike/openapi-routes'
import { OpenAPIBackend } from 'openapi-backend'
import { logger as stackdriver } from '@ponbike/logger-stackdriver'
import { makeExpressCallback } from '@hckrnews/express-callback'

const logger = stackdriver()

const { api: apiRoutes } = ApiRoutes.create({
  specification,
  secret: 'exampleSecret,
  Backend: OpenAPIBackend,
  logger,
  controllers,
  callback: makeExpressCallback,
  root: '/',
  meta: {
    example: 'test'
  },
  requestValidation: true,
  responseValidation: true
})

const router = express.Router()

router.use((request, response) =>
  apiRoutes.handleRequest(
    request,
    request,
    response
  )
)
```
