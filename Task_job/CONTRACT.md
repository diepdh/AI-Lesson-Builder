# CONTRACT.md — AI Lesson-to-Elearning WebApp Generator

> **Phiên bản:** 1.0
> **Ngày chốt:** (điền khi Chủ dự án APPROVED)
> **Trạng thái:** ⬜ CHỜ XÁC NHẬN

---

## 1. Scope — Phạm vi thực hiện

Những deliverable sau sẽ được xây dựng trong MVP này. Mỗi item đủ cụ thể để kiểm chứng được.

### 1.1 Backend Express API

| # | Deliverable | Kiểm chứng bằng |
|---|---|---|
| B-01 | `server.js` khởi động ở port 3000, trả `GET /api/health` | `curl http://localhost:3000/api/health` trả `{"ok":true}` |
| B-02 | `lesson.service.js` đọc/ghi `lesson.json` với validate + backup | `PUT /api/lesson` với lesson hợp lệ tạo file trong `data/backups/` |
| B-03 | `validate-lesson.js` từ chối lesson thiếu field bắt buộc | Test case: thiếu `lessonId`, `slides`, `id` slide, `reviewSlideId` không tồn tại |
| B-04 | `backup-lesson.js` tạo file `lesson-{timestamp}.json` trước mỗi lần ghi | File backup tồn tại sau mỗi `PUT /api/lesson` thành công |
| B-05 | `llm.service.js` với adapter cho `openai`, `gemini`, `anthropic`, `mock` | `LLM_PROVIDER=mock` trả hardcoded response mà không gọi API ngoài |
| B-06 | `authoring.service.js` + `POST /api/ai/authoring` — nhận prompt, trả `updatedLesson` sau validate + backup | Prompt "thêm checkpoint cho slide 4" → lesson được cập nhật trong preview |
| B-07 | `chat.service.js` + `POST /api/chat` — trả lời trợ giảng trong phạm vi bài học | Response có `ok`, `reply`, `scope`, `speak` |
| B-08 | `voice.service.js` + `POST /api/voice/chat` — nhận transcript, xử lý như chat | Request với `transcript` → response tương đương `/api/chat` |
| B-09 | `answer.service.js` + `POST /api/answer/evaluate` — đánh giá mềm theo nghĩa | Đúng nghĩa nhưng khác chữ vẫn trả `isCorrect: true`; sai trả `reviewSlideId` hợp lệ |
| B-10 | `question.service.js` + `POST /api/question/generate` + `POST /api/question/regenerate` | Response trả checkpoint đầy đủ fields theo schema |
| B-11 | `GET /api/lesson/backups` + `POST /api/lesson/restore-last` | Liệt kê được backup; restore đúng file mới nhất |
| B-12 | `prompt-builder.js` — 5 hàm builder cho authoring, chat, evaluation, question gen | Module export đúng interface đã định nghĩa |
| B-13 | `safe-json-parse.js` — strip markdown fence, parse an toàn | Input `\`\`\`json {...} \`\`\`` → trả object; input rác → trả `null` |
| B-14 | `json-response.js` — wrapper chuẩn hóa response `{ok, data, error}` | Tất cả route dùng chung helper này |

### 1.2 Frontend React + Vite

| # | Deliverable | Kiểm chứng bằng |
|---|---|---|
| F-01 | `vite.config.js` có proxy `/api/*` → `http://localhost:3000` | Request `/api/health` từ browser không lỗi CORS |
| F-02 | `AppShell` layout 2 cột: trái chat authoring, phải preview | Viewport laptop: cả 2 cột đều nhìn thấy, không cột nào bị đẩy xuống |
| F-03 | `LeftChatPanel` — input prompt, lịch sử hội thoại, loading/error, quick actions | Gửi prompt → thấy message → thấy response AI |
| F-04 | `RightPreviewPanel` — tab `Preview` (bắt buộc) + tab `JSON` (render lesson hiện tại) | Đổi tab → đúng nội dung hiển thị |
| F-05 | `LessonPlayer` — load lesson từ `/api/lesson`, render slide đầu tiên khi khởi động | Không hard-code lesson; nội dung thay đổi khi `lesson.json` thay đổi |
| F-06 | `SlideViewer` — render image/GIF/video; có fallback khi asset lỗi | Slide có `video` → video player; có `image` → img; cả hai lỗi → placeholder text |
| F-07 | `AudioPlayer` — phát audio theo slide; dừng khi đổi slide; nút replay | Đổi slide → audio cũ dừng; nút replay phát lại từ đầu |
| F-08 | `ProgressBar` — hiển thị tiến độ `slide X / tổng Y` | Đúng số đếm; cập nhật theo slide hiện tại |
| F-09 | `CheckpointBox` — hiển thị câu hỏi; khóa Next khi chưa pass; gọi `/api/answer/evaluate` | Next disabled khi checkpoint chưa pass; enabled sau khi trả lời đúng |
| F-10 | Review flow — sai checkpoint → chuyển đúng `reviewSlideId` → nút "Quay lại câu hỏi" → retry | Flow hoạt động đầy đủ không bị loop hoặc stuck |
| F-11 | `ClassroomChat` — chat trợ giảng trong preview; gửi slide context; TTS đọc reply | Chat trong preview hoàn toàn độc lập với chat authoring bên trái |
| F-12 | `VoiceButton` — speech-to-text tiếng Việt; transcript gửi `/api/voice/chat`; fallback nếu browser không hỗ trợ | Chrome: voice hoạt động; browser khác: thông báo fallback rõ ràng |
| F-13 | `CompletionOverlay` — hiển thị khi hoàn thành bài học | Màn hình overlay xuất hiện sau slide cuối cùng |
| F-14 | `api/` modules — `client.js`, `lesson.api.js`, `authoring.api.js`, `chat.api.js`, `answer.api.js`, `question.api.js` | Frontend không gọi fetch trực tiếp ngoài các module này |
| F-15 | Banner cảnh báo khi backend không chạy; app không crash | Tắt backend → UI hiện thông báo, retry button hoạt động |

