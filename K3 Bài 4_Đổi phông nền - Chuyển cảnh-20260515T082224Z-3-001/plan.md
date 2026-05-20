# PLAN.md

## 1. Mục tiêu triển khai

Xây dựng MVP cho một phần mềm chạy trên `localhost`, có giao diện theo mô hình:

- **bên trái:** cửa sổ chat với AI để người dùng ra yêu cầu;
- **bên phải:** preview trực tiếp của webapp bài giảng.

Phần mềm cần giúp người dùng tạo/chỉnh sửa một bài giảng e-learning và đồng thời chạy được bài giảng đó theo mô hình lớp học:

- 1 giáo viên;
- 1 bài giảng;
- cả lớp cùng xem một slide;
- giáo viên điều khiển slide;
- cả lớp thống nhất một câu trả lời rồi mới gửi cho AI.

---

## 2. Nguyên tắc triển khai

1. Không hard-code toàn bộ bài học trong `index.html`.
2. Dữ liệu bài học cần tách ra thành `lesson.json` hoặc cấu trúc tương đương.
3. Frontend của **phần mềm** phải là layout 2 cột: trái chat, phải preview.
4. Frontend của **webapp bài giảng** là nội dung xuất hiện trong vùng preview.
5. Backend localhost là nơi duy nhất được phép gọi LLM.
6. Giai đoạn đầu chỉ xử lý **một câu trả lời chung của cả lớp**.
7. Chức năng chat và thoại với LLM là bắt buộc.
8. Luồng sai → quay lại slide kiến thức → học lại → trả lời lại phải rõ ràng.
9. Coder phải tách bạch giữa:
   - giao diện phần mềm tạo/chỉnh bài học;
   - giao diện bài giảng webapp đang được preview/chạy.

---

## 3. Kiến trúc đề xuất cho MVP

