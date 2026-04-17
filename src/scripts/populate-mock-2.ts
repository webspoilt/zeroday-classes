import { MATH } from '../data/ossc-cgl/math';
import { DI } from '../data/ossc-cgl/di';
import { REASONING } from '../data/ossc-cgl/reasoning';
import { CURRENT_AFFAIRS } from '../data/ossc-cgl/current-affairs';
import { COMPUTER } from '../data/ossc-cgl/computer';
import { ODISHA_GK } from '../data/ossc-cgl/odisha-gk';
import * as fs from 'fs';
import * as path from 'path';

function generateQuestionHTML(q: any, index: number): string {
    const letters = ['a', 'b', 'c', 'd'];
    const correctLetter = letters[q.correct];
    
    let html = `<div class="q-card" data-correct="${correctLetter}">\n`;
    html += `  <span class="q-num">Q.${index + 1}</span>\n`;
    html += `  <div class="q-text">${q.question}</div>\n`;
    html += `  <div class="options">\n`;
    
    q.options.forEach((opt: string, i: number) => {
        html += `    <div class="option" data-opt="${letters[i]}"><span class="opt-letter">${letters[i].toUpperCase()}</span> ${opt}</div>\n`;
    });
    
    html += `  </div>\n`;
    html += `  <div class="explanation">${q.explanation}</div>\n`;
    html += `</div>\n`;
    
    return html;
}

const mock2File = path.join(__dirname, '../../public/mocks/OSSC_CGL_Mock_2_2026.html');
let content = fs.readFileSync(mock2File, 'utf8');

// Build the list of 150 questions
const questions: any[] = [
    ...MATH.slice(0, 25),      // 1-25
    ...DI.slice(0, 20),        // 26-45
    ...REASONING,              // 46-75
    ...CURRENT_AFFAIRS,        // 76-105
    ...MATH.slice(25, 30),     // 106-110 (using rest of math)
    ...COMPUTER,               // 111-120
    ...DI.slice(20, 25),       // 121-125 (using more from DI)
    ...ODISHA_GK,              // 126-145
    ...DI.slice(25, 30)        // 146-150 (using rest of DI)
];

console.log(`Gathered ${questions.length} questions.`);

// We need to replace the entire section of questions
// From Part 1 to Part 6
// I'll identify the markers in the HTML

const startMarker = '<!-- ============ PART 1: ARITHMETIC (Q1-25) ============ -->';
const endMarker = '<div class="controls">';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Markers not found!");
    process.exit(1);
}

let newSections = '';

// Generate Part 1
newSections += `<div class="section-divider">\n  <h2>1. Arithmetic - 10th Standard</h2>\n  <span class="badge">Q.1-25</span>\n</div>\n`;
for(let i=0; i<25; i++) newSections += generateQuestionHTML(questions[i], i);

// Generate Part 2
newSections += `<div class="section-divider">\n  <h2>2. Data Interpretation</h2>\n  <span class="badge">Q.26-45</span>\n</div>\n`;
for(let i=25; i<45; i++) newSections += generateQuestionHTML(questions[i], i);

// Generate Part 3
newSections += `<div class="section-divider">\n  <h2>3. Logical Reasoning</h2>\n  <span class="badge">Q.46-75</span>\n</div>\n`;
for(let i=45; i<75; i++) newSections += generateQuestionHTML(questions[i], i);

// Generate Part 4
newSections += `<div class="section-divider">\n  <h2>4. Current Events (National & International)</h2>\n  <span class="badge">Q.76-110</span>\n</div>\n`;
for(let i=75; i<110; i++) newSections += generateQuestionHTML(questions[i], i);

// Generate Part 5
newSections += `<div class="section-divider">\n  <h2>5. Computer Awareness</h2>\n  <span class="badge">Q.111-125</span>\n</div>\n`;
for(let i=110; i<125; i++) newSections += generateQuestionHTML(questions[i], i);

// Generate Part 6
newSections += `<div class="section-divider">\n  <h2>6. Odisha GK (History, Geo, Culture)</h2>\n  <span class="badge">Q.126-150</span>\n</div>\n`;
for(let i=125; i<150; i++) newSections += generateQuestionHTML(questions[i], i);

const newContent = content.substring(0, startIndex) + newSections + '\n' + content.substring(endIndex);

fs.writeFileSync(mock2File, newContent);
console.log("Mock 2 populated with 150 questions!");
