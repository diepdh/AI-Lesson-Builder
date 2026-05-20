# SPEC.md

## 1. Mục đích tài liệu

Tài liệu này là đặc tả triển khai chi tiết cho coder. Coder cần bám sát `goal.md`, `plan.md` và `spec.md` để xây dựng MVP.

MVP cần tạo được một phần mềm chạy trên `localhost` với giao diện:

```text
┌─────────────────────────────┬──────────────────────────────────────┐
│ AI Chat Workspace           │ WebApp Preview Workspace              │
│                             │                                      │
│ Người dùng chat/thoại với AI │ Preview bài giảng e-learning          │
│ để yêu cầu tạo/sửa bài học  │ chạy trực tiếp                         │
└─────────────────────────────┴──────────────────────────────────────┘
```

---

## 2. Định nghĩa sản phẩm MVP

### 2.1 Sản phẩm chính

Phần mềm là một **AI-assisted eLearning WebApp Builder**, cho phép giáo viên/người vận hành:

- chat với AI để tạo/chỉnh sửa bài giảng;
- preview trực tiếp bài giảng webapp;
- chạy bài giảng theo slide;
- dùng AI làm trợ giảng trong bài học;
- dùng AI để đánh giá câu trả lời chung của cả lớp.

### 2.2 Mô hình lớp học trong MVP

Giai đoạn đầu chỉ hỗ trợ:

- 1 giáo viên;
- 1 bài giảng;
- 1 lớp học;
- cả lớp cùng xem 1 slide tại một thời điểm;
- giáo viên điều khiển chuyển slide;
- học sinh cùng thảo luận và thống nhất 1 câu trả lời chung;
- giáo viên hoặc đại diện lớp gửi câu trả lời chung cho AI;
- AI đánh giá và quyết định cho học tiếp hoặc quay lại slide kiến thức.

### 2.3 Không làm trong MVP

Không triển khai các phần sau trong MVP:

- đăng nhập học sinh;
- phân quyền học sinh;
- nhiều lớp học đồng thời;
- realtime sync nhiều thiết bị;
- lưu tiến độ từng học sinh;
- điểm số cá nhân;
- LMS/SCORM/xAPI;
- export webapp độc lập dạng ZIP/package;
- UI upload file phức tạp.

---

## 3. Kiến trúc tổng thể

```text
User Browser
  │
  ├── Frontend App Shell
  │     ├── Left AI Chat Panel
  │     └── Right Lesson Preview Panel
  │
  └── calls localhost API
        │
        ▼
Backend Localhost API
  ├── Lesson Service
  ├── Authoring AI Service
  ├── Classroom Chat Service
  ├── Voice Service
  ├── Question Service
  ├── Answer Evaluation Service
  ├── Lesson Validation + Backup
  └── LLM Provider Adapter
        │
        ▼
External or Local LLM Provider
```

---

## 4. Công nghệ bắt buộc

### 4.1 Frontend

| Thành phần | Lựa chọn |
|---|---|
| Framework | React 18 + Vite |
| Language | JavaScript / JSX |
| Styling | CSS Modules hoặc Tailwind CSS |
| State | React useState / useReducer / Context |
| HTTP client | fetch hoặc axios |
| Speech-to-text | Web Speech API |
| Text-to-speech | SpeechSynthesis API |

### 4.2 Backend

| Thành phần | Lựa chọn |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express 4 |
| Config | dotenv |
| CORS | cors middleware |
| HTTP client | axios hoặc fetch |
| Storage | JSON file cho MVP |

### 4.3 LLM Provider

Backend phải hỗ trợ cấu hình linh hoạt qua `.env`.

Provider ưu tiên:

- OpenAI;
- Google Gemini;
- Anthropic Claude.

Frontend không được biết hoặc gọi trực tiếp provider.

---

## 5. Cấu trúc thư mục bắt buộc

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
  README.md
