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
