import path from 'node:path'
import fs from 'node:fs/promises'
import mime from 'mime'
import { sendResponse } from './sendRespose.js'

// Serves frontend files to the browser
export async function serveStatic (req, res, baseDir) {

    const publicDir = path.join(baseDir, 'public')
    const filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url)
    const contentType = mime.getType(filePath)

    try {
        const content = await fs.readFile(filePath)
        sendResponse(res, 200, contentType, content)
    } catch (err) {

        if (err.code == 'ENOENT') {
            const file404Path = path.join(publicDir, '404.html')
            const content = await fs.readFile(file404Path)
            sendResponse(res, 404, 'text/html', content )

        } else {
            sendResponse(res, 500, 'text/html', `<html><h1> Server Error: ${err.code} <h1></html>` )
        }
    }
}