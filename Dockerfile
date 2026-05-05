FROM node:20-bookworm-slim

RUN chromium \
    chromium-driver \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p test-reports

ENV CHROME_BIN=/usr/bin/chromium
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver
ENV APP_URL=http://localhost:8081

CMD ["npm", "run", "test:report", "--", "--reporter-options", "mochaFile=test-reports/results.xml"]