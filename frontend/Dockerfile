FROM node:19

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Copy all the project files
COPY . .

# Install the dependencies
RUN npm install
# add app
COPY . ./

EXPOSE 8080
# start app
CMD ["npm", "start"]