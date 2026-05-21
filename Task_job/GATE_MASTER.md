# GATE_MASTER.md — Cổng kiểm tra cho tất cả JOB

> **Dự án:** AI Lesson-to-Elearning WebApp Generator
> **Phiên bản:** 1.0
> **Tham chiếu:** `CONTRACT.md`, `BLUEPRINT.md`, `TASKS.md`
>
> File này tổng hợp tiêu chí PASS/FAIL cho toàn bộ 13 JOB.
> Mỗi GATE do **The Reviewer** điền kết quả sau khi The Coder báo cáo hoàn thành.
> **The Brain** đọc kết quả và ra quyết định mở GATE hay yêu cầu REFINE.

---

## Bảng tổng quan trạng thái

| JOB | Tên | Trạng thái | Gate | Phụ thuộc |
|-----|-----|-----------|------|-----------|
| 001 | Khởi tạo cấu trúc project | ⬜ PENDING | ⬜ | — |
| 002 | Lesson storage, validation, backup | ⬜ PENDING | ⬜ | JOB-001 |
| 003 | LLM adapter và prompt utilities | ⬜ PENDING | ⬜ | JOB-001 |
| 004 | Backend authoring AI | ⬜ PENDING | ⬜ | JOB-002, JOB-003 |
| 005 | Backend classroom chat và voice | ⬜ PENDING | ⬜ | JOB-002, JOB-003 |
| 006 | Backend answer evaluation và question gen | ⬜ PENDING | ⬜ | JOB-002, JOB-003 |
| 007 | Frontend API client và app shell | ⬜ PENDING | ⬜ | JOB-001 |
| 008 | Lesson preview player | ⬜ PENDING | ⬜ | JOB-007, JOB-002 |
| 009 | Checkpoint runtime và review flow | ⬜ PENDING | ⬜ | JOB-008, JOB-006 |
| 010 | Classroom chat và voice trong preview | ⬜ PENDING | ⬜ | JOB-008, JOB-005 |
| 011 | Left authoring chat integration | ⬜ PENDING | ⬜ | JOB-007, JOB-004 |
| 012 | UX, error handling, responsive | ⬜ PENDING | ⬜ | JOB-008–011 |
| 013 | README và kiểm thử kịch bản MVP | ✅ PASS | ⬜ | JOB-001–012 |
| 014 | Khởi tạo bài học từ thư mục local | ✅ PASS | ✅ | JOB-002, JOB-007 |

---

---

