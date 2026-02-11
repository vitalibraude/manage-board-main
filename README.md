# 🎯 Task Management Board - לוח ניהול משימות

![Task Board Demo](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Language](https://img.shields.io/badge/languages-Hebrew%20%7C%20English-orange)

אפליקציית ניהול משימות מודרנית עם תמיכה מלאה בעברית ואנגלית, גרירה ושחרור (Drag & Drop), ושמירה מקומית.

A modern task management application with full Hebrew and English support, drag & drop functionality, and local storage.

## ✨ Features / תכונות

### עברית 🇮🇱
- 📋 **ניהול משימות מלא** - צור, ערוך ומחק משימות בקלות
- 🎨 **ממשק משתמש מעוצב** - עיצוב מודרני ואינטואיטיבי
- 🔄 **גרירה ושחרור** - העבר משימות בין עמודות בקלות
- 🌍 **דו-לשוני** - תמיכה מלאה בעברית ואנגלית
- 💾 **שמירה אוטומטית** - כל המשימות נשמרות ב-LocalStorage
- 📅 **תאריכי יעד** - הגדר תאריכי יעד למשימות
- ⚡ **סימון עדיפות** - נמוכה, בינונית, גבוהה
- 📱 **Responsive** - עובד מצוין על כל המכשירים

### English 🇺🇸
- 📋 **Full Task Management** - Create, edit, and delete tasks easily
- 🎨 **Modern UI** - Beautiful and intuitive interface
- 🔄 **Drag & Drop** - Move tasks between columns seamlessly
- 🌍 **Bilingual** - Full Hebrew and English support
- 💾 **Auto-Save** - All tasks saved in LocalStorage
- 📅 **Due Dates** - Set deadlines for tasks
- ⚡ **Priority Levels** - Low, Medium, High
- 📱 **Responsive** - Works great on all devices

## 🚀 Live Demo

**🌐 View the live application here:**
👉 **https://vitalibraude.github.io/manage-board-main/**

Or run locally:
```bash
# Clone the repository
git clone https://github.com/vitalibraude/manage-board-main.git

# Navigate to directory
cd manage-board-main

# Open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit: http://localhost:8000
```

## 📖 How to Use / איך להשתמש

### עברית
1. **הוסף משימה חדשה** - לחץ על כפתור "+ משימה חדשה"
2. **מלא פרטים** - הזן כותרת, תיאור, עדיפות ותאריך יעד
3. **גרור משימות** - גרור משימות בין העמודות:
   - 📋 **לביצוע** - משימות חדשות
   - ⚙️ **בתהליך** - משימות פעילות
   - ✅ **הושלם** - משימות שהושלמו
4. **ערוך או מחק** - לחץ על האייקונים בכרטיס המשימה
5. **החלף שפה** - לחץ על "EN" להחלפה לאנגלית

### English
1. **Add New Task** - Click "+ New Task" button
2. **Fill Details** - Enter title, description, priority, and due date
3. **Drag Tasks** - Drag tasks between columns:
   - 📋 **To Do** - New tasks
   - ⚙️ **In Progress** - Active tasks
   - ✅ **Done** - Completed tasks
4. **Edit or Delete** - Click icons on task card
5. **Switch Language** - Click "עב" to switch to Hebrew

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **JavaScript (ES6+)** - Vanilla JavaScript, no frameworks
- **LocalStorage API** - Client-side data persistence
- **Drag and Drop API** - Native browser drag and drop

## 📁 Project Structure

```
manage-board-main/
├── index.html       # Main HTML file
├── style.css        # Styling and layout
├── script.js        # Application logic
├── README.md        # Documentation
└── .gitignore       # Git ignore rules
```

## 🎯 Features in Detail

### Task Properties
- **Title** - Brief task description
- **Description** - Detailed task information (optional)
- **Priority** - Low (blue), Medium (yellow), High (red)
- **Due Date** - Optional deadline with visual indicators
- **Status** - To Do, In Progress, Done

### UI Features
- **Drag & Drop** - Smooth task movement between columns
- **Visual Feedback** - Hover effects and drag indicators
- **Responsive Design** - Mobile, tablet, and desktop support
- **RTL/LTR Support** - Proper text direction for both languages
- **Modal Forms** - Clean task creation and editing
- **Empty States** - Helpful messages when columns are empty

## 🔒 Privacy

All data is stored locally in your browser's LocalStorage. No data is sent to any server. Your tasks remain completely private on your device.

## 🌟 GitHub Pages Setup

To enable GitHub Pages for this repository:

1. Go to your repository on GitHub: `https://github.com/vitalibraude/manage-board-main`
2. Click on **Settings** (⚙️)
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait a few minutes for deployment
7. Your site will be live at: `https://vitalibraude.github.io/manage-board-main/`

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Created with ❤️ by Vitali Braude

---

## 📸 Screenshots

### Hebrew Interface (RTL)
The application features a beautiful right-to-left interface for Hebrew users with:
- Intuitive task cards
- Color-coded priorities
- Smooth animations

### English Interface (LTR)
Full English support with left-to-right layout:
- Clean modern design
- Drag and drop functionality
- Responsive across devices

---

**⭐ If you find this project useful, please give it a star on GitHub!**

**🐛 Found a bug or have a suggestion? Open an issue!**

**🤝 Contributions are welcome! Feel free to fork and submit a PR.**
