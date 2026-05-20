# BLUEPRINT.md

## 1. Tổng quan dự án

Tên dự án: AI Lesson-to-Elearning WebApp Generator.

Mục tiêu MVP là xây dựng một web app chạy trên localhost, có khả năng:

- Cho giáo viên/người vận hành chat với AI để tạo hoặc chỉnh sửa bài học.
- Preview trực tiếp bài học e-learning ở cùng giao diện.
- Chạy bài học theo slide, audio, checkpoint, chat trợ giảng và voice.
- Dùng backend localhost để gọi LLM, validate lesson, backup dữ liệu và bảo vệ API key.

MVP không phải LMS hoàn chỉnh. Phạm vi hiện tại là 1 giáo viên, 1 bài học, 1 lớp học, 1 câu trả lời chung của cả lớp tại mỗi checkpoint.

## 2. Phân loại bài toán và rủi ro kỹ thuật

Loại dự án: Web app hybrid gồm authoring tool, lesson preview player, backend API và LLM integration.

Độ phức tạp: Medium-to-Complex vì có nhiều module frontend/backend, state flow tương tác, LLM JSON parsing, backup dữ liệu và voice browser API.

Rủi ro kỹ thuật chính:

- LLM trả về JSON sai định dạng hoặc nội dung phá schema lesson.
- Frontend hard-code dữ liệu bài học thay vì load từ backend/lesson JSON.
- API key bị lộ trong frontend.
- Checkpoint flow sai: học sinh trả lời sai nhưng vẫn đi tiếp, hoặc không quay lại đúng review slide.
- Voice recognition không được browser hỗ trợ, cần fallback rõ ràng.
- Audio không dừng khi chuyển slide hoặc khi video chạy.
- Authoring chat và classroom chat dễ bị trộn lẫn về mục đích và context.

## 3. Kiến trúc tổng thể

```text
User Browser
  |
  +-- Frontend React/Vite App
  |     |
  |     +-- App Shell
  |     |     +-- Left AI Chat Workspace
  |     |     +-- Right Preview Workspace
  |     |
  |     +-- Lesson Preview Runtime
  |           +-- Slide Player
  |           +-- Audio Player
  |           +-- Checkpoint Box
  |           +-- Classroom Chat
  |           +-- Voice Assistant
  |
  +-- HTTP fetch localhost API
        |
        v
Backend Express API
  |
  +-- Lesson Service
  +-- Authoring AI Service
  +-- Classroom Chat Service
  +-- Voice Service
  +-- Question Service
  +-- Answer Evaluation Service
  +-- Lesson Validation Service
  +-- Backup/Restore Service
  +-- LLM Provider Adapter
        |
        v
External or Local LLM Provider
```

## 4. Tech stack quyết định

Frontend:

- React 18 + Vite.
- JavaScript/JSX.
- CSS thường hoặc CSS Modules. Không cần Tailwind nếu project chưa có sẵn.
- State bằng `useState`, `useReducer`, Context khi cần chia sẻ lesson/runtime state.
- `fetch` cho HTTP.
- Web Speech API cho speech-to-text.
- SpeechSynthesis API cho text-to-speech.

Backend:

- Node.js 20+.
- Express 4.
- `dotenv` để đọc config.
- `cors` cho frontend localhost.
- JSON file storage cho MVP.
- `fetch` hoặc `axios` để gọi provider.

LLM:

- Backend phải có adapter chung cho OpenAI, Gemini, Anthropic hoặc local model.
- Provider chọn bằng `.env`.
- Frontend không biết provider và không chứa API key.

## 5. Project layout bắt buộc