```text
project-root/
  backend/
    server.js
    routes/
      lesson.routes.js
      ai.routes.js
      question.routes.js
      answer.routes.js
    services/
      lesson.service.js
      llm.service.js
      question.service.js
      answer.service.js
      authoring.service.js
    data/
      lesson.json
    .env

  frontend/
    index.html
    src/
      main.js
      app-shell.js
      left-chat-panel.js
      right-preview-panel.js
      preview-frame.js
      authoring-api.js
      lesson-preview/
        lesson-player.js
        checkpoint.js
        classroom-chat.js
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

---

## 4. Mô hình UI bắt buộc

## 4.1 App Shell

Ứng dụng chính cần có một **App Shell** gồm 2 khu vực chính.

### Khu vực trái: Left Chat Panel

Bao gồm:

- danh sách tin nhắn giữa người dùng và AI;
- ô nhập lệnh;
- nút gửi;
- nút thoại/micro (nếu bật);
- trạng thái loading;
- gợi ý prompt nhanh;
- có thể có danh sách “checkpoint” hoặc “view changes” sau này, nhưng không bắt buộc cho MVP.

### Khu vực phải: Right Preview Panel

Bao gồm:

- vùng preview của webapp bài giảng;
- thanh tiêu đề hoặc toolbar cơ bản;
- tab **Preview** là bắt buộc;
- tab **Code** hoặc **JSON** có thể để placeholder trong MVP, không cần hoàn thiện sâu.

### Yêu cầu UX

- người dùng gửi yêu cầu bên trái;
- hệ thống xử lý và cập nhật bài học;
- preview bên phải phản ánh thay đổi;
- không làm người dùng phải chuyển trang mới để xem kết quả.

---

## 5. Vai trò của AI trong phần mềm

AI có 2 vai trò khác nhau.

### 5.1 Vai trò 1: AI hỗ trợ tạo/chỉnh bài học

Trong cột chat bên trái, AI có thể được yêu cầu:

- tạo cấu trúc bài học;
- chỉnh lời thoại từng slide;
- thêm checkpoint;
- thêm/sửa phản hồi đúng-sai;
- chỉnh phong cách trợ giảng;
- chỉnh giao diện preview;
- bổ sung chat/thoại cho bài học.

### 5.2 Vai trò 2: AI trợ giảng trong bài học

Trong preview của bài giảng, AI đóng vai trò:

- trả lời câu hỏi trong phạm vi bài học;
- tiếp nhận câu hỏi chat/thoại;
- đánh giá câu trả lời chung của lớp;
- yêu cầu cả lớp ôn lại nếu trả lời sai.

Coder cần tách 2 luồng AI này rõ ràng, dù cả hai cùng dùng chung backend LLM service.

---

## 6. Dữ liệu bài học đề xuất

## 6.1 lesson.json

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "title": "AI là gì?",
  "description": "Bài học giới thiệu về trí tuệ nhân tạo cho học sinh lớp 1",
  "targetLearner": "Học sinh lớp 1",
  "classroomMode": {
    "mode": "teacher_led_shared_answer",
    "teacherControlsSlides": true,
    "sharedClassAnswer": true
  },
  "assistantPersona": {
    "role": "Cô giáo AI thân thiện",
    "tone": "ngắn gọn, dễ hiểu, phù hợp với học sinh nhỏ",
    "scopeRule": "Chỉ trả lời trong phạm vi bài học"
  },
  "slides": [
    {
      "id": "slide-01",
      "order": 1,
      "title": "Chào mừng",
      "module": "Giới thiệu",
      "image": "/assets/slides/slide-01.jpg",
      "audio": "/assets/audio/s01.mp3",
      "video": null,
      "script": "Chào mừng các em đến với bài học hôm nay...",
      "knowledgePoint": "Giới thiệu chủ đề AI",
      "checkpoint": null
    },
    {
      "id": "slide-04",
      "order": 4,
      "title": "Robot hút bụi có phải AI không?",
      "module": "Gắn kết",
      "image": "/assets/slides/slide-04.jpg",
      "audio": "/assets/audio/s04.mp3",
      "video": null,
      "script": "Robot hút bụi có thể tự chạy và tránh đồ vật...",
      "knowledgePoint": "AI có thể tự nhận biết và tự quyết định đơn giản",
      "checkpoint": {
        "id": "cp-04",
        "type": "multiple_choice",
        "question": "Robot hút bụi tự chạy và tự tránh đồ vật. Đó có phải là AI không?",
        "options": ["Có", "Không", "Em chưa biết"],
        "correctAnswer": "Có",
        "explanation": "Đúng rồi, robot hút bụi có AI vì nó biết tự tránh đồ vật.",
        "wrongFeedback": "Chưa đúng rồi. Mình cùng xem lại phần kiến thức nhé.",
        "reviewSlideId": "slide-03"
      }
    }
  ]
}
```

---

## 7. Các module cần code

## 7.1 Frontend module: App Shell

### Nhiệm vụ

- render layout 2 cột;
- quản lý kích thước panel;
- chứa Left Chat Panel và Right Preview Panel;
- điều phối trạng thái chung giữa AI chat và preview.

### Acceptance Criteria

- luôn nhìn thấy khu chat bên trái;
- luôn nhìn thấy vùng preview bên phải;
- preview không mở ở trang khác;
- UI gần với mẫu ảnh tham chiếu về tinh thần bố cục.

## 7.2 Frontend module: Left Chat Panel

### Nhiệm vụ

- nhập prompt cho AI;
- hiển thị lịch sử trao đổi;
- gửi prompt tới backend;
- hiển thị trạng thái “đang xử lý”; 
- hỗ trợ voice input cho prompt nếu cần.

### Loại yêu cầu AI cần hỗ trợ trong MVP

- “tạo bài học từ dữ liệu hiện có”;
- “thêm checkpoint cho slide X”;
- “điều chỉnh lời thoại slide X”;
- “thêm phần chat với LLM trong bài học”;
- “đổi giao diện bài học dễ nhìn hơn”.

## 7.3 Frontend module: Right Preview Panel

### Nhiệm vụ

- chứa preview của bài giảng webapp;
- có toolbar tối thiểu;
- có tab Preview;
- có thể có tab Code/JSON placeholder.

