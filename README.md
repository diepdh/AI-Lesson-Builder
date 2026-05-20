# 🎓 AI Lesson Builder (MVP)

Hệ thống hỗ trợ giáo viên tạo và trình phát bài giảng E-learning tương tác với sự trợ giúp của Trí tuệ nhân tạo (AI). 

Dự án này cho phép giáo viên chat với AI để biên soạn nội dung bài học, tự động sinh câu hỏi kiểm tra (Checkpoint), và cung cấp một trình phát bài học thông minh có khả năng tương tác với học sinh qua giọng nói và văn bản.

## 🚀 Hướng dẫn khởi động nhanh

### 1. Cấu hình Backend
Di chuyển vào thư mục backend và cài đặt các phụ thuộc:
```bash
cd backend
npm install
```
Tạo file cấu hình môi trường:
- **macOS/Linux:** `cp .env.example .env`
- **Windows (PowerShell):** `Copy-Item .env.example .env`

Mở file `.env` và cấu hình:
- `LLM_PROVIDER`: Chọn `openai`, `gemini`, `anthropic` hoặc `mock` (để kiểm thử không tốn phí).
- `LLM_API_KEY`: Điền mã bí mật API tương ứng của bạn.

Khởi động server:
```bash
npm run dev
```
*Server sẽ chạy tại: `http://localhost:3000`*

### 2. Cấu hình Frontend
Mở một cửa sổ dòng lệnh mới, di chuyển vào thư mục frontend và cài đặt:
```bash
cd frontend
npm install
```
Khởi động giao diện người dùng:
```bash
npm run dev
```
*Giao diện sẽ chạy tại: `http://localhost:5173`*

---

## ✅ Checklist kiểm thử MVP

Để đảm bảo hệ thống hoạt động đúng chuẩn, vui lòng kiểm tra theo các bước sau:

1.  **Giao diện:** Mở `http://localhost:5173`, đảm bảo thấy layout 2 cột (Authoring bên trái, Preview bên phải).
2.  **Kết nối:** Status bar phía trên báo "Connected". Thử tắt backend để thấy banner cảnh báo lỗi.
3.  **Tải bài học:** Nội dung bài học "AI là gì?" tự động hiển thị ở slide 1.
4.  **Điều hướng:** Nhấn "Trang sau" để chuyển slide. Thanh tiến trình "Trang X / Y" cập nhật đúng.
5.  **Âm thanh:** Slide có audio sẽ tự phát. Nhấn "Phát lại lời giảng" để nghe lại.
6.  **Checkpoint:** Chuyển đến slide 4, bảng câu hỏi trắc nghiệm tự động hiện ra.
7.  **Review Flow:** Trả lời SAI câu hỏi -> Hệ thống dẫn về slide kiến thức cũ -> Nhấn "Quay lại câu hỏi" để làm lại.
8.  **Trợ giảng AI:** Mở khung chat dưới slide, nhập câu hỏi "AI là ai tạo ra?" -> AI phản hồi và đọc âm thanh.
9.  **Giọng nói:** Nhấn "Nói với cô", cấp quyền Microphone và đặt câu hỏi bằng tiếng Việt.
10. **Chỉnh sửa AI:** Tại panel trái, nhấn "Thêm checkpoint" -> Nhấn Gửi -> Đảm bảo bài giảng bên phải cập nhật nội dung mới.

---

## 🛠️ Hướng dẫn quản lý tài nguyên (Assets)

Hệ thống hỗ trợ hiển thị Hình ảnh, Video và Âm thanh cho mỗi slide:

1.  **Hình ảnh:** Đặt các file ảnh vào thư mục `frontend/public/assets/slides/`. Cập nhật đường dẫn trong `lesson.json` (ví dụ: `/assets/slides/hinh-anh-1.jpg`).
2.  **Âm thanh:** Đặt file âm thanh giảng bài vào `frontend/public/assets/audio/`. Nếu file âm thanh bị lỗi hoặc thiếu, hệ thống sẽ tự động dùng giọng nói máy (TTS).
3.  **Video:** Đặt file video vào `frontend/public/assets/video/`.

---

## 🔍 Troubleshooting (Xử lý sự cố)

1.  **Lỗi "Không kết nối được backend":** Đảm bảo bạn đã chạy server backend và cổng 3000 không bị chiếm dụng.
2.  **AI không phản hồi hoặc báo lỗi 502:** Kiểm tra lại API Key và cấu hình `LLM_PROVIDER` trong file `.env`.
3.  **Không sử dụng được giọng nói:** Tính năng nhận diện giọng nói hoạt động tốt nhất trên trình duyệt **Google Chrome**.

---

## 📝 Nhật ký xây dựng
Xem chi tiết các bước thực hiện và thay đổi tại: `BUILD_LOG.md`.
## Tai lieu ban giao

- `HANDOVER.md`: tai lieu ban giao ky thuat va van hanh.
- `USER_GUIDE.md`: huong dan su dung cho giao vien/nguoi van hanh.
