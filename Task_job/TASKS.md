# TASKS.md

## Nguyên tắc cho Coder

Coder phải bám sát `goal.md`, `plan.md`, `spec.md` và `BLUEPRINT.md`.

Không mở rộng ngoài MVP nếu chưa cần. Ưu tiên app chạy được end-to-end trên localhost trước, sau đó mới hoàn thiện UX.

Mỗi task khi xong cần cập nhật ngắn trong `BUILD_LOG.md`:

- Task ID.
- File đã tạo/sửa.
- Cách chạy kiểm tra.
- Vấn đề còn tồn tại nếu có.

## TASK-001: Khởi tạo cấu trúc project

Mục tiêu: tạo skeleton backend/frontend đúng layout bắt buộc.

Phạm vi:

- Tạo `backend/` với `server.js`, `package.json`, `.env.example`, `.gitignore`.
- Tạo `frontend/` bằng React 18 + Vite.
- Tạo folder routes, services, utils, data, backups.
- Tạo folder frontend api, components, state.
- **Cấu hình Vite proxy** trong `vite.config.js` để `/api/*` forward về `http://localhost:3000`.
- Tạo `README.md` với lệnh chạy ban đầu.
- Tạo `BUILD_LOG.md` với entry đầu tiên cho TASK-001.

Acceptance criteria:

- `cd backend && npm install && npm run dev` chạy server Express.
- `cd frontend && npm install && npm run dev` chạy Vite.
- `GET /api/health` trả JSON.
- Không commit `.env`.

## TASK-002: Lesson storage, validation và backup

Mục tiêu: có nền tảng dữ liệu lesson an toàn.

Phạm vi:

- Tạo `backend/data/lesson.json` mẫu có nhiều slide, ít nhất 1 checkpoint.
- Tạo `utils/validate-lesson.js`.
- Tạo `utils/backup-lesson.js`.
- Tạo `utils/safe-json-parse.js`.
- Tạo `services/lesson.service.js`.
- Tạo `routes/lesson.routes.js`.

API cần có:

- `GET /api/lesson`.
- `PUT /api/lesson`.
- `POST /api/lesson/restore-last`.

Acceptance criteria:

- Lesson thiếu `lessonId`, `title`, hoặc `slides` bị reject.
- Slide thiếu `id`, `order`, `title`, `image`, `script`, `knowledgePoint` bị reject.
- Checkpoint có `reviewSlideId` không tồn tại bị reject.
- Mỗi lần `PUT /api/lesson` hợp lệ tạo file backup trong `backend/data/backups/` với tên chứa timestamp (ví dụ `lesson-2024-01-15T10-30-00.json`).
- `GET /api/lesson/backups` trả danh sách tên file backup theo thứ tự mới nhất trước.
- `POST /api/lesson/restore-last` khôi phục đúng file backup mới nhất.
- Validate fail thì không ghi đè lesson cũ và không tạo backup.

## TASK-003: LLM adapter và prompt utilities

Mục tiêu: backend có một lớp gọi LLM thống nhất.

Phạm vi:

- Tạo `services/llm.service.js`.
- Tạo `utils/prompt-builder.js`.
- Tạo `utils/json-response.js`.
- Đọc config từ `.env`.
- Hỗ trợ interface:

```js
async function callLLM({ systemPrompt, userPrompt, temperature, maxTokens }) {}
async function callLLMForJSON({ systemPrompt, userPrompt, temperature, maxTokens }) {}
```

Provider:

- Tối thiểu implement provider theo `.env`.
- **Bắt buộc có mock provider**: khi `LLM_PROVIDER=mock` trong `.env`, `callLLM` trả hardcoded response hợp lệ thay vì gọi API thật. Điều này cho phép test toàn bộ flow mà không cần API key thật.
- Code phải dễ mở rộng cho `openai`, `gemini`, `anthropic`.

Acceptance criteria:

- Không có API key trong frontend.
- Timeout, missing API key, invalid provider, invalid JSON đều được xử lý.
- `callLLMForJSON` trả object hoặc throw lỗi rõ ràng.

## TASK-004: Backend authoring AI

Mục tiêu: chat authoring bên trái có thể yêu cầu AI chỉnh lesson.

Phạm vi:

- Tạo `services/authoring.service.js`.
- Tạo `routes/authoring.routes.js`.
- Implement `POST /api/ai/authoring`.
- Prompt phải yêu cầu LLM trả JSON gồm `assistantMessage`, `changeSummary`, `patch`, `updatedLesson`.
- Trước khi ghi lesson: parse, validate, backup.

Acceptance criteria:

- Request `{ message, currentSlideId }` trả assistant message.
- Nếu LLM trả lesson hợp lệ, backend ghi lesson mới và trả `updatedLesson`.
- Nếu LLM trả lesson lỗi, backend giữ lesson cũ và trả lỗi rõ ràng.
- Preview có thể refresh bằng lesson mới ở task frontend sau.