```

---

## 6. Layout UI chi tiết

## 6.1 App Shell

### Yêu cầu giao diện

- toàn màn hình hoặc gần toàn màn hình;
- có top bar đơn giản;
- bên trái là AI Chat Workspace;
- bên phải là Preview Workspace;
- responsive tối thiểu cho màn hình laptop.

### Kích thước gợi ý

```css
.app-shell {
  display: grid;
  grid-template-columns: 360px 1fr;
  height: 100vh;
}
```

---

## 6.2 Left AI Chat Workspace

### Chức năng

Cột trái dùng để người dùng ra lệnh cho AI nhằm tạo/chỉnh bài học.

### Thành phần UI

```text
LeftChatPanel
  ├── Header
  │    ├── Logo/Title: "AI Lesson Builder"
  │    └── trạng thái backend/model
  ├── MessageList
  │    ├── UserMessage
  │    ├── AssistantMessage
  │    └── SystemStatusMessage
  ├── QuickActions
  │    ├── "Thêm checkpoint"
  │    ├── "Sửa lời thoại"
  │    ├── "Tạo câu hỏi"
  │    └── "Cải thiện giao diện"
  └── PromptInput
       ├── textarea
       ├── send button
       └── voice input button
```

### State cần quản lý

```js
const authoringChatState = {
  messages: [],
  input: "",
  isLoading: false,
  error: null,
  lastChangeSummary: null
};
```

### Hành vi khi gửi prompt

1. User nhập prompt.
2. Frontend append user message.
3. Frontend gọi `POST /api/ai/authoring`.
4. Backend xử lý prompt.
5. Backend trả về assistant message, patch hoặc updatedLesson, change summary.
6. Backend validate và backup trước khi ghi.
7. Frontend cập nhật chat.
8. Frontend refresh preview bằng dữ liệu lesson mới.

---

## 6.3 Right Preview Workspace

### Thành phần UI

```text
RightPreviewPanel
  ├── PreviewToolbar
  │    ├── tab Preview
  │    ├── tab JSON
  │    ├── tab Code placeholder
  │    └── reload preview button
  └── PreviewBody
       └── LessonPreview App
```

### Tab MVP

- `Preview`: bắt buộc.
- `JSON`: bắt buộc để debug lesson hiện tại.
- `Code`: placeholder, chưa cần sinh code thật.

---

## 7. Lesson Preview App

## 7.1 Layout bài học

```text
LessonPlayer
  ├── LessonHeader
  │    ├── title
  │    ├── module badge
  │    └── progress bar
  ├── SlideViewer
  │    ├── image/GIF/video
  │    └── loading/error fallback
  ├── ControlBar
  │    ├── prev
  │    ├── play/replay audio
  │    ├── next
  │    └── slide counter
  ├── CheckpointBox
  ├── ClassroomChat
  └── CompletionOverlay
```

## 7.2 Slide Viewer

### Render rule

- nếu `video` có giá trị: render video player hoặc iframe;
- nếu không có video: render image/GIF;
- nếu image lỗi: hiện fallback “Không tải được slide”.

## 7.3 Audio Player

### Hành vi

- nếu slide có audio: phát audio file;
- nếu không có audio và TTS fallback bật: dùng speech synthesis;
- khi chuyển slide: dừng audio cũ;
- có nút nghe lại.

## 7.4 Điều hướng slide

### Rule

- giáo viên có thể bấm Previous/Next;
- nếu slide có checkpoint chưa qua, nút Next bị khóa;
- nếu checkpoint đúng, mở khóa Next;
- nếu sai, chuyển tới `reviewSlideId`.

### State

```js
const lessonRuntimeState = {
  currentSlideIndex: 0,
  currentSlideId: null,
  checkpointLocked: false,
  currentCheckpointId: null,
  checkpointPassed: {},
  reviewMode: false,
  reviewReturnSlideId: null,
  classAnswerDraft: "",
  chatHistory: []
};
```

---

## 8. Checkpoint specification

## 8.1 Mục tiêu

Checkpoint dùng để kiểm tra hiểu bài ở cấp độ cả lớp.

Không thu câu trả lời cá nhân. Chỉ thu một câu trả lời chung.

## 8.2 UI checkpoint

```text
CheckpointBox
  ├── title: "Cả lớp cùng trả lời"
  ├── question text
  ├── options nếu có
  ├── input text cho câu trả lời chung
  ├── voice input button
  ├── submit button: "Gửi câu trả lời của lớp"
  ├── AI feedback area
  └── continue/review action button
