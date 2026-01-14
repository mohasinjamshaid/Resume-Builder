// resume.js - Handles resume form inputs, live preview, and data binding

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('resume-form');
    const skillsList = document.getElementById('skills-list');
    const addSkillBtn = document.getElementById('add-skill');
    const skillInput = document.getElementById('skill-input');
    let skills = [];
    const downloadBtn = document.getElementById('download-resume');
    const ctaCreateBtn = document.getElementById('cta-create');
    const ctaDemoBtn = document.getElementById('cta-demo');

    // Initialize
    loadUserDataInternal();
    
    // Animate stats when they come into view
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const targetValue = stat.textContent;
            
            // Skip if already animated
            if (stat.dataset.animated) return;
            
            // For demo purposes, we'll just add a simple animation effect
            setTimeout(() => {
                stat.style.fontWeight = '800';
                stat.style.transform = 'scale(1.1)';
                stat.style.transition = 'transform 0.3s ease, font-weight 0.3s ease';
                stat.dataset.animated = 'true';
            }, 300);
        });
    }
    
    // Call animateStats when page loads
    if (document.querySelector('.hero-stats')) {
        setTimeout(animateStats, 1000);
    }

    // Two-way data binding for inputs
    if (form) {
        form.addEventListener('input', function() {
            updatePreview();
            saveResumeData();
        });
    }

    // Handle skills
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            const skill = skillInput.value.trim();
            if (skill && !skills.includes(skill)) {
                skills.push(skill);
                renderSkills();
                skillInput.value = '';
                updatePreview();
                saveResumeData();
            }
        });
    }

    if (skillsList) {
        skillsList.addEventListener('click', function(e) {
            if (e.target.classList.contains('skill-tag')) {
                const skill = e.target.textContent;
                skills = skills.filter(s => s !== skill);
                renderSkills();
                updatePreview();
                saveResumeData();
            }
        });
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(){
            window.print();
        });
    }
    
    // Hero section button event handlers
    if (ctaCreateBtn) {
        ctaCreateBtn.addEventListener('click', function() {
            document.getElementById('landing-section').classList.add('hidden');
            document.getElementById('resume-section').classList.remove('hidden');
        });
    }
    
    if (ctaDemoBtn) {
        ctaDemoBtn.addEventListener('click', function() {
            // Show sample data in the form
            document.getElementById('name').value = 'John Doe';
            document.getElementById('email').value = 'john.doe@example.com';
            document.getElementById('phone').value = '+1 (555) 123-4567';
            document.getElementById('location').value = 'New York, NY';
            document.getElementById('linkedin').value = 'linkedin.com/in/johndoe';
            document.getElementById('summary').value = 'Experienced professional with expertise in software development and project management.';
            document.getElementById('degree').value = 'Bachelor of Science in Computer Science';
            document.getElementById('institution').value = 'University of Technology';
            document.getElementById('year').value = '2020';
            document.getElementById('cgpa').value = '3.8';
            
            // Add sample skills
            skills = ['JavaScript', 'React', 'Node.js', 'Project Management'];
            renderSkills();
            
            // Add sample experience
            document.getElementById('exp-title').value = 'Software Engineer';
            document.getElementById('exp-org').value = 'Tech Solutions Inc.';
            document.getElementById('exp-duration').value = 'Jan 2021 - Present';
            document.getElementById('exp-desc').value = 'Developed and maintained web applications using modern technologies.';
            
            document.getElementById('achievements').value = 'Certified AWS Developer, Led team of 5 developers on major project';
            
            // Update preview and show resume section
            updatePreview();
            document.getElementById('landing-section').classList.add('hidden');
            document.getElementById('resume-section').classList.remove('hidden');
        });
    }

    function renderSkills() {
        if (!skillsList) return;
        skillsList.innerHTML = skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    }

    function updatePreview() {
        const byId = id => document.getElementById(id);
        const setText = (id, text, fallback='') => { const el = byId(id); if(el) el.textContent = text || fallback; };

        setText('preview-name', byId('name') ? byId('name').value : '', 'Your Name');
        setText('preview-email', byId('email') ? byId('email').value : '');
        setText('preview-phone', byId('phone') ? byId('phone').value : '');
        setText('preview-location', byId('location') ? byId('location').value : '');
        setText('preview-linkedin', byId('linkedin') ? byId('linkedin').value : '');
        setText('preview-summary', byId('summary') ? byId('summary').value : '');

        const degree = byId('degree') ? byId('degree').value : '';
        const inst = byId('institution') ? byId('institution').value : '';
        const year = byId('year') ? byId('year').value : '';
        const cgpa = byId('cgpa') ? byId('cgpa').value : '';
        setText('preview-education', `${degree}${degree || inst ? ' from ' : ''}${inst}${year ? ', ' + year : ''}${cgpa ? ' (CGPA: ' + cgpa + ')' : ''}`);

        const previewSkills = byId('preview-skills');
        if (previewSkills) previewSkills.innerHTML = skills.map(skill => `<span>${skill}</span>`).join('');

        const previewExp = byId('preview-experience');
        if (previewExp) {
            const title = byId('exp-title') ? byId('exp-title').value : '';
            const org = byId('exp-org') ? byId('exp-org').value : '';
            const dur = byId('exp-duration') ? byId('exp-duration').value : '';
            const desc = byId('exp-desc') ? byId('exp-desc').value : '';
            previewExp.innerHTML = `<strong>${title}</strong>${org ? ' at ' + org : ''}${dur ? '<br>' + dur : ''}${desc ? '<br>' + desc : ''}`;
        }

        setText('preview-achievements', byId('achievements') ? byId('achievements').value : '');
    }

    function saveResumeData() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return;
        const userData = getUserData(currentUser) || {};
        userData.resume = {
            name: document.getElementById('name') ? document.getElementById('name').value : '',
            email: document.getElementById('email') ? document.getElementById('email').value : '',
            phone: document.getElementById('phone') ? document.getElementById('phone').value : '',
            location: document.getElementById('location') ? document.getElementById('location').value : '',
            linkedin: document.getElementById('linkedin') ? document.getElementById('linkedin').value : '',
            summary: document.getElementById('summary') ? document.getElementById('summary').value : '',
            degree: document.getElementById('degree') ? document.getElementById('degree').value : '',
            institution: document.getElementById('institution') ? document.getElementById('institution').value : '',
            year: document.getElementById('year') ? document.getElementById('year').value : '',
            cgpa: document.getElementById('cgpa') ? document.getElementById('cgpa').value : '',
            skills: skills,
            expTitle: document.getElementById('exp-title') ? document.getElementById('exp-title').value : '',
            expOrg: document.getElementById('exp-org') ? document.getElementById('exp-org').value : '',
            expDuration: document.getElementById('exp-duration') ? document.getElementById('exp-duration').value : '',
            expDesc: document.getElementById('exp-desc') ? document.getElementById('exp-desc').value : '',
            achievements: document.getElementById('achievements') ? document.getElementById('achievements').value : ''
        };
        saveUserData(currentUser, userData);
    }

    function loadUserDataInternal(){
        // storage.loadUserData will populate basic fields, then we sync skills and preview
        loadUserData();
        const currentUser = localStorage.getItem('currentUser');
        if(!currentUser) return;
        const userData = getUserData(currentUser) || {};
        if(userData.resume && userData.resume.skills){
            skills = userData.resume.skills.slice();
        }
        renderSkills();
        updatePreview();
    }
});