## TASK-005: Backend classroom chat và voice

Mục tiêu: hỗ trợ trợ giảng AI trong bài học.

Phạm vi:

- Tạo `services/chat.service.js`.
- Tạo `services/voice.service.js`.
- Tạo `routes/chat.routes.js`.
- Tạo `routes/voice.routes.js`.
- Implement `POST /api/chat`.
- Implement `POST /api/voice/chat`, dùng chung logic với chat.

Acceptance criteria:

- Chat request gồm `lessonId`, `currentSlideId`, `message`, `chatHistory`, `mode`.
- Backend build prompt từ lesson title, target learner, current slide, knowledge point.
- Response gồm `ok`, `reply`, `scope`, `speak`.
- Câu hỏi ngoài phạm vi được kéo về bài học theo prompt.

## TASK-006: Backend answer evaluation và question generation

Mục tiêu: checkpoint được đánh giá bằng LLM và có thể sinh câu hỏi.

Phạm vi:

- Tạo `services/answer.service.js`.
- Tạo `services/question.service.js`.
- Tạo `routes/answer.routes.js`.
- Tạo `routes/question.routes.js`.
- Implement `POST /api/answer/evaluate`.
- Implement `POST /api/question/generate`.
- Implement `POST /api/question/regenerate`.

Acceptance criteria:

- `/api/answer/evaluate` trả JSON hợp lệ gồm `ok`, `isCorrect`, `feedback`, `shouldReview`, `reviewSlideId`, `nextAction`.
- Đánh giá mềm theo nghĩa, không bắt đúng từng chữ.
- Nếu sai, `reviewSlideId` phải là slide tồn tại.
- Question generation trả checkpoint có `id`, `type`, `question`, `options`, `correctAnswer`, `explanation`, `wrongFeedback`, `reviewSlideId`.

## TASK-007: Frontend API client và app shell

Mục tiêu: dựng giao diện hai cột và kết nối backend cơ bản.

Phạm vi:

- Tạo `frontend/src/api/client.js`.
- Tạo các API module theo layout.
- Tạo `AppShell`, `LeftChatPanel`, `RightPreviewPanel`, `PreviewToolbar`.
- App start gọi `/api/health` và `/api/lesson`.
- Nếu `/api/health` fail (backend chưa chạy): hiển thị banner cảnh báo ở top của UI, không crash app, cho phép người dùng retry.
- Right panel có tab `Preview` và `JSON`.

Acceptance criteria:

- UI hiển thị hai cột: trái authoring chat, phải preview.
- Tab JSON render lesson hiện tại.
- Có trạng thái backend/model.
- Có loading/error khi backend không chạy.

## TASK-008: Lesson preview player

Mục tiêu: preview chạy được bài học từ lesson JSON.

Phạm vi:

- Tạo `LessonPlayer`.
- Tạo `SlideViewer`.
- Tạo `AudioPlayer`.
- Tạo `ProgressBar`.
- Tạo `CompletionOverlay`.
- Render image/GIF/video theo slide.
- Điều hướng Previous/Next.
- Dừng audio cũ khi đổi slide.

Acceptance criteria:

- Slide đầu tiên hiển thị sau khi load lesson.
- Next/Previous hoạt động.
- Audio phát lại được bằng nút replay.
- Video slide render được nếu field `video` có giá trị.
- Hoàn thành bài học hiển thị completion overlay.

## TASK-009: Checkpoint runtime và review flow

Mục tiêu: hoàn thiện luồng kiểm tra hiểu bài.

Phạm vi:

- Tạo `CheckpointBox`.
- Khi slide có checkpoint chưa pass, khóa Next.
- Hỗ trợ chọn option, nhập text, voice transcript nếu dùng chung VoiceButton.
- Gọi `/api/answer/evaluate`.
- Xử lý `nextAction = continue`.
- Xử lý `nextAction = review`.
- Lưu `reviewReturnSlideId`.
- Hiển thị nút quay lại câu hỏi trên review slide.

Acceptance criteria:

- Checkpoint chưa pass thì Next bị khóa.
- Trả lời đúng unlock Next.
- Trả lời sai chuyển đúng về `reviewSlideId`.
- Từ review slide quay lại được checkpoint ban đầu.
- Sau retry đúng mới đi tiếp được.
- Checkpoint `type: multiple_choice`: UI hiển thị danh sách options để chọn, gửi text của option được chọn trong field `classAnswer`.
- Checkpoint `type: short_text`: UI hiển thị text input tự do, gửi nội dung nhập trong field `classAnswer`. Backend evaluate theo nghĩa, không so khớp từng chữ.

## TASK-010: Classroom chat và voice trong preview

Mục tiêu: lớp học có thể hỏi trợ giảng AI bằng text hoặc voice.