```

## 8.3 Submit answer flow

```text
User selects/types/speaks class answer
→ click Submit
→ POST /api/answer/evaluate
→ backend LLM evaluates
→ frontend displays feedback
→ if nextAction = continue: unlock Next
→ if nextAction = review: go to reviewSlideId
```

## 8.4 Review flow khi sai

```text
Sai tại checkpoint slide X
→ backend trả reviewSlideId = slide Y
→ frontend lưu reviewReturnSlideId = slide X
→ chuyển về slide Y
→ phát lại audio/script của slide Y
→ hiển thị nút "Quay lại câu hỏi"
→ quay lại slide X
→ hỏi lại câu cũ hoặc gọi regenerate question
```

---

## 9. Classroom Chat / Voice specification

## 9.1 Chat trong bài học

Chat này khác với chat authoring bên trái.

- Chat bên trái: người dùng ra lệnh để tạo/sửa bài học.
- Chat trong preview: cả lớp hỏi trợ giảng AI về nội dung bài học.

## 9.2 Request context

```json
{
  "lessonId": "...",
  "currentSlideId": "...",
  "message": "...",
  "chatHistory": [],
  "mode": "classroom_shared"
}
```

## 9.3 Voice flow

```text
click mic
→ browser speech-to-text
→ show transcript
→ send transcript to /api/voice/chat or /api/chat
→ receive reply
→ show reply
→ speech synthesis reads reply if enabled
```

Nếu browser không hỗ trợ speech recognition, hiện fallback message.

---

## 10. Lesson data schema

## 10.1 Root schema

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

## 10.2 Slide schema

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

## 10.3 Checkpoint schema

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

---

## 11. Backend API contract

## 11.1 GET /api/health

```json
{
  "ok": true,
  "service": "ai-lesson-builder",
  "llmConfigured": true
}
```

## 11.2 GET /api/lesson

```json
{
  "ok": true,
  "lesson": {}
}
```

## 11.3 PUT /api/lesson

Cập nhật lesson hiện tại sau khi validate và backup.

Request:

```json
{
  "lesson": {}
}
```

Response:

```json
{
  "ok": true,
  "lesson": {},
  "message": "Lesson updated",
  "backupPath": "data/backups/lesson-xxxx.json"
}
```

Nếu validate fail:

```json
{
  "ok": false,
  "error": "Invalid lesson schema",
  "details": []
}
```

## 11.4 POST /api/lesson/restore-last

Khôi phục backup gần nhất.

Response:

```json
{
  "ok": true,
  "lesson": {},
  "message": "Restored latest backup"
}
```

## 11.5 POST /api/ai/authoring

Dùng cho chat bên trái.

Request:

```json
{
  "message": "Thêm checkpoint cho slide 4",
  "currentSlideId": "slide-04"
}
```

Response:

```json
{
  "ok": true,
  "assistantMessage": "Đã thêm checkpoint cho slide 4.",
  "changeSummary": "Added checkpoint cp-04",
  "patch": [],
  "updatedLesson": {},
  "backupPath": "data/backups/lesson-xxxx.json"
}
```

## 11.6 POST /api/answer/evaluate

Dùng để đánh giá câu trả lời chung của lớp.

Request:

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "slideId": "slide-04",
  "checkpointId": "cp-04",
  "question": "Robot hút bụi tự chạy và tự tránh đồ vật. Đó có phải là AI không?",
  "correctAnswer": "Có",
  "classAnswer": "Có ạ",
  "answerMode": "text",
  "knowledgePoint": "AI có thể tự nhận biết và tự quyết định đơn giản"
}
```

Response đúng:

```json
{
  "ok": true,
  "isCorrect": true,
  "feedback": "Đúng rồi! Robot hút bụi có AI vì nó biết tự tránh đồ vật.",
  "shouldReview": false,
  "reviewSlideId": null,
  "nextAction": "continue"
}
```

Response sai:

```json
{
  "ok": true,
  "isCorrect": false,
  "feedback": "Chưa đúng rồi. Mình cùng xem lại slide về robot hút bụi nhé.",
  "shouldReview": true,
  "reviewSlideId": "slide-03",
  "nextAction": "review"
}
```

## 11.7 POST /api/chat

Dùng cho chat trợ giảng trong bài học.

