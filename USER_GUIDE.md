# USER_GUIDE.md

## 1. Đối tượng sử dụng

Tài liệu này dành cho giáo viên hoặc người vận hành muốn dùng **AI Lesson Builder** để mở bài giảng, chỉnh sửa bằng AI, chạy slide, kiểm tra checkpoint và dùng trợ giảng AI trong lớp.

## 2. Mở ứng dụng

Trước khi dùng, cần có 2 cửa sổ terminal đang chạy:

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Sau đó mở trình duyệt:

```text
http://localhost:5173
```

Nếu dùng voice, nên dùng Google Chrome.

## 3. Giao diện chính

Ứng dụng có 2 vùng chính:

| Vùng | Chức năng |
|---|---|
| Panel trái: Authoring AI | Chat với AI để chỉnh sửa bài giảng |
| Panel phải: Preview | Xem và chạy bài học như học sinh sẽ thấy |

Ở panel phải có 2 tab:

- `Preview`: chạy bài học.
- `JSON`: xem dữ liệu bài học hiện tại.

## 4. Chạy bài học

1. Mở app tại `http://localhost:5173`.
2. Đợi bài học load xong.
3. Xem slide hiện tại ở panel phải.
4. Bấm `Trang sau` để chuyển slide.
5. Bấm `Trang trước` để quay lại slide trước nếu cần.
6. Nếu slide có audio, app sẽ cố phát audio.
7. Nếu audio lỗi hoặc thiếu file, app có thể dùng giọng đọc máy theo nội dung script.

## 5. Làm checkpoint

Khi tới slide có checkpoint, câu hỏi sẽ tự hiện.

Với câu hỏi trắc nghiệm:

1. Chọn một đáp án.
2. App gửi đáp án để AI/backend đánh giá.
3. Nếu đúng, bấm tiếp tục và nút `Trang sau` được mở.
4. Nếu sai, app hướng dẫn quay về slide ôn tập.

Với câu hỏi nhập ngắn:

1. Nhập câu trả lời của lớp.
2. Bấm `Gửi câu trả lời`.
3. Xem phản hồi và làm theo hướng dẫn.

## 6. Ôn tập sau khi trả lời sai

Nếu lớp trả lời sai:

1. App chuyển về slide ôn tập phù hợp.
2. Đọc lại nội dung hoặc nghe lại audio.
3. Bấm `Quay lại câu hỏi`.
4. Trả lời lại checkpoint.
5. Khi trả lời đúng, tiếp tục bài học.

## 7. Dùng trợ giảng AI trong bài học

Trong phần Preview, bấm nút mở chat trợ giảng.

Cách dùng:

1. Nhập câu hỏi liên quan bài học, ví dụ: `AI là gì?`.
2. Bấm gửi.
3. AI trả lời theo ngữ cảnh slide hiện tại.
4. Nếu response có cấu hình đọc, app sẽ đọc câu trả lời bằng TTS.

Lưu ý:

- Chat trợ giảng dùng cho học sinh/lớp học.
- Chat này tách biệt với Authoring AI ở panel trái.

## 8. Dùng voice

Voice dùng Web Speech API của trình duyệt.

Trên Chrome:

1. Bấm `Nói với cô`.
2. Cho phép quyền microphone.
3. Nói câu hỏi bằng tiếng Việt.
4. App gửi transcript tới trợ giảng AI.
5. AI trả lời bằng text và có thể đọc lên.

Trên trình duyệt không hỗ trợ:

- App sẽ hiện fallback.
- Hãy nhập câu hỏi bằng bàn phím.

## 9. Chỉnh sửa bài giảng bằng AI

Panel trái là Authoring AI. Dùng vùng này để yêu cầu AI chỉnh bài.

Cách gửi prompt:

1. Nhập yêu cầu vào ô chat.
2. Bấm `Gửi`.
3. Đợi AI xử lý.
4. Xem phản hồi và phần tóm tắt thay đổi.
5. Nếu có `updatedLesson`, preview bên phải cập nhật ngay.

Ví dụ prompt:

```text
Hãy viết lại lời thoại slide hiện tại cho học sinh lớp 3 dễ hiểu hơn.
```

```text
Hãy thêm một checkpoint trắc nghiệm cho slide này.
```

```text
Hãy làm nội dung slide này sinh động hơn nhưng vẫn ngắn gọn.
```

## 10. Dùng quick actions

Panel trái có các nút thao tác nhanh như:

- `Thêm checkpoint`
- `Sửa lời thoại`
- `Tạo câu hỏi`
- `Cải thiện nội dung`

Khi bấm quick action:

1. App điền prompt mẫu vào ô nhập.
2. Bạn có thể sửa lại nội dung prompt.
3. Bấm `Gửi` để thực sự gửi cho AI.

Quick action không tự gửi ngay.

## 11. Xem dữ liệu JSON

Tab `JSON` ở panel phải dùng để kiểm tra dữ liệu bài học hiện tại.

Dùng tab này khi:

- Muốn xem slide/checkpoint đã được AI cập nhật chưa.
- Muốn kiểm tra đường dẫn ảnh/audio/video.
- Muốn debug khi preview hiển thị chưa đúng.

Không nên chỉnh trực tiếp JSON trong giao diện vì tab này chỉ để xem.

## 12. Thêm ảnh, audio, video

Đặt file vào các thư mục:

```text
frontend/public/assets/slides/
frontend/public/assets/audio/
frontend/public/assets/video/
```

Sau đó cập nhật đường dẫn trong `backend/data/lesson.json`, ví dụ:

```json
{
  "image": "/assets/slides/slide-01.jpg",
  "audio": "/assets/audio/slide-01.mp3",
  "video": "/assets/video/demo.mp4"
}
```

Lưu ý:

- Không dùng đường dẫn tuyệt đối trên máy.
- Nên dùng đường dẫn bắt đầu bằng `/assets/`.
- Nếu ảnh lỗi, app hiển thị placeholder.
- Nếu audio lỗi, app fallback sang TTS nếu có script.

## 13. Khi gặp lỗi

| Lỗi | Cách xử lý |
|---|---|
| Không kết nối backend | Kiểm tra terminal backend còn chạy không |
| Backend lỗi sau khi AI chỉnh bài | Kiểm tra `backend/data/backups/` và restore bản gần nhất |
| AI không phản hồi | Kiểm tra `.env`, provider, API key hoặc dùng `LLM_PROVIDER=mock` |
| Voice không nhận | Dùng Chrome và cấp quyền microphone |
| Slide không hiện ảnh | Kiểm tra file asset và path trong `lesson.json` |
| Nút Next bị khóa | Hoàn thành checkpoint đúng trước |

## 14. Quy trình demo đề xuất

1. Mở app và giới thiệu layout 2 cột.
2. Chạy vài slide đầu.
3. Tới checkpoint, trả lời sai để demo review flow.
4. Quay lại checkpoint, trả lời đúng để mở khóa Next.
5. Mở chat trợ giảng và hỏi một câu theo nội dung slide.
6. Demo voice nếu dùng Chrome.
7. Chuyển sang panel trái, dùng quick action `Sửa lời thoại`.
8. Gửi prompt, chờ AI phản hồi.
9. Xem Preview và tab JSON cập nhật.
