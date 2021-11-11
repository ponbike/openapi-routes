export default class Backend {
  constructor ({ apiRoot, definition }) {
    this.apiRoot = apiRoot
    this.definition = definition
    this.routes = []
    this.security = []
  }

  register (operationId, handler) {
    this.routes.push({
      operationId,
      handler
    })
  }

  route (operationId) {
    return this.routes.find(route => route.operationId === operationId).handler
  }

  registerSecurityHandler (name, handler) {
    this.security.push({
      name,
      handler
    })
  }

  init () {
    return true
  }
}
