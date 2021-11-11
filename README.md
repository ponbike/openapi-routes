[![Node CI][npm-image]][npm-url] [![Bugs][bugs-image]][bugs-url] [![Code Smells][code-smells-image]][code-smells-url] [![Duplicated Lines (%)][duplicate-lines-image]][duplicate-lines-url] [![Maintainability Rating][maintainability-rate-image]][maintainability-rate-url] [![Reliability Rating][reliability-rate-image]][reliability-rate-url] [![Security Rating][security-rate-image]][security-rate-url] [![Technical Debt][technical-debt-image]][technical-debt-url] [![Vulnerabilities][vulnerabilitiest-image]][vulnerabilitiest-url] [![Quality Gate Status][quality-gate-image]][quality-gate-url] [![Coverage][coverage-image]][coverage-url]

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

[npm-url]: https://github.com/ponbike/openapi-routes/actions/workflows/nodejs.yml
[npm-image]: https://github.com/ponbike/openapi-routes/actions/workflows/nodejs.yml/badge.svg

[bugs-url]: https://sonarcloud.io/project/issues?id=ponbike_openapi-routes&resolved=false&types=BUG
[bugs-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-routes&metric=bugs

[code-smells-url]: https://sonarcloud.io/project/issues?id=ponbike_openapi-routes&resolved=false&types=CODE_SMELL
[code-smells-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-routes&metric=code_smells

[duplicate-lines-url]: https://sonarcloud.io/component_measures?id=ponbike_openapi-routes&metric=duplicated_lines_density&view=list
[duplicate-lines-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-routes&metric=duplicated_lines_density

[maintainability-rate-url]: https://sonarcloud.io/project/issues?id=ponbike_openapi-routes&resolved=false&types=CODE_SMELL
[maintainability-rate-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-routes&metric=sqale_rating

[reliability-rate-url]: https://sonarcloud.io/component_measures?id=ponbike_openapi-routes&metric=Reliability
[reliability-rate-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-routes&metric=reliability_rating

[security-rate-url]: https://sonarcloud.io/project/security_hotspots?id=ponbike_openapi-routes
[security-rate-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-routes&metric=security_rating

[technical-debt-url]: https://sonarcloud.io/component_measures?id=ponbike_openapi-routes
[technical-debt-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-routes&metric=sqale_index

[vulnerabilitiest-url]: https://sonarcloud.io/project/issues?id=ponbike_openapi-routes&resolved=false&types=VULNERABILITY
[vulnerabilitiest-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-routes&metric=vulnerabilities

[quality-gate-url]: https://sonarcloud.io/summary/new_code?id=ponbike_openapi-routes
[quality-gate-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-routes&metric=alert_status

[coverage-url]: https://sonarcloud.io/component_measures?id=ponbike_openapi-routes&metric=coverage&view=list
[coverage-image]: https://sonarcloud.io/api/project_badges/measure?project=ponbike_openapi-routes&metric=coverage
