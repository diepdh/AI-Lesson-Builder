# GOAL.md

## 1. Tên dự án

**AI Lesson-to-Elearning WebApp Generator**

## 2. Mục tiêu sản phẩm

Xây dựng một chương trình phần mềm có khả năng biến một bài giảng thành một webapp e-learning tương tác, chạy trước mắt trên `localhost`.

Webapp đầu ra đóng vai trò như một **giáo viên số / trợ giảng AI**, hỗ trợ học sinh học bài theo từng slide, nghe lời giảng, tương tác bằng câu hỏi kiểm tra hiểu bài, chat hoặc nói chuyện với LLM để được giải thích thêm, và tự động điều hướng học sinh quay lại phần kiến thức liên quan nếu chưa hiểu bài.

Mục tiêu trước mắt không phải là hệ thống LMS hoàn chỉnh, mà là một webapp thay thế hoặc hỗ trợ giáo viên trong các tình huống thiếu giáo viên có chuyên môn.

## 3. Bối cảnh sử dụng

- Một bài giảng đã có sẵn slide.
- Slide có thể là hình ảnh tĩnh hoặc hình ảnh động/GIF.
- Mỗi slide có thể có audio lời thoại riêng.
- Một số slide có thể có video nhúng.
- Giáo viên hoặc người hỗ trợ vẫn có thể điều phối lớp học và hỗ trợ chuyển slide khi cần.
- Học sinh học theo luồng bài giảng do webapp dẫn dắt.
- Học sinh có thể hỏi AI bằng chat hoặc giọng nói trong quá trình học.

## 4. Đầu vào của chương trình

Chương trình nhận dữ liệu đầu vào cho một bài giảng đơn lẻ, bao gồm:

1. **Slide bài giảng**
   - Định dạng: `.jpg`, `.png`, `.webp`, `.gif`.
   - Mỗi slide có thứ tự rõ ràng.
   - Mỗi slide có thể có tiêu đề, mô tả ngắn hoặc phần kiến thức chính.

2. **Audio lời thoại theo slide**
   - Mỗi slide có thể có một file audio tương ứng.
   - Định dạng ưu tiên: `.mp3`, có thể mở rộng sang `.wav`, `.m4a`.
   - Nếu slide không có audio, hệ thống có thể dùng TTS fallback nếu được bật.

3. **Video nhúng nếu có**
   - Có thể là file video local hoặc URL nhúng.
   - Video được gắn vào slide tương ứng.
   - Giai đoạn đầu chỉ cần hỗ trợ video cơ bản, chưa cần editor timeline phức tạp.

4. **Metadata bài học**
   - Tên bài học.
   - Mô tả ngắn.
   - Đối tượng học sinh.
   - Mục tiêu học tập.
   - Danh sách slide và tài nguyên tương ứng.
   - Nội dung kiến thức chính của từng slide.

5. **Cấu hình AI/LLM**
   - API endpoint localhost.
   - Model/provider sử dụng phía backend.
   - Prompt hệ thống cho trợ giảng AI.
   - Phạm vi kiến thức mà AI được phép trả lời.
   - Quy tắc đánh giá câu trả lời của học sinh.

## 5. Đầu ra của chương trình

Đầu ra là một webapp e-learning hoàn chỉnh có thể chạy trên `localhost`, bao gồm:

- Giao diện học bài theo slide.
- Khu vực hiển thị slide/hình/GIF/video.
- Nút điều hướng slide.
- Audio lời thoại theo từng slide.
- Câu hỏi tương tác tại các điểm kiểm tra hiểu bài.
- Cơ chế đánh giá câu trả lời đúng/sai/gần đúng.
- Cơ chế quay lại slide kiến thức khi học sinh trả lời sai.
- Chatbot AI trong phạm vi bài học.
- Chức năng trò chuyện bằng giọng nói với LLM.
- Màn hình hoàn thành bài học.

## 6. Vai trò của webapp trong lớp học

