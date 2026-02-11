// Load tasks from JSON file on startup
async function loadTasksFromJSON() {
    try {
        const response = await fetch('projects_data.json');
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ נטענו ${data.length} פרויקטים מהאקסל`);
            localStorage.setItem('taskflow_tasks', JSON.stringify(data));
            return data;
        }
    } catch (error) {
        console.log('שגיאה בטעינת פרויקטים:', error);
    }
    return [];
}

// Load on page load - only if no data exists
window.addEventListener('DOMContentLoaded', async () => {
    const saved = localStorage.getItem('taskflow_tasks');
    // Load only on first visit (no saved data)
    if (!saved) {
        console.log('📦 טוען נתונים ראשוניים מה-JSON...');
        await loadTasksFromJSON();
    }
});
