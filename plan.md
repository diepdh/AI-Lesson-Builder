# PLAN.md

## 1. Mục tiêu triển khai

Xây dựng MVP cho hệ thống **AI Lesson-to-Elearning WebApp Generator**, cho phép chạy một bài giảng e-learning tương tác trên localhost.

MVP cần chứng minh được luồng học chính:

```text
Slide bài học
→ phát lời giảng
→ học sinh học nội dung
→ checkpoint kiểm tra hiểu bài
→ học sinh trả lời bằng chọn đáp án / text / giọng nói
→ LLM đánh giá câu trả lời
→ đúng thì học tiếp
→ sai thì quay lại slide kiến thức liên quan
→ học sinh có thể chat hoặc nói chuyện với LLM bất kỳ lúc nào trong bài
```

## 2. Nguyên tắc triển khai

1. Không hard-code toàn bộ dữ liệu bài học trong `index.html`.
2. Dữ liệu bài học cần được tách ra thành file cấu hình, ví dụ `lesson.json`.
3. Frontend chỉ hiển thị và điều khiển trải nghiệm học.
4. Backend localhost chịu trách nhiệm gọi LLM.
5. API key không được để trong frontend.
6. Mỗi slide cần có ID ổn định để checkpoint có thể điều hướng quay lại đúng slide.
7. Chức năng chat và thoại với LLM là thành phần bắt buộc của bài học.
8. Luồng sai → học lại → kiểm tra lại cần rõ ràng, không chỉ hiển thị đáp án rồi cho qua.

## 3. Kiến trúc đề xuất cho MVP

```text
project-root/
  backend/
    server.js
    services/
      llm.service.js
      lesson.service.js
      question.service.js
      answer.service.js
    routes/
      lesson.routes.js
      question.routes.js
      answer.routes.js
      chat.routes.js
      voice.routes.js
    data/
      lesson.json
    .env

  frontend/
    index.html
    src/
      main.js
      api.js
      lesson-player.js
      checkpoint.js
      chat-panel.js
      voice-assistant.js
      audio-player.js
      state.js
    assets/
      slides/
      audio/
      video/

  goal.md
  plan.md
  README.md
```

Có thể triển khai bằng JavaScript thuần trước để nhanh, hoặc dùng React/Vite nếu muốn dễ mở rộng.

## 4. Công nghệ gợi ý

### 4.1 Frontend

- HTML/CSS/JavaScript hoặc React.
- Web Speech API cho speech-to-text giai đoạn đầu.
- SpeechSynthesis API cho text-to-speech giai đoạn đầu.
- Fetch API để gọi backend localhost.

### 4.2 Backend

- Node.js + Express.
- `.env` để lưu API key.
- LLM provider có thể là Gemini/OpenAI/Claude/local model, nhưng cần được đóng gói qua một service chung.

### 4.3 Localhost

- Frontend: `http://localhost:5173` nếu dùng Vite, hoặc `http://localhost:3000` nếu serve cùng backend.
- Backend API: `http://localhost:3000/api/...`.

