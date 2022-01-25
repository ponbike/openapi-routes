import addFormats from 'ajv-formats'
/**
 * Auto register API routes from the OpenAPI specification.
 */
class ApiRoutes {
  /**
   * Set the specification.
   *
   * @param {object} OpenAPISpecification
   * @param {class} Backend
   * @param {function} callback
   * @param {string} root
   * @param {mixed} meta
   */
  constructor (OpenAPISpecification, Backend, callback, root, meta) {
    this.logger = null
    this.specification = OpenAPISpecification
    this.callback = callback
    this.controllers = {}
    this.meta = meta || {}
    this.api = new Backend({
      apiRoot: root || '/',
      definition: OpenAPISpecification,
      customizeAjv: (originalAjv, ajvOpts, validationContext) => {
        addFormats(originalAjv)
        return originalAjv
      }
    })
  }

  /**
   * Get akl operations
   *
   * @return {array}
   */
  get operations () {
    return ['get', 'put', 'patch', 'post', 'delete']
  }

  /**
   * Set the logger.
   *
   * @param {class} logger
   */
  setLogger (logger) {
    this.logger = logger
  }

  /**
   * Set the controllers.
   *
   * @param {object} controllers
   */
  setControllers (controllers) {
    if (controllers === null || controllers.constructor.name !== 'Object') {
      throw new Error('No valid controllers found')
    }

    this.controllers = controllers
  }

  /**
   * Get all operation ID's from the specification.
   *
   * @return {string[]}
   */
  get operationIds () {
    return Object.values(this.specification.paths)
      .map((path) => Object.entries(path)
        .map(([operation, data]) => this.operations.includes(operation)
          ? data.operationId
          : null))
      .flat()
  }

  /**
   * Register all operations to a controller.
   */
  register () {
    this.operationIds.forEach((operationId) => {
      this.api.register(
        operationId,
        this.callback({
          controller: this.controllers[operationId],
          specification: this.specification,
          logger: this.logger,
          meta: this.meta
        })
      )
    })

    if (this.controllers?.notFound) {
      this.api.register(
        'notFound',
        this.callback({
          controller: this.controllers.notFound,
          specification: this.specification,
          logger: this.logger,
          meta: this.meta
        })
      )
    }

    this.api.init()
  }

  /**
   * Set the authentication
   *
   * @param {string} secret
   */
  authentication (secret) {
    this.api.register(
      'unauthorizedHandler',
      async (context, request, response) => response.status(401).json({
        status: 401,
        timestamp: new Date(),
        message: 'Unauthorized'
      })
    )
    this.api.registerSecurityHandler(
      'apiKey',
      (context) => context.request.headers['x-api-key'] === secret
    )
  }

  /**
   * Add the request validation to the API routes.
   */
  requestValidation () {
    this.api.register(
      'validationFail',
      (context, request, response) => response.status(400).json({
        status: 400,
        timestamp: new Date(),
        message: context.validation.errors
      })
    )
  }

  /**
   * Add the response validation to the API routes.
   */
  responseValidation () {
    this.api.register(
      'postResponseHandler',
      (context, request, response) => {
        const validResponse = context.api.validateResponse(context.response, context.operation)

        if (validResponse.errors) {
          return response.status(502).json({
            status: 502,
            timestamp: new Date(),
            message: validResponse.errors
          })
        }

        const validHeaders = context.api.validateResponseHeaders(response.headers, context.operation, {
          statusCode: response.statusCode,
          setMatchType: 'exact'
        })

        if (validHeaders.errors) {
          return response.status(502).json({
            status: 502,
            timestamp: new Date(),
            message: validHeaders.errors
          })
        }

        return response.status(200).json(context.response)
      }
    )
  }

  /**
   * Create the API routes from a specification.
   *
   * @param {object} data
   * @param {object} data.specification
   * @param {string} data.secret
   * @param {class} data.Backend
   * @param {class} data.logger
   * @param {function} data.callback
   * @param {object} data.controllers
   * @param {string} data.root
   * @param {mixed} data.meta
   * @param {boolean} data.requestValidation
   * @param {boolean} data.responseValidation
   *
   * @return {ApiRoutes}
   */
  static create ({
    specification,
    secret,
    Backend,
    logger,
    callback,
    controllers,
    root,
    meta,
    requestValidation = false,
    responseValidation = false
  }) {
    const apiRoutes = new ApiRoutes(specification, Backend, callback, root, meta)

    apiRoutes.setControllers(controllers)
    if (logger) {
      apiRoutes.setLogger(logger)
    }

    if (secret) {
      apiRoutes.authentication(secret)
    }

    if (requestValidation) {
      apiRoutes.requestValidation()
    }

    if (responseValidation) {
      apiRoutes.responseValidation()
    }

    apiRoutes.register()

    return apiRoutes
  }
}

export { ApiRoutes }
