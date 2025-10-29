import { updatePurchase } from './uploadPurchasedData.js'
await updatePurchase()

// === DOM ELEMENT REFERENCES === //
const priceDisplay = document.getElementById('price-display')
const connectionStatus = document.getElementById('connection-status')
const statusIcon = document.getElementById('status-icon')

// Store the last known price to compare for changes
let lastPrice = null

/**
 * Create an EventSource connection to receive Server-Sent Events (SSE)
 * from the server endpoint `/api/prices`.
 * 
 * The server continuously pushes updates such as:
 *  - "connecting" status
 *  - "connected" confirmation
 *  - "price-update" events with live gold price data
 */
const priceSource = new EventSource('/api/prices')

/**
 * Handle initial connection phase.
 * Triggered when the server sends the "connecting" event.
 */
priceSource.addEventListener('connecting', (event) => {
    const data =JSON.parse(event.data)

    // Update UI to reflect connection attempt
    connectionStatus.textContent = data.header1
    statusIcon.textContent = '⚪'
    priceDisplay.textContent = data.message1
})

/**
 * Handle successful connection event.
 * Triggered when the server sends the "connected" event.
 */
priceSource.addEventListener('connected', (event) => {
    const data =JSON.parse(event.data)

    // Update UI to indicate the connection is live
    connectionStatus.textContent = data.header2
    statusIcon.textContent = '🟢'
    priceDisplay.textContent = data.message2
})

/**
 * Handle incoming live price updates.
 * Triggered every few seconds when the server sends "price-update" events.
 */
priceSource.addEventListener('price-update', (event) => {
    const data = JSON.parse(event.data)
    const currentPrice = data.price

    // Update status
    connectionStatus.textContent = 'Live Price'
    statusIcon.textContent = '🟢'

    // Compare new price with last known price to indicate trend
    if(lastPrice !== null) {
        if(currentPrice > lastPrice) {
            statusIcon.textContent = '🟢'         // price increased

        } else if (currentPrice < lastPrice) {
            statusIcon.textContent = '🔴'         // price decreased

        } else {
            statusIcon.textContent = '⚪'         // no change
        }
    }

    // Display updated price
    priceDisplay.textContent = currentPrice
    lastPrice = currentPrice
})

//Handle connection loss
priceSource.onerror = (err) => {
    priceDisplay.textContent = 'Reconnecting...'
    connectionStatus.textContent = 'Disconnected'
    statusIcon.textContent = '🔴'
}