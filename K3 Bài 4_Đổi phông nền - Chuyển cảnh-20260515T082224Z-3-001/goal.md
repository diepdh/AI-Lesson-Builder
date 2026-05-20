# GOAL.md

## 1. Tên dự án

**AI Lesson-to-Elearning WebApp Generator**

## 2. Mục tiêu sản phẩm

Xây dựng một chương trình phần mềm chạy trước mắt trên `localhost`, có khả năng:

1. nhận một bài giảng đầu vào gồm slide, audio theo slide và video nhúng nếu có;
2. hỗ trợ người dùng ra lệnh cho AI bằng chat/thoại để tạo hoặc chỉnh sửa bài giảng webapp;
3. hiển thị **preview trực tiếp** của webapp bài giảng ngay trong cùng giao diện;
4. xuất ra một **webapp e-learning** dùng cho lớp học.

Mục tiêu của giai đoạn đầu không phải là LMS hoàn chỉnh, mà là một **công cụ tạo và chạy bài giảng e-learning có trợ giảng AI**, phù hợp bối cảnh thiếu giáo viên có chuyên môn.

---

## 3. Phạm vi MVP giai đoạn đầu

### 3.1 Mô hình sử dụng trong lớp học

Phiên bản đầu tiên đi theo mô hình:

- **1 giáo viên** điều phối buổi học;
- **1 bài giảng** đang chạy;
- cả lớp **cùng xem một slide tại cùng thời điểm**;
- giáo viên là người chuyển slide;
- học sinh **cùng trao đổi để thống nhất một câu trả lời chung**;
- giáo viên hoặc đại diện lớp gửi câu trả lời đó cho AI;
- AI phản hồi để cả lớp học tiếp hoặc quay lại slide kiến thức cần ôn lại.

### 3.2 Những gì chưa làm trong MVP

Chưa ưu tiên ở giai đoạn đầu:

- tài khoản đăng nhập cho từng học sinh;
- học sinh học riêng theo tốc độ cá nhân;
- chấm điểm cá nhân;
- lưu tiến độ riêng từng học sinh;
- đồng bộ nhiều thiết bị học sinh theo thời gian thực;
- LMS / SCORM / quản trị người dùng phức tạp.

---

## 4. Giao diện phần mềm bắt buộc

Giao diện phần mềm cần theo mô hình **2 cột**, tương tự ảnh mẫu mà người dùng đã cung cấp.

### 4.1 Cột trái: AI Chat Workspace

Cột bên trái là khu vực làm việc với AI, dùng để:

- nhập yêu cầu bằng văn bản;
- hỗ trợ nhập yêu cầu bằng giọng nói (nếu bật);
- yêu cầu AI tạo bài học, sửa bài học, thêm câu hỏi, chỉnh kịch bản lời thoại, chỉnh bố cục webapp;
- hiển thị lịch sử hội thoại giữa người dùng và AI;
- hiển thị trạng thái AI đang xử lý;
- hiển thị gợi ý lệnh nhanh (prompt shortcuts) nếu cần.

Đây là **kênh điều khiển chính** của người dùng đối với phần mềm.

### 4.2 Cột phải: Preview Workspace

Cột bên phải là khu vực preview trực tiếp của webapp bài giảng, dùng để:

- xem giao diện webapp sau khi AI tạo/chỉnh sửa;
- xem slide hiện tại;
- xem luồng bài học;
- thử chạy checkpoint;
- kiểm tra phần chat/thoại của bài học;
- xem kết quả thay đổi gần như tức thời sau mỗi yêu cầu gửi cho AI.

Giai đoạn đầu nên có ít nhất:

- tab **Preview**;
- có thể dự phòng thêm tab **Code** hoặc **JSON** để mở rộng sau, nhưng không bắt buộc phải hoàn thiện ngay.

### 4.3 Trải nghiệm mong muốn

Phần mềm cần cho cảm giác giống một môi trường làm việc AI-assisted:

- trái: “ra lệnh / trao đổi với AI”;
- phải: “xem ngay kết quả / preview webapp”.

Mỗi thay đổi do AI thực hiện cần được phản ánh rõ trong preview để người dùng kiểm tra nhanh.

---

## 5. Hai lớp sản phẩm cần phân biệt

Hệ thống này có **2 lớp giao diện**:

### 5.1 Lớp 1: Giao diện phần mềm tạo bài học

Đây là giao diện 2 cột:

- trái: chat với AI;
- phải: preview.

Đây là công cụ mà giáo viên / người vận hành dùng để tạo hoặc chỉnh bài học.

### 5.2 Lớp 2: Webapp bài giảng đầu ra

Đây là bài giảng e-learning được phần mềm tạo ra hoặc preview ra.

Webapp bài giảng cần có:

- khu vực hiển thị slide/hình/GIF/video;
- nút điều hướng slide;
- phát audio theo slide;
- checkpoint kiểm tra hiểu bài;
- đánh giá câu trả lời bằng AI;
- cơ chế quay lại slide kiến thức nếu trả lời sai;
- chat/thoại với LLM trong phạm vi bài học;
- màn hình hoàn thành bài học.

---

## 6. Dữ liệu đầu vào

Chương trình cần nhận dữ liệu đầu vào cho một bài giảng đơn lẻ, bao gồm:

1. **Slide bài giảng**
   - Định dạng: `.jpg`, `.png`, `.webp`, `.gif`.
   - Có thứ tự slide rõ ràng.

2. **Audio theo slide**
   - Mỗi slide có thể có một file audio riêng.
   - Định dạng ưu tiên: `.mp3`.

