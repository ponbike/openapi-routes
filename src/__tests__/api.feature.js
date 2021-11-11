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
