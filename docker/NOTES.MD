## 🐳 What is Docker?

Docker is an open-source platform that enables developers to package applications along with their dependencies into standardized units called **containers**. These containers ensure that applications run consistently across different environments, from development to production.

---

## ❓ Why Do We Need Docker?

* **Consistency Across Environments**: Docker ensures that applications behave the same way in development, testing, and production environments.
* **Resource Efficiency**: Containers are lightweight and share the host system's kernel, making them more efficient than traditional virtual machines.
* **Rapid Deployment**: Docker allows for quick application deployment, scaling, and updates.
* **Isolation**: Each container operates in its own isolated environment, enhancing security and stability.

---

## 🧩 Problems Docker Solves

* **"It Works on My Machine" Syndrome**: By packaging applications with their dependencies, Docker eliminates inconsistencies between development and production environments.
* **Complex Deployment Processes**: Docker simplifies the deployment process, making it more straightforward and less error-prone.
* **Resource Overhead**: Containers are more lightweight than virtual machines, reducing resource consumption.

---

## 🛠️ Where is Docker Used Daily?

* **Development**: Developers use Docker to create consistent development environments.
* **Testing**: Automated testing environments are set up using Docker for consistency and isolation.
* **Continuous Integration/Continuous Deployment (CI/CD)**: Docker integrates seamlessly with CI/CD pipelines for automated testing and deployment.
* **Microservices Architecture**: Docker is ideal for deploying microservices due to its lightweight and isolated nature.

---

## ⚙️ What is the Docker Daemon?

The Docker Daemon (`dockerd`) is a background service that manages Docker containers, images, networks, and storage volumes. It listens for Docker API requests and processes them.

---

## 📦 Docker Images vs. Containers

| Feature          | Docker Image                                              | Docker Container                    |
| ---------------- | --------------------------------------------------------- | ----------------------------------- |
| Definition       | Read-only template with application code and dependencies | Runnable instance of a Docker image |
| Mutability       | Immutable                                                 | Mutable                             |
| State            | Static                                                    | Dynamic                             |
| Lifecycle        | Build, Store                                              | Create, Start, Stop, Delete         |
| Storage Location | Docker Hub, Local Registry                                | Local System                        |
| Usage            | Blueprint for containers                                  | Running the actual application      |

---

## 🧰 Basic Docker Commands

### 🔹 Image Commands

| Command                     | Description                           |
| --------------------------- | ------------------------------------- |
| `docker image ls`           | List all Docker images on the system  |
| `docker pull <image_name>`  | Download an image from Docker Hub     |
| `docker build -t <name> .`  | Build an image from a Dockerfile      |
| `docker tag <src> <target>` | Tag an image with a new name          |
| `docker push <image>`       | Upload an image to Docker Hub         |
| `docker rmi <image>`        | Remove an image from the local system |

### 🔹 Container Commands

| Command                            | Description                                        |
| ---------------------------------- | -------------------------------------------------- |
| `docker run -it <image>`           | Run a container interactively                      |
| `docker run -d -p 8080:80 <image>` | Run a container in detached mode with port mapping |
| `docker ps`                        | List running containers                            |
| `docker ps -a`                     | List all containers (running and stopped)          |
| `docker start <container>`         | Start a stopped container                          |
| `docker stop <container>`          | Stop a running container                           |
| `docker exec -it <container> bash` | Access a running container's shell                 |
| `docker logs <container>`          | View logs of a container                           |
| `docker rm <container>`            | Remove a stopped container                         |

---

## 🚀 Creating and Dockerizing a Node.js App

### 📁 Project Structure

```
my-node-app/
├── app.js
├── package.json
├── Dockerfile
```

### 📝 app.js

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Dockerized Node.js App!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### 📦 package.json

```json
{
  "name": "my-node-app",
  "version": "1.0.0",
  "description": "A simple Node.js app",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

### 🐳 Dockerfile

```dockerfile
# Use official Node.js image
FROM node:14

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

### 🔧 Build the Docker Image

```bash
docker build -t my-node-app .
```

### ▶️ Run the Docker Container

```bash
docker run -d -p 3000:3000 my-node-app
```

Access the application by navigating to `http://localhost:3000` in your browser.

---
