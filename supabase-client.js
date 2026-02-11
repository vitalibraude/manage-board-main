// Supabase Client for TaskFlow Pro
// This file handles all database operations

const SUPABASE_URL = 'https://xlwbwzrqytuxdyfyuqbi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd2J3enJxeXR1eGR5Znl1cWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTE3NzUsImV4cCI6MjA4NjM4Nzc3NX0.ByWTZOzw6UlNooGGhjsH62PHwqD3SWQ5e6W11o7Pyvo';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

class SupabaseDB {
    constructor() {
        this.client = supabaseClient;
        this.tablesReady = false;
    }

    // Check if tables exist and create if needed
    async initializeTables() {
        try {
            // Try to query tasks table
            const { data, error } = await this.client
                .from('tasks')
                .select('id')
                .limit(1);

            if (error && error.code === 'PGRST116') {
                console.log('⚠️ טבלאות לא קיימות - משתמש ב-LocalStorage');
                this.tablesReady = false;
                return false;
            }

            this.tablesReady = true;
            console.log('✅ חיבור ל-Supabase הצליח!');
            return true;
        } catch (err) {
            console.log('⚠️ לא ניתן להתחבר ל-Supabase - משתמש ב-LocalStorage');
            this.tablesReady = false;
            return false;
        }
    }

    // ===== TASKS =====
    
    async getTasks() {
        if (!this.tablesReady) return null;
        
        try {
            const { data, error } = await this.client
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('שגיאה בקריאת משימות:', err);
            return null;
        }
    }

    async addTask(task) {
        if (!this.tablesReady) return null;

        try {
            const { data, error } = await this.client
                .from('tasks')
                .insert([{
                    title: task.title,
                    project: task.project,
                    developer: task.developer,
                    contact: task.contact,
                    status: task.status,
                    description: task.description,
                    created_at: task.createdAt,
                    updated_at: task.updatedAt
                }])
                .select();

            if (error) throw error;
            
            // Add initial note if exists
            if (task.notes && task.notes.length > 0) {
                await this.addNote(data[0].id, task.notes[0]);
            }

            return data[0];
        } catch (err) {
            console.error('שגיאה בהוספת משימה:', err);
            return null;
        }
    }

    async updateTask(taskId, updates) {
        if (!this.tablesReady) return null;

        try {
            const { data, error } = await this.client
                .from('tasks')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', taskId)
                .select();

            if (error) throw error;
            return data[0];
        } catch (err) {
            console.error('שגיאה בעדכון משימה:', err);
            return null;
        }
    }

    async deleteTask(taskId) {
        if (!this.tablesReady) return false;

        try {
            const { error } = await this.client
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('שגיאה במחיקת משימה:', err);
            return false;
        }
    }

    // ===== NOTES =====

    async getNotes(taskId) {
        if (!this.tablesReady) return null;

        try {
            const { data, error } = await this.client
                .from('notes')
                .select('*')
                .eq('task_id', taskId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('שגיאה בקריאת הערות:', err);
            return null;
        }
    }

    async addNote(taskId, note) {
        if (!this.tablesReady) return null;

        try {
            const { data, error } = await this.client
                .from('notes')
                .insert([{
                    task_id: taskId,
                    text: note.text,
                    author: note.author || 'מנהל המערכת',
                    created_at: note.timestamp || new Date().toISOString()
                }])
                .select();

            if (error) throw error;
            return data[0];
        } catch (err) {
            console.error('שגיאה בהוספת הערה:', err);
            return null;
        }
    }

    // ===== DEVELOPERS =====

    async getDevelopers() {
        if (!this.tablesReady) return null;

        try {
            const { data, error } = await this.client
                .from('developers')
                .select('*')
                .eq('active', true);

            if (error) throw error;
            return data.map(d => d.name);
        } catch (err) {
            console.error('שגיאה בקריאת מפתחים:', err);
            return null;
        }
    }

    // ===== CONTACTS =====

    async getContacts() {
        if (!this.tablesReady) return null;

        try {
            const { data, error } = await this.client
                .from('contacts')
                .select('*')
                .order('client, name');

            if (error) throw error;

            // Group by client
            const grouped = {};
            data.forEach(contact => {
                if (!grouped[contact.client]) {
                    grouped[contact.client] = [];
                }
                grouped[contact.client].push({
                    name: contact.name,
                    role: contact.role,
                    phone: contact.phone,
                    email: contact.email || ''
                });
            });

            return grouped;
        } catch (err) {
            console.error('שגיאה בקריאת אנשי קשר:', err);
            return null;
        }
    }

    // ===== PROJECTS =====

    async getProjects() {
        if (!this.tablesReady) return null;

        try {
            const { data, error } = await this.client
                .from('projects')
                .select('*')
                .eq('active', true)
                .order('client, name');

            if (error) throw error;

            // Group by client
            const grouped = {};
            data.forEach(project => {
                if (!grouped[project.client]) {
                    grouped[project.client] = { icon: '🏢', color: '#4f46e5' };
                }
            });

            return grouped;
        } catch (err) {
            console.error('שגיאה בקריאת פרויקטים:', err);
            return null;
        }
    }
}

// Export instance
const db = new SupabaseDB();