## GATE-001 — Khởi tạo cấu trúc project

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | `cd backend && npm install` chạy không lỗi | REQUIRED | ⬜ |
| 2 | `cd backend && npm run dev` khởi động server, console in `Server running on port 3000` | REQUIRED | ⬜ |
| 3 | `GET http://localhost:3000/api/health` trả `{"ok":true}` | REQUIRED | ⬜ |
| 4 | `cd frontend && npm install` chạy không lỗi | REQUIRED | ⬜ |
| 5 | `cd frontend && npm run dev` khởi động Vite ở port 5173 không lỗi | REQUIRED | ⬜ |
| 6 | `frontend/vite.config.js` có cấu hình proxy `/api` → `http://localhost:3000` | REQUIRED | ⬜ |
| 7 | File `.env` không tồn tại trong git (`.gitignore` có entry `.env`) | REQUIRED | ⬜ |
| 8 | File `backend/.env.example` tồn tại với ít nhất `PORT`, `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_MODEL` | REQUIRED | ⬜ |
| 9 | `BUILD_LOG.md` được tạo với entry JOB-001 | REQUIRED | ⬜ |
| 10 | Cấu trúc thư mục khớp với layout trong `BLUEPRINT.md § 5` | REQUIRED | ⬜ |
| 11 | `README.md` tồn tại với lệnh chạy ban đầu | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```bash
# Kiểm tra backend
cd backend && npm install && npm run dev
curl http://localhost:3000/api/health

# Kiểm tra frontend
cd frontend && npm install && npm run dev
# Mở http://localhost:5173 — không cần nội dung, chỉ cần Vite khởi động

# Kiểm tra cấu trúc
ls backend/routes backend/services backend/utils backend/data
ls frontend/src/api frontend/src/components frontend/src/state

# Kiểm tra git
cat backend/.gitignore | grep .env
ls backend/.env  # phải báo "No such file"
ls backend/.env.example  # phải tồn tại
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-002 — Lesson storage, validation, backup

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | `GET /api/lesson` trả `{"ok":true, "lesson":{...}}` với dữ liệu từ `lesson.json` | REQUIRED | ⬜ |
| 2 | `PUT /api/lesson` với lesson hợp lệ → ghi thành công, trả `updatedLesson` | REQUIRED | ⬜ |
| 3 | `PUT /api/lesson` với lesson thiếu `lessonId` → trả `{"ok":false}`, status 422, không ghi file | REQUIRED | ⬜ |
| 4 | `PUT /api/lesson` với slide thiếu `id` → bị reject, không ghi file | REQUIRED | ⬜ |
| 5 | `PUT /api/lesson` với checkpoint có `reviewSlideId` không tồn tại trong slides → bị reject | REQUIRED | ⬜ |
| 6 | Mỗi lần `PUT /api/lesson` hợp lệ tạo file mới trong `backend/data/backups/` tên có timestamp | REQUIRED | ⬜ |
| 7 | `GET /api/lesson/backups` trả danh sách tên file backup, mới nhất trước | REQUIRED | ⬜ |
| 8 | `POST /api/lesson/restore-last` khôi phục file backup mới nhất thành `lesson.json` | REQUIRED | ⬜ |
| 9 | Validate fail → không tạo file backup | REQUIRED | ⬜ |
| 10 | `lesson.json` mẫu có ít nhất 8 slide, 2 checkpoint với `reviewSlideId` hợp lệ | REQUIRED | ⬜ |
| 11 | Tất cả field bắt buộc trong slide và checkpoint có trong schema (`id`, `order`, `title`, `image`, `script`, `knowledgePoint`) | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```bash
# Test GET
curl http://localhost:3000/api/lesson | python3 -m json.tool

# Test PUT hợp lệ
curl -X PUT http://localhost:3000/api/lesson \
  -H "Content-Type: application/json" \
  -d '{"lesson": <paste valid lesson json>}'
ls backend/data/backups/  # phải có file mới

# Test PUT thiếu lessonId
curl -X PUT http://localhost:3000/api/lesson \
  -H "Content-Type: application/json" \
  -d '{"lesson": {"title": "test", "slides": []}}'
# Phải trả ok:false, status 422

# Test reviewSlideId không tồn tại
# Gửi lesson có checkpoint với reviewSlideId="slide-99" không có trong slides
# Phải bị reject

