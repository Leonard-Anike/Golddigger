import { prices } from '../data/prices.js'
import { parseJSONBody } from '../utils/parseJSONBody.js'
import { sendResponse } from '../utils/sendRespose.js'
import { addNewPurchasedData } from '../utils/addNewPurchasedData.js'
import { sendPurchaseEmail } from '../utils/sendPurchaseEmail.js'
import { getAllPurchasedData } from "../utils/renderPurchasedPath.js";

/**
 * Handles Server-Sent Events (SSE) connection to stream live price updates to the client.
 * 
 * @param {IncomingMessage} req - The HTTP request object.
 * @param {ServerResponse} res - The HTTP response object.
 */

export async function handlePrices (req, res) {

    // Set up response headers for SSE (Server-Sent Events)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    // Client retry interval in case of disconnection
    res.write('retry: 2000\n\n')

    // Initial event: client is connecting
    res.write(`event: connecting\n`)
    res.write(`data: ${JSON.stringify({
        header1: 'Connecting...',
        message1: 'Fetching price...'
    })}\n\n`)

    // Notify client when connection is established
    setTimeout(() => {
        res.write(`event: connected\n`)
        res.write(`data: ${JSON.stringify({
        header2: 'Connected',
        message2: 'Waiting for price updates...'
        })}\n\n`)

    }, 2500)

    // Generates and sends random price updates every 1.7 seconds
    setTimeout(() => {

        const priceInterval = setInterval ( () => {
        const randomIndex = Math.floor(Math.random() * prices.length)

        res.write(`event: price-update\n`);
        res.write(`data: ${JSON.stringify({ price: prices[randomIndex] })}\n\n`);
        }, 1700)

        // Clear interval when client closes the connection
        req.on('close', () => {
        clearInterval(priceInterval)
    })

    }, 4000)
}

/**
 * Handles POST requests to save new purchase data.
 * Validates input, stores data, and sends confirmation email to the user.
 * 
 * @param {IncomingMessage} req - The HTTP request object.
 * @param {ServerResponse} res - The HTTP response object.
 */

export async function handlePost (req, res) {

    try {
         // Parse JSON body from the request
        const parsedBody = await parseJSONBody(req)
        const {date, amount_paid, price_per_oz, gold_sold, user_email} = parsedBody
       
        // Validate required fields and data types
        if (
            !date || 
            typeof amount_paid !== 'string' || 
            typeof price_per_oz !== 'string' || 
            typeof gold_sold !== 'string' ||
            typeof user_email !== 'string'
        ) {
            return sendResponse(res, 400, 'application/json', JSON.stringify({error: 'Invalid purchase data'}))
        }
        
        // Save the new purchase record to the data source
        await addNewPurchasedData(parsedBody)

        // Send purchase confirmation email to the user
        await sendPurchaseEmail(parsedBody.user_email, parsedBody)

        // Respond with success message
        sendResponse(res, 200, 'application/json', JSON.stringify({message: 'Purchase data saved successfully'}))

    } catch (err) { 
        // Handle and report any unexpected server or processing errors
        sendResponse(res, 500, 'application/json', JSON.stringify({error: err.message || 'Server error'}))
    }
}

export async function handleRenderGet(req, res) {

    try {
        const purchasedData = await getAllPurchasedData();

        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(purchasedData));

    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: err.message || "Server error" }));
    }

}