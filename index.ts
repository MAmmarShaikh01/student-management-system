import inquirer from "inquirer";

interface StudentData {
    name: string;
    course: string;
    id: number;
    curBalance?: number;
}
let id: number[] = []
class Student {
    constructor(public data: StudentData) { }

    get fees(): string {
        if (this.data.curBalance && this.data.curBalance >= 1500) {
            return "paid";
        }
        return "unpaid";
    }

    getDetails(): string {
        return `${this.data.name} is enrolled in ${this.data.course} course. ID: ${this.data.id}. Fees status: ${this.fees}`;
    }
}

const students: Student[] = [];

function enrollStudent(name: string, course: string, id: number): void {
    const newStudent = new Student({ name, course, id });
    students.push(newStudent);
}

async function promptEnrollment(): Promise<void> {
    const answers = await inquirer.prompt([
        {
            name: "name",
            message: "Enter student's name:",
            type: "input",
        },
        {
            name: "course",
            message: "Select course:",
            type: "list",
            choices: ["Typescript", "Javascript", "Python"],
        },
    ]);

    const id = generateId();
    enrollStudent(answers.name, answers.course, id);
    console.log("Student enrolled successfully!");
}

async function promptAction(): Promise<void> {
    const { action } = await inquirer.prompt({
        name: "action",
        message: "Select an option:",
        type: "list",
        choices: ["Enroll", "View status", "Pay fees", "veiw students", "Exit"],
    });

    switch (action) {
        case "Enroll":
            await promptEnrollment();
            break;
        case "View status":
            await viewStudentStatus();
            break;
        case "Pay fees":
            await payFees();
            break;
        case "Exit":
            console.log("Exiting...");
            process.exit();
        case "veiw students":
            students.forEach((stud) => { if (stud.data.name) console.log(stud.data.name) })
    }
}

async function viewStudentStatus(): Promise<void> {
    const { studentName } = await inquirer.prompt({
        name: "studentName",
        message: "Enter student's name:",
        type: "input",
    });

    const student = students.find((s) => s.data.name === studentName);
    if (student) {
        console.log(student.getDetails());
    } else {
        console.log("Student not found.");
    }
}

async function payFees(): Promise<void> {
    const { studentName, amount } = await inquirer.prompt([
        {
            name: "studentName",
            message: "Enter student's name:",
            type: "input",
        },
        {
            name: "amount",
            message: "Enter amount to pay:",
            type: "number",
        },
    ]);

    const student = students.find((s) => s.data.name === studentName);
    if (student) {
        if (!student.data.curBalance) {
            student.data.curBalance = amount;
        } else {
            student.data.curBalance += amount;
        }
        console.log("Payment successful!");
    } else {
        console.log("Student not found.");
    }
}

function generateId(): number {
    // Generate unique 5-digit ID
    // return Math.floor(10000 + Math.random() * 90000);
    let main = Math.floor(10000 + Math.random() * 90000);
    const newId = id.find((s) => s === main);
    if (!newId) {
        id.push(main)
        return main
    } else {
        return generateId()
    }
}

async function main(): Promise<void> {
    console.log("Welcome to Student Management System!");

    while (true) {
        await promptAction();
    }
}

main().catch(error => console.error("There was an error:", error));
