import fs from 'fs';

const content = fs.readFileSync('c:/Users/vishn/OneDrive/Desktop/udhbavana/src/data/raw_bus_data.csv', 'utf-8');
const lines = content.split(/\r?\n/);

console.log('--- Checking Sheet 1 (lines 1 to 250) ---');
for (let i = 0; i < 250; i++) {
  const line = lines[i];
  if (line.includes('Kodumon') || line.includes('AVHS') || line.includes('Bhagavathippadi') || line.includes('Cherukole')) {
    console.log(`${i+1}: ${line}`);
  }
}

