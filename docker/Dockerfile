# Use Offical Node.js Image
FROM node:22-alpine

# Set Working Directory
WORKDIR /usr/src/app


# Copy package.json and install dependenices
COPY package*.json ./

RUN npm ci --omit=dev

# Application Code
COPY . .



# EXPOSE port
EXPOSE 3000

CMD ["npm" , "start"]