Request:

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "currentSlideId": "slide-09",
  "message": "AI có biết buồn không?",
  "chatHistory": [],
  "mode": "classroom_shared"
}
```

Response:

```json
{
  "ok": true,
  "reply": "AI không biết buồn như con người đâu. AI chỉ xử lý thông tin như máy tính thôi.",
  "scope": "in_lesson",
  "speak": true
}
```

## 11.8 POST /api/voice/chat

Dùng cho voice trong bài học.

Request:

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "currentSlideId": "slide-09",
  "transcript": "AI có phải là người không?",
  "mode": "classroom_shared"
}
```

Response:

```json
{
  "ok": true,
  "reply": "AI không phải là người. AI là máy thông minh do con người tạo ra.",
  "speak": true
}
```

## 11.9 POST /api/question/generate

Sinh checkpoint mới.

Request:

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "slideId": "slide-04",
  "questionType": "multiple_choice"
}
```

Response:

```json
{
  "ok": true,
  "checkpoint": {
    "id": "cp-04-generated",
    "type": "multiple_choice",
    "question": "Robot hút bụi biết tự tránh đồ vật. Đó có phải là AI không?",
    "options": ["Có", "Không"],
    "correctAnswer": "Có",
    "explanation": "Đúng rồi, đó là AI.",
    "wrongFeedback": "Chưa đúng rồi, hãy xem lại slide robot hút bụi nhé.",
    "reviewSlideId": "slide-03"
  }
}
```

---

## 12. Cấu hình môi trường `.env`

## 12.1 File `.env.example`

```env
PORT=3000

LLM_PROVIDER=openai
LLM_API_KEY=your_api_key_here
LLM_MODEL=gpt-4o-mini
LLM_BASE_URL=https://api.openai.com/v1
LLM_TIMEOUT=30000

LOG_LEVEL=info
```

## 12.2 Quy tắc

- `.env` không được commit.
- Frontend không được đọc `.env` backend.
- API key không được gửi về frontend.

---

## 13. `llm.service.js` interface bắt buộc

```js
async function callLLM({
  systemPrompt,
  userPrompt,
  temperature = 0.7,
  maxTokens = 1500
}) {}

async function callLLMForJSON({
  systemPrompt,
  userPrompt,
  temperature = 0.2,
  maxTokens = 2000
}) {}
```

### Provider adapter

```js
const providers = {
  openai: callOpenAI,
  gemini: callGemini,
  anthropic: callAnthropic
};

async function callLLM(params) {
  const provider = process.env.LLM_PROVIDER || 'openai';
  const fn = providers[provider];
  if (!fn) throw new Error(`Unknown LLM provider: ${provider}`);
  return fn(params);
}
```

### Error handling bắt buộc

- network timeout;
- invalid API key;
- rate limit;
- server error;
- empty response;
- invalid JSON response.

---

## 14. Lesson validation & backup

## 14.1 validate-lesson.js

Backend phải validate tối thiểu:

- root có `lessonId`, `title`, `slides`;
- `slides` là array không rỗng;
- mỗi slide có `id`, `order`, `title`, `image`, `script`, `knowledgePoint`;
- nếu có checkpoint thì phải có `id`, `type`, `question`, `correctAnswer`, `reviewSlideId`;
- `reviewSlideId` phải trỏ tới slide tồn tại;
- slide id không được trùng.

## 14.2 backup-lesson.js

Trước mỗi lần ghi `lesson.json`, backend phải copy file hiện tại vào:

```text
backend/data/backups/lesson-YYYYMMDD-HHmmss.json
```

## 14.3 Restore

API `POST /api/lesson/restore-last` khôi phục backup mới nhất.

---

## 15. Prompt design

## 15.1 Authoring AI prompt

```text
Bạn là trợ lý AI chuyên giúp giáo viên tạo bài giảng e-learning.
Bạn đang làm việc trong phần mềm có chat bên trái và preview bài học bên phải.
Nhiệm vụ của bạn là hiểu yêu cầu người dùng và cập nhật lesson JSON.