## 5. Cấu trúc lesson.json đề xuất

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "title": "AI là gì?",
  "description": "Bài học giới thiệu về trí tuệ nhân tạo cho học sinh lớp 1",
  "targetLearner": "Học sinh lớp 1",
  "learningObjectives": [
    "Hiểu AI là máy thông minh do con người tạo ra",
    "Biết một số ví dụ về AI và không phải AI",
    "Biết AI không có cảm xúc như con người",
    "Biết quy tắc an toàn khi dùng công nghệ"
  ],
  "assistantPersona": {
    "role": "Cô giáo AI thân thiện",
    "tone": "vui vẻ, ngắn gọn, dễ hiểu",
    "rules": [
      "Chỉ trả lời trong phạm vi bài học",
      "Giải thích phù hợp với học sinh lớp 1",
      "Không trả lời lan man ngoài chủ đề",
      "Nếu câu hỏi ngoài phạm vi, nhẹ nhàng kéo học sinh quay lại bài học"
    ]
  },
  "slides": [
    {
      "id": "slide-01",
      "order": 1,
      "module": "Giới thiệu",
      "title": "Chào mừng",
      "image": "/assets/slides/slide-01.jpg",
      "audio": "/assets/audio/s01.mp3",
      "video": null,
      "script": "Chào mừng các em đến với bài học hôm nay...",
      "knowledgePoint": "Giới thiệu chủ đề bài học về AI",
      "checkpoint": null
    },
    {
      "id": "slide-04",
      "order": 4,
      "module": "Gắn kết",
      "title": "Robot hút bụi có phải AI không?",
      "image": "/assets/slides/slide-04.jpg",
      "audio": "/assets/audio/s04.mp3",
      "video": null,
      "script": "Robot hút bụi có thể tự chạy và tránh đồ vật...",
      "knowledgePoint": "AI có thể tự học, tự nhận biết và tự đưa ra quyết định đơn giản",
      "checkpoint": {
        "id": "cp-04",
        "type": "multiple_choice",
        "mode": "manual_or_ai_generated",
        "question": "Robot hút bụi tự chạy và tự tránh đồ vật. Đó có phải là AI không?",
        "options": [
          "Có, đó là AI",
          "Không, chỉ là máy thường",
          "Em chưa biết"
        ],
        "correctAnswer": "Có, đó là AI",
        "explanation": "Đúng rồi. Robot hút bụi có AI vì nó biết tự tránh đồ vật.",
        "reviewSlideId": "slide-03",
        "retryPolicy": {
          "askSimilarQuestion": true,
          "maxAttemptsBeforeHint": 1
        }
      }
    }
  ]
}
```

## 6. Các module cần code

## 6.1 Backend module: Lesson Service

### Nhiệm vụ

- Đọc dữ liệu từ `lesson.json`.
- Trả metadata bài học cho frontend.
- Trả danh sách slide.
- Tìm slide theo `slideId`.
- Tìm checkpoint theo `checkpointId`.

### API

```http
GET /api/lesson
```

Trả toàn bộ dữ liệu bài học.

```http
GET /api/lesson/slides/:slideId
```

Trả dữ liệu một slide.

## 6.2 Backend module: LLM Service

### Nhiệm vụ

Tạo một lớp trung gian để gọi LLM, tránh frontend gọi trực tiếp provider.

### Hàm cần có

```js
async function callLLM({ systemPrompt, userPrompt, temperature, maxTokens })
```

### Yêu cầu

- Đọc API key từ `.env`.
- Có error handling.
- Có timeout.
- Có format response thống nhất.
- Có thể đổi provider sau này mà không ảnh hưởng frontend.

## 6.3 Backend module: Question Service

### Nhiệm vụ

Sinh câu hỏi tương tác từ nội dung slide nếu checkpoint chưa có sẵn hoặc cần câu hỏi tương tự.

### API

```http
POST /api/question/generate
```

Request:

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "slideId": "slide-04",
  "questionType": "multiple_choice",
  "learnerLevel": "grade_1"
}
```

Response:

```json
{
  "question": "Robot hút bụi biết tự tránh đồ vật. Đó có phải là AI không?",
  "type": "multiple_choice",
  "options": ["Có", "Không"],
  "correctAnswer": "Có",
  "explanation": "Đúng rồi. Nó có thể tự nhận biết và tránh đồ vật.",
  "reviewSlideId": "slide-03"
}
```

```http
POST /api/question/regenerate
```

Dùng khi học sinh vừa học lại và cần câu hỏi tương tự.

## 6.4 Backend module: Answer Service

### Nhiệm vụ

Đánh giá câu trả lời của học sinh bằng LLM.

### API

```http
POST /api/answer/evaluate
```

