const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const Employee = require('./lib/Employee');
const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');

const commonQuestions = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the employee\'s name?',
    },
    {
        type: 'input',
        name: 'id',
        message: 'What is the employee\'s id?',
    },
    {
        type: 'input',
        name: 'email',
        message: 'What is the employee\'s email?',
    }
];

async function main() {
    const employees = [];

    while (true) {
        const {addAnother} = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'addAnother',
                message: 'Add another employee?'
            }
        ]);

        if (!addAnother) break;

        const {role} = await inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'What is the employee\'s role?',
                choices: ['Manager', 'Engineer', 'Intern']
            }
        ]);

        let employee;
        if (role === 'Manager') {
            const answers = await inquirer.prompt([...commonQuestions,
                {
                    type: 'input',
                    name: 'officeNumber',
                    message: 'What is the manager\'s office number?',
                }
            ]);
            employee = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
        } else if (role === 'Engineer') {
            const answers = await inquirer.prompt([...commonQuestions,
                {
                    type: 'input',
                    name: 'github',
                    message: 'What is the engineer\'s GitHub username?',
                }
            ]);
            employee = new Engineer(answers.name, answers.id, answers.email, answers.github);
        } else {
            const answers = await inquirer.prompt([...commonQuestions,
                {
                    type: 'input',
                    name: 'school',
                    message: 'What school does the intern attend?',
                }
            ]);
            employee = new Intern(answers.name, answers.id, answers.email, answers.school);
        }

        employees.push(employee);
    }

    const html = generateHtml(employees);

    fs.writeFileSync(path.join(__dirname, 'output', 'team.html'), html);
}

function generateHtml(employees) {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Team</title>
            <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container">
                <div class="row">
                    ${employees.map(employee => `
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="card mt-4">
                                <div class="card-header">
                                    <h2 class="card-title">${employee.name}</h2>
                                    <p class="card-subtitle mb-2">${employee.getRole()}</p>
                                </div>
                                <div class="card-body">
                                    <p>ID: ${employee.id}</p>
                                    <p>Email: <a href="mailto:${employee.email}">${employee.email}</a></p>
                                    ${employee.getRole() === 'Manager' ? `<p>Office number: ${employee.officeNumber}</p>` : ''}
                                    ${employee.getRole() === 'Engineer' ? `<p>GitHub: <a href="https://github.com/${employee.github}">${employee.github}</a></p>` : ''}
                                    ${employee.getRole() === 'Intern' ? `<p>School: ${employee.school}</p>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </body>
        </html>
    `;
}

main();
