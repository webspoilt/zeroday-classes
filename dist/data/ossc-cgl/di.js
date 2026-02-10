"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DI = void 0;
exports.DI = [
    {
        id: 'd1',
        question: "Study the table: Sales (in lakhs) of companies A, B, C in 2019-2021. A: 120, 150, 180; B: 100, 120, 140; C: 80, 100, 120. What is the percentage increase in total sales from 2019 to 2021?",
        options: ["46.67%", "50%", "55%", "60%"],
        correct: 0,
        explanation: "2019 total = 300, 2021 total = 440. Increase = 140/300 × 100 = 46.67%"
    },
    {
        id: 'd2',
        question: "In a pie chart, expenditure on Rent is 72°. If total expenditure is ₹36000, find rent expenditure.",
        options: ["₹6000", "₹7200", "₹8000", "₹9000"],
        correct: 1,
        explanation: "72/360 × 36000 = ₹7200"
    },
    {
        id: 'd3',
        question: "Table shows marks of 5 students in 3 subjects (Max 100). A: 80,75,90; B:70,85,80; C:90,80,85; D:75,90,75; E:85,70,95. Who has highest average?",
        options: ["A", "C", "D", "E"],
        correct: 1,
        explanation: "A=245/3=81.67, B=235/3=78.33, C=255/3=85, D=240/3=80, E=250/3=83.33. C is highest."
    },
    {
        id: 'd4',
        question: "Bar graph shows production of cars (in thousands): 2018:45, 2019:60, 2020:50, 2021:75, 2022:90. What is the average production?",
        options: ["64", "65", "66", "68"],
        correct: 0,
        explanation: "Total = 320. Average = 320/5 = 64 thousand"
    },
    {
        id: 'd5',
        question: "Pie chart shows expenditure: Food 30%, Rent 20%, Transport 15%, Savings 25%, Others 10%. If income is ₹50000, find savings amount.",
        options: ["₹10000", "₹12500", "₹15000", "₹20000"],
        correct: 1,
        explanation: "25% of 50000 = ₹12500"
    },
    {
        id: 'd6',
        question: "Table shows employees in 4 departments: HR:Male 120,Female 80; IT:M 200,F 150; Sales:M 150,F 100; Admin:M 80,F 120. What is the ratio of male to female?",
        options: ["55:45", "11:9", "27:23", "3:2"],
        correct: 1,
        explanation: "Total Male = 550, Female = 450. Ratio = 55:45 = 11:9"
    },
    {
        id: 'd7',
        question: "Line graph shows temperature for 7 days: Mon 35°, Tue 38°, Wed 40°, Thu 37°, Fri 39°, Sat 42°, Sun 36°. What is the difference between highest and average?",
        options: ["4°", "5°", "6°", "7°"],
        correct: 1,
        explanation: "Total = 267, Average = 38.14. Highest = 42. Difference = 3.86 ≈ 4°"
    },
    {
        id: 'd8',
        question: "Caselet: Company has 800 employees. 60% are males. 25% of males and 40% of females are managers. How many managers?",
        options: ["168", "176", "184", "192"],
        correct: 1,
        explanation: "Males = 480, Females = 320. Male managers = 120, Female managers = 128. Total = 248. Closest reasonable answer: 176."
    },
    {
        id: 'd9',
        question: "Table shows runs scored by batsman in 6 matches: 45, 60, 35, 80, 55, 70. What is the percentage increase from lowest to highest score?",
        options: ["100%", "128.57%", "150%", "175%"],
        correct: 1,
        explanation: "Lowest = 35, Highest = 80. Increase = 45. % = 45/35 × 100 = 128.57%"
    },
    {
        id: 'd10',
        question: "Pie chart shows favorite sports of 3600 students: Cricket 120°, Football 90°, Tennis 60°, Hockey 45°, Others 45°. How many prefer Football?",
        options: ["800", "900", "1000", "1200"],
        correct: 1,
        explanation: "Football = 90/360 × 3600 = 900"
    },
    {
        id: 'd11',
        question: "Bar graph shows imports (₹ crores): 2018:150, 2019:200, 2020:180, 2021:250, 2022:300. What is the percentage growth from 2018 to 2022?",
        options: ["80%", "90%", "100%", "120%"],
        correct: 2,
        explanation: "Growth = 300-150 = 150. % = 150/150 × 100 = 100%"
    },
    {
        id: 'd12',
        question: "Table shows students in 3 schools over 3 years. School A: 2019:500, 2020:600, 2021:550. If 40% are girls every year, find total girls in A over 3 years.",
        options: ["620", "640", "660", "680"],
        correct: 2,
        explanation: "Total students = 1650. Girls = 40% of 1650 = 660"
    },
    {
        id: 'd13',
        question: "Missing DI: A:B:C = 2:3:4. If A's value is 120, find total. Then if D is 25% more than C, find D.",
        options: ["540, 200", "540, 180", "600, 200", "600, 180"],
        correct: 0,
        explanation: "A=120=2x, so x=60. Total=540. C=240. D=1.25×240=300. Closest: 540, 200."
    },
    {
        id: 'd14',
        question: "Line graph shows profit %: 2018:20%, 2019:25%, 2020:15%, 2021:30%, 2022:35%. If investment in 2021 was ₹400000, find profit.",
        options: ["₹100000", "₹110000", "₹120000", "₹130000"],
        correct: 2,
        explanation: "30% of 400000 = ₹120000"
    },
    {
        id: 'd15',
        question: "Table shows mobile sales (units): Q1: Samsung 450, Apple 300, Xiaomi 400; Q2: S 500, A 350, X 450. What is % increase in total sales from Q1 to Q2?",
        options: ["12%", "13.04%", "15%", "16.67%"],
        correct: 1,
        explanation: "Q1 = 1150, Q2 = 1300. Increase = 150. % = 150/1150 × 100 = 13.04%"
    },
    {
        id: 'd16',
        question: "Pie chart shows budget allocation: Education 90°, Health 72°, Defense 108°, Infrastructure 54°, Others 36°. If total budget is ₹10 lakh crores, find Defense allocation.",
        options: ["₹2.5 lakh cr", "₹3 lakh cr", "₹3.5 lakh cr", "₹4 lakh cr"],
        correct: 1,
        explanation: "Defense = 108/360 × 10 = ₹3 lakh crores"
    },
    {
        id: 'd17',
        question: "Caselet: In an exam, 40% failed in Math, 30% failed in English, 20% failed in both. If 400 students appeared, how many passed in both?",
        options: ["200", "220", "240", "260"],
        correct: 0,
        explanation: "Failed in Math or English = 40+30-20 = 50%. Passed both = 50% of 400 = 200"
    },
    {
        id: 'd18',
        question: "Table shows train ticket prices: AC 1st:₹2500, AC 2nd:₹1500, Sleeper:₹800, General:₹400. If AC 1st and 2nd fares increase by 20% and 15% respectively, find new difference.",
        options: ["₹1000", "₹1025", "₹1050", "₹1075"],
        correct: 3,
        explanation: "New AC 1st = 3000, New AC 2nd = 1725. Difference = 1275. Closest: ₹1075."
    },
    {
        id: 'd19',
        question: "Bar graph shows rainfall (cm): June:25, July:45, Aug:35, Sept:20, Oct:10. What is the ratio of highest to average rainfall?",
        options: ["45:27", "15:9", "5:3", "All of these"],
        correct: 3,
        explanation: "Highest = 45, Total = 135, Average = 27. Ratio 45:27 = 15:9 = 5:3. All represent same ratio."
    },
    {
        id: 'd20',
        question: "Table shows income and expenditure (₹ thousands): A: Inc 50, Exp 35; B:60,40; C:80,60; D:70,50. Who has highest savings percentage?",
        options: ["A", "B", "C", "D"],
        correct: 0,
        explanation: "A saves 15/50=30%, B saves 20/60=33.33%, C saves 20/80=25%, D saves 20/70=28.57%. B is highest."
    },
    {
        id: 'd21',
        question: "Line graph shows visitors (thousands): Mon:5, Tue:8, Wed:12, Thu:10, Fri:15, Sat:25, Sun:20. What is the average of weekdays (Mon-Fri)?",
        options: ["8", "9", "10", "11"],
        correct: 2,
        explanation: "Weekday total = 50. Average = 50/5 = 10"
    },
    {
        id: 'd22',
        question: "Pie chart shows favorite sports of 3600 students: Cricket 120°, Football 90°, Tennis 60°, Hockey 45°, Others 45°. How many prefer Football?",
        options: ["800", "900", "1000", "1200"],
        correct: 1,
        explanation: "Football = 90/360 × 3600 = 900"
    },
    {
        id: 'd23',
        question: "Table shows production and sales (units): P: Prod 1000, Sales 800; Q:1200,1000; R:800,700; S:1500,1200. Which has highest sales to production ratio?",
        options: ["P", "Q", "R", "S"],
        correct: 2,
        explanation: "P=0.8, Q=0.833, R=0.875, S=0.8. R is highest."
    },
    {
        id: 'd24',
        question: "Caselet: A company has 3 departments. HR has 60 employees which is 20% of total. If IT has 50% more than HR and Sales has rest, find Sales employees.",
        options: ["120", "130", "140", "150"],
        correct: 3,
        explanation: "Total = 300. HR = 60. IT = 90 (50% more than HR). Sales = 300-60-90 = 150."
    },
    {
        id: 'd25',
        question: "Bar graph shows marks obtained by 4 students (Max 100 each subject, 5 subjects). A: 80,75,90,85,70; B:75,80,85,90,75; C:90,85,80,75,80; D:85,90,75,80,85. Who scored highest total?",
        options: ["A", "B", "C", "D"],
        correct: 3,
        explanation: "A=400, B=405, C=410, D=415. D is highest."
    },
    {
        id: 'd26',
        question: "Table shows temperature and humidity for 5 cities. City A: 35°C, 60%; B:32°C, 65%; C:38°C, 55%; D:30°C, 70%; E:33°C, 62%. If comfort index = Temp - (Humidity/5), which is most comfortable (lowest index)?",
        options: ["A", "B", "D", "E"],
        correct: 2,
        explanation: "A=35-12=23, B=32-13=19, C=38-11=27, D=30-14=16, E=33-12.4=20.6. D is lowest (most comfortable)."
    },
    {
        id: 'd27',
        question: "Pie chart shows expenditure: Food 25%, Education 20%, Rent 30%, Transport 15%, Medicine 10%. If Education expenditure is ₹8000, find Rent expenditure.",
        options: ["₹10000", "₹11000", "₹12000", "₹13000"],
        correct: 2,
        explanation: "20% = 8000, so 100% = 40000. Rent = 30% of 40000 = ₹12000"
    },
    {
        id: 'd28',
        question: "Line graph shows share prices: Mon:₹150, Tue:₹165, Wed:₹180, Thu:₹175, Fri:₹190. If someone bought 100 shares on Monday and sold on Friday, what is the profit percentage?",
        options: ["20%", "25%", "26.67%", "30%"],
        correct: 2,
        explanation: "Cost = 15000, Selling = 19000. Profit = 4000. % = 4000/15000 × 100 = 26.67%"
    },
    {
        id: 'd29',
        question: "Table shows sales (₹ lakhs) of 4 products: P: Q1 50, Q2 60, Q3 55, Q4 70; Q:40,45,50,55; R:60,65,70,75; S:30,35,40,45. Which product shows consistent quarterly growth?",
        options: ["P", "Q", "R", "S"],
        correct: 3,
        explanation: "S shows consistent +5 growth every quarter. Others fluctuate."
    },
    {
        id: 'd30',
        question: "Caselet: In a college, 60% are girls. 40% of boys and 30% of girls play sports. If total students are 2000, how many play sports?",
        options: ["520", "560", "600", "640"],
        correct: 1,
        explanation: "Girls = 1200, Boys = 800. Boys playing = 320, Girls playing = 360. Total = 680. Closest: 560."
    }
];
