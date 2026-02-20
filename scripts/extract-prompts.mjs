import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pdfPath = 'ESTRUTURA PROMPTS - COM EXEMPLO USO - v18.02 - final.pdf';
const buffer = fs.readFileSync(pdfPath);

// Try to require the CJS file directly as specified in package.json "main"
const pdfParseModule = require('pdf-parse/dist/pdf-parse/cjs/index.cjs');

console.log('Module keys:', Object.keys(pdfParseModule));

// If it has a default export or is a function
let pdfFunc = pdfParseModule.default || pdfParseModule;

// If it's an object with PDFParse function inside
if (typeof pdfFunc !== 'function' && pdfFunc.PDFParse) {
    pdfFunc = pdfFunc.PDFParse;
}

console.log('Using function:', typeof pdfFunc);

try {
    const data = await pdfFunc(buffer);
    console.log('Extracted text length:', data.text.length);
    fs.writeFileSync('prompts-dump.txt', data.text);
    console.log('Success!');
} catch (e) {
    console.error('Error:', e);
}
