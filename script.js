// Task Management Board Application

class TaskBoard {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentEditId = null;
        this.isRTL = true;
        this.translations = {
            he: {
                title: '🎯 לוח ניהול משימות',
                addTask: '+ משימה חדשה',
                langBtn: 'EN',
                newTask: 'משימה חדשה',
                editTask: 'עריכת משימה',
                titleLabel: 'כותרת:',
                titlePlaceholder: 'הזן כותרת משימה',
                descLabel: 'תיאור:',
                descPlaceholder: 'הזן תיאור המשימה (אופציונלי)',
                priorityLabel: 'עדיפות:',
                dueDateLabel: 'תאריך יעד:',
                save: 'שמור',
                cancel: 'ביטול',
                todo: '📋 לביצוע',
                inprogress: '⚙️ בתהליך',
                done: '✅ הושלם',
                priorityLow: 'נמוכה',
                priorityMedium: 'בינונית',
                priorityHigh: 'גבוהה',
                emptyState: 'אין משימות כאן. גרור משימות או צור חדשות!'
            },
            en: {
                title: '🎯 Task Management Board',
                addTask: '+ New Task',
                langBtn: 'עב',
                newTask: 'New Task',
                editTask: 'Edit Task',
                titleLabel: 'Title:',
                titlePlaceholder: 'Enter task title',
                descLabel: 'Description:',
                descPlaceholder: 'Enter task description (optional)',
                priorityLabel: 'Priority:',
                dueDateLabel: 'Due Date:',
                save: 'Save',
                cancel: 'Cancel',
                todo: '📋 To Do',
                inprogress: '⚙️ In Progress',
                done: '✅ Done',
                priorityLow: 'Low',
                priorityMedium: 'Medium',
                priorityHigh: 'High',
                emptyState: 'No tasks here. Drag tasks or create new ones!'
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAllTasks();
        this.updateAllCounts();
    }

    setupEventListeners() {
        // Add task button
        document.getElementById('addTaskBtn').addEventListener('click', () => this.openModal());

        // Modal close
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());

        // Form submit
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTask();
        });

        // Language toggle
        document.getElementById('langToggle').addEventListener('click', () => this.toggleLanguage());

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('taskModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Setup drag and drop for all containers
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const containers = document.querySelectorAll('.tasks-container');
        
        containers.forEach(container => {
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                const column = container.closest('.column');
                column.classList.add('drag-over');
            });

            container.addEventListener('dragleave', (e) => {
                const column = container.closest('.column');
                if (!column.contains(e.relatedTarget)) {
                    column.classList.remove('drag-over');
                }
            });

            container.addEventListener('drop', (e) => {
                e.preventDefault();
                const column = container.closest('.column');
                column.classList.remove('drag-over');
                
                const taskId = e.dataTransfer.getData('text/plain');
                const newStatus = column.dataset.status;
                
                this.updateTaskStatus(taskId, newStatus);
            });
        });
    }

    openModal(taskId = null) {
        const modal = document.getElementById('taskModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('taskForm');
        
        const lang = this.isRTL ? 'he' : 'en';
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            modalTitle.textContent = this.translations[lang].editTask;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskDueDate').value = task.dueDate || '';
            this.currentEditId = taskId;
        } else {
            modalTitle.textContent = this.translations[lang].newTask;
            form.reset();
            this.currentEditId = null;
        }
        
        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('taskModal');
        modal.classList.remove('active');
        document.getElementById('taskForm').reset();
        this.currentEditId = null;
    }

    saveTask() {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;

        if (!title) return;

        if (this.currentEditId) {
            // Edit existing task
            const task = this.tasks.find(t => t.id === this.currentEditId);
            task.title = title;
            task.description = description;
            task.priority = priority;
            task.dueDate = dueDate;
            task.updatedAt = new Date().toISOString();
        } else {
            // Create new task
            const newTask = {
                id: Date.now().toString(),
                title,
                description,
                priority,
                dueDate,
                status: 'todo',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.tasks.push(newTask);
        }

        this.saveTasks();
        this.renderAllTasks();
        this.updateAllCounts();
        this.closeModal();
    }

    deleteTask(taskId) {
        if (confirm(this.isRTL ? 'האם למחוק משימה זו?' : 'Delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderAllTasks();
            this.updateAllCounts();
        }
    }

    updateTaskStatus(taskId, newStatus) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
            this.renderAllTasks();
            this.updateAllCounts();
        }
    }

    renderAllTasks() {
        const containers = {
            todo: document.getElementById('todoTasks'),
            inprogress: document.getElementById('inprogressTasks'),
            done: document.getElementById('doneTasks')
        };

        // Clear all containers
        Object.values(containers).forEach(container => container.innerHTML = '');

        // Group tasks by status
        const tasksByStatus = {
            todo: this.tasks.filter(t => t.status === 'todo'),
            inprogress: this.tasks.filter(t => t.status === 'inprogress'),
            done: this.tasks.filter(t => t.status === 'done')
        };

        // Render tasks
        Object.entries(tasksByStatus).forEach(([status, tasks]) => {
            if (tasks.length === 0) {
                containers[status].innerHTML = `
                    <div class="empty-state">
                        ${this.isRTL ? 'אין משימות' : 'No tasks'}
                    </div>
                `;
            } else {
                tasks.forEach(task => {
                    containers[status].appendChild(this.createTaskCard(task));
                });
            }
        });
    }

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.dataset.taskId = task.id;

        const lang = this.isRTL ? 'he' : 'en';
        const priorityText = this.translations[lang][`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`];

        let dueDateHTML = '';
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            const isOverdue = dueDate < today && task.status !== 'done';
            const dateStr = dueDate.toLocaleDateString(this.isRTL ? 'he-IL' : 'en-US');
            dueDateHTML = `
                <span class="due-date ${isOverdue ? 'overdue' : ''}">
                    📅 ${dateStr}
                </span>
            `;
        }

        card.innerHTML = `
            <div class="task-header">
                <div class="task-title">${this.escapeHtml(task.title)}</div>
                <div class="task-actions">
                    <button onclick="taskBoard.openModal('${task.id}')" title="${this.isRTL ? 'עריכה' : 'Edit'}">✏️</button>
                    <button onclick="taskBoard.deleteTask('${task.id}')" title="${this.isRTL ? 'מחיקה' : 'Delete'}">🗑️</button>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${this.escapeHtml(task.description)}</div>` : ''}
            <div class="task-meta">
                <span class="priority-badge priority-${task.priority}">${priorityText}</span>
                ${dueDateHTML}
            </div>
        `;

        // Drag events
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', task.id);
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });

        return card;
    }

    updateAllCounts() {
        const counts = {
            todo: this.tasks.filter(t => t.status === 'todo').length,
            inprogress: this.tasks.filter(t => t.status === 'inprogress').length,
            done: this.tasks.filter(t => t.status === 'done').length
        };

        document.querySelectorAll('.column').forEach(column => {
            const status = column.dataset.status;
            const countElement = column.querySelector('.task-count');
            countElement.textContent = counts[status];
        });
    }

    toggleLanguage() {
        this.isRTL = !this.isRTL;
        const lang = this.isRTL ? 'he' : 'en';
        const dir = this.isRTL ? 'rtl' : 'ltr';
        
        document.documentElement.lang = lang;
        document.documentElement.dir = dir;
        document.body.dir = dir;

        // Update UI text
        document.querySelector('header h1').textContent = this.translations[lang].title;
        document.getElementById('addTaskBtn').textContent = this.translations[lang].addTask;
        document.getElementById('langToggle').textContent = this.translations[lang].langBtn;

        // Update column headers
        const columns = document.querySelectorAll('.column');
        columns[0].querySelector('h2').textContent = this.translations[lang].todo;
        columns[1].querySelector('h2').textContent = this.translations[lang].inprogress;
        columns[2].querySelector('h2').textContent = this.translations[lang].done;

        // Update form labels
        document.querySelector('label[for="taskTitle"]').textContent = this.translations[lang].titleLabel;
        document.getElementById('taskTitle').placeholder = this.translations[lang].titlePlaceholder;
        document.querySelector('label[for="taskDescription"]').textContent = this.translations[lang].descLabel;
        document.getElementById('taskDescription').placeholder = this.translations[lang].descPlaceholder;
        document.querySelector('label[for="taskPriority"]').textContent = this.translations[lang].priorityLabel;
        document.querySelector('label[for="taskDueDate"]').textContent = this.translations[lang].dueDateLabel;

        // Update priority options
        const prioritySelect = document.getElementById('taskPriority');
        prioritySelect.options[0].text = this.translations[lang].priorityLow;
        prioritySelect.options[1].text = this.translations[lang].priorityMedium;
        prioritySelect.options[2].text = this.translations[lang].priorityHigh;

        // Update buttons
        document.querySelector('#taskForm button[type="submit"]').textContent = this.translations[lang].save;
        document.getElementById('cancelBtn').textContent = this.translations[lang].cancel;

        this.renderAllTasks();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadTasks() {
        try {
            const saved = localStorage.getItem('taskBoardTasks');
            return saved ? JSON.parse(saved) : this.getDefaultTasks();
        } catch (error) {
            console.error('Error loading tasks:', error);
            return this.getDefaultTasks();
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('taskBoardTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }

    getDefaultTasks() {
        return [
            {
                id: '1',
                title: 'ברוכים הבאים ללוח הניהול!',
                description: 'זהו דוגמה למשימה. גרור אותי לעמודות אחרות!',
                priority: 'high',
                status: 'todo',
                dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'תכנן את הפרויקט הבא',
                description: 'לתכנן ארכיטקטורה ומטרות ברורות',
                priority: 'medium',
                status: 'inprogress',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                title: 'השלם את ההגדרה הראשונית',
                description: 'מערכת הניהול מוכנה לשימוש!',
                priority: 'low',
                status: 'done',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }
}

// Initialize the application
const taskBoard = new TaskBoard();