Quy tắc:
- Không phá cấu trúc lesson JSON.
- Không xóa slide hoặc dữ liệu cũ nếu người dùng không yêu cầu.
- Nếu thêm checkpoint, phải có question, type, options nếu cần, correctAnswer, explanation, wrongFeedback, reviewSlideId.
- reviewSlideId phải trỏ tới một slide đã tồn tại.
- Nội dung phải phù hợp với targetLearner.
- Trả về JSON có assistantMessage, changeSummary, patch, updatedLesson.
```

## 15.2 Classroom Chat prompt

```text
Bạn là cô giáo AI thân thiện đang hỗ trợ cả lớp học.
Hãy trả lời ngắn gọn, dễ hiểu, phù hợp học sinh nhỏ tuổi.
Chỉ trả lời trong phạm vi bài học hiện tại.
Nếu câu hỏi ngoài phạm vi bài học, hãy nhẹ nhàng kéo cả lớp quay lại bài học.

Ngữ cảnh:
- Bài học: {{lessonTitle}}
- Đối tượng: {{targetLearner}}
- Slide hiện tại: {{currentSlideTitle}}
- Kiến thức slide: {{knowledgePoint}}
```

## 15.3 Answer Evaluation prompt

```text
Bạn là hệ thống đánh giá câu trả lời chung của một lớp học.
Hãy đánh giá mềm theo ý nghĩa, không yêu cầu đúng từng chữ.

Thông tin:
- Câu hỏi: {{question}}
- Đáp án đúng: {{correctAnswer}}
- Câu trả lời của lớp: {{classAnswer}}
- Kiến thức slide: {{knowledgePoint}}

Chỉ trả JSON hợp lệ:
{
  "isCorrect": true hoặc false,
  "feedback": "phản hồi ngắn gọn, thân thiện cho cả lớp",
  "shouldReview": true hoặc false,
  "reviewSlideId": "id slide hoặc null",
  "nextAction": "continue" hoặc "review"
}
```

---

## 16. Error handling

## 16.1 Frontend error cases

Cần xử lý tối thiểu:

- backend không chạy;
- LLM lỗi;
- lesson JSON sai;
- không tải được slide;
- không tải được audio;
- browser không hỗ trợ speech recognition;
- AI trả JSON không hợp lệ.

## 16.2 UI message gợi ý

- Backend lỗi: “Không kết nối được backend localhost. Vui lòng kiểm tra server.”
- LLM lỗi: “AI đang gặp lỗi, vui lòng thử lại.”
- Speech lỗi: “Trình duyệt chưa hỗ trợ nhận diện giọng nói. Hãy dùng Chrome hoặc nhập bằng bàn phím.”
- Slide lỗi: “Không tải được slide này.”
- Lesson lỗi: “Dữ liệu bài học không hợp lệ, hệ thống chưa ghi thay đổi.”

---

## 17. State flow quan trọng

## 17.1 Authoring flow

```text
User prompt ở left chat
→ POST /api/ai/authoring
→ backend gọi LLM
→ backend nhận updatedLesson/patch
→ validate lesson
→ backup lesson hiện tại
→ ghi lesson mới
→ response updatedLesson
→ frontend set lesson state
→ right preview re-render
```

## 17.2 Lesson checkpoint flow

```text
Slide có checkpoint
→ khóa Next
→ lớp thảo luận
→ nhập/gửi câu trả lời chung
→ POST /api/answer/evaluate
→ nếu đúng: unlock Next
→ nếu sai: go reviewSlideId
```

## 17.3 Review flow

```text
current checkpoint slide = X
reviewSlideId = Y
→ save reviewReturnSlideId = X
→ go slide Y
→ play explanation/audio
→ show button "Quay lại câu hỏi"
→ go slide X
→ retry checkpoint
```

## 17.4 Classroom chat flow

```text
User asks in lesson chat
→ POST /api/chat
→ backend builds lesson-aware prompt
→ LLM reply
→ render reply
→ optional TTS
```

---

## 18. Test scenarios cho coder

## 18.1 Test 1: Mở app

1. Chạy backend.
2. Chạy frontend.
3. Mở browser.
4. Thấy layout trái chat – phải preview.

Expected: không lỗi console nghiêm trọng.

## 18.2 Test 2: Load lesson

1. App gọi `/api/lesson`.
2. Preview hiển thị slide đầu tiên.
3. Có title, progress, nút next/prev.

Expected: dữ liệu đến từ JSON/API, không hard-code trong component.

## 18.3 Test 3: Authoring AI

1. Nhập: “Thêm checkpoint cho slide 4.”
2. Backend gọi LLM.
3. Backend validate lesson.
4. Backend backup lesson cũ.
5. Lesson được cập nhật.
6. Preview slide 4 có checkpoint.

Expected: cột trái có message xác nhận, cột phải cập nhật.

## 18.4 Test 4: AI trả lesson lỗi

1. Giả lập LLM trả JSON thiếu `slides`.
2. Backend validate fail.

Expected: lesson cũ không bị ghi đè, frontend thấy lỗi rõ ràng.

## 18.5 Test 5: Checkpoint đúng

1. Tới slide có checkpoint.
2. Nhập câu trả lời đúng.
3. Gửi.

Expected: AI phản hồi đúng, mở khóa Next.

## 18.6 Test 6: Checkpoint sai

1. Tới slide có checkpoint.
2. Nhập câu trả lời sai.
3. Gửi.

Expected: AI phản hồi sai, chuyển về `reviewSlideId`.

## 18.7 Test 7: Review rồi quay lại checkpoint

1. Sau khi sai, hệ thống đang ở slide review.
2. Bấm “Quay lại câu hỏi”.
3. Trả lời lại đúng.

Expected: quay lại checkpoint và cho tiếp tục.

## 18.8 Test 8: Classroom chat

1. Mở chat trong preview.
2. Hỏi: “AI có biết buồn không?”

Expected: AI trả lời trong phạm vi bài học, ngắn gọn.

## 18.9 Test 9: Voice

1. Bấm micro.
2. Nói câu hỏi.
3. Transcript hiển thị.
4. AI trả lời.

Expected: nếu browser hỗ trợ, flow chạy. Nếu không, có fallback message.

---

## 19. README run command

README cần có lệnh chạy rõ ràng.

```bash
# backend
cd backend
npm install
cp .env.example .env
npm run dev