### 1.3 Tài liệu và dữ liệu mẫu

| # | Deliverable | Kiểm chứng bằng |
|---|---|---|
| D-01 | `backend/data/lesson.json` mẫu đầy đủ: 8+ slide, 2+ checkpoint | Load bài học → preview chạy được toàn bộ flow |
| D-02 | `backend/.env.example` với tất cả biến môi trường và comment giải thích | Reviewer có thể cấu hình từ zero chỉ đọc file này |
| D-03 | `README.md` với lệnh cài đặt, chạy, cấu hình LLM, thêm asset | Reviewer chưa biết project → làm theo README → app chạy được |
| D-04 | `BUILD_LOG.md` được cập nhật sau mỗi JOB | File tồn tại, có entry cho từng JOB đã hoàn thành |

---

## 2. Out-of-Scope — Không thực hiện trong MVP này

Những phần sau **sẽ không được xây dựng**. Nếu có yêu cầu trong quá trình build, The Coder phải báo lại Brain thay vì tự ý triển khai.

| # | Không làm | Lý do |
|---|---|---|
| OS-01 | Đăng nhập / xác thực học sinh hay giáo viên | Ngoài phạm vi MVP; tăng độ phức tạp không cần thiết |
| OS-02 | Đồng bộ nhiều thiết bị học sinh theo thời gian thực (WebSocket/SSE) | MVP dùng mô hình 1 màn hình chung cho cả lớp |
| OS-03 | Chấm điểm cá nhân và lưu tiến độ từng học sinh | Chỉ xử lý 1 câu trả lời chung của cả lớp |
| OS-04 | LMS / SCORM / xAPI / dashboard quản trị trường | Đây là authoring tool + player, không phải LMS |
| OS-05 | Upload file từ browser (slide/audio) trong giao diện authoring | MVP dùng asset từ `public/assets/` trên disk |
| OS-06 | Deploy lên server công khai / cloud | Chỉ chạy `localhost` |
| OS-07 | Automated test (unit test, integration test) | Kiểm thử thủ công theo checklist trong TASKS.md |
| OS-08 | Nhiều bài học đồng thời (multi-lesson management) | MVP: 1 `lesson.json` duy nhất |
| OS-09 | Streaming response từ LLM | Dùng request/response thông thường |
| OS-10 | Export bài học ra file HTML/SCORM độc lập | Ngoài phạm vi giai đoạn này |

---

## 3. Definition of Done — Toàn dự án

MVP được xem là **hoàn thành** khi Reviewer thực hiện được toàn bộ kịch bản sau từ một máy mới (chỉ cần Node.js + Chrome):

```
[✓] Đọc README → chạy được backend và frontend
[✓] Mở http://localhost:5173 → thấy layout 2 cột không lỗi
[✓] Preview load lesson từ /api/lesson (không hard-code)
[✓] Slide hiển thị, audio phát, có thể chuyển slide
[✓] Tab JSON hiển thị nội dung lesson.json hiện tại
[✓] Nhập prompt authoring → preview cập nhật (hoặc hiện lỗi an toàn)
[✓] Slide có checkpoint → Next bị khóa
[✓] Trả lời đúng → Next mở khóa
[✓] Trả lời sai → chuyển về reviewSlideId → nút quay lại → retry đúng → đi tiếp
[✓] Chat trợ giảng trong preview hoạt động, trả lời theo context slide
[✓] Voice: Chrome → flow hoạt động; browser khác → fallback không crash
[✓] Hoàn thành slide cuối → CompletionOverlay xuất hiện
[✓] Kiểm tra Network tab → không có request nào chứa API key
[✓] Tất cả GATE của 13 JOB ở trạng thái PASS
[✓] BUILD_LOG.md tồn tại và có entry cho từng JOB
```

