# Health-Check-Monitor-for-HTTP-Endpoints

This program checks the health of a set of HTTP endpoints specified in a YAML configuration file. It monitors the endpoints every 15 seconds and logs their availability percentages to the console.

Prerequisites
Node.js: Ensure you have Node.js installed on your machine. You can download it from nodejs.org.
YAML Configuration File: Prepare a YAML file with the HTTP endpoints you want to monitor.

You can use vsCode - bash

mkdir health-checker
cd health-checker
npm init -y

Install Required Packages

npm install axios js-yaml

axios is for making HTTP requests.
js-yaml is for parsing YAML files.

Create the YAML Input File
Create a file named endpoints.yaml in the project directory with the following content:

- headers:
    user-agent: fetch-synthetic-monitor
  method: GET
  name: fetch index page
  url: https://fetch.com/
- headers:
    user-agent: fetch-synthetic-monitor
  method: GET
  name: fetch careers page
  url: https://fetch.com/careers
- body: '{"foo":"bar"}'
  headers:
    content-type: application/json
    user-agent: fetch-synthetic-monitor
  method: POST
  name: fetch some fake post endpoint
  url: https://fetch.com/some/post/endpoint
- name: fetch rewards index page
  url: https://www.fetchrewards.com/



Create the Health Checker Script

Create a file named healthChecker.js and add the following code:

const fs = require('fs');
const yaml = require('js-yaml');
const axios = require('axios');

const filePath = process.argv[2]; // Get file path from command line argument
const endpoints = yaml.load(fs.readFileSync(filePath, 'utf8'));
const domainStats = {};

async function checkEndpoint(endpoint) {
    const { url, method = 'GET', headers = {}, body } = endpoint;
    const startTime = Date.now();
    try {
        const response = await axios({
            method,
            url,
            headers,
            data: body ? JSON.parse(body) : undefined,
        });
        const latency = Date.now() - startTime;
        return response.status >= 200 && response.status < 300 && latency < 500;
    } catch (error) {
        return false;
    }
}

async function monitorEndpoints() {
    while (true) {
        let totalChecks = 0;
        let successfulChecks = 0;

        for (const endpoint of endpoints) {
            const isUp = await checkEndpoint(endpoint);
            totalChecks++;

            const domain = new URL(endpoint.url).hostname;
            if (!domainStats[domain]) {
                domainStats[domain] = { total: 0, successful: 0 };
            }
            domainStats[domain].total++;
            if (isUp) {
                domainStats[domain].successful++;
                console.log(`${endpoint.name} is UP`);
            } else {
                console.log(`${endpoint.name} is DOWN (error)`);
            }

            if (isUp) successfulChecks++;
        }

        // Log availability percentages
        for (const domain in domainStats) {
            const { total, successful } = domainStats[domain];
            const availabilityPercentage = Math.round((successful / total) * 100);
            console.log(`${domain} has ${availabilityPercentage}% availability percentage`);
        }

        await new Promise((resolve) => setTimeout(resolve, 15000)); // Wait for 15 seconds
    }
}

monitorEndpoints().catch((error) => {
    console.error('Error monitoring endpoints:', error);
});

Run the Program
To run the program, use the following command in the terminal, replacing endpoints.yaml with the path to your YAML file:
node healthChecker.js endpoints.yaml

Stopping the Program To stop the program, press CTRL+C in the terminal.

Output
The program will log the health status of each endpoint and the availability percentage for each domain to the console every 15 seconds. For example, the expected output may look like this:

fetch index page is UP
fetch careers page is UP
fetch some fake post endpoint is DOWN (error)
fetch rewards index page is UP
fetch.com has 67% availability percentage
www.fetchrewards.com has 100% availability percentage

Notes
Ensure that the URLs in the YAML file are valid and accessible.
Modify the YAML file to include any endpoints you want to monitor.
