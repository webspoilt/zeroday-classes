"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REASONING = void 0;
exports.REASONING = [
    {
        id: 'r1',
        question: "In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written?",
        options: ["EOJDJEFM", "EOJDEJFM", "MFEDJJOE", "MFEJDJOE"],
        correct: 0,
        explanation: "Each letter is moved +1, -1 alternatively from the end."
    },
    {
        id: 'r2',
        question: "Pointing to a photograph, a man said 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
        options: ["His own", "His son's", "His father's", "His nephew's"],
        correct: 1,
        explanation: "Since he has no brother, 'father's son' is himself. So 'that man's father' is him. Therefore, it's his son."
    },
    {
        id: 'r3',
        question: "Complete the series: 2, 6, 12, 20, 30, ?",
        options: ["42", "44", "46", "48"],
        correct: 0,
        explanation: "Differences: 4, 6, 8, 10, 12. Next term = 30+12 = 42"
    },
    {
        id: 'r4',
        question: "If A > B, B > C, C > D, then which is definitely wrong?",
        options: ["A > D", "B > D", "D > A", "A > C"],
        correct: 2,
        explanation: "From A>B>C>D, we get A>D, B>D, A>C. But D>A is definitely wrong."
    },
    {
        id: 'r5',
        question: "Statements: All pens are books. Some books are pencils. Conclusions: I. Some pencils are pens II. Some books are pens",
        options: ["Only I follows", "Only II follows", "Both follow", "Neither follows"],
        correct: 1,
        explanation: "II definitely follows from 'All pens are books'. I doesn't necessarily follow."
    },
    {
        id: 'r6',
        question: "Find the odd one out: 8, 27, 64, 100, 125",
        options: ["8", "27", "64", "100"],
        correct: 3,
        explanation: "All are perfect cubes except 100 (8=2³, 27=3³, 64=4³, 125=5³)"
    },
    {
        id: 'r7',
        question: "Arrange in meaningful order: 1. Curd 2. Grass 3. Butter 4. Milk 5. Cow",
        options: ["5,2,4,1,3", "4,1,3,5,2", "2,5,4,3,1", "5,2,3,4,1"],
        correct: 0,
        explanation: "Cow eats Grass → Milk → Curd → Butter"
    },
    {
        id: 'r8',
        question: "If '+' means '×', '×' means '÷', '÷' means '+', '–' means '–', then 6 × 2 + 3 ÷ 4 – 2 = ?",
        options: ["10", "11", "12", "13"],
        correct: 1,
        explanation: "6 ÷ 2 × 3 + 4 – 2 = 3 × 3 + 4 – 2 = 9 + 4 – 2 = 11"
    },
    {
        id: 'r9',
        question: "In a row of boys, Karan is 15th from left and 20th from right. How many boys are there?",
        options: ["34", "35", "36", "37"],
        correct: 0,
        explanation: "Total = 15 + 20 - 1 = 34"
    },
    {
        id: 'r10',
        question: "Select the pair similar to: Architect : Building :: ?",
        options: ["Sculptor : Statue", "Painter : Brush", "Composer : Song", "Chef : Knife"],
        correct: 0,
        explanation: "Architect creates Building, Sculptor creates Statue."
    },
    {
        id: 'r11',
        question: "Statements: Some managers are leaders. All leaders are entrepreneurs. No entrepreneur is lazy. Conclusions: I. No leader is lazy II. Some managers are not lazy",
        options: ["Only I", "Only II", "Both", "Neither"],
        correct: 2,
        explanation: "Both follow. All leaders are entrepreneurs and no entrepreneur is lazy, so no leader is lazy. Some managers are leaders, so they are not lazy."
    },
    {
        id: 'r12',
        question: "In a code, 'TEMPORARY' is written as 'EPRMOAYRT'. How is 'PERMANENT' written?",
        options: ["EPMRANETN", "EPRMAENTN", "EPMRANNET", "EPRMANENT"],
        correct: 0,
        explanation: "Letters are rearranged in specific pattern: positions 2,4,6,8 first, then 1,3,5,7,9"
    },
    {
        id: 'r13',
        question: "Eight persons sit in a circle. A is third to the right of B and second to the left of C. If C is to the immediate right of D, who is opposite to B?",
        options: ["C", "D", "E", "F"],
        correct: 1,
        explanation: "Circular arrangement: B-_-A-C-D. D is opposite to B in the circle."
    },
    {
        id: 'r14',
        question: "Complete: 64 : 8 :: 289 : ?",
        options: ["17", "19", "21", "23"],
        correct: 0,
        explanation: "64 = 8², so 289 = 17²"
    },
    {
        id: 'r15',
        question: "If 'P × Q' means P is the sister of Q, 'P + Q' means P is the mother of Q, 'P – Q' means P is the brother of Q, then which means A is the aunt of B?",
        options: ["A × C + B", "A + C × B", "A – C + B", "A × C – B"],
        correct: 0,
        explanation: "A × C means A is sister of C. C + B means C is mother of B. So A is aunt of B."
    },
    {
        id: 'r16',
        question: "Five friends P, Q, R, S, T sit in a row. Q is between P and R. T is between R and S. If P and S are at ends, who is in the middle?",
        options: ["Q", "R", "S", "T"],
        correct: 1,
        explanation: "Arrangement: P-Q-R-T-S. R is in the middle."
    },
    {
        id: 'r17',
        question: "Statements: All roses are flowers. Some flowers are red. All red are beautiful. Conclusions: I. Some roses are beautiful II. Some flowers are beautiful",
        options: ["Only I", "Only II", "Both", "Neither"],
        correct: 1,
        explanation: "Only II follows. Some flowers are red and all red are beautiful, so some flowers are beautiful. Roses being beautiful is not definite."
    },
    {
        id: 'r18',
        question: "Find the missing number: 2, 5, 11, 23, 47, ?",
        options: ["95", "96", "97", "98"],
        correct: 0,
        explanation: "Pattern: ×2+1, ×2+1... 47×2+1 = 95"
    },
    {
        id: 'r19',
        question: "If WATER is written as YCVGT, then what is written as HKTG?",
        options: ["FIRE", "FARE", "FACE", "FADE"],
        correct: 0,
        explanation: "Each letter +2. So HKTG-2 = FIRE"
    },
    {
        id: 'r20',
        question: "Six persons A, B, C, D, E, F are sitting around a hexagon. A is between B and C. D is between E and F. If B is opposite to E, who is opposite to C?",
        options: ["D", "E", "F", "A"],
        correct: 2,
        explanation: "Hexagon arrangement: A between B-C, D between E-F. B opposite E, so C is opposite F."
    },
    {
        id: 'r21',
        question: "Statements: No table is wood. Some woods are chairs. All chairs are stones. Conclusions: I. Some stones are woods II. No table is chair",
        options: ["Only I", "Only II", "Both", "Neither"],
        correct: 0,
        explanation: "Only I follows. Some woods are chairs and all chairs are stones, so some stones are woods. No definite relation between table and chair."
    },
    {
        id: 'r22',
        question: "In a certain code, '253' means 'books are old', '546' means 'man is old' and '378' means 'buy good books'. What stands for 'are'?",
        options: ["2", "5", "3", "Cannot be determined"],
        correct: 0,
        explanation: "Comparing: 'old' = 5 (common in first two). 'books' = 3 (common in first and third). So in '253', if 3=books and 5=old, then 2=are."
    },
    {
        id: 'r23',
        question: "Pointing to a woman, Nirmal said, 'She is the daughter of my wife's grandfather's only child.' How is the woman related to Nirmal?",
        options: ["Wife", "Sister-in-law", "Sister", "Data inadequate"],
        correct: 0,
        explanation: "Wife's grandfather's only child = wife's parent. Daughter of wife's parent = wife's sister or wife herself. Since Nirmal is pointing, it's his wife."
    },
    {
        id: 'r24',
        question: "Find the wrong number: 125, 106, 88, 76, 65, 58, 53",
        options: ["88", "76", "65", "58"],
        correct: 0,
        explanation: "Differences should be decreasing by 1: 19, 17, 15, 13, 11, 9. But 106-88=18 (should be 17). So 88 is wrong."
    },
    {
        id: 'r25',
        question: "If 'sky' is called 'blue', 'blue' is called 'water', 'water' is called 'colour', 'colour' is called 'rain', 'rain' is called 'summer', then where do fish live?",
        options: ["Sky", "Blue", "Colour", "Rain"],
        correct: 1,
        explanation: "Fish live in water, and water is called 'blue'."
    },
    {
        id: 'r26',
        question: "Seven boxes P, Q, R, S, T, U, V are placed one above another. R is immediately above T. P is immediately below Q. V is topmost. S is above U but below Q. Which is at the bottom?",
        options: ["T", "U", "P", "Cannot be determined"],
        correct: 0,
        explanation: "Order: V-Q-P-S-U-R-T. T is at the bottom."
    },
    {
        id: 'r27',
        question: "Complete the analogy: 42 : 56 :: 110 : ?",
        options: ["132", "136", "140", "156"],
        correct: 0,
        explanation: "42 = 6×7, 56 = 7×8. 110 = 10×11, so next = 11×12 = 132"
    },
    {
        id: 'r28',
        question: "Statements: All phones are computers. No computer is a TV. Some TVs are radios. Conclusions: I. No phone is a TV II. Some radios are not computers",
        options: ["Only I", "Only II", "Both", "Neither"],
        correct: 2,
        explanation: "Both follow. All phones are computers and no computer is TV, so no phone is TV. Some TVs are radios and no TV is computer, so some radios are not computers."
    },
    {
        id: 'r29',
        question: "If 'P $ Q' means P is father of Q, 'P # Q' means P is mother of Q, 'P @ Q' means P is wife of Q, then which means N is grandmother of M?",
        options: ["N # P $ M", "N @ P # M", "N # P @ M", "N $ P # M"],
        correct: 0,
        explanation: "N # P means N is mother of P. P $ M means P is father of M. So N is grandmother of M."
    },
    {
        id: 'r30',
        question: "In a row of girls, Shilpa is 8th from left and Reena is 17th from right. If they interchange positions, Shilpa becomes 14th from left. How many girls are there?",
        options: ["28", "29", "30", "32"],
        correct: 2,
        explanation: "Shilpa's new position 14th from left = Reena's old position 17th from right. Total = 14+17-1 = 30"
    }
];
