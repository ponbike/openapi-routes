import { expect, describe, it } from '@jest/globals'
import { ApiRoutes } from '../api'
import OpenAPISpecification from '../__fixtures__/api-doc.json'
import Backend from '../__mocks__/backend.js'
import callback from '../__mocks__/callback.js'
import controllers from '../__mocks__/controller.js'

describe('API route without security', () => {
  const { api: actual, operationIds } = ApiRoutes.create({
    specification: OpenAPISpecification,
    Backend,
    controllers,
    callback,
    requestValidation: true,
    responseValidation: true
  })
  it('Test if the return value is a instance of the backend', () => {
    expect(actual instanceof Backend).toBeTruthy()
  })

  it('Test if the operation id\'s are generated', () => {
    expect(operationIds).toEqual([
      'getStatus',
      'getTest',
      'postTest2',
      'postTest'
    ])
  })

  it('Test if the API route add all routes', () => {
    expect(actual.routes.map((route) => route.operationId)).toEqual([
      'validationFail',
      'postResponseHandler',
      'getStatus',
      'getTest',
      'postTest2',
      'postTest',
      'notFound'
    ])
  })

  it('Test if the API security is empty', () => {
    expect(actual.security.map((route) => route.name)).toEqual([])
  })

  it('Test the not found handler', async () => {
    const notFoundController = actual.route('notFound')
    const context = {}
    const req = {}
    let response = null
    const res = {
      type: () => true,
      status: () => ({
        send: (data) => {
          response = data
        }
      })
    }
    await notFoundController(context, req, res)
    expect(response).toEqual(true)
  })

  it('Test the status handler', async () => {
    const statusController = actual.route('getStatus')
    const context = {}
    const req = {}
    let response = null
    const res = {
      type: () => true,
      status: () => ({
        send: (data) => {
          response = data
        }
      })
    }
    await statusController(context, req, res)
    expect(response.message).toEqual('controller is not a function')
    expect(response.status).toEqual(500)
  })

  it('Test the test handler', async () => {
    const testController = actual.route('getTest')
    const context = {}
    const req = {}
    let response = null
    const res = {
      type: () => true,
      status: () => ({
        send: (data) => {
          response = data
        }
      })
    }
    await testController(context, req, res)
    expect(response.message).toEqual('controller is not a function')
    expect(response.status).toEqual(500)
  })

  it('Test the validation fail handler', async () => {
    const statusController = actual.route('validationFail')
    const context = {
      validation: {
        errors: 42
      }
    }
    const req = {}
    let response = null
    const res = {
      type: () => true,
      status: () => ({
        json: (data) => {
          response = data
        },
        send: (data) => {
          response = data
        }
      })
    }
    await statusController(context, req, res)
    expect(response.message).toEqual(42)
    expect(response.status).toEqual(400)
  })

  it('Test the post response handler', async () => {
    const statusController = actual.route('postResponseHandler')
    const context = {
      api: {
        validateResponse: () => ({}),
        validateResponseHeaders: () => ({})
      },
      operation: 123,
      response: 42
    }
    const req = {}
    let response = null
    let status = null
    const res = {
      type: () => true,
      status: (newStatus) => ({
        json: (data) => {
          status = newStatus
          response = data
        },
        send: (data) => {
          status = newStatus
          response = data
        }
      })
    }
    await statusController(context, req, res)
    expect(response).toEqual(42)
    expect(status).toEqual(200)
  })
})

describe('API route with security', () => {
  const { api: actual, logger } = ApiRoutes.create({
    specification: OpenAPISpecification,
    secret: 'secret',
    Backend,
    controllers,
    callback,
    root: '/test',
    logger: () => 43
  })
  it('Test if the return value is a instance of the backend with security', () => {
    expect(actual instanceof Backend).toBeTruthy()
  })

  it('Test if the API route add all routes', () => {
    expect(actual.routes.map((route) => route.operationId)).toEqual([
      'unauthorizedHandler',
      'getStatus',
      'getTest',
      'postTest2',
      'postTest',
      'notFound'
    ])
  })

  it('Test if the API security is set', () => {
    expect(actual.security.map((route) => route.name)).toEqual(['apiKey'])
  })

  it('Test if the API root is set', () => {
    expect(actual.apiRoot).toBe('/test')
  })

  it('Test if the API root is set', () => {
    expect(actual.apiRoot).toBe('/test')
  })

  it('Test if the logger is set', () => {
    expect(logger()).toBe(43)
  })

  it('It should throw an error if there are no controllers set', () => {
    expect(() => {
      ApiRoutes.create({
        specification: OpenAPISpecification,
        secret: 'secret',
        Backend,
        controllers: null,
        callback,
        root: '/test',
        logger: () => 44
      })
    }).toThrowError('No valid controllers found')
  })
})
