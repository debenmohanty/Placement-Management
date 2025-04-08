document.addEventListener('DOMContentLoaded', function() {
    // Toggle between login and register forms
    const registerToggle = document.getElementById('registerToggle');
    const loginToggle = document.getElementById('loginToggle');
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');
    
    if (registerToggle) {
        registerToggle.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        });
    }
    
    if (loginToggle) {
        loginToggle.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }
    
    // Show/hide additional fields based on role selection
    const regRole = document.getElementById('regRole');
    const studentFields = document.getElementById('studentFields');
    const companyFields = document.getElementById('companyFields');
    
    if (regRole) {
        regRole.addEventListener('change', function() {
            if (this.value === 'student') {
                studentFields.classList.remove('hidden');
                companyFields.classList.add('hidden');
            } else if (this.value === 'company') {
                companyFields.classList.remove('hidden');
                studentFields.classList.add('hidden');
            } else {
                studentFields.classList.add('hidden');
                companyFields.classList.add('hidden');
            }
        });
    }
    
    // Handle login form submission
    const loginFormEl = document.getElementById('loginForm');
    if (loginFormEl) {
        loginFormEl.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            
            // This is just frontend validation and routing
            // In a real application, these credentials would be validated against a database
            if (email && password && role) {
                // Redirect to appropriate dashboard based on role
                if (role === 'student') {
                    window.location.href = 'dashboard-student.html';
                } else if (role === 'faculty') {
                    window.location.href = 'dashboard-faculty.html';
                } else if (role === 'company') {
                    window.location.href = 'dashboard-company.html';
                }
            } else {
                alert('Please fill in all fields');
            }
        });
    }
    
    // Handle register form submission
    const registerFormEl = document.getElementById('registerForm');
    if (registerFormEl) {
        registerFormEl.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;
            
            // This is just frontend validation
            // In a real application, this data would be sent to a server to create a user account
            if (fullName && email && password && role) {
                alert('Registration successful! Please login with your credentials.');
                registerForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            } else {
                alert('Please fill in all required fields');
            }
        });
    }
}); 