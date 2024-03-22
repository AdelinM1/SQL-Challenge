const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Lexington14!',
    database: 'employee_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Listen for connection errors
pool.on('error', (err) => {
    console.error('MySQL connection error:', err);
});

async function getAllDepartments() {
    const [rows, fields] = await pool.query('SELECT * FROM department');
    return rows;
}

async function getAllRoles() {
    const [rows, fields] = await pool.query('SELECT * FROM role');
    return rows;
}

async function getAllEmployees() {
    const [rows, fields] = await pool.query('SELECT * FROM employee');
    return rows;
}

async function addDepartment(departmentName) {
    await pool.query('INSERT INTO department (name) VALUES (?)', [departmentName]);
}

async function addRole(title, salary, departmentId) {
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
}

async function addEmployee(firstName, lastName, roleId, managerId) {
    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
}

async function updateEmployeeRole(employeeId, roleId) {
    await pool.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
}

module.exports = {
    getAllDepartments,
    getAllRoles,
    getAllEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole
};