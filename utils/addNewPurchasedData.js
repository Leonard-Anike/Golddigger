import path from "node:path";
import fs from "node:fs/promises";

// Saves the purchased data to local data base - purchasedData.jsonl
const purchasedPathJSONL = path.join("data", "purchasedData.jsonl");

export async function addNewPurchasedData(newPurchasedData) {
  try {
    if (!newPurchasedData || typeof newPurchasedData !== "object") {
      throw new Error("Invalid purchase data");
    }

    const formattedPurchasedData =
      JSON.stringify(newPurchasedData, null, 0)
        .replace(/^{/, "{ ")
        .replace(/}$/, " }")
        .replace(/,/g, ", ")
        .replace(/:/g, ": ") + "\n";
    await fs.appendFile(purchasedPathJSONL, formattedPurchasedData, "utf8");

  } catch (err) {
    throw new Error("Error writing to database file");
  }
}


//Reads the purchased data from render (readonly)
export async function getPurchasedDataFronRender(newPurchasedData) {
  
  const renderPurchasedPathJSONL = path.join(process.cwd(), 'data', 'purchasedData.jsonl')

    try {

      const purchasedData = await fs.readFile(renderPurchasedPathJSONL, "utf8").catch(() => "");
          const parsedData = purchasedData
            .split("\n")
            .filter(line => line.trim())
            .map(line => JSON.parse(line));
     
          return parsedData
       
    } catch (err) {
        throw new Error("Error reading database file: " + err.message);
    }

}