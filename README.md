# Health-Check-Monitor-for-HTTP-Endpoints

This program checks the health of a set of HTTP endpoints specified in a YAML configuration file. It monitors the endpoints every 15 seconds and logs their availability percentages to the console.

Make sure you have Node.js installed on your machine. You can download it from nodejs.org.
Prepare a YAML file with the HTTP endpoints you want to monitor. You can use vs code and bash. Follow below steps:


mkdir health-checker or create the folder in vs code and run the below commands.

cd health-checker

npm init -y

npm install axios js-yaml

axios is for making HTTP requests.

js-yaml is for parsing YAML files.

Create a file named endpoints.yaml in the project directory with the content of endpoints.yaml.

Create another file named healthChecker.js with the content of healthChecker.js file.

To run the program, use the following command in the terminal, replacing endpoints.yaml with the path to your YAML file:

node healthChecker.js endpoints.yaml

To stop the program, press CTRL+C in the terminal.

The program will log the health status of each endpoint and the availability percentage for each domain to the console every 15 seconds. For example, the expected output may look like this:

fetch index page is UP

fetch careers page is UP

fetch some fake post endpoint is DOWN (error)

fetch rewards index page is UP

fetch.com has 67% availability percentage

www.fetchrewards.com has 100% availability percentage

Make sure that the URLs in the YAML file are valid and accessible.
Modify the YAML file to include any endpoints you want to monitor.
