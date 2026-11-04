
const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Custom HTTP error class
export class HttpError extends Error {
  constructor(status, message, data) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

// Reusable request function
export async function request(
  path,
  { method = 'GET', body, headers = {}, signal } = {}
) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,

    headers: {
      Accept: 'application/json',

      ...(body !== undefined
        ? { 'Content-Type': 'application/json' }
        : {}),

      ...headers,
    },

    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const isJSON = response.headers
    .get('content-type')
    ?.includes('application/json')

  const data =
    response.status === 204
      ? null
      : isJSON
        ? await response.json()
        : null

  if (!response.ok) {
    throw new HttpError(
      response.status,
      data?.message ?? `Request failed (${response.status})`,
      data
    )
  }

  return data
}

// Convenient API methods
export const api = {
  get: (path, opts) => request(path, opts),

  post: (path, body) =>
    request(path, {
      method: 'POST',
      body,
    }),

  put: (path, body) =>
    request(path, {
      method: 'PUT',
      body,
    }),

  patch: (path, body) =>
    request(path, {
      method: 'PATCH',
      body,
    }),

  del: (path) =>
    request(path, {
      method: 'DELETE',
    }),
}
