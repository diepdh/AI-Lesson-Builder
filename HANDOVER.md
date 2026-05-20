# HANDOVER.md

## 1. Muc dich ban giao

Du an **AI Lesson Builder (MVP)** la web app chay tren localhost de:

- Giao vien chinh sua bai giang bang AI o panel ben trai.
- Xem truoc bai hoc e-learning o panel ben phai.
- Chay bai hoc theo slide, audio, checkpoint, chat tro giang va voice.
- Bao ve API key bang cach chi goi LLM tu backend.

MVP nay khong phai LMS hoan chinh. Pham vi hien tai la 1 bai hoc, 1 lop hoc, 1 may chay localhost.

## 2. Thanh phan he thong

| Thanh phan | Cong nghe | Vai tro |
|---|---|---|
| Backend | Node.js, Express | API doc/ghi lesson, goi LLM, validate, backup |
| Frontend | React 18, Vite | Giao dien authoring + preview bai hoc |
| Data | JSON file | Luu bai hoc tai `backend/data/lesson.json` |
| Asset | Static files | Slide/audio/video tai `frontend/public/assets/` |
| LLM | OpenAI/Gemini/Anthropic/mock | Cau hinh qua `backend/.env` |

## 3. Cau truc thu muc quan trong

```text
backend/
  server.js
  .env.example
  data/
    lesson.json
    backups/
  routes/
  services/
  utils/

frontend/
  src/
    App.jsx
    api/
    components/
  public/
    assets/
      slides/
      audio/
      video/

README.md
USER_GUIDE.md
BUILD_LOG.md
Task_job/
  BLUEPRINT.md
  CONTRACT.md
  TASKS.md
  BUILD_LOG.md
  REVIEW_REPORT.md
```

## 4. Cach chay he thong

### Backend

```bash
cd backend
npm install
```

Tao file `.env`:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Chay backend:

```bash
npm run dev
```

Backend chay tai:

```text
http://localhost:3000
```

Health check:

```text
GET http://localhost:3000/api/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend chay tai:

```text
http://localhost:5173
```

## 5. Bien moi truong

File mau: `backend/.env.example`

```text
PORT=3000
LLM_PROVIDER=mock
LLM_API_KEY=
LLM_MODEL=gpt-4o-mini
LLM_BASE_URL=https://api.openai.com/v1
LLM_TIMEOUT=30000
TTS_FALLBACK=true
TTS_LANG=vi-VN
TTS_RATE=0.9
TTS_PITCH=1.1
```

Ghi chu van hanh:

- Dung `LLM_PROVIDER=mock` de demo khong can API key.
- Khi dung provider that, chi dien API key trong `backend/.env`.
- Khong dua API key vao frontend hoac `lesson.json`.
- Khong commit `backend/.env`.

## 6. API chinh

| API | Method | Chuc nang |
|---|---|---|
| `/api/health` | GET | Kiem tra backend song |
| `/api/lesson` | GET | Load bai hoc |
| `/api/lesson` | PUT | Ghi bai hoc sau validate + backup |
| `/api/lesson/backups` | GET | Liet ke backup |
| `/api/lesson/restore-last` | POST | Khoi phuc backup moi nhat |
| `/api/ai/authoring` | POST | Chat AI de chinh sua bai hoc |
| `/api/chat` | POST | Chat tro giang trong preview |
| `/api/voice/chat` | POST | Gui transcript voice toi tro giang |
| `/api/answer/evaluate` | POST | Cham cau tra loi checkpoint |
| `/api/question/generate` | POST | Sinh checkpoint |
| `/api/question/regenerate` | POST | Sinh lai checkpoint |

## 7. Luong du lieu chinh

1. Frontend goi `GET /api/lesson` de load `backend/data/lesson.json`.
2. Panel trai gui prompt toi `POST /api/ai/authoring`.
3. Backend goi LLM, parse JSON, validate lesson, tao backup, ghi lesson moi.
4. Frontend nhan `updatedLesson` va cap nhat preview + tab JSON.
5. Lesson player xu ly slide, audio, checkpoint, review flow.
6. Classroom chat va voice goi backend qua `/api/chat` va `/api/voice/chat`.

## 8. Quan ly noi dung bai hoc

File bai hoc chinh:

```text
backend/data/lesson.json
```

Khi sua bai hoc qua API, backend tao backup tai:

```text
backend/data/backups/
```

Asset dung trong bai hoc nen dat tai:

```text
frontend/public/assets/slides/
frontend/public/assets/audio/
frontend/public/assets/video/
```

Duong dan trong `lesson.json` nen bat dau bang `/assets/`, vi du:

```json
{
  "image": "/assets/slides/slide-01.jpg",
  "audio": "/assets/audio/slide-01.mp3"
}
```

## 9. Checklist nghiem thu nhanh

1. `GET /api/health` tra `{ "ok": true }`.
2. Mo `http://localhost:5173` thay layout 2 cot.
3. Preview load duoc slide dau tien tu backend.
4. Tab JSON hien thi lesson hien tai.
5. Bam `Trang sau` chuyen slide duoc.
6. Slide co checkpoint khoa nut Next.
7. Tra loi sai chuyen ve slide on tap.
8. Bam `Quay lai cau hoi` quay ve checkpoint.
9. Tra loi dung mo khoa Next.
10. Chat tro giang tra loi theo noi dung slide.
11. Voice hoat dong tren Chrome hoac hien fallback ro.
12. Authoring chat cap nhat preview hoac bao loi an toan.
13. Khong co API key trong frontend source/network request.

## 10. Lenh kiem tra ky thuat

Backend syntax:

```bash
cd backend
node --check server.js
```

Frontend build:

```bash
cd frontend
npm run build
```

Tim API key lo trong frontend:

```bash
rg -n "API_KEY|LLM_API_KEY|api.openai.com|generativelanguage|sk-|AIza" frontend/src frontend/public frontend/index.html frontend/vite.config.js
```

## 11. Su co thuong gap

| Van de | Cach xu ly |
|---|---|
| Frontend bao khong ket noi backend | Kiem tra backend da chay o port 3000 chua |
| Port 3000 bi chiem | Tat process dang dung port hoac doi port co kiem soat |
| AI bao loi 502 | Kiem tra `LLM_PROVIDER`, `LLM_API_KEY`, mang va timeout |
| Voice khong chay | Dung Chrome, cap quyen microphone, hoac nhap bang ban phim |
| Anh/audio khong hien | Kiem tra file co trong `frontend/public/assets/` va path bat dau `/assets/` |
| Lesson bi loi sau chinh sua | Dung backup trong `backend/data/backups/` hoac endpoint restore |

## 12. Trang thai ban giao

Theo `Task_job/REVIEW_REPORT.md`, cac job `JOB-001` den `JOB-013` da duoc reviewer kiem tra va pass sau cac vong sua. Tai lieu goc de truy vet:

- `Task_job/TASKS.md`
- `Task_job/BUILD_LOG.md`
- `Task_job/REVIEW_REPORT.md`
- `Task_job/CONTRACT.md`
- `Task_job/BLUEPRINT.md`