Request:

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "slideId": "slide-04",
  "checkpointId": "cp-04",
  "question": "Robot hút bụi tự chạy và tự tránh đồ vật. Đó có phải là AI không?",
  "correctAnswer": "Có, đó là AI",
  "studentAnswer": "Có ạ",
  "answerMode": "voice"
}
```

Response khi đúng:

```json
{
  "isCorrect": true,
  "score": 1,
  "feedback": "Đúng rồi! Robot hút bụi có AI vì nó biết tự tránh đồ vật.",
  "shouldReview": false,
  "reviewSlideId": null,
  "nextAction": "continue"
}
```

Response khi sai:

```json
{
  "isCorrect": false,
  "score": 0,
  "feedback": "Chưa đúng rồi. Mình cùng xem lại slide về robot hút bụi nhé.",
  "shouldReview": true,
  "reviewSlideId": "slide-03",
  "nextAction": "review"
}
```

### Quy tắc đánh giá

- Chấp nhận các câu trả lời đúng về nghĩa, không cần đúng từng chữ.
- Với học sinh nhỏ, ưu tiên đánh giá mềm.
- Nếu câu trả lời mơ hồ, có thể hỏi lại hoặc xem là gần đúng.
- Response trả về frontend phải là JSON hợp lệ.

## 6.5 Backend module: Chat Service

### Nhiệm vụ

Cho phép học sinh chat với LLM trong phạm vi bài học.

### API

```http
POST /api/chat
```

Request:

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "currentSlideId": "slide-09",
  "message": "Cô ơi AI có biết buồn không?",
  "chatHistory": [
    {
      "role": "student",
      "content": "AI là gì?"
    },
    {
      "role": "assistant",
      "content": "AI là máy thông minh do con người tạo ra."
    }
  ]
}
```

Response:

```json
{
  "reply": "AI không biết buồn như con người đâu em. AI chỉ xử lý thông tin như máy tính thôi.",
  "safe": true,
  "scope": "in_lesson"
}
```

### Prompt yêu cầu

System prompt cần gồm:

- Vai trò: cô/thầy giáo AI.
- Đối tượng: học sinh theo metadata bài học.
- Phong cách: ngắn gọn, thân thiện, dễ hiểu.
- Phạm vi: chỉ trả lời trong nội dung bài học.
- Nếu ngoài phạm vi: trả lời nhẹ nhàng và kéo về bài học.

## 6.6 Backend module: Voice Service

### Nhiệm vụ

Giai đoạn đầu, voice service có thể dùng chung logic với chat service.

Frontend sẽ chuyển giọng nói thành văn bản trước, sau đó gửi text lên backend.

### API

```http
POST /api/voice/chat
```

Request:

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "currentSlideId": "slide-09",
  "transcript": "Cô ơi AI có phải là người không?"
}
```

Response:

```json
{
  "reply": "AI không phải là người đâu em. AI là máy thông minh do con người tạo ra.",
  "speak": true
}
```

## 7. Frontend module cần code

## 7.1 Lesson Player

### Nhiệm vụ

- Fetch `/api/lesson` khi app khởi động.
- Render slide hiện tại.
- Render hình/GIF/video.
- Phát audio theo slide.
- Hiển thị module, tiến độ, số slide.
- Cho phép giáo viên/học sinh chuyển slide nếu không bị checkpoint khóa.

### State cần có

```js
const state = {
  lesson: null,
  currentSlideIndex: 0,
  currentSlideId: null,
  isAudioPlaying: false,
  isCheckpointActive: false,
  checkpointPassed: {},
  reviewReturnSlideId: null,
  chatHistory: []
};
```

## 7.2 Audio Player

### Nhiệm vụ

- Phát audio file nếu slide có audio.
- Nếu không có audio và cấu hình cho phép, dùng TTS fallback.
- Có nút nghe lại.
- Khi chuyển slide phải dừng audio cũ.

## 7.3 Checkpoint Component

### Nhiệm vụ

- Hiển thị câu hỏi của slide.
- Nếu slide chưa có checkpoint, có thể gọi `/api/question/generate`.
- Cho phép trả lời bằng:
  - Chọn đáp án.
  - Gõ text.
  - Nói câu trả lời.
- Gửi câu trả lời tới `/api/answer/evaluate`.
- Nhận kết quả đúng/sai.
- Nếu đúng: mở khóa slide tiếp theo.
- Nếu sai: gọi luồng review.

### Luồng review khi sai

```text
checkpoint sai
→ nhận reviewSlideId từ backend
→ lưu returnSlideId = slide chứa checkpoint
→ chuyển về reviewSlideId
→ phát lại audio/giải thích của slide kiến thức
→ sau khi học lại, quay lại returnSlideId
→ hỏi lại câu cũ hoặc gọi /api/question/regenerate
```

## 7.4 Chat Panel

### Nhiệm vụ

- Nút mở/đóng chat.
- Input text.
- Nút gửi.
- Hiển thị lịch sử chat.
- Gửi message tới `/api/chat`.
- Nhận reply và render.
- Có thể đọc câu trả lời bằng TTS.

### Yêu cầu UX

- Chat panel không che mất nội dung chính quá nhiều.
- Có trạng thái đang suy nghĩ.
- Có xử lý lỗi API.
- Câu trả lời nên ngắn gọn.

## 7.5 Voice Assistant

### Nhiệm vụ

- Nút micro cho học sinh nói.
- Dùng Web Speech API để nhận diện tiếng Việt.
- Hiển thị transcript.
- Gửi transcript tới `/api/voice/chat` hoặc `/api/chat`.
- Nhận reply từ LLM.
- Hiển thị reply trong chat.
- Dùng TTS đọc reply nếu bật.

### Trạng thái UI

- Idle: “Nhấn để nói”.
- Listening: “Đang nghe...”.
- Processing: “Đang suy nghĩ...”.
- Speaking: “AI đang trả lời...”.
- Error: “Không nghe rõ, em thử nói lại nhé.”

## 8. Các bước triển khai theo giai đoạn

## Phase 1: Refactor từ prototype sang cấu trúc dữ liệu

### Mục tiêu

Tách dữ liệu bài học khỏi file HTML/JS.

### Việc cần làm

1. Tạo `lesson.json` từ dữ liệu hard-code hiện có.
2. Mỗi slide có `id`, `order`, `image`, `audio`, `script`, `knowledgePoint`, `checkpoint`.
3. Frontend fetch lesson từ backend hoặc đọc file JSON local.
4. Render slide dựa trên dữ liệu JSON.
5. Đảm bảo bài học hiện tại vẫn chạy được.

### Kết quả mong muốn

- Thay bài học bằng cách đổi `lesson.json`, không cần sửa logic app.

## Phase 2: Tạo backend localhost

### Mục tiêu

Frontend không gọi trực tiếp LLM provider nữa.

### Việc cần làm

1. Tạo backend Node.js + Express.
2. Tạo `.env` chứa API key.
3. Tạo `/api/lesson`.
4. Tạo `/api/chat`.
5. Tạo LLM service chung.
6. Đổi frontend để gọi localhost.

### Kết quả mong muốn

- Frontend gọi `http://localhost:3000/api/chat`.
- API key không xuất hiện trong frontend.