### Acceptance Criteria

- preview cập nhật sau hành động từ AI;
- có thể xem và chạy luồng slide/checkpoint trong preview.

## 7.4 Frontend module: Lesson Player (bên trong preview)

### Nhiệm vụ

- load bài học từ API/JSON;
- hiển thị slide;
- phát audio;
- hiển thị checkpoint;
- cho giáo viên chuyển slide;
- xử lý câu trả lời chung của lớp.

### State tối thiểu

```js
const state = {
  lesson: null,
  currentSlideIndex: 0,
  currentSlideId: null,
  isAudioPlaying: false,
  isCheckpointActive: false,
  currentCheckpoint: null,
  reviewReturnSlideId: null,
  classChatHistory: []
};
```

## 7.5 Frontend module: Classroom Checkpoint

### Nhiệm vụ

- hiển thị câu hỏi cho cả lớp;
- cho phép chọn đáp án hoặc nhập/gọi voice cho câu trả lời chung;
- gửi câu trả lời lên backend;
- hiển thị phản hồi AI;
- nếu sai thì quay lại slide cần ôn.

### Luồng bắt buộc

```text
Giáo viên dừng tại checkpoint
→ cả lớp thảo luận
→ giáo viên/đại diện lớp nhập hoặc nói câu trả lời chung
→ gửi lên backend
→ AI đánh giá
→ đúng thì tiếp tục
→ sai thì quay lại reviewSlideId
→ học lại
→ trở về checkpoint
→ trả lời lại
```

## 7.6 Frontend module: Classroom Chat / Voice

### Nhiệm vụ

Trong bài học preview, cần có khu vực chat/thoại với trợ giảng AI.

- mở/đóng chat;
- nhập câu hỏi;
- bấm micro để nói;
- gửi tới backend;
- hiển thị câu trả lời;
- dùng TTS đọc câu trả lời nếu bật.

---

## 8. Backend module cần code

## 8.1 Lesson Service

### API

```http
GET /api/lesson
```

Trả dữ liệu bài học.

```http
PUT /api/lesson
```

Dùng để cập nhật cấu trúc bài học sau khi AI authoring chỉnh sửa.

## 8.2 LLM Service

### Nhiệm vụ

- gọi model/provider;
- đọc cấu hình từ `.env`;
- timeout/error handling;
- chuẩn hóa response.

### Hàm gợi ý

```js
async function callLLM({ systemPrompt, userPrompt, temperature, maxTokens })
```

## 8.3 Authoring AI Service

### Nhiệm vụ

Xử lý prompt từ cột chat bên trái.

Ví dụ:

- đọc yêu cầu người dùng;
- quyết định chỉnh phần nào của lesson config;
- trả về patch/dữ liệu mới;
- backend cập nhật `lesson.json` hoặc state hiện tại;
- frontend reload preview.

### API

```http
POST /api/ai/authoring
```

Request mẫu:

```json
{
  "message": "Hãy thêm một checkpoint cho slide 4 và làm giọng điệu phù hợp học sinh lớp 1"
}
```

Response mẫu:

```json
{
  "summary": "Đã thêm checkpoint cho slide 4",
  "updatedLesson": { }
}
```

## 8.4 Question Service

### API

```http
POST /api/question/generate
```

Sinh câu hỏi từ nội dung slide.

```http
POST /api/question/regenerate
```

Sinh câu hỏi tương tự khi cần hỏi lại.

## 8.5 Answer Service

### API

```http
POST /api/answer/evaluate
```

