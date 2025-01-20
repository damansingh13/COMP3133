const fs = require('fs');
const csv = require('csv-parser');

const inputFilePath = './input_countries.csv';
const canadaFilePath = './canada.txt';
const usaFilePath = './usa.txt';

try {
    if (fs.existsSync(canadaFilePath)) fs.unlinkSync(canadaFilePath);
    if (fs.existsSync(usaFilePath)) fs.unlinkSync(usaFilePath);

    fs.writeFileSync(canadaFilePath, 'country,year,population\n');
    fs.writeFileSync(usaFilePath, 'country,year,population\n');
} catch (error) {
    console.error('Error during file handling:', error);
    process.exit(1);
}

let canadaCount = 0;
let usaCount = 0;

fs.createReadStream(inputFilePath)
    .pipe(csv())
    .on('data', (row) => {
        const { country, year, population } = row;
        const line = `${country},${year},${population}\n`;

        if (country.toLowerCase() === 'canada') {
            fs.appendFileSync(canadaFilePath, line);
            canadaCount++;
        } else if (country.toLowerCase() === 'united states') {
            fs.appendFileSync(usaFilePath, line);
            usaCount++;
        }
    })
    .on('end', () => {
        console.log('Processing complete.');
        console.log(`Total records for Canada: ${canadaCount}`);
        console.log(`Total records for United States: ${usaCount}`);
    })
    .on('error', (error) => {
        console.error('Error reading the CSV file:', error);
    });