## Phase 3: Chat với LLM trong bài học

### Mục tiêu

Hoàn thiện chức năng học sinh chat với AI.

### Việc cần làm

1. Tạo chat panel trên frontend.
2. Gửi message, currentSlideId, lesson context, chatHistory về backend.
3. Backend tạo prompt từ lesson context.
4. LLM trả lời trong phạm vi bài học.
5. Frontend hiển thị câu trả lời.
6. Thêm trạng thái loading/error.

### Acceptance Criteria

- Học sinh hỏi nội dung trong bài, AI trả lời đúng phạm vi.
- Học sinh hỏi ngoài bài, AI kéo về bài học.
- Câu trả lời phù hợp độ tuổi học sinh.

## Phase 4: Thoại với LLM

### Mục tiêu

Học sinh có thể nói câu hỏi và nhận phản hồi từ LLM.

### Việc cần làm

1. Thêm nút micro.
2. Dùng Web Speech API nhận diện tiếng Việt.
3. Hiển thị transcript.
4. Gửi transcript tới `/api/voice/chat` hoặc `/api/chat`.
5. Nhận reply.
6. Hiển thị reply trong chat panel.
7. Dùng SpeechSynthesis đọc reply.

### Acceptance Criteria

- Học sinh bấm micro, nói được câu hỏi.
- Transcript được hiển thị.
- LLM trả lời dựa trên transcript.
- Câu trả lời được đọc ra bằng giọng nói nếu bật.

## Phase 5: Đánh giá câu trả lời bằng LLM

### Mục tiêu

Không chỉ kiểm tra đúng/sai bằng index đáp án, mà dùng LLM để hiểu ý học sinh.

### Việc cần làm

1. Tạo `/api/answer/evaluate`.
2. Gửi question, correctAnswer, studentAnswer, slide context tới backend.
3. Backend gọi LLM và yêu cầu trả JSON.
4. Frontend xử lý `isCorrect`, `feedback`, `nextAction`, `reviewSlideId`.

### Acceptance Criteria

