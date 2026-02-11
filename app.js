// TaskFlow Pro - Project Management System
// By Ofekpoint for Yuval

// Data Structure
const PROJECTS = {
    'רם אדרת': { icon: '🏢', color: '#4f46e5' },
    'נצרת': { icon: '⛪', color: '#06b6d4' },
    'AITECH': { icon: '🚀', color: '#10b981' },
    'מפעל הפיס': { icon: '🎰', color: '#f59e0b' }
};

const DEVELOPERS = ['ולאד', 'זאק', 'סרגי', 'ניקולה'];

const CONTACTS = {
    'רם אדרת': [
        { name: 'לאה', role: 'מנהלת פרויקטים חיצונית', phone: '052-5610052', email: '' },
        { name: 'אשרת', role: 'סמנכלית משאבי אנוש', phone: '050-4442093', email: '' },
        { name: 'מיקי', role: 'מנמ"ר', phone: '054-3001724', email: '' },
        { name: 'אורן גלבוע', role: 'IT', phone: '054-4445387', email: '' }
    ],
    'נצרת': [
        { name: 'רנא', role: 'מנהלת רכש וכספים', phone: '054-6209963', email: '' },
        { name: 'איימן', role: 'מנהל פרויקטים פרילנסר', phone: '050-6492975', email: '' }
    ],
    'AITECH': [
        { name: 'עופר', role: 'מנמ"ר', phone: '050-5428073', email: '' },
        { name: 'איתי', role: 'מנהל פרויקטים', phone: '058-7343769', email: '' },
        { name: 'ענת', role: 'אשת קשר מאפיינת', phone: '054-2555875', email: '' }
    ],
    'מפעל הפיס': [
        { name: 'דוד', role: 'מנהל פרויקטים', phone: '054-8029999', email: '' },
        { name: 'יוסי', role: 'מנהל של דוד', phone: '054-4694271', email: '' },
        { name: 'ערן', role: 'איש IT', phone: '054-7383919', email: '' }
    ]
};

const STATUS_COLORS = {
    'תכנון': '#94a3b8',
    'ממתין לתמחור': '#f59e0b',
    'ממתין לאישור': '#fbbf24',
    'בפיתוח': '#3b82f6',
    'בבדיקות': '#8b5cf6',
    'פידבקים': '#ec4899',
    'הושהה': '#ef4444',
    'גמור': '#10b981'
};

class TaskFlowApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentView = 'project'; // 'project' or 'developer'
        this.editingTaskId = null;
        this.init();
    }

    init() {
        this.renderContactsDirectory();
        this.renderView();
        this.setupEventListeners();
        this.populateProjectDropdown();
    }

    setupEventListeners() {
        document.getElementById('addTaskBtn').addEventListener('click', () => this.openTaskModal());
        document.getElementById('toggleView').addEventListener('click', () => this.toggleView());
        document.getElementById('dashboardBtn').addEventListener('click', () => this.openDashboard());
        document.getElementById('taskForm').addEventListener('submit', (e) => this.saveTask(e));
        document.getElementById('taskProject').addEventListener('change', (e) => this.updateContactDropdown(e.target.value));
    }

    toggleView() {
        this.currentView = this.currentView === 'project' ? 'developer' : 'project';
        const projectView = document.getElementById('projectView');
        const developerView = document.getElementById('developerView');
        const viewLabel = document.getElementById('viewLabel');

        if (this.currentView === 'project') {
            projectView.classList.add('active');
            developerView.classList.remove('active');
            viewLabel.textContent = 'מבט לפי מתכנת';
        } else {
            projectView.classList.remove('active');
            developerView.classList.add('active');
            viewLabel.textContent = 'מבט לפי פרויקט';
        }

        this.renderView();
    }

    renderView() {
        if (this.currentView === 'project') {
            this.renderProjectView();
        } else {
            this.renderDeveloperView();
        }
    }

    renderContactsDirectory() {
        const contactsGrid = document.getElementById('contactsGrid');
        contactsGrid.innerHTML = '';

        Object.entries(CONTACTS).forEach(([project, contacts]) => {
            contacts.forEach(contact => {
                const card = document.createElement('div');
                card.className = 'contact-card';
                card.innerHTML = `
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-role">${project} - ${contact.role}</div>
                    <div class="contact-info">
                        ${contact.phone ? `<div><i class="fas fa-phone"></i> ${contact.phone}</div>` : ''}
                        ${contact.email ? `<div><i class="fas fa-envelope"></i> ${contact.email}</div>` : ''}
                    </div>
                `;
                contactsGrid.appendChild(card);
            });
        });
    }

    renderProjectView() {
        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = '';

        Object.entries(PROJECTS).forEach(([projectName, projectData]) => {
            const projectTasks = this.tasks.filter(t => t.project === projectName);
            
            const section = document.createElement('div');
            section.className = 'project-section';
            
            section.innerHTML = `
                <div class="project-header" style="background: linear-gradient(135deg, ${projectData.color} 0%, ${this.darkenColor(projectData.color)} 100%)">
                    <div class="project-title">
                        <span>${projectData.icon}</span>
                        <span>${projectName}</span>
                    </div>
                    <div class="project-badge">${projectTasks.length} משימות</div>
                </div>
                <div class="tasks-container" id="project-${projectName}"></div>
            `;
            
            grid.appendChild(section);

            const container = document.getElementById(`project-${projectName}`);
            if (projectTasks.length === 0) {
                container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>אין משימות בפרויקט זה</p></div>';
            } else {
                projectTasks.forEach(task => {
                    container.appendChild(this.createTaskCard(task, 'project'));
                });
            }
        });
    }

    renderDeveloperView() {
        const grid = document.getElementById('developersGrid');
        grid.innerHTML = '';

        DEVELOPERS.forEach((developer, index) => {
            const devTasks = this.tasks.filter(t => t.developer === developer);
            const colors = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'];
            
            const section = document.createElement('div');
            section.className = 'project-section';
            
            section.innerHTML = `
                <div class="project-header" style="background: linear-gradient(135deg, ${colors[index]} 0%, ${this.darkenColor(colors[index])} 100%)">
                    <div class="project-title">
                        <i class="fas fa-user-tie"></i>
                        <span>${developer}</span>
                    </div>
                    <div class="project-badge">${devTasks.length} משימות</div>
                </div>
                <div class="tasks-container" id="dev-${developer}"></div>
            `;
            
            grid.appendChild(section);

            const container = document.getElementById(`dev-${developer}`);
            if (devTasks.length === 0) {
                container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>אין משימות למפתח זה</p></div>';
            } else {
                devTasks.forEach(task => {
                    container.appendChild(this.createTaskCard(task, 'developer'));
                });
            }
        });
    }

    createTaskCard(task, viewType = 'project') {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.style.borderRightColor = STATUS_COLORS[task.status] || '#4f46e5';
        
        // במבט לפי מתכנת - הצג את הפרויקט
        // במבט לפי פרויקט - הצג את המתכנת
        const displayTag = viewType === 'developer' 
            ? `<span class="task-tag" style="background: ${PROJECTS[task.project]?.color}20; color: ${PROJECTS[task.project]?.color}">
                   <i class="fas fa-folder"></i> ${task.project}
               </span>`
            : `<span class="task-tag tag-developer">
                   <i class="fas fa-user-tie"></i> ${task.developer}
               </span>`;
        
        card.innerHTML = `
            <div class="task-header">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                <div class="task-actions">
                    <button onclick="app.editTask('${task.id}')" title="עריכה">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="app.deleteTask('${task.id}')" title="מחיקה">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button onclick="app.viewTaskDetails('${task.id}')" title="פרטים">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="task-meta">
                ${displayTag}
                <span class="task-tag tag-contact">
                    <i class="fas fa-user"></i> ${task.contact}
                </span>
                <span class="task-tag tag-status" style="background: ${STATUS_COLORS[task.status]}20; color: ${STATUS_COLORS[task.status]}">
                    ${task.status}
                </span>
            </div>
            ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
        `;
        
        return card;
    }

    openTaskModal(taskId = null) {
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        
        form.reset();
        this.editingTaskId = taskId;
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> עריכת משימה';
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskProject').value = task.project;
            this.updateContactDropdown(task.project);
            document.getElementById('taskContact').value = task.contact;
            document.getElementById('taskDeveloper').value = task.developer;
            document.getElementById('taskStatus').value = task.status;
            document.getElementById('taskDescription').value = task.description || '';
        } else {
            document.getElementById('modalTitle').innerHTML = '<i class="fas fa-plus-circle"></i> משימה חדשה';
        }
        
        modal.classList.add('active');
    }

    saveTask(e) {
        e.preventDefault();
        
        const taskData = {
            id: this.editingTaskId || Date.now().toString(),
            title: document.getElementById('taskTitle').value,
            project: document.getElementById('taskProject').value,
            developer: document.getElementById('taskDeveloper').value,
            contact: document.getElementById('taskContact').value,
            status: document.getElementById('taskStatus').value,
            description: document.getElementById('taskDescription').value,
            notes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const note = document.getElementById('taskNote').value.trim();
        if (note) {
            taskData.notes.push({
                text: note,
                timestamp: new Date().toISOString(),
                author: 'מנהל המערכת'
            });
        }

        if (this.editingTaskId) {
            const index = this.tasks.findIndex(t => t.id === this.editingTaskId);
            const existingNotes = this.tasks[index].notes || [];
            taskData.notes = [...existingNotes, ...taskData.notes];
            this.tasks[index] = taskData;
        } else {
            this.tasks.push(taskData);
        }

        this.saveTasks();
        this.closeTaskModal();
        this.renderView();
    }

    editTask(taskId) {
        this.openTaskModal(taskId);
    }

    deleteTask(taskId) {
        if (confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderView();
        }
    }

    viewTaskDetails(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        const modal = document.getElementById('taskDetailsModal');
        const content = document.getElementById('taskDetailsContent');
        const title = document.getElementById('detailsTitle');
        
        title.innerHTML = `<i class="fas fa-info-circle"></i> ${this.escapeHtml(task.title)}`;
        
        const notesHTML = task.notes && task.notes.length > 0 
            ? task.notes.map(note => `
                <div class="note-item" style="background: var(--light); padding: 0.75rem; border-radius: 6px; margin-bottom: 0.5rem;">
                    <div style="color: var(--gray); font-size: 0.85rem; margin-bottom: 0.25rem;">
                        <i class="fas fa-clock"></i> ${new Date(note.timestamp).toLocaleString('he-IL')}
                    </div>
                    <div>${this.escapeHtml(note.text)}</div>
                </div>
            `).join('')
            : '<p style="color: var(--gray);">אין הערות</p>';
        
        content.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-folder"></i> פרוייקט</h4>
                <p>${task.project}</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-user-tie"></i> מתכנת</h4>
                <p>${task.developer}</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-user"></i> איש קשר</h4>
                <p>${task.contact}</p>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <h4 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-tasks"></i> סטטוס</h4>
                <span style="background: ${STATUS_COLORS[task.status]}20; color: ${STATUS_COLORS[task.status]}; padding: 0.5rem 1rem; border-radius: 6px; display: inline-block;">
                    ${task.status}
                </span>
            </div>
            ${task.description ? `
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-align-left"></i> תיאור</h4>
                    <p>${this.escapeHtml(task.description)}</p>
                </div>
            ` : ''}
            <div>
                <h4 style="color: var(--dark); margin-bottom: 0.5rem;"><i class="fas fa-comments"></i> היסטוריית הערות</h4>
                ${notesHTML}
            </div>
        `;
        
        modal.classList.add('active');
    }

    openDashboard() {
        const modal = document.getElementById('dashboardModal');
        
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'גמור').length;
        const inProgress = this.tasks.filter(t => ['בפיתוח', 'בבדיקות'].includes(t.status)).length;
        const pending = this.tasks.filter(t => ['תכנון', 'ממתין לתמחור', 'ממתין לאישור'].includes(t.status)).length;
        
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('inProgressTasks').textContent = inProgress;
        document.getElementById('pendingTasks').textContent = pending;
        
        modal.classList.add('active');
        
        setTimeout(() => this.renderChart(), 100);
    }

    renderChart() {
        const ctx = document.getElementById('statusChart');
        const statusCounts = {};
        
        this.tasks.forEach(task => {
            statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
        });
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: Object.keys(statusCounts).map(status => STATUS_COLORS[status]),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    populateProjectDropdown() {
        const select = document.getElementById('taskProject');
        Object.keys(PROJECTS).forEach(project => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            select.appendChild(option);
        });
    }

    updateContactDropdown(project) {
        const select = document.getElementById('taskContact');
        select.innerHTML = '<option value="">בחר איש קשר...</option>';
        
        if (project && CONTACTS[project]) {
            CONTACTS[project].forEach(contact => {
                const option = document.createElement('option');
                option.value = contact.name;
                option.textContent = `${contact.name} - ${contact.role}`;
                select.appendChild(option);
            });
        }
    }

    closeTaskModal() {
        document.getElementById('taskModal').classList.remove('active');
        this.editingTaskId = null;
    }

    closeDashboard() {
        document.getElementById('dashboardModal').classList.remove('active');
    }

    closeDetailsModal() {
        document.getElementById('taskDetailsModal').classList.remove('active');
    }

    loadTasks() {
        const saved = localStorage.getItem('taskflow_tasks');
        return saved ? JSON.parse(saved) : this.getDefaultTasks();
    }

    saveTasks() {
        localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    }

    getDefaultTasks() {
        return [
            {
                id: '1',
                title: 'פורטל עובדים',
                project: 'רם אדרת',
                developer: 'ולאד',
                contact: 'לאה',
                status: 'בפיתוח',
                description: 'פיתוח פורטל משאבי אנוש',
                notes: [{
                    text: 'התחלנו פיתוח - צפי סיום עד סוף השבוע',
                    timestamp: new Date().toISOString(),
                    author: 'מנהל'
                }],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'DMS VSS',
                project: 'AITECH',
                developer: 'סרגי',
                contact: 'עופר',
                status: 'ממתין לאישור',
                description: 'מערכת ניהול מסמכים VSS',
                notes: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    darkenColor(color) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 30);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 30);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 30);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions
function toggleContacts() {
    const dir = document.getElementById('contactsDirectory');
    dir.style.display = dir.style.display === 'none' ? 'block' : 'none';
}

function closeTaskModal() {
    app.closeTaskModal();
}

function closeDashboard() {
    app.closeDashboard();
}

function closeDetailsModal() {
    app.closeDetailsModal();
}

// Initialize app
const app = new TaskFlowApp();
