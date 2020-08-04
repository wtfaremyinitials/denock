import { assertEquals } from './deps.ts'

import { nock } from '../mod.ts'

Deno.test('nock compatibility shim', async () => {
    let scope = nock('https://jsonplaceholder.typicode.com')
        .post('/todos')
        .reply(201, { test: 'ok' })

    const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
        method: 'POST'
    })

    const body = await response.json()
    const status = await response.status

    assertEquals(body, { test: 'ok' })
    assertEquals(status, 201)
})
