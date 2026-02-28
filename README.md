# Tridi

Веб-платформа для генерации и редактирования 3D-моделей из фотографий.

## Стек

- **Backend:** FastAPI, SQLAlchemy, MySQL, TripoSR
- **Frontend:** React, TypeScript, Vite, React Three Fiber, TailwindCSS

## Запуск

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### База данных

Создайте базу MySQL:
```sql
CREATE DATABASE tridi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Отредактируйте `backend/.env` — укажите свои данные подключения.

## API Документация

После запуска backend: [http://localhost:8000/docs](http://localhost:8000/docs)
