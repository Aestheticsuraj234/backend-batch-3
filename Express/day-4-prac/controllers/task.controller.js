import { readTasks, writeTasks } from "../utils/index.js";

export const createTask = async (req, res) => {
    const { title, description } = req.body;
    const tasks = await readTasks();

    const newTask = {
        id: crypto.randomUUID(),
        title,
        description,
        username: req.session.user.username,
        complete: false
    }

    tasks.push(newTask)

    writeTasks(tasks)

    res.status(201).json(newTask)
}

export const getAllTasks = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const tasks = await readTasks();
    res.json(tasks.filter((task) => task.username === req.session.user.username));
}