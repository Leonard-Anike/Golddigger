import path from "node:path";
import fs from "node:fs/promises";

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
