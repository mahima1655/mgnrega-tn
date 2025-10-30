FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy source code
COPY . .

# Build React app
RUN cd client && npm run build

# Copy database
RUN cp server/mgnrega.db server/mgnrega.db

EXPOSE 5000

# Start server
CMD ["node", "server/index.js"]