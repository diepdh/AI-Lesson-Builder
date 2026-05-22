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

### 2. Khởi tạo dữ liệu bài học từ ổ đĩa (Setup Screen)
Tính năng mới cho phép dựng bài học tự động từ các thư mục (folder) chứa ảnh và âm thanh trên máy tính của bạn:
- Sau khi khởi động Frontend (bước 3), nếu chưa có dữ liệu bài học, hệ thống sẽ hiển thị màn hình **Khởi tạo bài học**.
- Bạn cần nhập đường dẫn tuyệt đối (Absolute Path) tới thư mục chứa ảnh (slides) và thư mục chứa âm thanh (audio).
  - *Ví dụ Windows:* `C:\Users\Ten_Ban\Downloads\bai-giang\slides`
  - *Ví dụ macOS:* `/Users/Ten_Ban/Downloads/bai-giang/slides`
- Hệ thống sẽ tự động ghép cặp ảnh và âm thanh theo thứ tự chữ cái (alphabet) để tạo thành các trang slide. Bạn nên đặt tên file theo số thứ tự (ví dụ: `slide-01.jpg`, `slide-02.jpg`) để đảm bảo chính xác.

### 3. Cấu hình Frontend
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

## � Xuất webapp mới

Sau khi hoàn thành xây dựng và kiểm thử, bạn có thể xuất một webapp đầy đủ để triển khai hoặc chạy trên máy khác.

1.  Từ thư mục gốc `Xtech`, chạy script export bằng PowerShell:

```powershell
.\scripts\export-webapp.ps1
```

2.  Nếu bạn đã xây dựng frontend trước đó, có thể bỏ qua bước build bằng cách thêm `-NoBuild`:

```powershell
.\scripts\export-webapp.ps1
```

3.  Script sẽ tạo thư mục `exports/ai-lesson-webapp-YYYYMMDDHHmmss` và file nén cùng tên `exports/ai-lesson-webapp-YYYYMMDDHHmmss.zip`.

4.  Gói xuất gồm:
   - `backend/`: mã nguồn backend, `package.json`, `server.js`, `routes`, `services`, `utils`.
   - `backend/public/`: nội dung production của frontend được copy từ `frontend/dist`.
   - `backend/data/lesson.json`: dữ liệu bài học hiện tại.
   - `backend/data/media/`: media slide/audio/video cần thiết cho bản portable.
   - `.env.example` đã được copy ra `backend/.env` để bạn dễ cấu hình.

5.  Để chạy webapp xuất ra trên máy khác:

```powershell
cd exports\ai-lesson-webapp-YYYYMMDDHHmmss\backend
npm install
npm start
```

6.  Mở trình duyệt đến:

```text
http://localhost:3000
```

---

## �📝 Nhật ký xây dựng
Xem chi tiết các bước thực hiện và thay đổi tại: `BUILD_LOG.md`.
## Tài liệu bàn giao

- `HANDOVER.md`: tài liệu bàn giao kỹ thuật và vận hành.
- `USER_GUIDE.md`: hướng dẫn sử dụng cho giáo viên/người vận hành.
