// Check authentication and load dashboard data
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');

    if (!token || !userRole) {
        window.location.href = 'login.html';
        return;
    }

    // Update welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userRoleSpan = document.getElementById('userRole');
    
    if (welcomeMessage) {
        welcomeMessage.innerHTML = `Welcome, <span class="user-name">${userName}</span>!`;
    }
    
    if (userRoleSpan) {
        userRoleSpan.textContent = userRole.charAt(0).toUpperCase() + userRole.slice(1);
    }

    try {
        // Load dashboard data based on user role
        switch (userRole) {
            case 'student':
                await loadStudentDashboard();
                break;
            case 'company':
                await loadCompanyDashboard();
                break;
            case 'faculty':
                await loadFacultyDashboard();
                break;
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Failed to load dashboard data');
    }
});

// Load student dashboard data
async function loadStudentDashboard() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/student/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load dashboard data');
        }

        const data = await response.json();
        
        // Update stats
        document.getElementById('appliedJobs').textContent = data.stats.appliedJobs;
        document.getElementById('shortlisted').textContent = data.stats.shortlisted;
        document.getElementById('interviews').textContent = data.stats.interviews;
        
        // Update recent jobs
        const jobsGrid = document.getElementById('recentJobs');
        if (jobsGrid) {
            jobsGrid.innerHTML = data.recentJobs.map(job => `
                <div class="job-card">
                    <h4>${job.title}</h4>
                    <p>${job.company}</p>
                    <p>${job.location}</p>
                    <button onclick="viewJob('${job.id}')">View Details</button>
                </div>
            `).join('');
        }
        
        // Update applications
        const applicationsGrid = document.getElementById('applications');
        if (applicationsGrid) {
            applicationsGrid.innerHTML = data.applications.map(app => `
                <div class="application-card">
                    <h4>${app.jobTitle}</h4>
                    <p>Status: ${app.status}</p>
                    <p>Applied: ${new Date(app.appliedDate).toLocaleDateString()}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading student dashboard:', error);
        showError('Failed to load student dashboard data');
    }
}

// Load company dashboard data
async function loadCompanyDashboard() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/company/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load dashboard data');
        }

        const data = await response.json();
        
        // Update stats
        document.getElementById('activeJobs').textContent = data.stats.activeJobs;
        document.getElementById('totalApplications').textContent = data.stats.totalApplications;
        document.getElementById('shortlisted').textContent = data.stats.shortlisted;
        
        // Update job postings
        const jobsGrid = document.getElementById('jobPostings');
        if (jobsGrid) {
            jobsGrid.innerHTML = data.jobPostings.map(job => `
                <div class="job-card">
                    <h4>${job.title}</h4>
                    <p>Type: ${job.type}</p>
                    <p>Applications: ${job.applicationCount}</p>
                    <button onclick="viewJob('${job.id}')">View Details</button>
                </div>
            `).join('');
        }
        
        // Update recent applications
        const applicationsGrid = document.getElementById('recentApplications');
        if (applicationsGrid) {
            applicationsGrid.innerHTML = data.recentApplications.map(app => `
                <div class="application-card">
                    <h4>${app.studentName}</h4>
                    <p>Applied for: ${app.jobTitle}</p>
                    <p>Status: ${app.status}</p>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading company dashboard:', error);
        showError('Failed to load company dashboard data');
    }
}

// Load faculty dashboard data
async function loadFacultyDashboard() {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/faculty/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load dashboard data');
        }

        const data = await response.json();
        
        // Update stats
        document.getElementById('totalStudents').textContent = data.stats.totalStudents;
        document.getElementById('placedStudents').textContent = data.stats.placedStudents;
        document.getElementById('mentorshipRequests').textContent = data.stats.mentorshipRequests;
        
        // Update recent activities
        const activitiesGrid = document.getElementById('recentActivities');
        if (activitiesGrid) {
            activitiesGrid.innerHTML = data.recentActivities.map(activity => `
                <div class="activity-card">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <p>Date: ${new Date(activity.date).toLocaleDateString()}</p>
                </div>
            `).join('');
        }
        
        // Update mentorship requests
        const requestsGrid = document.getElementById('mentorshipRequests');
        if (requestsGrid) {
            requestsGrid.innerHTML = data.mentorshipRequests.map(request => `
                <div class="request-card">
                    <h4>${request.studentName}</h4>
                    <p>Request: ${request.requestType}</p>
                    <p>Status: ${request.status}</p>
                    <button onclick="handleMentorshipRequest('${request.id}', 'accept')">Accept</button>
                    <button onclick="handleMentorshipRequest('${request.id}', 'reject')">Reject</button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading faculty dashboard:', error);
        showError('Failed to load faculty dashboard data');
    }
}

// Helper function to show error messages
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Logout functionality
document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = 'login.html';
}); 