```text
project-root/
  backend/
    server.js
    package.json
    .env.example
    .gitignore
    data/
      lesson.json
      backups/
    routes/
      lesson.routes.js
      authoring.routes.js
      chat.routes.js
      voice.routes.js
      answer.routes.js
      question.routes.js
    services/
      lesson.service.js
      llm.service.js
      authoring.service.js
      chat.service.js
      voice.service.js
      answer.service.js
      question.service.js
    utils/
      json-response.js
      prompt-builder.js
      safe-json-parse.js
      validate-lesson.js
      backup-lesson.js

  frontend/
    package.json
    vite.config.js
    index.html
    public/
      assets/
        slides/
        audio/
        video/
    src/
      main.jsx
      App.jsx
      styles.css
      api/
        client.js
        lesson.api.js
        authoring.api.js
        chat.api.js
        voice.api.js
        answer.api.js
        question.api.js
      components/
        AppShell/
          AppShell.jsx
        LeftChatPanel/
          LeftChatPanel.jsx
          ChatMessage.jsx
          PromptInput.jsx
        RightPreviewPanel/
          RightPreviewPanel.jsx
          PreviewToolbar.jsx
        LessonPreview/
          LessonPlayer.jsx
          SlideViewer.jsx
          AudioPlayer.jsx
          CheckpointBox.jsx
          ClassroomChat.jsx
          VoiceButton.jsx
          ProgressBar.jsx
          CompletionOverlay.jsx
      state/
        appState.js
        lessonState.js

  goal.md
  plan.md
  spec.md
  BLUEPRINT.md
  TASKS.md
  README.md
```

## 6. Module map

```text
                 +----------------------+
                 |   LLM Provider API   |
                 +----------^-----------+
                            |
                    +-------+-------+
                    | LLM Adapter   |
                    +-------^-------+
                            |
+---------------------------+----------------------------+
|                     Backend Express                     |
|                                                        |
| Lesson Routes --> Lesson Service --> lesson.json        |
|                              |                          |
|                              +--> Validate + Backup     |
|                                                        |
| Authoring Routes --> Authoring Service --> LLM Adapter  |
| Chat Routes      --> Chat Service      --> LLM Adapter  |
| Voice Routes     --> Voice Service     --> Chat Service |
| Answer Routes    --> Answer Service    --> LLM Adapter  |
| Question Routes  --> Question Service  --> LLM Adapter  |
+---------------------------^----------------------------+
                            |
                         fetch
                            |
+---------------------------+----------------------------+
|                      Frontend React                      |
|                                                        |
| AppShell                                               |
|  +-- LeftChatPanel --> authoring.api                   |
|  +-- RightPreviewPanel                                 |
|       +-- Preview tab --> LessonPlayer                 |
|       +-- JSON tab    --> lesson state                 |
|                                                        |
| LessonPlayer                                           |
|  +-- SlideViewer                                       |
|  +-- AudioPlayer                                       |
|  +-- CheckpointBox --> answer.api/question.api         |
|  +-- ClassroomChat --> chat.api                        |
|  +-- VoiceButton   --> Web Speech API + voice/chat API |
+--------------------------------------------------------+
```

## 7. Data flow chính

### 7.1 Load app

```text
Frontend start
-> GET /api/health
-> GET /api/lesson
-> set lesson state
-> render left authoring chat and right preview
```

### 7.2 Authoring flow

```text
User nhập prompt ở LeftChatPanel
-> POST /api/ai/authoring
-> backend build authoring prompt từ lesson hiện tại
-> gọi LLM
-> parse JSON result
-> validate updatedLesson
-> backup lesson cũ
-> ghi lesson mới
-> trả updatedLesson + changeSummary
-> frontend refresh preview
```

Nguyên tắc: nếu validate fail, backend không được ghi đè `lesson.json`.

### 7.3 Lesson runtime flow

```text
Slide hiện tại
-> render image/GIF/video
-> phát audio nếu có
-> nếu slide có checkpoint chưa pass: lock Next
-> nếu không có checkpoint hoặc đã pass: cho phép Next
```

### 7.4 Checkpoint answer flow

```text
Lớp nhập/chọn/nói câu trả lời chung
-> POST /api/answer/evaluate
-> backend gọi LLM đánh giá mềm theo nghĩa
-> response nextAction
-> continue: unlock Next
-> review: lưu reviewReturnSlideId, chuyển tới reviewSlideId
```

### 7.5 Review flow

```text
Sai tại checkpoint slide X
-> chuyển về review slide Y
-> phát lại audio/script của slide Y
-> hiển thị nút "Quay lại câu hỏi"
-> quay lại slide X
-> retry checkpoint
```

### 7.6 Classroom chat/voice flow

```text
Người dùng hỏi trong preview
-> POST /api/chat hoặc /api/voice/chat
-> backend build prompt từ lesson + slide hiện tại + chatHistory
-> LLM trả lời trong phạm vi bài học
-> frontend render reply
-> optional TTS
```

## 8. Lesson schema chuẩn

Root:

```json
{
  "lessonId": "string",
  "title": "string",
  "description": "string",
  "targetLearner": "string",
  "learningObjectives": ["string"],
  "classroomMode": {
    "mode": "teacher_led_shared_answer",
    "teacherControlsSlides": true,
    "sharedClassAnswer": true
  },
  "assistantPersona": {
    "role": "string",
    "tone": "string",
    "scopeRule": "string"
  },
  "slides": []
}
```

Slide:

```json
{
  "id": "slide-01",
  "order": 1,
  "title": "string",
  "module": "string",
  "image": "/assets/slides/slide-01.jpg",
  "audio": "/assets/audio/s01.mp3",
  "video": null,
  "script": "string",
  "knowledgePoint": "string",
  "checkpoint": null
}
```

Checkpoint:

```json
{
  "id": "cp-04",
  "type": "multiple_choice",
  "question": "string",
  "options": ["string"],
  "correctAnswer": "string",
  "explanation": "string",
  "wrongFeedback": "string",
  "reviewSlideId": "slide-03",
  "retryPolicy": {
    "askSimilarQuestion": true,
    "maxAttemptsBeforeHint": 1
  }
}
```

## 9. API boundary

Backend phải expose tối thiểu:

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/api/health` | Kiểm tra backend và trạng thái LLM config |
| GET | `/api/lesson` | Trả lesson hiện tại |
| PUT | `/api/lesson` | Cập nhật lesson sau validate + backup |
| POST | `/api/lesson/restore-last` | Khôi phục backup mới nhất |
| POST | `/api/ai/authoring` | Chat authoring để sửa lesson |
| POST | `/api/answer/evaluate` | Đánh giá câu trả lời chung của lớp |
| POST | `/api/chat` | Chat trợ giảng trong bài học |
| POST | `/api/voice/chat` | Voice đã transcript, xử lý như chat |
| POST | `/api/question/generate` | Sinh checkpoint mới |
| POST | `/api/question/regenerate` | Sinh câu hỏi tương tự khi retry |

Tất cả response nên có `ok: true/false`. Khi lỗi, trả `error` và `details` nếu có.

## 10. State frontend quan trọng

Authoring chat state:

```js
{
  messages: [],
  input: "",
  isLoading: false,
  error: null,
  lastChangeSummary: null
}
```

Lesson runtime state:

```js
{
  lesson: null,
  currentSlideIndex: 0,
  currentSlideId: null,
  checkpointLocked: false,
  currentCheckpointId: null,
  checkpointPassed: {},
  reviewMode: false,
  reviewReturnSlideId: null,
  classAnswerDraft: "",
  classroomChatHistory: []
}
```

## 11. Quy tắc triển khai bắt buộc

- Không hard-code toàn bộ lesson trong React component.
- `lesson.json` là nguồn dữ liệu chính của bài học MVP.
- API key chỉ nằm trong backend `.env`.
- `.env` không được commit; phải có `.env.example`.
- Mọi ghi lesson phải validate trước, backup trước, ghi sau.
- LLM JSON output phải được parse an toàn và có fallback lỗi.
- Authoring chat không được tự ý xóa slide/dữ liệu nếu user không yêu cầu.
- Classroom chat chỉ trả lời trong phạm vi bài học.
- Checkpoint chưa pass thì không được đi tiếp.
- Sai checkpoint thì phải quay về `reviewSlideId`.

## 12. Acceptance criteria tổng thể

MVP đạt yêu cầu khi Reviewer chạy được kịch bản:

1. Mở app tại `http://localhost:5173`.
2. Backend chạy tại `http://localhost:3000`.
3. UI có layout hai cột: trái authoring chat, phải preview.
4. Preview load lesson từ `/api/lesson`.
5. Slide hiển thị ảnh/GIF/video và audio hoạt động.
6. Tab JSON hiển thị lesson hiện tại.
7. Prompt authoring có thể cập nhật lesson sau validate + backup.
8. Checkpoint khóa Next khi chưa pass.
9. Câu trả lời đúng unlock Next.
10. Câu trả lời sai chuyển về review slide và cho quay lại checkpoint.
11. Classroom chat trả lời theo context bài học.
12. Voice input có flow hoạt động trên browser hỗ trợ, có fallback nếu không hỗ trợ.
13. API key không xuất hiện trong frontend.
14. README có lệnh chạy backend/frontend rõ ràng.