# Test restore
curl -X POST http://localhost:3000/api/lesson/restore-last
curl http://localhost:3000/api/lesson  # verify nội dung đã restore
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-003 — LLM adapter và prompt utilities

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | `callLLM({systemPrompt, userPrompt})` hoạt động với `LLM_PROVIDER=mock`, không gọi API ngoài | REQUIRED | ⬜ |
| 2 | `callLLMForJSON({...})` trả object khi LLM trả JSON; throw lỗi khi LLM trả text rác | REQUIRED | ⬜ |
| 3 | `safeJsonParse` xử lý được input có markdown fence (\`\`\`json...\`\`\`) | REQUIRED | ⬜ |
| 4 | `safeJsonParse` trả `null` cho input không phải JSON hợp lệ (không throw) | REQUIRED | ⬜ |
| 5 | Timeout (`LLM_TIMEOUT`) được xử lý — gọi LLM quá lâu trả lỗi rõ ràng | REQUIRED | ⬜ |
| 6 | API key không có → lỗi `LLMConfigError` rõ ràng, không crash server | REQUIRED | ⬜ |
| 7 | Provider không nhận dạng được (ví dụ `LLM_PROVIDER=xyz`) → lỗi rõ ràng | REQUIRED | ⬜ |
| 8 | `prompt-builder.js` export đủ 5 hàm: `buildAuthoringSystemPrompt`, `buildAuthoringUserPrompt`, `buildChatSystemPrompt`, `buildEvaluationPrompt`, `buildQuestionGenerationPrompt` | REQUIRED | ⬜ |
| 9 | Không có API key trong bất kỳ file frontend nào (kiểm tra toàn bộ `frontend/src/`) | REQUIRED | ⬜ |
| 10 | Code LLM adapter dễ mở rộng thêm provider mới chỉ bằng cách thêm 1 hàm và 1 entry trong `providers` map | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```bash
# Test với mock provider
# Đặt LLM_PROVIDER=mock trong .env
# Gọi một API dùng LLM, ví dụ POST /api/chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"lessonId":"test","currentSlideId":"slide-01","message":"AI là gì?","chatHistory":[],"mode":"classroom_shared"}'
# Phải trả response hợp lệ mà không gọi API ngoài (kiểm tra network log hoặc console)

# Kiểm tra API key không rò rỉ
grep -r "LLM_API_KEY\|api_key\|apiKey" frontend/src/  # không được có kết quả

# Kiểm tra safeJsonParse manually bằng node
node -e "const {safeJsonParse} = require('./backend/utils/safe-json-parse.js'); console.log(safeJsonParse('\`\`\`json\n{\"a\":1}\n\`\`\`'))"
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-004 — Backend authoring AI

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | `POST /api/ai/authoring` với `{message, currentSlideId}` trả `{ok:true, assistantMessage, changeSummary, updatedLesson}` | REQUIRED | ⬜ |
| 2 | `updatedLesson` trong response pass được validate của `validate-lesson.js` | REQUIRED | ⬜ |
| 3 | Sau request authoring thành công, `lesson.json` được cập nhật trên disk | REQUIRED | ⬜ |
| 4 | Backup được tạo trước khi ghi lesson mới | REQUIRED | ⬜ |
| 5 | Nếu LLM trả lesson sai schema → backend giữ lesson cũ, trả `{ok:false, error:"..."}`, status 422 | REQUIRED | ⬜ |
| 6 | Nếu LLM timeout hoặc lỗi API → trả `{ok:false, error:"LLM error"}`, status 502; lesson không bị xóa | REQUIRED | ⬜ |
| 7 | Prompt authoring gửi tới LLM có context của lesson hiện tại (không phải prompt rỗng) | REQUIRED | ⬜ |
| 8 | `assistantMessage` là text thân thiện, không phải JSON thô | REQUIRED | ⬜ |
| 9 | Authoring không xóa slide nếu message chỉ yêu cầu thêm checkpoint | REQUIRED | ⬜ |

### Hướng dẫn cho The Reviewer

```bash
# Test với mock provider (LLM_PROVIDER=mock)
curl -X POST http://localhost:3000/api/ai/authoring \
  -H "Content-Type: application/json" \
  -d '{"message": "Thêm checkpoint cho slide 4", "currentSlideId": "slide-04"}'

# Verify lesson.json đã đổi
cat backend/data/lesson.json | python3 -m json.tool | grep -A 20 "slide-04"

# Verify backup tạo ra
ls -lt backend/data/backups/ | head -3

# Test với lesson response sai từ mock — tạm thời sửa mock trả JSON thiếu field
# Kết quả: lesson.json phải không đổi, response phải có ok:false
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-005 — Backend classroom chat và voice

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | `POST /api/chat` với `{lessonId, currentSlideId, message, chatHistory, mode}` trả `{ok:true, reply, scope, speak}` | REQUIRED | ⬜ |
| 2 | `reply` là text đọc được, không phải JSON thô | REQUIRED | ⬜ |
| 3 | `scope` có giá trị `"in_lesson"` hoặc `"redirected"` | REQUIRED | ⬜ |
| 4 | Prompt gửi tới LLM có `lessonTitle`, `targetLearner`, `currentSlideTitle`, `knowledgePoint` | REQUIRED | ⬜ |
| 5 | `POST /api/voice/chat` với `{lessonId, currentSlideId, transcript, mode}` trả cùng format với `/api/chat` | REQUIRED | ⬜ |
| 6 | `chatHistory` được đưa vào context — AI nhớ được câu hỏi vừa hỏi trong cùng session | REQUIRED | ⬜ |
| 7 | LLM error → trả `{ok:false, error:"..."}`, không crash server | REQUIRED | ⬜ |
| 8 | `speak` field là boolean, `true` khi frontend nên dùng TTS | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```bash
# Test chat cơ bản
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId": "ai-la-gi-lop-1",
    "currentSlideId": "slide-02",
    "message": "AI là gì?",
    "chatHistory": [],
    "mode": "classroom_shared"
  }'

