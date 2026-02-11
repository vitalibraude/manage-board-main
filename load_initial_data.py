#!/usr/bin/env python3
"""
טעינת 14 הפרויקטים האמיתיים ל-Supabase
להריץ רק פעם אחת אחרי יצירת הטבלאות!
"""

from supabase import create_client
import sys

SUPABASE_URL = 'https://xlwbwzrqytuxdyfyuqbi.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhsd2J3enJxeXR1eGR5Znl1cWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MTE3NzUsImV4cCI6MjA4NjM4Nzc3NX0.ByWTZOzw6UlNooGGhjsH62PHwqD3SWQ5e6W11o7Pyvo'

# נתוני 14 הפרויקטים האמיתיים
PROJECTS_DATA = [
    {
        "title": "DMS VSS",
        "project": "רם אדרת",
        "developer": "סרגי",
        "contact": "לאה",
        "status": "נשלח אפיון ללקוח",
        "description": "מערכת ניהול מסמכים VSS"
    },
    {
        "title": "DMS ללקוחות חיצוניים",
        "project": "רם אדרת",
        "developer": "סרגי",
        "contact": "לאה",
        "status": "נשלח אפיון ללקוח",
        "description": "DMS עבור לקוחות חיצוניים"
    },
    {
        "title": "תהליך BGA",
        "project": "רם אדרת",
        "developer": "ולאד",
        "contact": "אשרת",
        "status": "נשלח אפיון ללקוח",
        "description": "תהליך BGA"
    },
    {
        "title": "מערכת HELPDESK",
        "project": "רם אדרת",
        "developer": "זאק",
        "contact": "מיקי",
        "status": "נשלח אפיון ללקוח",
        "description": "מערכת תמיכה טכנית"
    },
    {
        "title": "תהליך תיקי ייצור עם אינטגרציה",
        "project": "רם אדרת",
        "developer": "ניקולה",
        "contact": "אורן גלבוע",
        "status": "נשלח אפיון ללקוח",
        "description": "ניהול תיקי ייצור עם אינטגרציה למערכות"
    },
    {
        "title": "פורטל + 4 תהליכים",
        "project": "נצרת",
        "developer": "זאק",
        "contact": "רנא",
        "status": "משימה גמורה",
        "description": "פורטל עם 4 תהליכים עסקיים"
    },
    {
        "title": "פרויקט DMS עם מיגרציה",
        "project": "נצרת",
        "developer": "סרגי",
        "contact": "איימן",
        "status": "אצל המתכנת",
        "description": "DMS כולל מיגרציית מסמכים קיימים"
    },
    {
        "title": "בקשה לרכוש קבוע",
        "project": "AITECH",
        "developer": "זאק",
        "contact": "עופר",
        "status": "נשלח אפיון ללקוח",
        "description": "תהליך בקשה לרכישת רכוש קבוע"
    },
    {
        "title": "תהליך פתיחת ספק",
        "project": "AITECH",
        "developer": "ניקולה",
        "contact": "איתי",
        "status": "נשלח אפיון ללקוח",
        "description": "תהליך פתיחת ספק חדש"
    },
    {
        "title": "קליטת עובד",
        "project": "AITECH",
        "developer": "זאק",
        "contact": "ענת",
        "status": "אצל המתכנת",
        "description": "תהליך קליטת עובד חדש"
    },
    {
        "title": "עזיבת עובד",
        "project": "AITECH",
        "developer": "ולאד",
        "contact": "ענת",
        "status": "אצל המתכנת",
        "description": "תהליך עזיבת עובד"
    },
    {
        "title": "פורום ייצור",
        "project": "AITECH",
        "developer": "סרגי",
        "contact": "עופר",
        "status": "אצל המתכנת",
        "description": "פורום לניהול תהליכי ייצור"
    },
    {
        "title": "DMS LITE",
        "project": "מפעל הפיס",
        "developer": "סרגי",
        "contact": "דוד",
        "status": "אפיין",
        "description": "גרסה מקוצרת של DMS"
    },
    {
        "title": "רכיב ימי הולדת",
        "project": "מפעל הפיס",
        "developer": "ולאד",
        "contact": "יוסי",
        "status": "אפיין",
        "description": "רכיב להצגת ימי הולדת של עובדים"
    }
]