- Trả lời “có ạ”, “đúng rồi”, “nó là AI” đều có thể được xem là đúng nếu cùng nghĩa.
- Trả lời sai thì nhận feedback thân thiện.
- Backend luôn trả JSON hợp lệ cho frontend.

## Phase 6: Sai thì quay lại slide kiến thức

### Mục tiêu

Hoàn thiện logic học lại khi sai.

### Việc cần làm

1. Mỗi checkpoint có `reviewSlideId`.
2. Khi backend trả `nextAction = review`, frontend chuyển về `reviewSlideId`.
3. Lưu slide checkpoint ban đầu để quay lại sau khi học lại.
4. Phát lại audio hoặc remedial explanation.
5. Quay lại checkpoint.
6. Hỏi lại câu cũ hoặc gọi `/api/question/regenerate`.

### Acceptance Criteria

- Học sinh sai không được đi tiếp ngay.
- Hệ thống chuyển về đúng slide kiến thức.
- Sau khi ôn lại, học sinh được kiểm tra lại.
- Đúng mới được tiếp tục.

## Phase 7: Sinh câu hỏi bằng AI

### Mục tiêu

Cho phép hệ thống sinh câu hỏi tương tác từ nội dung slide.

### Việc cần làm

1. Tạo `/api/question/generate`.
2. Tạo prompt sinh câu hỏi theo độ tuổi học sinh.
3. Response phải là JSON gồm question, options, correctAnswer, explanation, reviewSlideId.
4. Frontend dùng câu hỏi sinh ra nếu checkpoint chưa có sẵn.
5. Tạo `/api/question/regenerate` để sinh câu hỏi tương tự khi học sinh cần làm lại.

### Acceptance Criteria

- Sinh được câu hỏi phù hợp slide.
- Có đáp án đúng rõ ràng.
- Có giải thích ngắn gọn.
- Có slide cần review nếu sai.

## Phase 8: Hỗ trợ video nhúng cơ bản

### Mục tiêu

Cho phép slide có video local hoặc URL nhúng.

### Việc cần làm

1. Thêm field `video` trong slide.
2. Nếu có video, render video player hoặc iframe.
3. Nếu không có video, render image/GIF như bình thường.
4. Dừng audio khi video phát nếu cần.

### Acceptance Criteria

- Slide có video hiển thị được.
- Slide không có video không bị ảnh hưởng.

## Phase 9: Hoàn thiện UX và kiểm thử

### Mục tiêu

Làm app đủ ổn định để demo.

### Việc cần làm

1. Responsive cơ bản.
2. Loading state cho API.
3. Error state khi LLM lỗi.
4. Fallback nếu trình duyệt không hỗ trợ speech recognition.
5. Kiểm tra audio khi chuyển slide.
6. Kiểm tra checkpoint lock/unlock.
7. Kiểm tra chat history.
8. Kiểm tra flow sai → review → quay lại checkpoint → đúng → tiếp tục.

## 9. Prompt mẫu cho LLM

## 9.1 System prompt cho chat

```text
Bạn là cô giáo AI thân thiện đang dạy học sinh nhỏ tuổi.
Bạn chỉ được trả lời trong phạm vi bài học hiện tại.
Hãy dùng tiếng Việt đơn giản, câu ngắn, dễ hiểu.
Không trả lời quá dài. Tối đa 3-4 câu.
Nếu học sinh hỏi ngoài phạm vi bài học, hãy nhẹ nhàng nói rằng câu hỏi đó chưa nằm trong bài hôm nay và gợi ý quay lại nội dung đang học.
```

## 9.2 Prompt đánh giá câu trả lời

```text
Bạn là hệ thống đánh giá câu trả lời của học sinh nhỏ tuổi.
Hãy đánh giá mềm theo ý nghĩa, không yêu cầu học sinh trả lời đúng từng chữ.

Thông tin:
- Câu hỏi: {{question}}
- Đáp án đúng: {{correctAnswer}}
- Câu trả lời của học sinh: {{studentAnswer}}
- Kiến thức slide: {{knowledgePoint}}

Hãy trả về JSON hợp lệ, không thêm giải thích ngoài JSON:
{
  "isCorrect": true hoặc false,
  "score": số từ 0 đến 1,
  "feedback": "phản hồi ngắn gọn, thân thiện",
  "shouldReview": true hoặc false,
  "reviewSlideId": "id slide cần học lại hoặc null",
  "nextAction": "continue" hoặc "review" hoặc "retry"
}
```

