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


## Docker Port Mapping

Port mapping in Docker connects a container's internal port to a host machine port using the `-p` or `--publish` flag. This uses NAT and firewall rules to make container ports accessible externally, like `docker run -p 8080:3000` mapping host port 8080 to container port 3000. For your Node.js app listening on 3000, run `docker run -p 3000:3000 your-image` to access `http://localhost:3000` from the host. [docs.docker](https://docs.docker.com/engine/network/port-publishing/)

In Docker Compose, use the `ports` section: `ports: - "3000:3000"` under your service. EXPOSE 3000 in your Dockerfile documents the intent but doesn't publish; it's for build tools and orchestration. [docs.docker](https://docs.docker.com/get-started/docker-concepts/running-containers/publishing-ports/)

## Environment Variables in Docker

Use ARG for build-time variables (e.g., `ARG NODE_ENV=production`) and ENV for runtime (e.g., `ENV PORT=3000`). ARGs scope to build stages and don't persist; ENVs do. In your Dockerfile, add `ENV NODE_ENV=production` before CMD to set app behavior. [docker](https://www.docker.com/blog/docker-best-practices-using-arg-and-env-in-your-dockerfiles/)

Docker Compose supports `environment:` lists, `env_file: .env`, or `.env` files for interpolation like `${PORT:-3000}`. Create `.env` with `PORT=3000` and reference in `ports: - "${PORT}:${PORT}"`. Secrets go in `env_file` or external managers, not Dockerfiles. [configu](https://configu.com/blog/docker-environment-variables-arg-env-using-them-correctly/)

## Publishing Node.js App to Docker Hub

Build your image: `docker build -t yourusername/simple-node-app .` using your provided Dockerfile (add `package.json` with `"start": "node index.js"`). Login with `docker login`, tag `docker tag simple-node-app yourusername/simple-node-app:latest`, then push `docker push yourusername/simple-node-app:latest`. [snyk](https://snyk.io/blog/how-to-publish-node-js-docker-images-to-docker-hub-registry-using-github-actions/)

Your Dockerfile is solid: uses official Node 22, copies package.json first for layer caching, sets WORKDIR, exposes 3000, and runs `npm start`. Optimize later with multi-stage builds for smaller images. [docs.docker](https://docs.docker.com/build-cloud/optimization/)

## Docker Compose Optimization

Pre-build images with `docker compose build --no-cache` sparingly; use official images for deps like Postgres/Redis to skip builds. Set short healthchecks (e.g., `healthcheck: interval: 2s`) and `depends_on` with conditions for parallel startup. [youtube](https://www.youtube.com/watch?v=WQFx2m5Ub9M)

Use volumes for code (`volumes: - .:/app`), networks for isolation, and profiles (`profiles: ["dev"]`) to run subsets. Avoid repetition with YAML anchors (`x-logging: &logging ...`); limit services to essentials. [hackmamba](https://hackmamba.io/engineering/best-practices-when-using-docker-compose/)

## Docker Compose Best Practices

Version `3.8+` for modern features; name services lowercase with hyphens (e.g., `app`, `postgres-db`). Externalize configs via `.env`, use `restart: unless-stopped`, and explicit networks (`networks: default:`). [hackmamba](https://hackmamba.io/engineering/best-practices-when-using-docker-compose/)

Order: services first, then volumes/networks; use `profiles` for env-specific services. Validate with `docker compose config`; don't hardcode secrets. For production, add resource limits (`deploy: resources: limits: memory: 512M`). [configu](https://configu.com/blog/docker-environment-variables-arg-env-using-them-correctly/)

## Complete docker-compose.yml Example

Here's an optimized `docker-compose.yml` for your Node.js app with Postgres and Redis:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "${PORT:-3000}:3000"
    environment:
      - NODE_ENV=production
      - DB_URL=postgresql://user:pass@postgres:5432/mydb
      - REDIS_URL=redis://redis:6379
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

Run `docker compose up -d`; access app at localhost:3000. Add `/health` endpoint to your Express app for healthchecks. [youtube](https://www.youtube.com/watch?v=aetqo2nkQcA)