3. **Video nhúng nếu có**
   - Có thể là file local hoặc URL nhúng.

4. **Metadata bài học**
   - tên bài học;
   - mô tả ngắn;
   - đối tượng học sinh;
   - mục tiêu học tập;
   - kiến thức chính của từng slide.

5. **Cấu hình AI**
   - API endpoint thông qua localhost;
   - model/provider phía backend;
   - prompt hệ thống;
   - quy tắc sinh câu hỏi;
   - quy tắc đánh giá câu trả lời.

---

## 7. Webapp bài giảng đầu ra cần làm gì

Webapp bài giảng đầu ra cần đóng vai trò như một **trợ giảng AI cho cả lớp**, không chỉ là trình chiếu slide.

### 7.1 Chức năng cốt lõi

- hiển thị nội dung bài học theo slide;
- phát lời giảng theo slide;
- cho giáo viên điều khiển chuyển slide;
- tại các checkpoint, cả lớp cùng thảo luận để đưa ra **một câu trả lời chung**;
- gửi câu trả lời chung đó tới backend;
- backend gọi LLM để đánh giá;
- nếu đúng thì cho tiếp tục;
- nếu sai thì quay lại slide kiến thức liên quan để học lại;
- cho phép hỏi AI bằng chat hoặc thoại trong quá trình học.

### 7.2 Nguyên tắc xử lý checkpoint trong MVP

Ở giai đoạn đầu:

- không thu câu trả lời riêng từng học sinh;
- không chấm điểm từng học sinh;
- chỉ có **một luồng trả lời chung của lớp**;
- giáo viên hoặc người điều phối là người bấm gửi câu trả lời;
- AI phản hồi ở cấp độ **cả lớp**.

---

## 8. Chức năng chat với LLM trong bài học

Webapp bài giảng cần có một khu vực chat với LLM để cả lớp có thể hỏi thêm trong quá trình học.

### 8.1 Mục tiêu

- giải thích lại nội dung chưa hiểu;
- trả lời ngắn gọn, dễ hiểu;
- chỉ trả lời trong phạm vi bài học;
- đóng vai trò như “cô/thầy giáo AI” hỗ trợ lớp học.

### 8.2 Yêu cầu

- có nút mở/đóng chat;
- có ô nhập câu hỏi;
- có nút gửi;
- có lịch sử hội thoại trong phiên học;
- gửi câu hỏi cùng ngữ cảnh slide hiện tại tới backend localhost;
- backend gọi LLM và trả lời;
- câu trả lời phù hợp với độ tuổi học sinh và bối cảnh lớp học.

---

## 9. Chức năng thoại với LLM trong bài học

Webapp bài giảng cần hỗ trợ thoại với LLM.

### 9.1 Mục tiêu

- giáo viên hoặc đại diện lớp có thể bấm micro để nói câu hỏi;
- hệ thống chuyển giọng nói thành văn bản;
- gửi câu hỏi đó tới backend;
- nhận câu trả lời từ LLM;
- hiển thị câu trả lời và có thể đọc lại bằng TTS.

### 9.2 Luồng cơ bản

1. bấm nút micro;
2. nhận diện giọng nói tiếng Việt;
3. hiển thị transcript;
4. gửi transcript tới backend localhost;
5. backend gọi LLM;
6. hiển thị phản hồi;
7. có thể dùng TTS đọc phản hồi.

---

## 10. Chức năng sinh câu hỏi tương tác bằng AI

Hệ thống cần có khả năng tạo câu hỏi kiểm tra hiểu bài dựa trên nội dung slide.

### Đầu ra mỗi checkpoint nên gồm

- câu hỏi;
- loại câu hỏi;
- danh sách đáp án nếu là trắc nghiệm;
- đáp án đúng;
- lời giải thích ngắn gọn;
- phản hồi khi sai;
- `reviewSlideId` để quay lại phần kiến thức cần học lại.

---

## 11. Kiến trúc kỹ thuật mức cao

### 11.1 Frontend ứng dụng chính

Frontend của phần mềm tạo bài học cần có:

- AI Chat Workspace (cột trái);
- Preview Workspace (cột phải);
- trạng thái loading / error / checkpoint của preview;
- khả năng gọi backend localhost.

### 11.2 Backend localhost

Backend là thành phần bắt buộc, chịu trách nhiệm:

- nhận và xử lý yêu cầu từ chat AI;
- nạp dữ liệu bài học;
- phục vụ slide/audio/video;
- gọi LLM;
- sinh câu hỏi;
- đánh giá câu trả lời;
- trả dữ liệu JSON về frontend.

### 11.3 Không gọi LLM trực tiếp từ frontend

API key và provider secret không được nằm trên frontend. Mọi lời gọi LLM phải đi qua backend localhost.

---

## 12. Định nghĩa thành công của MVP

MVP được xem là đạt yêu cầu khi demo được các tình huống sau:

1. mở phần mềm trên localhost;
2. giao diện hiển thị đúng mô hình **chat bên trái – preview bên phải**;
3. người dùng có thể nhập yêu cầu cho AI ở cột trái;
4. preview bên phải cập nhật được nội dung webapp bài giảng;
5. bài giảng chạy theo slide với audio;
6. giáo viên chuyển slide cho cả lớp;
7. tại checkpoint, lớp gửi một câu trả lời chung;
8. AI đánh giá và phản hồi;
9. nếu sai, hệ thống quay lại slide kiến thức cần ôn lại;
10. trong bài học có thể chat/thoại với LLM;
11. toàn bộ gọi AI đi qua backend localhost.