Webapp không chỉ là công cụ trình chiếu slide. Webapp cần đóng vai trò như một **trợ giảng chủ động**, có khả năng:

- Giới thiệu nội dung bài học.
- Phát lời giảng theo slide.
- Dẫn dắt học sinh qua từng phần kiến thức.
- Đặt câu hỏi để kiểm tra hiểu bài.
- Nhận câu trả lời dạng chọn đáp án, nhập văn bản hoặc giọng nói.
- Phân tích câu trả lời bằng LLM.
- Phản hồi theo ngôn ngữ phù hợp với học sinh.
- Cho học tiếp nếu học sinh hiểu đúng.
- Quay lại slide kiến thức liên quan nếu học sinh trả lời sai.
- Cho phép học sinh hỏi thêm bằng chat hoặc giọng nói.

## 7. Luồng học tập chính

### 7.1 Luồng bình thường

1. Học sinh mở bài học.
2. Webapp hiển thị slide đầu tiên.
3. Webapp phát audio lời thoại của slide.
4. Giáo viên hoặc hệ thống điều hướng sang slide tiếp theo.
5. Đến slide có checkpoint, hệ thống đặt câu hỏi kiểm tra hiểu bài.
6. Học sinh trả lời bằng một trong các cách:
   - Chọn đáp án.
   - Gõ câu trả lời.
   - Nói câu trả lời.
7. Hệ thống gửi câu trả lời tới backend localhost.
8. Backend gọi LLM để đánh giá câu trả lời.
9. Nếu đúng, học sinh được học tiếp.
10. Nếu sai, học sinh được đưa về slide kiến thức liên quan để học lại.

### 7.2 Luồng khi học sinh trả lời sai

1. Học sinh trả lời sai tại checkpoint.
2. Hệ thống hiển thị phản hồi ngắn gọn, thân thiện.
3. Hệ thống xác định slide kiến thức cần ôn lại.
4. Webapp chuyển học sinh về slide đó.
5. Webapp phát lại lời giảng hoặc phần giải thích bổ sung.
6. Sau khi học lại, hệ thống đưa học sinh trở về câu hỏi checkpoint.
7. Hệ thống có thể hỏi lại câu cũ hoặc sinh câu hỏi tương tự.
8. Nếu học sinh trả lời đúng, tiếp tục bài học.

## 8. Chức năng chat với LLM

Webapp cần có một khu vực chat để học sinh hỏi AI trong quá trình học.

### 8.1 Mục tiêu

- Cho phép học sinh hỏi lại nội dung chưa hiểu.
- Giải thích lại kiến thức theo ngôn ngữ đơn giản.
- Trả lời trong phạm vi bài học, không lan man ra ngoài.
- Đóng vai trò như một cô/thầy giáo AI thân thiện.

### 8.2 Yêu cầu chức năng

- Có nút mở/đóng khung chat.
- Có ô nhập câu hỏi bằng văn bản.
- Có nút gửi câu hỏi.
- Hiển thị lịch sử hội thoại trong phiên học.
- Gửi nội dung câu hỏi, slide hiện tại và ngữ cảnh bài học tới backend localhost.
- Backend gọi LLM để tạo câu trả lời.
- Câu trả lời cần ngắn gọn, dễ hiểu, phù hợp độ tuổi học sinh.
- AI chỉ trả lời trong phạm vi bài học.
- Nếu câu hỏi ngoài phạm vi, AI cần nhẹ nhàng kéo học sinh quay lại bài học.

### 8.3 Ngữ cảnh gửi cho LLM

Khi học sinh chat, backend nên nhận được:

- ID bài học.
- Slide hiện tại.
- Nội dung kiến thức của slide hiện tại.
- Tóm tắt toàn bài.
- Lịch sử chat gần nhất.
- Câu hỏi của học sinh.

## 9. Chức năng thoại với LLM

Webapp cần hỗ trợ học sinh nói chuyện với LLM bằng giọng nói.

