# HANDOVER.md

## 1. Mục đích bàn giao

Dự án **AI Lesson Builder (MVP)** là web app chạy trên localhost để:

- Giáo viên chỉnh sửa bài giảng bằng AI ở panel bên trái.
- Xem trước bài học e-learning ở panel bên phải.
- Chạy bài học theo slide, audio, checkpoint, chat trợ giảng và voice.
- Bảo vệ API key bằng cách chỉ gọi LLM từ backend.

MVP này không phải LMS hoàn chỉnh. Phạm vi hiện tại là 1 bài học, 1 lớp học, 1 máy chạy localhost.

## 2. Thành phần hệ thống

| Thành phần | Công nghệ | Vai trò |
|---|---|---|
| Backend | Node.js, Express | API đọc/ghi lesson, gọi LLM, validate, backup |
| Frontend | React 18, Vite | Giao diện authoring + preview bài học |
| Data | JSON file | Lưu bài học tại `backend/data/lesson.json` |
| Asset | Static files | Slide/audio/video tại `frontend/public/assets/` |
| LLM | OpenAI/Gemini/Anthropic/mock | Cấu hình qua `backend/.env` |

## 3. Cấu trúc thư mục quan trọng

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

## 4. Cách chạy hệ thống

### Backend

```bash
cd backend
npm install
```

Tạo file `.env`:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Chạy backend:

```bash
npm run dev
```

Backend chạy tại:

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

Frontend chạy tại:

```text
http://localhost:5173
```

## 5. Biến môi trường

File mẫu: `backend/.env.example`

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

Ghi chú vận hành:

- Dùng `LLM_PROVIDER=mock` để demo không cần API key.
- Khi dùng provider thật, chỉ điền API key trong `backend/.env`.
- Không đưa API key vào frontend hoặc `lesson.json`.
- Không commit `backend/.env`.

## 6. API chính

| API | Method | Chức năng |
|---|---|---|
| `/api/health` | GET | Kiểm tra backend sống |
| `/api/lesson` | GET | Load bài học |
| `/api/lesson` | PUT | Ghi bài học sau validate + backup |
| `/api/lesson/backups` | GET | Liệt kê backup |
| `/api/lesson/restore-last` | POST | Khôi phục backup mới nhất |
| `/api/ai/authoring` | POST | Chat AI để chỉnh sửa bài học |
| `/api/chat` | POST | Chat trợ giảng trong preview |
| `/api/voice/chat` | POST | Gửi transcript voice tới trợ giảng |
| `/api/answer/evaluate` | POST | Chấm câu trả lời checkpoint |
| `/api/question/generate` | POST | Sinh checkpoint |
| `/api/question/regenerate` | POST | Sinh lại checkpoint |

## 7. Luồng dữ liệu chính

1. Frontend gọi `GET /api/lesson` để load `backend/data/lesson.json`.
2. Panel trái gửi prompt tới `POST /api/ai/authoring`.
3. Backend gọi LLM, parse JSON, validate lesson, tạo backup, ghi lesson mới.
4. Frontend nhận `updatedLesson` và cập nhật preview + tab JSON.
5. Lesson player xử lý slide, audio, checkpoint, review flow.
6. Classroom chat và voice gọi backend qua `/api/chat` và `/api/voice/chat`.

## 8. Quản lý nội dung bài học

File bài học chính:

```text
backend/data/lesson.json
```

Khi sửa bài học qua API, backend tạo backup tại:

```text
backend/data/backups/
```

Asset dùng trong bài học nên đặt tại:

```text
frontend/public/assets/slides/
frontend/public/assets/audio/
frontend/public/assets/video/
```

Đường dẫn trong `lesson.json` nên bắt đầu bằng `/assets/`, ví dụ:

```json
{
  "image": "/assets/slides/slide-01.jpg",
  "audio": "/assets/audio/slide-01.mp3"
}
```

## 9. Checklist nghiệm thu nhanh

1. `GET /api/health` trả `{ "ok": true }`.
2. Mở `http://localhost:5173` thấy layout 2 cột.
3. Preview load được slide đầu tiên từ backend.
4. Tab JSON hiển thị lesson hiện tại.
5. Bấm `Trang sau` chuyển slide được.
6. Slide có checkpoint khóa nút Next.
7. Trả lời sai chuyển về slide ôn tập.
8. Bấm `Quay lại câu hỏi` quay về checkpoint.
9. Trả lời đúng mở khóa Next.
10. Chat trợ giảng trả lời theo nội dung slide.
11. Voice hoạt động trên Chrome hoặc hiện fallback rõ.
12. Authoring chat cập nhật preview hoặc báo lỗi an toàn.
13. Không có API key trong frontend source/network request.

## 10. Lệnh kiểm tra kỹ thuật

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

Tìm API key lộ trong frontend:

```bash
rg -n "API_KEY|LLM_API_KEY|api.openai.com|generativelanguage|sk-|AIza" frontend/src frontend/public frontend/index.html frontend/vite.config.js
```

## 11. Sự cố thường gặp

| Vấn đề | Cách xử lý |
|---|---|
| Frontend báo không kết nối backend | Kiểm tra backend đã chạy ở port 3000 chưa |
| Port 3000 bị chiếm | Tắt process đang dùng port hoặc đổi port có kiểm soát |
| AI báo lỗi 502 | Kiểm tra `LLM_PROVIDER`, `LLM_API_KEY`, mạng và timeout |
| Voice không chạy | Dùng Chrome, cấp quyền microphone, hoặc nhập bằng bàn phím |
| Ảnh/audio không hiện | Kiểm tra file có trong `frontend/public/assets/` và path bắt đầu `/assets/` |
| Lesson bị lỗi sau chỉnh sửa | Dùng backup trong `backend/data/backups/` hoặc endpoint restore |

## 12. Trạng thái bàn giao

Theo `Task_job/REVIEW_REPORT.md`, các job `JOB-001` đến `JOB-013` đã được reviewer kiểm tra và pass sau các vòng sửa. Tài liệu gốc để truy vết:

- `Task_job/TASKS.md`
- `Task_job/BUILD_LOG.md`
- `Task_job/REVIEW_REPORT.md`
- `Task_job/CONTRACT.md`
- `Task_job/BLUEPRINT.md`
