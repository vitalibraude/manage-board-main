# 🗄️ הגדרת Supabase Database - TaskFlow Pro

## שלב 1: יצירת הטבלאות 📊

1. **כנס ל-Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/xlwbwzrqytuxdyfyuqbi/sql/new
   ```

2. **העתק והדבק את הקוד הבא:**

```sql
-- TaskFlow Pro Database Schema

-- 1. טבלת מפתחים (Developers)
CREATE TABLE IF NOT EXISTS developers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    email TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. טבלת לקוחות/פרויקטים (Projects)
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    client TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, client)
);

-- 3. טבלת אנשי קשר (Contacts)
CREATE TABLE IF NOT EXISTS contacts (
    id BIGSERIAL PRIMARY KEY,
    client TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client, name)
);

-- 4. טבלת משימות (Tasks)
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    project TEXT NOT NULL,
    developer TEXT NOT NULL,
    contact TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. טבלת הערות (Notes)
CREATE TABLE IF NOT EXISTS notes (
    id BIGSERIAL PRIMARY KEY,
    task_id BIGINT REFERENCES tasks(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    author TEXT DEFAULT 'מנהל המערכת',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project);
CREATE INDEX IF NOT EXISTS idx_tasks_developer ON tasks(developer);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_notes_task_id ON notes(task_id);
CREATE INDEX IF NOT EXISTS idx_contacts_client ON contacts(client);

-- Enable Row Level Security (RLS)
ALTER TABLE developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations
CREATE POLICY "Enable all for developers" ON developers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for notes" ON notes FOR ALL USING (true) WITH CHECK (true);

-- Insert initial developers
INSERT INTO developers (name, email) VALUES 
    ('סרגי', 'sergey@example.com'),
    ('זאק', 'zak@example.com'),
    ('ניקולה', 'nikolay@example.com'),
    ('ולאד', 'vlad@example.com')
ON CONFLICT (name) DO NOTHING;
```

3. **לחץ על "Run"** ▶️

---

## שלב 2: טעינת הנתונים 📥

לאחר שהטבלאות נוצרו, הרץ:

```bash
cd /home/user/webapp
python3 setup_supabase.py
```

זה יטען:
- ✅ 4 מפתחים (ולאד, זאק, סרגי, ניקולה)
- ✅ ~20 אנשי קשר (לפי לקוח)
- ✅ 14 פרויקטים אמיתיים מה-Excel
- ✅ 14 משימות עם הסטטוסים החדשים

---

## מבנה הטבלאות 🏗️

### 1️⃣ `developers` - מפתחים
| שדה | תיאור |
|------|-------|
| id | מזהה ייחודי |
| name | שם המפתח (ולאד/זאק/סרגי/ניקולה) |
| email | אימייל |
| active | פעיל/לא פעיל |
| created_at | תאריך יצירה |

### 2️⃣ `projects` - פרויקטים
| שדה | תיאור |
|------|-------|
| id | מזהה ייחודי |
| name | שם הפרויקט |
| client | שם הלקוח (רם אדרת/נצרת/AITECH/מפעל הפיס) |
| active | פעיל/לא פעיל |
| created_at | תאריך יצירה |

### 3️⃣ `contacts` - אנשי קשר
| שדה | תיאור |
|------|-------|
| id | מזהה ייחודי |
| client | שם הלקוח |
| name | שם איש הקשר |
| phone | טלפון |
| role | תפקיד |
| email | אימייל |
| created_at | תאריך יצירה |

### 4️⃣ `tasks` - משימות
| שדה | תיאור |
|------|-------|
| id | מזהה ייחודי |
| title | כותרת המשימה |
| project | שם הפרויקט |
| developer | שם המפתח |
| contact | שם איש הקשר |
| status | סטטוס (אחד מ-12) |
| description | תיאור מפורט |
| created_at | תאריך יצירה |
| updated_at | תאריך עדכון אחרון |

### 5️⃣ `notes` - הערות
| שדה | תיאור |
|------|-------|
| id | מזהה ייחודי |
| task_id | מזהה המשימה (קישור ל-tasks) |
| text | טקסט ההערה |
| author | שם מי שכתב |
| created_at | תאריך ההערה |

---

## 12 הסטטוסים החדשים 🎯

1. 📝 **אפיין** - צריך להתחיל אפיון
2. 🚀 **החלנו אפיון** - בתהליך אפיון
3. ✅ **סיימנו אפיון** - אפיון הסתיים
4. 📤 **נשלח אפיון ללקוח** - חכה לתגובה
5. 🔄 **הלקוח נתן תיקונים לאפיון** - צריך לתקן
6. 👍 **הלקוח אישר אפיון** - אושר, מוכן לפיתוח
7. 👨‍💻 **אצל המתכנת** - בפיתוח
8. ✔️ **המתכנת סיים** - פיתוח הסתיים
9. 🔍 **QA: הQA נתן הערות** - נמצאו באגים
10. ✅ **QA: אישר** - עבר בדיקות
11. 💬 **הלקוח ראה פיתוח והוסיף הערות** - הלקוח מגיב
12. 🎉 **הלקוח אישר** - הלקוח מרוצה
13. 🏆 **משימה גמורה** - סגור!

---

## בדיקה מהירה ✅

לאחר הרצת הסקריפט, בדוק ב-Supabase Table Editor:

```
https://supabase.com/dashboard/project/xlwbwzrqytuxdyfyuqbi/editor
```

אמורים להיות:
- ✅ 4 שורות ב-`developers`
- ✅ ~20 שורות ב-`contacts`
- ✅ 14 שורות ב-`projects`
- ✅ 14 שורות ב-`tasks`
- ✅ 0 שורות ב-`notes` (יתווספו כשמוסיפים הערות)

---

## פתרון בעיות 🔧

### שגיאה: "Table not found"
➡️ הרץ שוב את ה-SQL ב-SQL Editor

### שגיאה: "Duplicate key"
➡️ הנתונים כבר קיימים - זה בסדר!

### שגיאה: "Invalid API key"
➡️ בדוק שהמפתח תקין:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd2J3enJxeXR1eGR5Znl1cWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTE3NzUsImV4cCI6MjA4NjM4Nzc3NX0.ByWTZOzw6UlNooGGhjsH62PHwqD3SWQ5e6W11o7Pyvo
```

---

## מה הלאה? 🚀

1. ✅ הטבלאות נוצרו
2. ✅ הנתונים נטענו
3. 🔜 **שלב הבא**: שינוי האפליקציה לעבוד עם Supabase במקום LocalStorage

---

**נתוני חיבור:**
- 🌐 URL: `https://xlwbwzrqytuxdyfyuqbi.supabase.co`
- 🔑 Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- 📊 Dashboard: https://supabase.com/dashboard/project/xlwbwzrqytuxdyfyuqbi