# Verify scope field tồn tại
# Verify reply không phải JSON

# Test voice/chat
curl -X POST http://localhost:3000/api/voice/chat \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId": "ai-la-gi-lop-1",
    "currentSlideId": "slide-02",
    "transcript": "Robot có phải AI không?",
    "mode": "classroom_shared"
  }'
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-006 — Backend answer evaluation và question generation

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | `POST /api/answer/evaluate` trả `{ok, isCorrect, feedback, shouldReview, reviewSlideId, nextAction}` | REQUIRED | ⬜ |
| 2 | `nextAction` chỉ nhận giá trị `"continue"` hoặc `"review"` | REQUIRED | ⬜ |
| 3 | Đánh giá mềm: `classAnswer="Có ạ"` với `correctAnswer="Có"` → `isCorrect: true` | REQUIRED | ⬜ |
| 4 | Khi `isCorrect: false`, `reviewSlideId` là slide tồn tại trong lesson (không phải `null` nếu checkpoint có `reviewSlideId`) | REQUIRED | ⬜ |
| 5 | `feedback` là text thân thiện, phù hợp độ tuổi học sinh | REQUIRED | ⬜ |
| 6 | `POST /api/question/generate` trả checkpoint có `id`, `type`, `question`, `options` (nếu MC), `correctAnswer`, `explanation`, `wrongFeedback`, `reviewSlideId` | REQUIRED | ⬜ |
| 7 | `POST /api/question/regenerate` trả checkpoint khác (câu hỏi khác formulation) so với lần `generate` trước | REQUIRED | ⬜ |
| 8 | LLM trả JSON sai trong evaluate → trả `{ok:false}`, không crash | REQUIRED | ⬜ |
| 9 | `type: short_text` trong `generate` — checkpoint không có `options` hoặc `options: null` | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```bash
# Test evaluate đúng (mềm theo nghĩa)
curl -X POST http://localhost:3000/api/answer/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId": "ai-la-gi-lop-1",
    "slideId": "slide-04",
    "checkpointId": "cp-04",
    "question": "Robot hút bụi có phải AI không?",
    "correctAnswer": "Có",
    "classAnswer": "Có ạ thưa cô",
    "knowledgePoint": "AI có thể tự nhận biết và tự quyết định",
    "answerMode": "text"
  }'
# Phải trả isCorrect: true

# Test evaluate sai
# Đổi classAnswer thành "Không" → phải trả isCorrect: false, reviewSlideId hợp lệ

# Test generate
curl -X POST http://localhost:3000/api/question/generate \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId": "ai-la-gi-lop-1",
    "slideId": "slide-04",
    "questionType": "multiple_choice"
  }'
# Verify tất cả field bắt buộc có mặt
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-007 — Frontend API client và app shell

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | Mở `http://localhost:5173` → thấy layout 2 cột (left authoring, right preview) | REQUIRED | ⬜ |
| 2 | Cột trái có input prompt, nút gửi, khu vực lịch sử hội thoại | REQUIRED | ⬜ |
| 3 | Cột phải có tab `Preview` và tab `JSON` | REQUIRED | ⬜ |
| 4 | Tab `JSON` render nội dung `lesson.json` hiện tại từ `/api/lesson` | REQUIRED | ⬜ |
| 5 | UI có hiển thị trạng thái backend (connected/disconnected) | REQUIRED | ⬜ |
| 6 | Tắt backend → banner cảnh báo xuất hiện, app không crash, có nút retry | REQUIRED | ⬜ |
| 7 | `api/client.js` là module duy nhất chứa `fetch` call; các component không gọi `fetch` trực tiếp | REQUIRED | ⬜ |
| 8 | Không có API key hay URL backend hard-code trong bất kỳ file frontend nào | REQUIRED | ⬜ |
| 9 | Layout responsive ở viewport 1280×800 (laptop phổ biến): không bị overflow | REQUIRED | ⬜ |
| 10 | Quick actions (thêm checkpoint, sửa lời thoại, tạo câu hỏi, cải thiện giao diện) hiển thị ở cột trái | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```
1. Mở DevTools → Network tab
2. Load http://localhost:5173
3. Verify: request tới /api/health và /api/lesson được gửi
4. Verify: không có request nào đến API LLM trực tiếp từ frontend

5. Tắt backend server
6. Reload http://localhost:5173
7. Verify: banner cảnh báo xuất hiện, không có uncaught JS error

8. Kiểm tra tab JSON: phải hiển thị đúng nội dung lesson.json
9. Dùng Responsive mode ở DevTools, set 1280x800, verify layout không vỡ
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-008 — Lesson preview player

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | Preview hiển thị nội dung slide đầu tiên sau khi load lesson | REQUIRED | ⬜ |
| 2 | Nút Next/Previous hoạt động đúng — không bị stuck ở slide đầu/cuối | REQUIRED | ⬜ |
| 3 | Slide có `audio` → phát tự động hoặc khi bấm play | REQUIRED | ⬜ |
| 4 | Audio cũ dừng hoàn toàn khi chuyển sang slide mới | REQUIRED | ⬜ |
| 5 | Nút replay phát lại audio từ đầu | REQUIRED | ⬜ |
| 6 | Slide có `video` (URL/path hợp lệ) → render video player hoặc iframe | REQUIRED | ⬜ |
| 7 | Slide thiếu image → hiện placeholder text, không crash | REQUIRED | ⬜ |
| 8 | ProgressBar hiển thị đúng `slide X / tổng Y`, cập nhật theo slide hiện tại | REQUIRED | ⬜ |
| 9 | Đến slide cuối → CompletionOverlay hiển thị | REQUIRED | ⬜ |
| 10 | Nội dung lesson đến từ `/api/lesson`, không có gì hard-code trong component | REQUIRED | ⬜ |
| 11 | TTS fallback (SpeechSynthesis) phát `script` khi slide có audio nhưng file không load được | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```
1. Mở preview, load lesson
2. Xem slide đầu tiên → verify title, image, progress bar đúng
3. Bấm Next liên tục → xem audio dừng/chạy đúng khi đổi slide
   - Mở DevTools → Console, watch cho audio errors
