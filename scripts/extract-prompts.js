const fs = require('fs');
// We know require('pdf-parse') returns an object with PDFParse class
const pdfModule = require('pdf-parse');
const { PDFParse } = pdfModule;

async function run() {
    try {
        console.log('Reading file...');
        const buffer = fs.readFileSync('ESTRUTURA PROMPTS - COM EXEMPLO USO - v18.02 - final.pdf');

        // Convert Buffer to Uint8Array for the library
        const data = new Uint8Array(buffer);

        console.log('Instantiating PDFParse...');
        const parser = new PDFParse({ data });

        console.log('Extracting text...');
        const result = await parser.getText();

        console.log('Extracted text length:', result.text.length);
        fs.writeFileSync('prompts-dump.txt', result.text);
        console.log('Successfully saved to prompts-dump.txt');

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
