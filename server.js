import 'dotenv/config'
import http from 'node:http'
import { serveStatic } from './utils/serveStatic.js'
import { handlePrices, handlePost, handleRenderGet } from './handlers/routeHandlers.js'

const PORT = process.env.PORT || 3000;

const __dirname = import.meta.dirname

const server = http.createServer( async (req, res) => {

    if (req.url === '/api/debug/data' && req.method === 'GET') {

        return await handleRenderGet(req, res)

    }
   
    if (req.url === '/api' && req.method === 'POST') {

        return await handlePost(req, res)
        
    } else if (req.url === '/api/prices') {
        return await handlePrices(req, res)
    }
    
    else if (!req.url.startsWith('/api')) {
    
        return await serveStatic(req, res, __dirname)

    }

})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))