## 9.3 Prompt sinh câu hỏi

```text
Bạn là giáo viên thiết kế câu hỏi e-learning cho học sinh nhỏ tuổi.
Hãy tạo một câu hỏi kiểm tra hiểu bài dựa trên nội dung slide.

Thông tin:
- Độ tuổi học sinh: {{targetLearner}}
- Mục tiêu bài học: {{learningObjectives}}
- Nội dung slide: {{knowledgePoint}}
- Script lời giảng: {{script}}

Yêu cầu:
- Câu hỏi ngắn, dễ hiểu.
- Có 2-4 lựa chọn nếu là trắc nghiệm.
- Có một đáp án đúng rõ ràng.
- Có giải thích khi học sinh trả lời đúng.
- Có feedback khi học sinh trả lời sai.
- Có reviewSlideId để quay lại slide kiến thức liên quan.

Chỉ trả JSON hợp lệ:
{
  "question": "...",
  "type": "multiple_choice",
  "options": ["...", "..."],
  "correctAnswer": "...",
  "explanation": "...",
  "wrongFeedback": "...",
  "reviewSlideId": "..."
}
```

## 10. Checklist cho coder

### Backend

- [ ] Có server localhost.
- [ ] Có file `.env` chứa API key.
- [ ] Có LLM service.
- [ ] Có `/api/lesson`.
- [ ] Có `/api/chat`.
- [ ] Có `/api/voice/chat` hoặc dùng chung `/api/chat`.
- [ ] Có `/api/answer/evaluate`.
- [ ] Có `/api/question/generate`.
- [ ] Có `/api/question/regenerate`.
- [ ] Không để API key trong frontend.
- [ ] Response API có error handling.

### Frontend

- [ ] Fetch lesson từ API hoặc JSON.
- [ ] Render slide theo lesson data.
- [ ] Phát audio theo slide.
- [ ] Render video nếu slide có video.
- [ ] Có checkpoint.
- [ ] Có trả lời bằng chọn đáp án.
- [ ] Có trả lời bằng text.
- [ ] Có trả lời bằng voice.
- [ ] Có chat panel với LLM.
- [ ] Có voice assistant hỏi LLM.
- [ ] Có TTS đọc câu trả lời AI.
- [ ] Sai thì quay lại slide kiến thức.
- [ ] Đúng thì mở khóa học tiếp.
- [ ] Có màn hình hoàn thành bài học.

### UX

- [ ] Giao diện dễ dùng cho học sinh nhỏ.
- [ ] Nút bấm lớn, rõ ràng.
- [ ] Feedback thân thiện.
- [ ] Có trạng thái loading khi gọi AI.
- [ ] Có thông báo lỗi dễ hiểu.
- [ ] Có fallback khi trình duyệt không hỗ trợ giọng nói.

## 11. Thứ tự ưu tiên code

Ưu tiên triển khai theo thứ tự sau:

1. Tách `lesson.json`.
2. Backend localhost cơ bản.
3. Frontend fetch lesson từ backend.
4. Slide player + audio.
5. Checkpoint cơ bản.
6. `/api/answer/evaluate` bằng LLM.
7. Sai thì quay lại slide kiến thức.
8. Chat với LLM.
9. Thoại với LLM.
10. Sinh câu hỏi bằng AI.
11. Video nhúng.
12. Hoàn thiện UX/demo.

## 12. Định nghĩa hoàn thành

Dự án MVP được xem là hoàn thành khi coder demo được kịch bản sau:

1. Mở webapp trên localhost.
2. Bài học được load từ `lesson.json`.
3. Học sinh xem slide và nghe audio.
4. Tới checkpoint, học sinh trả lời bằng voice hoặc text.
5. Backend gọi LLM để đánh giá.
6. Nếu đúng, webapp cho học tiếp.
7. Nếu sai, webapp chuyển về slide kiến thức liên quan.
8. Sau khi học lại, học sinh được hỏi lại.
9. Học sinh có thể mở chat và hỏi LLM.
10. Học sinh có thể bấm micro để nói chuyện với LLM.
11. API key chỉ nằm ở backend, không xuất hiện trong frontend.
