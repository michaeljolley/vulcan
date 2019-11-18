FROM node:12.6.0-alpine

ARG BUILDVERSION=0.0.0

WORKDIR /app

# Copy dependency files
COPY ./package.json ./package-lock.json ./

# Clean install depdenencies
RUN npm ci --silent

# ^^^^
# All layers above are cached, the below layers change more often
# vvvv

COPY ./ .

RUN npm version $BUILDVERSION --allow-same-version

EXPOSE 80
CMD [ "node", "src/index.js" ]