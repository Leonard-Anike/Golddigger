import path from 'node:path'
import fs from 'node:fs/promises'

const purchasedPathJSONL = path.join('data', 'purchasedData.jsonl')

export async function getData() {

    try {

         const purchasedData = await fs.readFile(purchasedPathJSONL, 'utf8')
        
         if (!purchasedData.trim()) return []

         return purchasedData
            .split('\n')
            .filter(Boolean)
            .map(line => JSON.parse(line))

    } catch (err) {

        if (err.code === 'ENOENT') return []
        throw new Error (`Failed to read purchase data: ${err.message}`)
    }
}