### 9.1 Mục tiêu

- Học sinh có thể bấm nút micro và nói câu hỏi.
- Hệ thống chuyển giọng nói thành văn bản.
- Văn bản được gửi tới backend như một câu hỏi chat.
- LLM trả lời bằng văn bản.
- Webapp có thể đọc câu trả lời bằng giọng nói.

### 9.2 Luồng thoại

1. Học sinh bấm nút micro.
2. Trình duyệt bắt đầu ghi nhận giọng nói.
3. Speech-to-text chuyển lời nói thành văn bản.
4. Webapp hiển thị văn bản đã nhận diện để học sinh biết hệ thống nghe đúng hay chưa.
5. Webapp gửi văn bản tới API chat/voice trên localhost.
6. Backend gọi LLM để trả lời.
7. Webapp hiển thị câu trả lời.
8. Webapp dùng TTS đọc câu trả lời nếu chế độ đọc tự động được bật.

### 9.3 Lưu ý giai đoạn đầu

- Có thể dùng Web Speech API của trình duyệt cho speech-to-text và text-to-speech.
- Ưu tiên Chrome vì hỗ trợ tiếng Việt tốt hơn.
- Backend vẫn cần thiết để gọi LLM, tránh để API key nằm trực tiếp trong frontend.

## 10. Chức năng sinh câu hỏi tương tác bằng AI

Hệ thống cần có khả năng tạo câu hỏi kiểm tra hiểu bài từ nội dung slide.

### 10.1 Đầu vào để sinh câu hỏi

- Nội dung kiến thức của slide.
- Mục tiêu học tập của bài học.
- Độ tuổi/trình độ học sinh.
- Loại câu hỏi mong muốn:
  - Trắc nghiệm.
  - Đúng/sai.
  - Câu hỏi ngắn.
  - Câu hỏi nói/gõ tự do.

### 10.2 Đầu ra mong muốn

Mỗi checkpoint nên có:

- Câu hỏi.
- Danh sách đáp án nếu là trắc nghiệm.
- Đáp án đúng.
- Giải thích khi trả lời đúng.
- Phản hồi khi trả lời sai.
- Slide kiến thức cần quay lại nếu sai.
- Câu hỏi tương tự để hỏi lại sau khi học sinh ôn tập.

## 11. Yêu cầu về backend localhost

Backend localhost là thành phần bắt buộc trong giai đoạn hiện tại.

Backend chịu trách nhiệm:

- Nạp dữ liệu bài học.
- Phục vụ file slide/audio/video.
- Nhận câu hỏi chat từ frontend.
- Gọi LLM.
- Đánh giá câu trả lời của học sinh.
- Sinh câu hỏi tương tác nếu cần.
- Trả kết quả về frontend theo JSON.
- Ẩn API key khỏi frontend.

## 12. API endpoint dự kiến

### 12.1 Lesson API

```http
GET /api/lesson
```

Trả về metadata bài học, danh sách slide và tài nguyên tương ứng.

```http
POST /api/lesson/load
```

Nạp hoặc cập nhật dữ liệu một bài học.

### 12.2 Question API

```http
POST /api/question/generate
```

Sinh câu hỏi tương tác từ nội dung slide.

```http
POST /api/question/regenerate
```

Sinh câu hỏi tương tự khi học sinh cần làm lại.

### 12.3 Answer API

```http
POST /api/answer/evaluate
```

Đánh giá câu trả lời của học sinh.

Kết quả trả về cần có:

```json
{
  "isCorrect": true,
  "score": 1,
  "feedback": "Đúng rồi! Em hiểu bài rất tốt.",
  "shouldReview": false,
  "reviewSlideId": null,
  "nextAction": "continue"
}
```

Nếu sai:

```json
{
  "isCorrect": false,
  "score": 0,
  "feedback": "Chưa đúng rồi. Mình cùng xem lại phần này nhé.",
  "shouldReview": true,
  "reviewSlideId": "slide-09",
  "nextAction": "review"
}
```

