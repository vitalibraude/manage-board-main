# 🚀 הפעלת Supabase - צעדים מהירים

## ⚡ צעד 1: יצירת טבלאות (חובה!)

1. **פתח את Supabase SQL Editor:**
   👉 https://supabase.com/dashboard/project/xlwbwzrqytuxdyfyuqbi/sql/new

2. **העתק את כל התוכן מהקובץ:** `supabase_schema.sql`

3. **הדבק ב-SQL Editor ולחץ RUN** ▶️

זהו! הטבלאות נוצרו! ✅

---

## ⚡ צעד 2: טעינת נתונים (אופציונלי)

אם אתה רוצה לטעון את 14 הפרויקטים מהאקסל:

```bash
cd /home/user/webapp
python3 migrate_to_supabase.py
```

---

## ⚡ צעד 3: בדיקה

1. פתח את האפליקציה
2. בקונסול (F12) תראה: **"✅ מחובר ל-Supabase - כל השינויים נשמרים בענן!"**
3. נסה ליצור משימה חדשה
4. היא תישמר ב-Supabase!

---

## 🔑 פרטי התחברות

- **URL:** https://xlwbwzrqytuxdyfyuqbi.supabase.co
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (כבר בקוד)

---

## 🎯 תוצאה

- ✅ נתונים נשמרים בענן
- ✅ עובד מכל מחשב
- ✅ גיבוי אוטומטי
- ✅ LocalStorage כ-fallback

---

**אחרי שתריץ את ה-SQL, האפליקציה תתחבר אוטומטית!** 🎉
