import { denock } from './index.ts'

// TODO: options objects?

function urlSearchParamsToObj(obj) {
  obj = JSON.parse(JSON.stringify(obj))
  return Object.keys(obj).length === 0 ? undefined : obj
}

export function nock(baseUri, baseOptions) {
    function intercept(uri, method, requestBody, options) {
        options = Object.assign({}, baseOptions, options)
        let urlObj = new URL(baseUri + uri)
        return {
            reply: (replyStatus, responseBody) => denock({
                method,
                protocol: urlObj.protocol.replace(':', ''),
                host: urlObj.hostname,
                port: urlObj.port,
                path: urlObj.pathname,
                queryParams: urlSearchParamsToObj(urlObj.searchParams),
                headers: options.headers,
                requestBody,
                responseBody,
                replyStatus,
            })
        }
    }

    return {
        get: (uri, body, options) => intercept(uri, 'GET', body, options),
        put: (uri, body, options) => intercept(uri, 'PUT', body, options),
        post: (uri, body, options) => intercept(uri, 'POST', body, options),
        head: (uri, body, options) => intercept(uri, 'HEAD', body, options),
        patch: (uri, body, options) => intercept(uri, 'PATCH', body, options),
        merge: (uri, body, options) => intercept(uri, 'MERGE', body, options),
        delete: (uri, body, options) => intercept(uri, 'DELETE', body, options),
        options: (uri, body, options) =>
            intercept(uri, 'OPTIONS', body, options)
    }
}
