// API Configuration
const API_URL = 'http://localhost:5001';

// Auth Functions
async function login(email, password, role) {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect based on role
            switch(role) {
                case 'student':
                    window.location.href = 'dashboard-student.html';
                    break;
                case 'company':
                    window.location.href = 'dashboard-company.html';
                    break;
                case 'faculty':
                    window.location.href = 'dashboard-faculty.html';
                    break;
                default:
                    window.location.href = 'index.html';
            }
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message);
    }
}

async function register(userData) {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message);
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Toggle between login and register forms
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');
    const loginToggle = document.getElementById('loginToggle');
    const registerToggle = document.getElementById('registerToggle');

    if (loginToggle && registerToggle) {
        loginToggle.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });

        registerToggle.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        });
    }

    // Show/hide additional fields based on role
    const regRoleSelect = document.getElementById('regRole');
    const studentFields = document.getElementById('studentFields');
    const companyFields = document.getElementById('companyFields');

    if (regRoleSelect) {
        regRoleSelect.addEventListener('change', function() {
            if (studentFields && companyFields) {
                studentFields.classList.add('hidden');
                companyFields.classList.add('hidden');
                
                if (this.value === 'student') {
                    studentFields.classList.remove('hidden');
                } else if (this.value === 'company') {
                    companyFields.classList.remove('hidden');
                }
            }
        });
    }

    // Login form
    const loginFormEl = document.getElementById('loginForm');
    if (loginFormEl) {
        loginFormEl.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            login(email, password, role);
        });
    }

    // Register form
    const registerFormEl = document.getElementById('registerForm');
    if (registerFormEl) {
        registerFormEl.addEventListener('submit', function(e) {
            e.preventDefault();
            const role = document.getElementById('regRole').value;
            const userData = {
                name: document.getElementById('fullName').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value,
                role: role
            };

            // Add additional fields based on role
            if (role === 'student') {
                userData.rollNumber = document.getElementById('rollNumber').value;
                userData.branch = document.getElementById('branch').value;
            } else if (role === 'company') {
                userData.companyName = document.getElementById('companyName').value;
                userData.industry = document.getElementById('industry').value;
            }

            register(userData);
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}); 