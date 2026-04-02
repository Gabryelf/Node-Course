import * as fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE_NAME = path.join(__dirname, "notes.json");


export const saveFile = (notes) => {
  const jsonData = JSON.stringify(notes);
  fs.writeFileSync(FILE_NAME, jsonData);
};

export const loadFile = () => {
  try {
    const jsonData = fs.readFileSync(FILE_NAME, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.log(`${error.message}`);
    console.log("Возникла ошибка", error.message);
    return [];
  }
};