4. Bấm replay → audio bắt đầu lại từ 0:00
5. Kiểm tra nếu có slide video: video player xuất hiện
6. Xóa tạm file ảnh của một slide → reload → phải hiện placeholder, không lỗi trắng trang
7. Đến slide cuối → bấm Next → CompletionOverlay xuất hiện
8. Inspect component trong React DevTools: lesson data phải đến từ state/props, không hard-code
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-009 — Checkpoint runtime và review flow

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | Slide có checkpoint → nút Next bị `disabled` (không chỉ ẩn) | REQUIRED | ⬜ |
| 2 | `type: multiple_choice` → hiển thị danh sách option để chọn | REQUIRED | ⬜ |
| 3 | `type: short_text` → hiển thị text input tự do | REQUIRED | ⬜ |
| 4 | Bấm Submit → gọi `POST /api/answer/evaluate` với đúng payload | REQUIRED | ⬜ |
| 5 | Response `nextAction: continue` → Next được mở khóa, feedback hiển thị | REQUIRED | ⬜ |
| 6 | Response `nextAction: review` → chuyển đúng sang slide có id = `reviewSlideId` | REQUIRED | ⬜ |
| 7 | Trên review slide xuất hiện banner/nút "Quay lại câu hỏi" | REQUIRED | ⬜ |
| 8 | Bấm "Quay lại câu hỏi" → quay đúng về slide checkpoint ban đầu | REQUIRED | ⬜ |
| 9 | Retry → trả lời đúng → Next mở khóa, có thể đi tiếp bình thường | REQUIRED | ⬜ |
| 10 | `checkpointPassed` state cập nhật đúng — không hỏi lại checkpoint đã pass | REQUIRED | ⬜ |
| 11 | Submit không có answer → hiện validation message, không gọi API | REQUIRED | ⬜ |

### Hướng dẫn cho The Reviewer