Request mẫu:

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "slideId": "slide-04",
  "checkpointId": "cp-04",
  "question": "Robot hút bụi tự chạy và tự tránh đồ vật. Đó có phải là AI không?",
  "correctAnswer": "Có",
  "classAnswer": "Có ạ",
  "answerMode": "text"
}
```

Response mẫu khi đúng:

```json
{
  "isCorrect": true,
  "feedback": "Đúng rồi! Đây là AI vì robot biết tự tránh đồ vật.",
  "shouldReview": false,
  "reviewSlideId": null,
  "nextAction": "continue"
}
```

Response mẫu khi sai:

```json
{
  "isCorrect": false,
  "feedback": "Chưa đúng rồi. Mình cùng xem lại phần robot hút bụi nhé.",
  "shouldReview": true,
  "reviewSlideId": "slide-03",
  "nextAction": "review"
}
```

## 8.6 Classroom Chat Service

### API

```http
POST /api/chat
```

Dùng cho chat trong bài học.

## 8.7 Classroom Voice Service

### API

```http
POST /api/voice/chat
```

Giai đoạn đầu có thể dùng chung logic với `/api/chat`, chỉ khác nguồn input là transcript.

---

## 9. Các phase triển khai

## Phase 1: Dựng App Shell theo layout mẫu

### Mục tiêu

Tạo giao diện chính theo mô hình trái chat – phải preview.

### Việc cần làm

1. Dựng layout 2 cột.
2. Tạo Left Chat Panel.
3. Tạo Right Preview Panel.
4. Dựng tab Preview.
5. Dựng preview trống hoặc preview mock.

### Acceptance Criteria

- UI tổng thể bám sát tinh thần ảnh mẫu.
- Bên trái nhập được prompt.
- Bên phải có vùng preview riêng.

## Phase 2: Tách bài học thành lesson.json

### Mục tiêu

Tách dữ liệu bài học khỏi code hard-code.

### Việc cần làm

1. Tạo `lesson.json`.
2. Chuẩn hóa cấu trúc slide/checkpoint.
3. Tạo API trả lesson.
4. Preview load được dữ liệu này.

## Phase 3: Tạo Lesson Preview chạy được

### Mục tiêu

Bên phải có thể chạy bài học cơ bản.

### Việc cần làm

1. render slide;
2. phát audio;
3. cho chuyển slide;
4. hiển thị tiến độ;
5. render video nếu có.

## Phase 4: Tạo backend localhost và LLM service

### Mục tiêu

Tất cả lời gọi AI đi qua backend.

### Việc cần làm

1. Node.js + Express;
2. `.env` cho API key;
3. `llm.service.js`;
4. route authoring AI;
5. route chat/answer/question.

## Phase 5: Bật AI authoring ở cột trái

### Mục tiêu

Người dùng có thể ra yêu cầu cho AI và thấy preview đổi theo.

### Việc cần làm

1. tạo `/api/ai/authoring`;
2. gửi prompt từ Left Chat Panel;
3. AI trả về updated lesson hoặc patch;
4. cập nhật lesson hiện tại;
5. refresh preview.

### Acceptance Criteria

- nhập yêu cầu ở trái;
- bài học trong preview đổi theo;
- có message xác nhận thay đổi.

## Phase 6: Checkpoint và đánh giá câu trả lời chung của lớp

### Mục tiêu

Cả lớp có thể thống nhất một đáp án và gửi cho AI.

### Việc cần làm

1. hiển thị checkpoint;
2. nhập hoặc nói câu trả lời chung;
3. gọi `/api/answer/evaluate`;
4. phản hồi đúng/sai;
5. đúng thì tiếp tục;
6. sai thì chuyển review.

## Phase 7: Luồng quay lại slide kiến thức khi sai

### Mục tiêu

Hoàn thiện luồng học lại khi câu trả lời chung sai.

### Việc cần làm

1. dùng `reviewSlideId`;
2. quay về slide kiến thức;
3. phát lại nội dung;
4. quay lại checkpoint;
5. hỏi lại.

## Phase 8: Chat với LLM trong bài học

### Mục tiêu

Trong preview của bài học, cả lớp có thể hỏi trợ giảng AI.

### Việc cần làm

1. thêm chat panel trong bài học;
2. gửi current slide context;
3. trả lời ngắn gọn, đúng phạm vi bài.

## Phase 9: Thoại với LLM trong bài học

### Mục tiêu

Cho phép đặt câu hỏi bằng giọng nói trong bài học.

### Việc cần làm

1. thêm micro;
2. speech-to-text;
3. gửi transcript;
4. hiển thị và đọc phản hồi.

## Phase 10: Hoàn thiện UX và demo

### Mục tiêu

Làm ứng dụng đủ ổn định để demo.

### Việc cần làm

1. loading state;
2. error state;
3. fallback speech;
4. responsive cơ bản;
5. kiểm thử toàn luồng authoring + preview + classroom.

---

## 10. Prompt mẫu cho coder dùng ở backend

## 10.1 System prompt cho Authoring AI

```text
Bạn là trợ lý AI giúp tạo và chỉnh sửa bài giảng e-learning.
Nhiệm vụ của bạn là cập nhật cấu trúc bài học sao cho phù hợp với học sinh nhỏ tuổi.
Bạn chỉ được sửa trong phạm vi bài học hiện tại.
Khi trả lời, hãy ưu tiên trả về dữ liệu có cấu trúc rõ ràng để backend cập nhật lesson.
```

## 10.2 System prompt cho Chat AI trong bài học

```text
Bạn là cô giáo AI thân thiện đang hỗ trợ cả lớp học.
Hãy trả lời ngắn gọn, dễ hiểu, phù hợp với học sinh nhỏ tuổi.
Chỉ trả lời trong phạm vi bài học hiện tại.
Nếu câu hỏi ngoài phạm vi bài học, hãy nhẹ nhàng kéo cả lớp quay lại nội dung đang học.
```

## 10.3 Prompt đánh giá câu trả lời chung của lớp

```text
Bạn là hệ thống đánh giá câu trả lời chung của một lớp học nhỏ tuổi.
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

