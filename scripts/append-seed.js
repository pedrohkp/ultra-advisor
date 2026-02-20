const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '../seed.sql');
const insertPath = path.join(__dirname, '../insert_prompts.sql');

try {
    const seedContent = fs.readFileSync(seedPath, 'utf8');
    const insertContent = fs.readFileSync(insertPath, 'utf8');

    // Add a newline before appending if not present
    const separator = seedContent.endsWith('\n') ? '' : '\n';

    fs.appendFileSync(seedPath, separator + insertContent, 'utf8');
    console.log('Successfully appended insert_prompts.sql to seed.sql');
} catch (error) {
    console.error('Error appending files:', error);
    process.exit(1);
}
