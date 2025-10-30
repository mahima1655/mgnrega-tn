FROM node:18

WORKDIR /app

# Copy and install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy and install client dependencies  
COPY client/package*.json ./client/
RUN cd client && npm install

# Copy source code
COPY . .

# Build React app
WORKDIR /app/client
RUN chmod +x node_modules/.bin/react-scripts
RUN npx react-scripts build

# Switch back to app directory
WORKDIR /app

EXPOSE 5000

# Start server
CMD ["node", "server/index.js"]