# אנשי קשר לכל פרויקט
CONTACTS_DATA = {
    "רם אדרת": [
        {"name": "לאה", "role": "מנהלת פרויקטים חיצונית", "phone": "052-5610052"},
        {"name": "אשרת", "role": "סמנכ״ל משאבי אנוש", "phone": "050-4442093"},
        {"name": "מיקי", "role": "מנמ״ר", "phone": "054-3001724"},
        {"name": "אורן גלבוע", "role": "IT", "phone": "054-4445387"}
    ],
    "נצרת": [
        {"name": "רנא", "role": "מנהלת רכש וכספים", "phone": "054-6209963"},
        {"name": "איימן", "role": "מנהל פרויקטים פרילנסר", "phone": "050-6492975"}
    ],
    "AITECH": [
        {"name": "עופר", "role": "מנמ״ר", "phone": "050-5428073"},
        {"name": "איתי", "role": "מנהל פרויקטים", "phone": "058-7343769"},
        {"name": "ענת", "role": "אשת קשר מאפיינת", "phone": "054-2555875"}
    ],
    "מפעל הפיס": [
        {"name": "דוד", "role": "מנהל פרויקטים", "phone": "054-8029999"},
        {"name": "יוסי", "role": "מנהל של דוד", "phone": "054-4694271"},
        {"name": "ערן", "role": "איש IT", "phone": "054-7383919"}
    ]
}

def main():
    print("=" * 60)
    print("🚀 טעינת נתונים ל-Supabase")
    print("=" * 60)
    
    # חיבור
    print("\n🔌 מתחבר ל-Supabase...")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # בדיקה שהטבלאות קיימות
    print("🔍 בודק שהטבלאות קיימות...")
    try:
        supabase.table('tasks').select('id').limit(1).execute()
        print("✅ הטבלאות קיימות!")
    except Exception as e:
        print(f"\n❌ שגיאה: הטבלאות לא קיימות!")
        print("\n📋 תריץ קודם את SQL:")
        print("👉 https://supabase.com/dashboard/project/xlwbwzrqytuxdyfyuqbi/sql/new")
        print("📄 והעתק את: supabase_schema.sql")
        sys.exit(1)
    
    # 1. טעינת אנשי קשר
    print("\n👥 טוען אנשי קשר...")
    contacts_count = 0
    for client, contacts in CONTACTS_DATA.items():
        for contact in contacts:
            try:
                supabase.table('contacts').insert({
                    'client': client,
                    'name': contact['name'],
                    'role': contact['role'],
                    'phone': contact['phone']
                }).execute()
                contacts_count += 1
                print(f"  ✅ {contact['name']} ({client})")
            except Exception as e:
                if 'duplicate' in str(e).lower() or 'unique' in str(e).lower():
                    print(f"  ⏩ {contact['name']} כבר קיים")
                else:
                    print(f"  ⚠️  שגיאה בטעינת {contact['name']}: {e}")
    
    print(f"\n✅ נטענו {contacts_count} אנשי קשר חדשים")
    
    # 2. טעינת פרויקטים
    print("\n📊 טוען פרויקטים...")
    projects = set(task['project'] for task in PROJECTS_DATA)
    for project in projects:
        try:
            supabase.table('projects').insert({
                'name': project,
                'client': project,
                'active': True
            }).execute()
            print(f"  ✅ {project}")
        except Exception as e:
            if 'duplicate' in str(e).lower() or 'unique' in str(e).lower():
                print(f"  ⏩ {project} כבר קיים")
            else:
                print(f"  ⚠️  שגיאה: {e}")
    
    # 3. טעינת משימות
    print("\n📋 טוען 14 משימות...")
    tasks_count = 0
    for i, task in enumerate(PROJECTS_DATA, 1):
        try:
            result = supabase.table('tasks').insert({
                'title': task['title'],
                'project': task['project'],
                'developer': task['developer'],
                'contact': task['contact'],
                'status': task['status'],
                'description': task['description']
            }).execute()
            tasks_count += 1
            print(f"  ✅ {i}. {task['title']} ({task['project']})")
        except Exception as e:
            print(f"  ⚠️  שגיאה במשימה {i}: {e}")
    
    # סיכום
    print("\n" + "=" * 60)
    print("🎉 סיימתי!")
    print("=" * 60)
    print(f"✅ נטענו {tasks_count} משימות")
    print(f"✅ נטענו {contacts_count} אנשי קשר")
    print(f"✅ נטענו {len(projects)} פרויקטים")
    print("\n🌐 עכשיו פתח את האתר:")
    print("👉 https://vitalibraude.github.io/manage-board-main/")
    print("\nתראה את כל הנתונים מ-Supabase! 🎊")
    print("=" * 60)

if __name__ == '__main__':
    main()
