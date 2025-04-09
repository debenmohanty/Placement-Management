// API Configuration
const API_URL = 'http://localhost:5001/api';

// Dashboard Functions
async function fetchDashboardData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`${API_URL}/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            updateDashboardUI(data);
        } else {
            throw new Error('Failed to fetch dashboard data');
        }
    } catch (error) {
        console.error('Dashboard error:', error);
        alert('Failed to load dashboard data');
    }
}

function updateDashboardUI(data) {
    // Update user info and welcome message
    const user = getCurrentUser();
    if (user) {
        // Update welcome message
        const welcomeElement = document.getElementById('welcomeMessage');
        if (welcomeElement) {
            welcomeElement.innerHTML = `Welcome, <span class="user-name">${user.name}</span>!`;
        }

        // Update user info in profile section if it exists
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = user.name;
        }

        const userRoleElement = document.getElementById('userRole');
        if (userRoleElement) {
            userRoleElement.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        }
    }

    // Update stats
    if (data.stats) {
        document.getElementById('totalJobs').textContent = data.stats.totalJobs || 0;
        document.getElementById('totalApplications').textContent = data.stats.totalApplications || 0;
        document.getElementById('activeCompanies').textContent = data.stats.activeCompanies || 0;
    }

    // Update recent jobs
    if (data.recentJobs && data.recentJobs.length > 0) {
        const jobsContainer = document.getElementById('recentJobs');
        if (jobsContainer) {
            jobsContainer.innerHTML = data.recentJobs.map(job => `
                <div class="job-card">
                    <h3>${job.title}</h3>
                    <p>${job.company}</p>
                    <p>${job.location}</p>
                    <a href="job-detail.html?id=${job.id}" class="btn btn-primary">View Details</a>
                </div>
            `).join('');
        }
    }

    // Update recent applications
    if (data.recentApplications && data.recentApplications.length > 0) {
        const applicationsContainer = document.getElementById('recentApplications');
        if (applicationsContainer) {
            applicationsContainer.innerHTML = data.recentApplications.map(app => `
                <div class="application-card">
                    <h3>${app.jobTitle}</h3>
                    <p>Status: ${app.status}</p>
                    <p>Applied on: ${new Date(app.appliedAt).toLocaleDateString()}</p>
                    <a href="application-detail.html?id=${app.id}" class="btn btn-primary">View Details</a>
                </div>
            `).join('');
        }
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (isAuthenticated()) {
        fetchDashboardData();
    } else {
        window.location.href = 'login.html';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Logout functionality
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real application, you would destroy the session here
            // For now, just redirect to login page
            window.location.href = 'login.html';
        });
    }
    
    // Apply for job functionality
    const applyButtons = document.querySelectorAll('.btn-apply');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobTitle = this.closest('.job-card').querySelector('h3').textContent;
            const company = this.closest('.job-card').querySelector('.company-name').textContent;
            
            // In a real application, this would send an application to the backend
            alert(`Application submitted for ${jobTitle} at ${company}!`);
            this.textContent = 'Applied';
            this.disabled = true;
            this.style.backgroundColor = '#95a5a6';
        });
    });
    
    // Event registration functionality
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.addEventListener('click', function() {
            const eventName = this.querySelector('h3').textContent;
            const eventDate = this.querySelector('.date').textContent + ' ' + 
                              this.querySelector('.month').textContent;
            
            const isRegistered = this.classList.contains('registered');
            
            if (!isRegistered) {
                // In a real application, this would register the user for the event
                alert(`You have registered for "${eventName}" on ${eventDate}`);
                this.classList.add('registered');
                this.style.borderLeft = '4px solid var(--success-color)';
            }
        });
    });
    
    // Accept/Decline mentorship requests (for faculty dashboard)
    const actionButtons = document.querySelectorAll('.btn-accept, .btn-decline');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const requestCard = this.closest('.request-card');
            const studentName = requestCard.querySelector('h4').textContent;
            const action = this.classList.contains('btn-accept') ? 'accepted' : 'declined';
            
            // In a real application, this would update the mentorship request status
            alert(`You have ${action} the mentorship request from ${studentName}`);
            requestCard.style.opacity = '0.6';
            requestCard.style.pointerEvents = 'none';
        });
    });
    
    // Post Job functionality (for company dashboard)
    const postJobForm = document.getElementById('postJobForm');
    if (postJobForm) {
        postJobForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const jobTitle = document.getElementById('jobTitle').value;
            const jobType = document.getElementById('jobType').value;
            
            // In a real application, this would submit the job posting to the backend
            alert(`Job "${jobTitle}" has been posted successfully!`);
            this.reset();
        });
    }
}); 