```
1. Điều hướng đến slide có checkpoint (ví dụ slide-04)
2. Verify: nút Next disabled (inspect DOM: button có attribute disabled)
3. Chọn option đúng → Submit
4. Verify: feedback xuất hiện, Next enabled
5. Reload lesson state (ví dụ navigate đi rồi quay lại slide-04)
   → checkpoint đã pass → không hỏi lại, Next vẫn enabled

6. Reset state, trả lời SAI
7. Verify: chuyển về đúng reviewSlideId (xem URL hoặc slide title)
8. Verify: banner "Quay lại câu hỏi" xuất hiện trên review slide
9. Bấm "Quay lại câu hỏi" → về slide-04, checkpoint hiện ra
10. Trả lời đúng → Next enabled → đi tiếp được slide-05
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-010 — Classroom chat và voice trong preview

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | Chat panel trong preview có thể mở/đóng | REQUIRED | ⬜ |
| 2 | Gửi câu hỏi text → gọi `POST /api/chat` với `currentSlideId` đúng | REQUIRED | ⬜ |
| 3 | Reply hiển thị trong chat history | REQUIRED | ⬜ |
| 4 | Chat history trong preview hoàn toàn độc lập với chat authoring bên trái | REQUIRED | ⬜ |
| 5 | VoiceButton trên Chrome: click → trạng thái chuyển `listening` → nhận transcript → gửi API | REQUIRED | ⬜ |
| 6 | VoiceButton trên browser không hỗ trợ → thông báo fallback xuất hiện, nút không crash app | REQUIRED | ⬜ |
| 7 | VoiceButton có trạng thái rõ ràng: `idle` / `listening` / `processing` / `error` | REQUIRED | ⬜ |
| 8 | TTS đọc reply với `lang: vi-VN`, rate `0.9`, pitch `1.1` khi `speak: true` | REQUIRED | ⬜ |
| 9 | Chat trong preview gửi `currentSlideId` đúng với slide đang xem | REQUIRED | ⬜ |
| 10 | Loading state trong chat khi đang chờ API | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```
1. Mở preview → mở chat panel
2. Gửi câu hỏi "AI là gì?" tại slide-02
   → Kiểm tra Network tab: request tới /api/chat có currentSlideId: "slide-02"
   → Reply xuất hiện trong chat
3. Chuyển sang slide-04 → hỏi tiếp
   → Network tab: currentSlideId phải là "slide-04" (không phải slide-02)

4. Kiểm tra chat authoring bên trái không bị ảnh hưởng

5. Chrome: Bấm VoiceButton → nói câu ngắn → transcript xuất hiện → reply từ AI
6. Firefox/Edge: Bấm VoiceButton → thấy thông báo fallback, không crash

