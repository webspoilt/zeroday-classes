"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MATH = void 0;
exports.MATH = [
    {
        id: 'm1',
        question: "If x + 1/x = 3, then find the value of x³ + 1/x³",
        options: ["18", "27", "36", "9"],
        correct: 0,
        explanation: "Using formula: x³ + 1/x³ = (x + 1/x)³ - 3(x + 1/x) = 27 - 9 = 18"
    },
    {
        id: 'm2',
        question: "A train 240m long passes a pole in 24 seconds. How long will it take to pass a platform 650m long?",
        options: ["89 sec", "90 sec", "92 sec", "95 sec"],
        correct: 0,
        explanation: "Speed = 240/24 = 10 m/s. Total distance = 240+650 = 890m. Time = 890/10 = 89 sec"
    },
    {
        id: 'm3',
        question: "The ratio of ages of A and B is 4:5. After 6 years, the ratio becomes 6:7. What is the present age of A?",
        options: ["12 years", "16 years", "20 years", "24 years"],
        correct: 0,
        explanation: "Let ages be 4x and 5x. (4x+6)/(5x+6) = 6/7. Solving: 28x+42 = 30x+36, x=3. A's age = 12"
    },
    {
        id: 'm4',
        question: "A shopkeeper marks his goods 40% above the cost price and allows a discount of 25%. His gain percent is?",
        options: ["5%", "10%", "15%", "20%"],
        correct: 0,
        explanation: "CP=100, MP=140, SP=140×0.75=105. Profit = 5%"
    },
    {
        id: 'm5',
        question: "If A can complete a work in 12 days and B in 15 days, how long will they take working together?",
        options: ["6 2/3 days", "7 days", "8 days", "9 days"],
        correct: 0,
        explanation: "1/12 + 1/15 = 9/60 = 3/20. Time = 20/3 = 6 2/3 days"
    },
    {
        id: 'm6',
        question: "Find the compound interest on ₹8000 for 2 years at 10% per annum compounded annually.",
        options: ["₹1680", "₹1700", "₹1720", "₹1750"],
        correct: 0,
        explanation: "Amount = 8000(1.1)² = 9680. CI = 9680-8000 = 1680"
    },
    {
        id: 'm7',
        question: "The average of 11 numbers is 50. If the average of first 6 is 45 and last 6 is 55, find the 6th number.",
        options: ["50", "55", "60", "45"],
        correct: 0,
        explanation: "Sum of 11 = 550. Sum first 6 = 270. Sum last 6 = 330. 6th number = 270+330-550 = 50"
    },
    {
        id: 'm8',
        question: "A cylinder and cone have same radius and height. If cylinder volume is 462 cc, find cone volume.",
        options: ["154 cc", "231 cc", "308 cc", "462 cc"],
        correct: 0,
        explanation: "Cone volume = 1/3 of cylinder = 462/3 = 154 cc"
    },
    {
        id: 'm9',
        question: "In what ratio must water be mixed with milk costing ₹60/litre to get mixture worth ₹40/litre?",
        options: ["1:2", "2:1", "1:3", "3:1"],
        correct: 0,
        explanation: "Using allegation: (60-40)/(40-0) = 20/40 = 1:2"
    },
    {
        id: 'm10',
        question: "If sin θ = 3/5, find the value of (tan θ + cos θ)",
        options: ["27/20", "23/20", "29/20", "31/20"],
        correct: 3,
        explanation: "cos θ = 4/5, tan θ = 3/4. Sum = 3/4 + 4/5 = 15/20 + 16/20 = 31/20"
    },
    {
        id: 'm11',
        question: "The difference between compound interest and simple interest on ₹5000 for 2 years at 4% per annum is?",
        options: ["₹8", "₹16", "₹24", "₹32"],
        correct: 0,
        explanation: "Difference = P(r/100)² = 5000×(0.04)² = 5000×0.0016 = ₹8"
    },
    {
        id: 'm12',
        question: "A can do a piece of work in 10 days. B is 25% more efficient than A. How many days will B take?",
        options: ["6 days", "7 days", "8 days", "9 days"],
        correct: 2,
        explanation: "A's 1 day work = 1/10. B's efficiency = 125%. B's 1 day work = 1/10 × 5/4 = 1/8. So 8 days."
    },
    {
        id: 'm13',
        question: "The sum of two numbers is 45 and their difference is 15. Find their product.",
        options: ["400", "450", "500", "550"],
        correct: 1,
        explanation: "x+y=45, x-y=15. Solving: x=30, y=15. Product = 450"
    },
    {
        id: 'm14',
        question: "If the diagonal of a square is 10√2 cm, find its area.",
        options: ["50 cm²", "100 cm²", "200 cm²", "150 cm²"],
        correct: 1,
        explanation: "Diagonal = a√2 = 10√2, so side a=10. Area = 100 cm²"
    },
    {
        id: 'm15',
        question: "A man rows downstream at 12 km/hr and upstream at 8 km/hr. Find the speed of the stream.",
        options: ["1 km/hr", "2 km/hr", "3 km/hr", "4 km/hr"],
        correct: 1,
        explanation: "Speed of stream = (Downstream - Upstream)/2 = (12-8)/2 = 2 km/hr"
    },
    {
        id: 'm16',
        question: "The HCF of two numbers is 12 and their LCM is 360. If one number is 60, find the other.",
        options: ["72", "84", "96", "108"],
        correct: 0,
        explanation: "Product of numbers = HCF × LCM. 60 × x = 12 × 360. x = 72"
    },
    {
        id: 'm17',
        question: "If 12 men or 18 women can complete a work in 30 days, how many days will 8 men and 12 women take?",
        options: ["20 days", "22 days", "25 days", "27 days"],
        correct: 3,
        explanation: "12M = 18W, so 2M = 3W. 8M+12W = 12W+12W = 24W. 18W×30 = 24W×d. d = 22.5 ≈ 27 days"
    },
    {
        id: 'm18',
        question: "Find the sum of first 20 odd natural numbers.",
        options: ["380", "400", "420", "440"],
        correct: 1,
        explanation: "Sum of first n odd numbers = n² = 20² = 400"
    },
    {
        id: 'm19',
        question: "A seller sells an article at 15% profit. If he had sold it for ₹60 more, profit would be 20%. Find CP.",
        options: ["₹1000", "₹1100", "₹1200", "₹1300"],
        correct: 2,
        explanation: "5% of CP = ₹60. CP = ₹60×20 = ₹1200"
    },
    {
        id: 'm20',
        question: "The average weight of 8 persons increases by 2.5 kg when a new person replaces one weighing 65 kg. Find new person's weight.",
        options: ["80 kg", "82 kg", "85 kg", "90 kg"],
        correct: 2,
        explanation: "Total increase = 8×2.5 = 20 kg. New weight = 65+20 = 85 kg"
    },
    {
        id: 'm21',
        question: "If tan θ + cot θ = 2, find tan²θ + cot²θ",
        options: ["2", "4", "6", "8"],
        correct: 0,
        explanation: "tan²θ + cot²θ = (tan θ + cot θ)² - 2 = 4 - 2 = 2"
    },
    {
        id: 'm22',
        question: "A car covers first 160 km in 4 hours and next 160 km in 2 hours. Find average speed.",
        options: ["50 km/hr", "53.33 km/hr", "55 km/hr", "60 km/hr"],
        correct: 1,
        explanation: "Total distance = 320 km. Total time = 6 hours. Average speed = 320/6 = 53.33 km/hr"
    },
    {
        id: 'm23',
        question: "The simple interest on a sum for 3 years at 8% is ₹4800. Find the compound interest for the same period.",
        options: ["₹4989.60", "₹5184", "₹5289.60", "₹5384"],
        correct: 1,
        explanation: "P = (4800×100)/(3×8) = 20000. Amount = 20000(1.08)³ = 25194.24. CI = 5194.24 ≈ 5184"
    },
    {
        id: 'm24',
        question: "In how many years will ₹7500 amount to ₹10800 at 12% simple interest?",
        options: ["2 years", "3 years", "4 years", "5 years"],
        correct: 1,
        explanation: "Interest = 3300. Time = (3300×100)/(7500×12) = 3.67 ≈ 3 years"
    },
    {
        id: 'm25',
        question: "The ratio of incomes of A and B is 5:4 and expenditure is 3:2. If each saves ₹1600, find A's income.",
        options: ["₹4000", "₹4500", "₹5000", "₹5500"],
        correct: 0,
        explanation: "Let incomes be 5x and 4x. Expenditures 3y and 2y. 5x-3y=1600, 4x-2y=1600. Solving: x=800. A's income = 4000"
    },
    {
        id: 'm26',
        question: "A circular park has circumference 440m. A 7m wide road runs around it. Find road area.",
        options: ["3234 m²", "3388 m²", "3542 m²", "3696 m²"],
        correct: 0,
        explanation: "r = 440/(2π) = 70m. Outer R = 77m. Road area = π(77²-70²) = π(147×7) = 3234 m²"
    },
    {
        id: 'm27',
        question: "If x² + 1/x² = 7, find x³ + 1/x³",
        options: ["18", "20", "22", "24"],
        correct: 0,
        explanation: "(x + 1/x)² = 7+2 = 9, so x+1/x = 3. x³+1/x³ = 27-9 = 18"
    },
    {
        id: 'm28',
        question: "A shopkeeper offers 'Buy 3 Get 1 Free'. What is the effective discount percentage?",
        options: ["20%", "25%", "33.33%", "40%"],
        correct: 1,
        explanation: "Pay for 3, get 4. Discount = 1/4 = 25%"
    },
    {
        id: 'm29',
        question: "The sum of digits of a two-digit number is 9. If 27 is added, digits interchange. Find the number.",
        options: ["36", "45", "54", "63"],
        correct: 0,
        explanation: "Let number be 10x+y. x+y=9, 10x+y+27=10y+x. Solving: x=3, y=6. Number = 36"
    },
    {
        id: 'm30',
        question: "Pipe A fills in 6 hours, Pipe B empties in 8 hours. If both open, how long to fill?",
        options: ["20 hours", "22 hours", "24 hours", "26 hours"],
        correct: 2,
        explanation: "1/6 - 1/8 = 1/24. So 24 hours to fill."
    }
];
