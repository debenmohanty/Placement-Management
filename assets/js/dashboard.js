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