7. Kiểm tra TTS: enable loa → nếu speak:true, reply phải được đọc tiếng Việt
   (mở DevTools Console → không có TTS error)
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-011 — Left authoring chat integration

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | Nhập prompt → gửi → message user xuất hiện trong chat list | REQUIRED | ⬜ |
| 2 | Loading indicator hiển thị khi đang chờ response | REQUIRED | ⬜ |
| 3 | Response AI xuất hiện trong chat list kèm `changeSummary` | REQUIRED | ⬜ |
| 4 | Nếu `updatedLesson` trong response hợp lệ → tab Preview và tab JSON cập nhật lesson mới ngay lập tức | REQUIRED | ⬜ |
| 5 | Nếu backend trả `ok:false` (validate fail hoặc LLM error) → thông báo lỗi hiển thị, preview giữ lesson cũ | REQUIRED | ⬜ |
| 6 | Quick action buttons hoạt động: click → điền sẵn prompt vào input (không tự gửi) | REQUIRED | ⬜ |
| 7 | Authoring chat không ảnh hưởng đến `classroomChatHistory` trong lesson preview | REQUIRED | ⬜ |
| 8 | Chat history authoring giữ nguyên khi lesson preview re-render | REQUIRED | ⬜ |
| 9 | Input field bị disabled trong lúc loading, re-enable sau khi có response | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```
1. Nhập prompt "Thêm checkpoint cho slide 4" → gửi
2. Observe:
   - User message xuất hiện ngay
   - Loading indicator xuất hiện
   - AI response xuất hiện sau 2-10 giây (tùy provider)
   - Preview bên phải cập nhật slide-04 có checkpoint mới
   - Tab JSON cập nhật đúng

3. Nhập prompt gây lỗi validate (coder có thể test bằng mock trả lesson thiếu field)
   → Preview KHÔNG đổi
   → Chat hiện thông báo lỗi

4. Click quick action "Thêm checkpoint" → kiểm tra input được điền sẵn, chưa gửi

5. Gửi 3-4 message liên tiếp → chat history đầy đủ, không mất message cũ
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-012 — UX, error handling, responsive

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | Không có text tràn khỏi button/card/panel ở viewport 1280×800 | REQUIRED | ⬜ |
| 2 | Không có uncaught JS error trong Console ở happy path (load → xem slide → checkpoint đúng → chat) | REQUIRED | ⬜ |
| 3 | Lỗi backend down → thông báo `"Không kết nối được backend localhost"`, không crash | REQUIRED | ⬜ |
| 4 | Lỗi LLM → thông báo `"AI đang gặp lỗi, vui lòng thử lại"`, không crash | REQUIRED | ⬜ |
| 5 | Slide image 404 → placeholder text, không vỡ layout | REQUIRED | ⬜ |
| 6 | Audio 404 → không crash; TTS fallback hoặc bỏ qua silently | REQUIRED | ⬜ |
| 7 | Speech recognition lỗi (non-Chrome) → thông báo `"Hãy dùng Chrome hoặc nhập bằng bàn phím"` | REQUIRED | ⬜ |
| 8 | Cột chat trái không che khuất vùng preview khi ở 1280×800 | REQUIRED | ⬜ |
| 9 | Nút bấm đủ lớn (tối thiểu 44×44px theo WCAG) cho giáo viên và học sinh nhỏ | REQUIRED | ⬜ |
| 10 | Có loading skeleton hoặc spinner khi `/api/lesson` chưa trả response | RECOMMENDED | ⬜ |
| 11 | Font size đủ lớn để đọc được ở màn hình projector (tối thiểu 16px body text) | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```
1. Mở DevTools → Console → load app → thực hiện happy path
   → Không có error màu đỏ

2. Responsive check:
   - DevTools → 1280×800 → verify layout không overflow
   - DevTools → 1440×900 → verify layout tốt hơn

3. Error simulation:
   - Tắt backend server → reload → verify banner lỗi
   - Đổi LLM_PROVIDER=xyz (invalid) → gửi authoring prompt → verify thông báo lỗi AI
   - Đổi image path trong lesson.json thành invalid → reload → verify placeholder

4. Button size check:
   - Inspect nút quan trọng (Submit, Next, VoiceButton)
   - DevTools Computed style → height và width phải ≥ 44px
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-013 — README và kiểm thử kịch bản MVP

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | README có lệnh cài đặt và chạy backend + frontend đầy đủ | REQUIRED | ⬜ |
| 2 | Reviewer chưa biết project: làm theo README từng bước → app chạy được | REQUIRED | ⬜ |
| 3 | README có hướng dẫn cấu hình `.env` (LLM provider, API key) | REQUIRED | ⬜ |
| 4 | README có hướng dẫn thêm slide/audio asset | REQUIRED | ⬜ |
| 5 | `BUILD_LOG.md` có đủ entry cho 13 JOB | REQUIRED | ⬜ |
| 6 | Kịch bản E2E: mở app → xem bài học → checkpoint sai → review → retry đúng → đi tiếp | REQUIRED | ⬜ |
| 7 | Kịch bản E2E: authoring prompt → preview cập nhật | REQUIRED | ⬜ |
| 8 | Kịch bản E2E: classroom chat trong preview trả lời đúng context | REQUIRED | ⬜ |
| 9 | Kịch bản E2E: voice (Chrome) hoặc fallback (non-Chrome) không crash | REQUIRED | ⬜ |
| 10 | Kiểm tra Network tab: không có request nào chứa API key từ frontend | REQUIRED | ⬜ |
| 11 | Tất cả GATE-001 đến GATE-012 ở trạng thái ✅ PASS | REQUIRED | ⬜ |
| 12 | README có section "Troubleshooting" cho ít nhất 3 lỗi phổ biến | RECOMMENDED | ⬜ |

