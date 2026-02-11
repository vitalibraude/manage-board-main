// Initialize local data with 14 real projects
const INITIAL_DATA = [
    {
        "id": "1",
        "title": "DMS VSS",
        "project": "רם אדרת",
        "developer": "סרגי",
        "contact": "לאה",
        "status": "תהליך האפיון החל",
        "description": "מערכת ניהול מסמכים VSS",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "2",
        "title": "DMS ללקוחות חיצוניים",
        "project": "רם אדרת",
        "developer": "סרגי",
        "contact": "לאה",
        "status": "תהליך האפיון החל",
        "description": "DMS עבור לקוחות חיצוניים",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "3",
        "title": "תהליך BGA",
        "project": "רם אדרת",
        "developer": "ולאד",
        "contact": "אשרת",
        "status": "תהליך האפיון החל",
        "description": "תהליך BGA",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "4",
        "title": "מערכת HELPDESK",
        "project": "רם אדרת",
        "developer": "זאק",
        "contact": "מיקי",
        "status": "תהליך האפיון החל",
        "description": "מערכת תמיכה טכנית",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "5",
        "title": "תהליך תיקי ייצור עם אינטגרציה",
        "project": "רם אדרת",
        "developer": "ניקולה",
        "contact": "אורן גלבוע",
        "status": "תהליך האפיון החל",
        "description": "ניהול תיקי ייצור עם אינטגרציה למערכות",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "6",
        "title": "פורטל + 4 תהליכים",
        "project": "נצרת",
        "developer": "זאק",
        "contact": "רנא",
        "status": "המשימה גמורה",
        "description": "פורטל עם 4 תהליכים עסקיים",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "7",
        "title": "פרויקט DMS עם מיגרציה",
        "project": "נצרת",
        "developer": "סרגי",
        "contact": "איימן",
        "status": "נדרש אומדן מחיר",
        "description": "DMS כולל מיגרציית מסמכים קיימים",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "8",
        "title": "בקשה לרכוש קבוע",
        "project": "AITECH",
        "developer": "זאק",
        "contact": "עופר",
        "status": "הלקוח אישר הצעת מחיר",
        "description": "תהליך בקשה לרכישת רכוש קבוע",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "9",
        "title": "תהליך פתיחת ספק",
        "project": "AITECH",
        "developer": "ניקולה",
        "contact": "איתי",
        "status": "תהליך האפיון החל",
        "description": "תהליך פתיחת ספק חדש",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "10",
        "title": "קליטת עובד",
        "project": "AITECH",
        "developer": "זאק",
        "contact": "ענת",
        "status": "נשלח לQA",
        "description": "תהליך קליטת עובד חדש",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "11",
        "title": "עזיבת עובד",
        "project": "AITECH",
        "developer": "ולאד",
        "contact": "ענת",
        "status": "QA החזיר הערות",
        "description": "תהליך עזיבת עובד",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "12",
        "title": "פורום ייצור",
        "project": "AITECH",
        "developer": "סרגי",
        "contact": "עופר",
        "status": "לקוח החזיר הערות",
        "description": "פורום לניהול תהליכי ייצור",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "13",
        "title": "DMS LITE",
        "project": "מפעל הפיס",
        "developer": "סרגי",
        "contact": "דוד",
        "status": "נדרש לאפיין",
        "description": "גרסה מקוצרת של DMS",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    },
    {
        "id": "14",
        "title": "רכיב ימי הולדת",
        "project": "מפעל הפיס",
        "developer": "ולאד",
        "contact": "יוסי",
        "status": "נדרש לאפיין",
        "description": "רכיב להצגת ימי הולדת של עובדים",
        "notes": [],
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString()
    }
];

// Check if LocalStorage is empty, if so initialize it
if (!localStorage.getItem('taskflow_tasks')) {
    console.log('🆕 אין נתונים - מאתחל 14 פרויקטים אמיתיים...');
    localStorage.setItem('taskflow_tasks', JSON.stringify(INITIAL_DATA));
    console.log('✅ 14 הפרויקטים נטענו ל-LocalStorage!');
}