Phạm vi:

- Tạo `ClassroomChat`.
- Tạo `VoiceButton`.
- Chat gửi `/api/chat`.
- Voice dùng Web Speech API để lấy transcript.
- Transcript gửi `/api/voice/chat` hoặc `/api/chat`.
- Reply hiển thị trong chat.
- Dùng SpeechSynthesis đọc reply nếu bật.
- Cấu hình TTS: ngôn ngữ `vi-VN`, rate `0.9`, pitch `1.1`. Phải set đúng lang để tránh đọc tiếng Việt bằng giọng Anh.
- Có fallback khi browser không hỗ trợ speech recognition.

Acceptance criteria:

- Chat trong preview hoạt động độc lập với authoring chat bên trái.
- Chat gửi current slide context.
- Voice hiển thị trạng thái idle/listening/processing/speaking/error.
- Browser không hỗ trợ voice thì hiện thông báo fallback, không làm hỏng app.

## TASK-011: Left authoring chat integration

Mục tiêu: người vận hành có thể chat với AI để chỉnh lesson và preview cập nhật.

Phạm vi:

- Hoàn thiện `LeftChatPanel`, `ChatMessage`, `PromptInput`.
- Quick actions: thêm checkpoint, sửa lời thoại, tạo câu hỏi, cải thiện giao diện.
- Gửi prompt tới `/api/ai/authoring`.
- Render assistant message và change summary.
- Khi response có `updatedLesson`, cập nhật state và preview.

Acceptance criteria:

- Prompt authoring gửi được.
- Loading/error rõ ràng.
- Nếu backend validate fail, UI báo lỗi và preview giữ lesson cũ.
- Nếu thành công, tab Preview và JSON cập nhật lesson mới.

## TASK-012: UX, error handling và responsive

Mục tiêu: làm MVP đủ ổn định để demo.

Phạm vi:

- Thiết kế giao diện dễ dùng cho giáo viên và học sinh nhỏ.
- Nút lớn, nhãn rõ, feedback thân thiện.
- Loading state cho LLM/API.
- Error state cho backend, lesson JSON, slide/audio, speech, invalid LLM JSON.
- Responsive tối thiểu cho laptop và tablet rộng.
- Không dùng layout marketing; đây là tool/workspace.

Acceptance criteria:

- Không có text tràn khỏi button/card/panel ở viewport laptop phổ biến.
- Chat panel không che mất lesson preview.
- Lỗi backend và lỗi LLM có thông báo dễ hiểu.
- Console không có lỗi nghiêm trọng trong happy path.

## TASK-013: README và kiểm thử kịch bản MVP

Mục tiêu: Reviewer có thể chạy và kiểm tra end-to-end.

Phạm vi:

- README có lệnh:

```bash
cd backend
npm install
cp .env.example .env
npm run dev

cd frontend
npm install
npm run dev
```

- Ghi rõ URL:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:3000`

- Thêm checklist test thủ công.

Acceptance criteria:

- Coder chạy được backend/frontend từ README.
- Test được các kịch bản:
  1. Mở app thấy layout hai cột.
  2. Load lesson từ backend.
  3. Authoring chat cập nhật lesson hoặc báo lỗi an toàn.
  4. Slide player + audio hoạt động.
  5. Checkpoint đúng unlock Next.
  6. Checkpoint sai quay về review slide.
  7. Review xong quay lại checkpoint.
  8. Classroom chat hoạt động.
  9. Voice hoạt động hoặc fallback rõ ràng.
  10. API key không xuất hiện trong frontend.

## Thứ tự triển khai bắt buộc

1. TASK-001.
2. TASK-002.
3. TASK-003.
4. TASK-004.
5. TASK-005.
6. TASK-006.
7. TASK-007.
8. TASK-008.
9. TASK-009.
10. TASK-010.
11. TASK-011.
12. TASK-012.
13. TASK-013.

Không chuyển sang TASK frontend phụ thuộc API nếu backend API tương ứng chưa có mock hoặc implementation tối thiểu.

**Nếu làm theo team 2 người**: TASK-007 (frontend shell + app state) có thể làm song song với TASK-004/005/006 (backend AI services) vì không có dependency trực tiếp. Chỉ TASK-008 trở đi mới cần cả backend AI lẫn frontend shell đều xong.

## Definition of Done cho Coder

MVP hoàn thành khi:

- Backend và frontend chạy được trên localhost.
- Lesson load từ JSON qua backend.
- UI có authoring workspace và preview workspace.
- Authoring AI có validate + backup trước khi ghi lesson.
- Lesson player chạy slide/audio/video cơ bản.
- Checkpoint đúng/sai/review/retry hoạt động.
- Classroom chat và voice hoạt động trong giới hạn browser.
- API key chỉ ở backend.
- README đủ để Reviewer chạy lại từ đầu.