# frontend
cd frontend
npm install
npm run dev
```

Mở:

```text
http://localhost:5173
```

Backend mặc định:

```text
http://localhost:3000
```

---

## 20. Acceptance criteria tổng thể

MVP chỉ được xem là hoàn thành khi đạt toàn bộ tiêu chí sau:

### 20.1 UI shell

- Có layout 2 cột.
- Cột trái là chat với AI.
- Cột phải là preview webapp.
- Có tab Preview.
- Có tab JSON.
- Preview cập nhật khi lesson thay đổi.

### 20.2 Authoring

- Gửi được prompt từ cột trái.
- Backend nhận prompt và gọi LLM.
- AI có thể cập nhật lesson JSON.
- Backend validate trước khi ghi.
- Backend backup trước khi ghi.
- Nếu AI trả JSON lỗi, lesson cũ không bị mất.
- Cột phải preview lại lesson mới.

### 20.3 Lesson player

- Load được lesson từ backend.
- Hiển thị slide.
- Phát audio.
- Chuyển slide được.
- Hiển thị progress.

### 20.4 Checkpoint

- Slide có checkpoint thì hiển thị câu hỏi.
- Next bị khóa khi chưa trả lời đúng.
- Gửi được câu trả lời chung của lớp.
- Backend đánh giá bằng LLM.
- Đúng thì cho tiếp tục.
- Sai thì quay lại slide kiến thức.

### 20.5 Chat/Voice trong bài học

- Có chat trợ giảng trong preview.
- Có thể hỏi AI theo slide hiện tại.
- Có thể dùng voice input nếu trình duyệt hỗ trợ.
- AI trả lời đúng phạm vi bài học.

### 20.6 Bảo mật tối thiểu

- API key không xuất hiện trong frontend.
- `.env` không được commit.
- Có `.env.example`.
- Không lưu API key trong localStorage.

---

## 21. Definition of Done

MVP hoàn thành khi người review có thể chạy được toàn bộ kịch bản:

```text
Mở app localhost
→ thấy UI trái chat, phải preview
→ yêu cầu AI thêm/sửa nội dung bài học
→ backend validate và backup
→ preview cập nhật
→ chạy bài học
→ giáo viên chuyển slide
→ tới checkpoint
→ cả lớp nhập một câu trả lời chung
→ AI đánh giá
→ đúng thì đi tiếp
→ sai thì quay lại slide kiến thức
→ hỏi trợ giảng AI bằng chat
→ hỏi trợ giảng AI bằng voice nếu browser hỗ trợ
```

Nếu thiếu một trong các phần chính trên, MVP chưa đạt yêu cầu.
