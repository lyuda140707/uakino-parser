import { google } from "googleapis";
import { CONFIG } from "./config.js";
import fs from "fs";

export async function writeRow(row) {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: CONFIG.GOOGLE_SHEET_ID,
    range: CONFIG.GOOGLE_SHEET_RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  console.log("🟢 Додано в таблицю:", row[0]);
}