## 11. Checklist cho coder

### App Shell

- [ ] Có layout 2 cột.
- [ ] Có chat panel bên trái.
- [ ] Có preview panel bên phải.
- [ ] Có tab Preview.
- [ ] UI bám sát tinh thần ảnh mẫu.

### Backend

- [ ] Có server localhost.
- [ ] Có `.env` chứa API key.
- [ ] Có LLM service.
- [ ] Có `/api/lesson`.
- [ ] Có `/api/ai/authoring`.
- [ ] Có `/api/chat`.
- [ ] Có `/api/voice/chat` hoặc logic tương đương.
- [ ] Có `/api/answer/evaluate`.
- [ ] Có `/api/question/generate`.
- [ ] Không để API key trong frontend.

### Preview bài học

- [ ] Load lesson từ JSON/API.
- [ ] Render slide.
- [ ] Phát audio theo slide.
- [ ] Hỗ trợ video cơ bản.
- [ ] Có checkpoint.
- [ ] Có câu trả lời chung của lớp.
- [ ] Đánh giá bằng AI.
- [ ] Sai thì quay lại slide kiến thức.
- [ ] Có chat với LLM trong bài học.
- [ ] Có thoại với LLM trong bài học.

### UX

- [ ] Loading rõ ràng.
- [ ] Error dễ hiểu.
- [ ] Nút bấm lớn, dễ dùng.
- [ ] Preview không bị che khuất quá nhiều.
- [ ] Có phản hồi sau mỗi thay đổi AI authoring.

---

## 12. Định nghĩa hoàn thành

MVP được xem là hoàn thành khi có thể demo theo kịch bản sau:

1. mở phần mềm trên localhost;
2. nhìn thấy giao diện trái chat – phải preview;
3. nhập yêu cầu ở cột trái, ví dụ “thêm checkpoint cho slide 4”;
4. hệ thống AI xử lý và cập nhật bài học;
5. preview bên phải phản ánh thay đổi;
6. chạy bài học trong preview;
7. giáo viên chuyển slide;
8. tại checkpoint, cả lớp đưa ra một câu trả lời chung;
9. AI đánh giá câu trả lời đó;
10. nếu sai, bài học quay về slide kiến thức;
11. trong bài học có thể chat hoặc nói chuyện với LLM;
12. mọi gọi AI đều đi qua backend localhost.
