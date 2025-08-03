# 1. Use Node.js official image
FROM node:18

# 2. Set working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json first for caching
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your project files
COPY . .

# 6. Expose the port (must match PORT in .env)
EXPOSE 5000

# 7. Start the app using your dev script
CMD ["npm", "run", "dev"]