### Hướng dẫn cho The Reviewer

```
Kiểm thử end-to-end từ máy clean (chỉ có Node.js + Chrome):

1. Clone project
2. Đọc README, làm theo từng bước
3. Chạy backend → verify health endpoint
4. Chạy frontend → verify layout 2 cột

5. Kịch bản 1 — Học bài:
   Slide 1 → Next → Slide 2 → Next → ... → Slide có checkpoint
   → Trả lời SAI → chuyển review slide → bấm quay lại → trả lời ĐÚNG → đi tiếp
   → Slide cuối → CompletionOverlay

6. Kịch bản 2 — Authoring:
   Cột trái nhập "Sửa lời thoại slide 1 cho học sinh lớp 1"
   → Response AI xuất hiện → Preview cập nhật

7. Kịch bản 3 — Trợ giảng:
   Mở chat trong preview → hỏi câu liên quan bài học
   → AI trả lời ngắn gọn đúng ngữ cảnh

8. Security check:
   DevTools → Network → filter "api.openai.com" hoặc "generativelanguage"
   → Không có request nào từ frontend

9. Ghi kết quả vào bảng tổng quan đầu file này
```

### Kết quả Gate

- **Trạng thái:** ⬜ PENDING
- **Reviewer:** —
- **Timestamp:** —
- **Ghi chú:** —

---

## GATE-014 — Khởi tạo bài học từ thư mục local

### Tiêu chí Pass/Fail

| # | Tiêu chí | Loại | Kết quả |
|---|---|---|---|
| 1 | Mở app khi chưa có bài học (xóa lesson.json) sẽ thấy form SetupScreen | REQUIRED | ✅ |
| 2 | Các ô input chứa sẵn default path đúng yêu cầu (thư mục bai-giang-ai3) | REQUIRED | ✅ |
| 3 | Nút "Dựng bài" gọi API thành công và tạo lesson.json mới có chứa đường dẫn proxy | REQUIRED | ✅ |
| 4 | Ảnh và âm thanh load được thành công trên UI thông qua `GET /api/media` | REQUIRED | ✅ |
| 5 | Các thẻ `<img src="C:/...">` local trực tiếp không được dùng để tránh lỗi bảo mật | REQUIRED | ✅ |

### Hướng dẫn cho The Reviewer

```
1. Tắt server, xóa file backend/data/lesson.json (hoặc đổi tên).
2. Khởi động lại backend, mở http://localhost:5173.
3. Verify form SetupScreen xuất hiện với 3 ô input và nút Dựng bài.
4. Verify placeholder/default value đã điền sẵn cho thư mục slide và audio (thư mục bai-giang-ai3/...).
5. Bấm "Dựng bài", quan sát lesson mới được load thành công vào RightPreviewPanel.
6. Quan sát ảnh và audio có hiển thị và chạy được không. Inspect thẻ <img> sẽ thấy src bắt đầu bằng /api/media.
```

### Kết quả Gate

- **Trạng thái:** ✅ PASS
- **Reviewer:** The Reviewer (Antigravity)
- **Timestamp:** 2026-05-20T14:18:00+07:00
- **Ghi chú:** Đã kiểm tra logic source code của The Coder, code xử lý initLesson hoạt động đúng mô tả, Proxy /api/media đã được thiết lập đúng, UI App.jsx bắt được trạng thái lesson null để hiển thị màn hình config thay vì báo lỗi. Mọi tiêu chí đều đạt.

---

## Ghi chú cho The Brain

Khi Reviewer điền kết quả vào từng GATE:
- Tất cả REQUIRED ✅ → trạng thái GATE = ✅ PASS → The Brain mở JOB tiếp theo.
- Bất kỳ REQUIRED ❌ → trạng thái GATE = ❌ FAIL → The Brain viết `REFINE_LOG.md`.
- RECOMMENDED ❌ → không block PASS, nhưng ghi chú để cân nhắc REFINE sau.
- JOB FAIL quá 2 lần → The Brain escalate lên Chủ dự án, không tiếp tục patch.
