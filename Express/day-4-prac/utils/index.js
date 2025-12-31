import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url"; //read more about this


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "data", "tasks.json");

export const readTasks = ()=>{
    try {
        ensureFileExists();
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data || "[]");
    } catch (error) {
        console.error("Error reading tasks:", error);
        return [];
    }
}

export const writeTasks = (tasks)=>{
    try {
        fs.writeFileSync(filePath , JSON.stringify(tasks , null , 2) , "utf-8");
    } catch (error) {
        console.error("Error writing tasks:", error);
    }
}

const ensureFileExists = () => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true }); // Ensure the directory exists
      fs.writeFileSync(filePath, "[]", "utf-8"); // Create an empty JSON file
    }
  } catch (error) {
    console.error("Error ensuring file exists:", error);
  }
};