Ngoài ra, toàn bộ checklist trong `TASKS.md ## TASK-013` phải passed.

---

## 4. Môi trường kỹ thuật

### 4.1 Runtime

| Thành phần | Yêu cầu |
|---|---|
| Node.js | 20+ (LTS) |
| npm | 9+ |
| Trình duyệt | Chrome (bắt buộc cho voice); Firefox/Edge (chấp nhận, không có voice) |
| OS | Bất kỳ — Windows/macOS/Linux đều phải chạy được |

### 4.2 Port

| Service | Port | Ghi chú |
|---|---|---|
| Backend Express | 3000 | Cố định, không được thay đổi |
| Frontend Vite | 5173 | Mặc định Vite, không cần thay đổi |

### 4.3 Package chính — Backend

```
express ^4.x
cors ^2.x
dotenv ^16.x
axios ^1.x
```

Không dùng TypeScript, ORM, message queue hay bất kỳ dependency nặng nào khác trong MVP.

### 4.4 Package chính — Frontend

```
react ^18.x
react-dom ^18.x
vite ^5.x
@vitejs/plugin-react ^4.x
```

Không dùng React Router, Redux, hay UI component library nặng. State bằng `useState`/`useReducer`/Context.

### 4.5 LLM Provider

Provider chọn qua `LLM_PROVIDER` trong `.env`. Tất cả provider đều phải được router trong `llm.service.js`:

| Giá trị | Provider | Model mặc định |
|---|---|---|
| `openai` | OpenAI API | `gpt-4o-mini` |
| `gemini` | Google Gemini API | `gemini-1.5-flash` |
| `anthropic` | Anthropic Claude API | `claude-3-haiku-20240307` |
| `mock` | Hardcoded response | — (không gọi API) |

`mock` là bắt buộc phải implement để test flow không cần API key thật.

### 4.6 Asset

Slide/audio/video đặt tại `frontend/public/assets/`. Không dùng đường dẫn tuyệt đối ngoài project. URL trong `lesson.json` phải bắt đầu bằng `/assets/`.

### 4.7 Biến môi trường bắt buộc

Tất cả phải có trong `.env.example` với comment giải thích:

```
PORT
LLM_PROVIDER
LLM_API_KEY
LLM_MODEL
LLM_BASE_URL
LLM_TIMEOUT
TTS_FALLBACK
TTS_LANG
TTS_RATE
TTS_PITCH
```

### 4.8 Quản lý dependency

Mỗi service (backend/frontend) có `package.json` riêng. Không dùng monorepo tooling (Turborepo, nx) trong MVP.

---

## 5. Ràng buộc bất di bất dịch

The Coder **không được tự ý thay đổi** những ràng buộc sau. Nếu muốn thay đổi, phải báo The Brain trước.

| # | Ràng buộc | Lý do |
|---|---|---|
| C-01 | API key chỉ nằm trong `backend/.env`, không được xuất hiện trong bất kỳ file frontend nào | Bảo mật — nếu vi phạm, JOB liên quan tự động FAIL |
| C-02 | `.env` không được commit vào git | Bảo mật |
| C-03 | Mọi gọi LLM phải đi qua `llm.service.js` ở backend | Không gọi trực tiếp từ route hay frontend |
| C-04 | Mọi ghi `lesson.json` phải theo thứ tự: validate → backup → ghi; backup fail → không ghi | Toàn vẹn dữ liệu |
| C-05 | Frontend không được đọc `lesson.json` trực tiếp từ disk; phải qua `GET /api/lesson` | Separation of concerns |
| C-06 | Audio cũ phải dừng trước khi slide mới bắt đầu | UX — audio chồng nhau là lỗi nghiêm trọng |
| C-07 | Checkpoint chưa pass thì nút Next phải bị disabled (không chỉ ẩn đi) | Học sinh không được bỏ qua checkpoint |
| C-08 | Authoring chat và classroom chat là 2 luồng hoàn toàn độc lập — khác API, khác context, khác prompt | Không được dùng chung state hay lẫn lộn context |
| C-09 | `BUILD_LOG.md` phải tồn tại và được cập nhật sau mỗi JOB | Traceability cho hệ thống 3 Agent |
| C-10 | Tất cả response API có field `ok: true/false`; lỗi có `error` và `details` | Contract API nhất quán |

---

## 6. Xác nhận của Chủ dự án

> ⬜ **PENDING** — Contract chưa được xác nhận.

Để dự án tiếp tục sang **Pha 4 (BUILD PLAN)**, Chủ dự án cần xác nhận bằng cách thay trạng thái trên thành:

> ✅ **APPROVED** — Ngày: _____ / Ghi chú: _____

Hoặc:

> 🔄 **CẦN CHỈNH SỬA** — Mục cần thay đổi: _____

> ⚠️ **GATE 0**: CONTRACT phải ở trạng thái `APPROVED` trước khi The Brain viết bất kỳ JOB BRIEF nào.