### 12.4 Chat API

```http
POST /api/chat
```

Nhận câu hỏi dạng text từ học sinh và trả lời bằng LLM.

Request mẫu:

```json
{
  "lessonId": "ai-la-gi-lop-1",
  "currentSlideId": "slide-09",
  "message": "AI có biết buồn không cô?",
  "chatHistory": []
}
```

Response mẫu:

```json
{
  "reply": "AI không biết buồn như con người đâu em. AI chỉ xử lý thông tin như máy tính thôi."
}
```

### 12.5 Voice API

```http
POST /api/voice/chat
```

Nhận câu hỏi đã được chuyển từ giọng nói thành văn bản, xử lý như chat và trả về câu trả lời.

Giai đoạn đầu có thể dùng chung logic với `/api/chat`.

## 13. Yêu cầu về frontend

Frontend cần có các khu vực chính:

1. **Lesson Player**
   - Hiển thị slide.
   - Hiển thị video nếu slide có video.
   - Phát audio theo slide.
   - Cho phép nghe lại.
   - Cho phép chuyển slide theo điều phối giáo viên hoặc điều kiện checkpoint.

2. **Checkpoint Area**
   - Hiển thị câu hỏi.
   - Cho phép trả lời bằng chọn đáp án, nhập text hoặc nói.
   - Gửi câu trả lời tới backend.
   - Hiển thị feedback.
   - Điều hướng tiếp tục hoặc quay lại slide ôn tập.

3. **AI Chat Panel**
   - Cho phép học sinh hỏi bằng text.
   - Hiển thị trả lời của LLM.
   - Có thể đọc câu trả lời bằng TTS.

4. **Voice Assistant**
   - Nút micro.
   - Hiển thị trạng thái đang nghe.
   - Hiển thị nội dung nhận diện được.
   - Gửi câu hỏi tới LLM.
   - Đọc câu trả lời bằng TTS nếu bật.

5. **Progress Display**
   - Hiển thị tiến độ bài học.
   - Hiển thị slide hiện tại.
   - Có thể đánh dấu các checkpoint đã hoàn thành.

## 14. Phạm vi phiên bản đầu tiên

Phiên bản đầu tiên cần tập trung vào:

- Một bài giảng đơn lẻ.
- Chạy trên localhost.
- Slide dạng ảnh/GIF.
- Audio theo từng slide.
- Chat với LLM.
- Hỏi đáp bằng giọng nói với LLM.
- Câu hỏi checkpoint.
- Đánh giá câu trả lời bằng LLM.
- Sai thì quay lại slide kiến thức liên quan.
- Đúng thì tiếp tục bài học.

Chưa cần trong giai đoạn đầu:

- Đăng nhập tài khoản.
- Quản lý nhiều lớp học.
- LMS/SCORM/xAPI.
- Báo cáo học tập nâng cao.
- Editor kéo thả phức tạp.
- Đồng bộ timeline audio/video chi tiết.
- Deploy cloud production.

## 15. Tiêu chí hoàn thành MVP

MVP được xem là đạt khi:

1. Có thể chạy toàn bộ hệ thống trên localhost.
2. Frontend lấy dữ liệu bài học từ file cấu hình hoặc API, không hard-code toàn bộ trong `index.html`.
3. Hiển thị được ít nhất một bài học gồm nhiều slide.
4. Phát được audio theo slide.
5. Có checkpoint kiểm tra hiểu bài.
6. Học sinh trả lời đúng thì tiếp tục học.
7. Học sinh trả lời sai thì quay lại slide kiến thức liên quan.
8. Học sinh có thể chat với LLM trong phạm vi bài học.
9. Học sinh có thể hỏi bằng giọng nói và nhận câu trả lời từ LLM.
10. Backend localhost chịu trách nhiệm gọi LLM, frontend không chứa API key.
