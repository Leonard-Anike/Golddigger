export async function parseJSONBody (req) {

    let body = ''

    for await (const chunk of req) {
        body += chunk
    }

    try {
        const parsedBody = JSON.parse(body)
        return parsedBody

    } catch (err) {
        throw new Error (`Invalid JSON format: ${err.message}`)
    }
}