const inquirer = require('inquirer');
const { getAllDepartments, getAllRoles, getAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./db/database.js');

// Function to start the application
async function startApp() {
    console.log('Employee Tracker');

    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    });

    switch (action) {
        case 'View all departments':
            await viewAllDepartments();
            break;
        case 'View all roles':
            await viewAllRoles();
            break;
        case 'View all employees':
            await viewAllEmployees();
            break;
        case 'Add a department':
            await promptAddDepartment();
            break;
        case 'Add a role':
            await promptAddRole();
            break;
        case 'Add an employee':
            await promptAddEmployee();
            break;
        case 'Update an employee role':
            await promptUpdateEmployeeRole();
            break;
        case 'Exit':
            console.log('Exiting...');
            process.exit();
    }
}

// Function to view all departments
async function viewAllDepartments() {
    const departments = await getAllDepartments();
    console.table(departments);
    startApp();
}

// Function to view all roles
async function viewAllRoles() {
    const roles = await getAllRoles();
    console.table(roles);
    startApp();
}

// Function to view all employees
async function viewAllEmployees() {
    const employees = await getAllEmployees();
    console.table(employees);
    startApp();
}

// Function to prompt user to add a department
async function promptAddDepartment() {
    const { departmentName } = await inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:'
    });

    await addDepartment(departmentName);
    console.log(`Department "${departmentName}" added successfully.`);
    startApp();
}

async function promptAddRole() {
    const departments = await getAllDepartments();
    const departmentChoices = departments.map(department => ({ name: department.name, value: department.id }));

    const { title, salary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:'
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department for the role:',
            choices: departmentChoices
        }
    ]);

    await addRole(title, salary, departmentId);
    console.log(`Role "${title}" added successfully.`);
    startApp();
}

// Function to prompt user to add an employee
async function promptAddEmployee() {
    const roles = await getAllRoles();
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the role for the employee:',
            choices: roleChoices
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'Enter the manager ID for the employee (if applicable):'
        }
    ]);

    await addEmployee(firstName, lastName, roleId, managerId);
    console.log(`Employee "${firstName} ${lastName}" added successfully.`);
    startApp();
}

// Function to prompt user to update an employee role
async function promptUpdateEmployeeRole() {
    const employees = await getAllEmployees();
    const employeeChoices = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));

    const roles = await getAllRoles();
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

    const { employeeId, roleId } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Select the new role for the employee:',
            choices: roleChoices
        }
    ]);

    await updateEmployeeRole(employeeId, roleId);
    console.log(`Employee's role updated successfully.`);
    startApp();
}

// Start application
startApp();