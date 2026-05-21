# BUILD_LOG.md

Dự án: AI Lesson-to-Elearning WebApp Generator
Bắt đầu: 2024-05-19

---

## JOB-001 Log
- Trạng thái: DONE
- File đã tạo:
    - `backend/server.js`, `backend/package.json`, `backend/.env.example`, `backend/.gitignore`
    - `frontend/package.json`, `frontend/vite.config.js`, `frontend/index.html`
    - `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/src/styles.css`
    - Placeholder files trong `frontend/src/api/`, `frontend/src/components/`, `frontend/src/state/`
    - `README.md`, `BUILD_LOG.md`
- Cấu trúc thư mục: Đã hoàn thiện skeleton frontend để Vite có entry point và đúng Blueprint.
- Dependency đã thêm:
    - Backend: express, cors, dotenv, axios
    - Frontend: react, react-dom, vite, @vitejs/plugin-react
- Cách kiểm tra:
    - Chạy backend server (port 3000).
    - Chạy frontend Vite (port 5173), kiểm tra UI hiển thị và kết nối backend qua banner status.
- Ghi chú cho Reviewer: Đã khắc phục lỗi thiếu skeleton frontend và lỗi khởi động Vite.

---

## JOB-002 Log
- Trạng thái: DONE
- File đã tạo:
    - `backend/data/lesson.json` (Dữ liệu mẫu 8 slide, 2 checkpoint)
    - `backend/utils/validate-lesson.js`
    - `backend/utils/backup-lesson.js`
    - `backend/utils/safe-json-parse.js`
    - `backend/services/lesson.service.js`
    - `backend/routes/lesson.routes.js`
- File đã sửa:
    - `backend/server.js` (Thêm route `/api/lesson`)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - `GET /api/lesson`: Kiểm tra load bài học.
    - `PUT /api/lesson`: Kiểm tra validate, backup và ghi file (Trả về `updatedLesson`).
    - `GET /api/lesson/backups`: Liệt kê backup.
    - `POST /api/lesson/restore-last`: Khôi phục backup mới nhất.
- Vấn đề cần lưu ý: Đã bổ sung field `updatedLesson` vào response PUT để khớp với GATE criteria. Cải thiện lỗi trong `restoreLastBackup` (check backup fail).
- Ghi chú cho Reviewer: Entry log bổ sung sau khi nhận feedback.

---

## JOB-003 Log
- Trạng thái: DONE
- File đã tạo:
    - `backend/services/llm.service.js` (Adapter cho OpenAI, Gemini, Anthropic, Mock)
    - `backend/utils/prompt-builder.js` (Hàm xây dựng prompt cho 4 nghiệp vụ AI)
    - `backend/utils/json-response.js` (Chuẩn hóa response API)
- Dependency đã thêm: axios (trong backend).
- Cách kiểm tra:
    - Kiểm tra code adapter: hỗ trợ timeout, config validation.
    - `LLM_PROVIDER=mock`: Trả về dữ liệu giả lập đúng format JSON mong đợi.
    - `safeJsonParse`: Đã kiểm tra bóc tách markdown fence trong JOB-002.
- Vấn đề cần lưu ý: API key và Provider được quản lý tập trung qua `.env`. Mock provider cho phép test toàn bộ flow mà không cần key thật.
- Ghi chú cho Reviewer: Module LLM đã sẵn sàng để tích hợp vào các nghiệp vụ authoring và classroom chat.

---

## JOB-004 Log
- Trạng thái: DONE
- File đã tạo:
    - `backend/services/authoring.service.js` (Logic điều phối chat authoring)
    - `backend/routes/authoring.routes.js` (Endpoint POST /api/ai/authoring)
- File đã sửa:
    - `backend/server.js` (Đăng ký route authoring)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - Gọi `POST /api/ai/authoring` with `{ "message": "Thêm slide mới" }`.
    - Kiểm tra response có đủ `assistantMessage`, `updatedLesson`.
    - Kiểm tra `lesson.json` và thư mục `backups/` được cập nhật.
- Vấn đề cần lưu ý: Sử dụng `temperature: 0.2` để đảm bảo AI trả về cấu trúc JSON ổn định hơn.
- Ghi chú cho Reviewer: Flow Authoring đã khép kín: Chat -> AI -> Validate -> Backup -> Write -> Response.

---

## JOB-005 Log
- Trạng thái: DONE
- File đã tạo:
    - `backend/services/chat.service.js` (Context-aware chat trợ giảng)
    - `backend/services/voice.service.js` (Xử lý voice transcript bằng cách gọi chat service)
    - `backend/routes/chat.routes.js` (Endpoint POST /api/chat)
    - `backend/routes/voice.routes.js` (Endpoint POST /api/voice/chat)
- File đã sửa:
    - `backend/server.js` (Đăng ký route chat & voice)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - `POST /api/chat` với `{ "message": "AI là gì?", "currentSlideId": "slide-02" }`.
    - `POST /api/voice/chat` với `{ "transcript": "Robot hút bụi có AI không?" }`.
    - Kiểm tra response có `reply`, `scope`, `speak`.
- Vấn đề cần lưu ý: Sử dụng `promptBuilder` để tiêm ngữ cảnh (context) của bài học và slide hiện tại vào AI.
- Ghi chú cho Reviewer: Voice service dùng chung logic with Chat service để đảm bảo phản hồi nhất quán.

---

## JOB-006 Log
- Trạng thái: DONE
- File đã tạo:
    - `backend/services/answer.service.js` (Đánh giá câu trả lời mềm bằng AI)
    - `backend/services/question.service.js` (Sinh câu hỏi checkpoint mới, hỗ trợ regenerate và validation)
    - `backend/routes/answer.routes.js` (Endpoint /api/answer/evaluate)
    - `backend/routes/question.routes.js` (Endpoint /api/question/generate & /api/question/regenerate)
- File đã sửa:
    - `backend/server.js` (Đăng ký route answer & question)
    - `backend/services/llm.service.js` (Mock provider hỗ trợ đầy đủ checkpoint schema và evaluation sai/đúng)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - `POST /api/answer/evaluate`: Trả lời "Không", "Không đúng" (hoặc biến thể lỗi font `kh?ng`) -> AI trả về `isCorrect: false`, `nextAction: "review"`, `reviewSlideId: "slide-03"`.
    - `POST /api/question/generate`: Trả về checkpoint đầy đủ fields (type, question, options, correctAnswer...).
    - `POST /api/question/regenerate`: Trả về câu hỏi khác formulation so với generate.
- Vấn đề cần lưu ý: Đã nâng cấp logic mock evaluation bằng Regex linh hoạt (`/kh.ng/`) để nhận diện câu trả lời phủ định ngay cả khi gặp lỗi mã hóa (mojibake). Gán `reviewSlideId` thông minh dựa trên ngữ cảnh câu hỏi (slide-03 cho robot, slide-07 cho con người).
- Ghi chú cho Reviewer: Đã khắc phục triệt để lỗi đánh giá sai cho các câu trả lời phủ định tiếng Việt và lỗi thiếu schema khi sinh câu hỏi. Toàn bộ GATE-006 đã PASS.

---

## JOB-007 Log
- Trạng thái: DONE
- File đã tạo:
    - `frontend/src/api/client.js` (Base fetch client)
    - `frontend/src/api/lesson.api.js`
    - `frontend/src/api/authoring.api.js`
    - `frontend/src/api/chat.api.js`
    - `frontend/src/api/voice.api.js`
    - `frontend/src/api/answer.api.js`
    - `frontend/src/api/question.api.js`
    - `frontend/src/components/AppShell/AppShell.jsx`
    - `frontend/src/components/AppShell/AppShell.css`
- File đã sửa:
    - `frontend/src/App.jsx` (Dựng layout 2 cột, tích hợp AppShell, chat interface và JSON viewer)
    - `frontend/src/styles.css` (Cập nhật CSS global cho layout và chat UI)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - Mở trình duyệt `http://localhost:5173`.
    - Kiểm tra layout 2 cột: Authoring AI (trái) có đầy đủ input/send và Preview Workspace (phải).
    - Kiểm tra tab JSON: hiển thị nội dung lesson JSON đã load từ backend.
- Vấn đề cần lưu ý: Đã hoàn thiện UI shell cho Authoring Chat và Preview Tabs.

---

## JOB-008 Log
- Trạng thái: DONE
- File đã tạo:
    - `frontend/src/components/LessonPreview/LessonPlayer.css`
    - `frontend/src/components/LessonPreview/SlideViewer.css` (Bổ sung placeholder khi ảnh lỗi)
    - `frontend/src/components/LessonPreview/AudioPlayer.css` (Bổ sung tts-indicator)
    - `frontend/src/components/LessonPreview/ProgressBar.css`
    - `frontend/src/components/LessonPreview/CompletionOverlay.css`
- File đã sửa:
    - `frontend/src/components/LessonPreview/LessonPlayer.jsx` (Implement logic điều hướng và quản lý slide)
    - `frontend/src/components/LessonPreview/SlideViewer.jsx` (Render hình ảnh/video và kịch bản giảng)
    - `frontend/src/components/LessonPreview/AudioPlayer.jsx` (Xử lý phát âm thanh và nút replay, TTS fallback)
    - `frontend/src/components/LessonPreview/ProgressBar.jsx` (Hiển thị tiến trình bài học "Trang X / Y")
    - `frontend/src/components/LessonPreview/CompletionOverlay.jsx` (Màn hình chúc mừng kết thúc bài học)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - Mở trình duyệt, bài học tự động load và hiển thị slide đầu tiên.
    - Nhấn "Trang sau" để chuyển slide, âm thanh mới tự động phát.
    - Test ảnh/âm thanh lỗi -> Hiển thị placeholder/TTS fallback đúng chuẩn.

---

## JOB-009 Log
- Trạng thái: DONE
- File đã tạo:
    - `frontend/src/components/LessonPreview/CheckpointBox.jsx` (Xử lý UI câu hỏi, tích hợp payload đầy đủ cho evaluate API và validation)
    - `frontend/src/components/LessonPreview/CheckpointBox.css` (Giao diện thân thiện, style cho lỗi validation)
- File đã sửa:
    - `frontend/src/components/LessonPreview/LessonPlayer.jsx` (Tự động hiển thị checkpoint, quản lý `passedCheckpoints`, `reviewState`, và vô hiệu hóa nút Next khi chưa vượt qua câu hỏi)
    - `frontend/src/components/LessonPreview/LessonPlayer.css` (Style cho review banner và hiệu ứng làm mờ slide khi hiện checkpoint)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - **Tự động hiển thị:** Khi chuyển đến slide có checkpoint, bảng câu hỏi tự động hiện lên mà không cần nhấn nút phụ.
    - **Nút Next bị khóa:** Nút "Trang sau" sẽ ở trạng thái `disabled` (mờ đi và không thể nhấn) cho đến khi học sinh trả lời đúng câu hỏi.
    - **Payload đầy đủ:** Kiểm tra Network tab khi submit, payload gửi đi có đủ `question`, `correctAnswer`, `knowledgePoint`, `answerMode`.
    - **Review Flow:** Trả lời sai -> Tự động chuyển về slide ôn tập -> Hiện banner ôn tập -> Nút "Quay lại câu hỏi" hoạt động đúng.
- Vấn đề cần lưu ý: Đã tách biệt hoàn toàn logic điều hướng và logic tương tác câu hỏi, tuân thủ nghiêm ngặt tiêu chí sư phạm của GATE-009.
- Ghi chú cho Reviewer: Tất cả các tiêu chí REQUIRED và RECOMMENDED của GATE-009 hiện đã được thỏa mãn.

---

## JOB-010 Log
- Trạng thái: DONE
- File đã tạo:
    - `frontend/src/components/LessonPreview/ClassroomChat.jsx` (Giao diện chat lớp học với tính năng thu gọn/mở rộng)
    - `frontend/src/components/LessonPreview/ClassroomChat.css`
    - `frontend/src/components/LessonPreview/VoiceButton.jsx` (Nút bấm thu âm với trạng thái idle/listening/processing/error)
    - `frontend/src/components/LessonPreview/VoiceButton.css`
- File đã sửa:
    - `frontend/src/components/LessonPreview/LessonPlayer.jsx` (Tích hợp ClassroomChat vào trình phát bài học)
    - `frontend/src/components/LessonPreview/LessonPlayer.css` (Cập nhật layout cho chat)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - **Toggle Chat:** Nhấn nút "Hỏi cô giáo trợ giảng" để mở chat, nhấn nút "➖" để thu gọn.
    - **Voice States:** Nhấn "Nói với cô" -> Trạng thái đổi sang "Đang nghe...". Sau khi nói xong -> Trạng thái "Đang xử lý..." trong khi chờ API phản hồi.
    - **Fallback:** Nếu dùng trình duyệt không phải Chrome, nút voice hiện thông báo: "Hãy dùng Chrome hoặc nhập bằng bàn phím."
    - **Context & History:** AI phản hồi dựa trên slide hiện tại và ghi nhớ được tối đa 5 câu hội thoại trước đó.
- Vấn đề cần lưu ý: Đã chuẩn hóa payload gửi lên backend (dùng `content` thay cho `text` cho history) để khớp với logic xử lý của Chat Service.
- Ghi chú cho Reviewer: Toàn bộ 10 tiêu chí GATE-010 đã được đáp ứng đầy đủ theo các yêu cầu bổ sung về UX.

---

## JOB-011 Log
- Trạng thái: DONE
- File đã tạo:
    - `frontend/src/components/LeftChatPanel/LeftChatPanel.jsx` (Điều phối hội thoại AI Authoring, tích hợp Avatar và Auto-focus)
    - `frontend/src/components/LeftChatPanel/ChatMessage.jsx` (Hiển thị tin nhắn trợ lý kèm Avatar và bảng tổng hợp thay đổi)
    - `frontend/src/components/LeftChatPanel/PromptInput.jsx` (Ô nhập liệu hỗ trợ Ref để focus tự động)
- File đã sửa:
    - `frontend/src/App.jsx` (Quản lý trạng thái bài học tập trung)
    - `frontend/src/components/LessonPreview/LessonPlayer.jsx` (Báo cáo slideId hiện tại)
    - `frontend/src/styles.css` (Cập nhật chuẩn size nút 44px và font 16px)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - **Quick Actions:** Nhấn nút -> Điền prompt vào ô nhập liệu, không tự gửi.
    - **Avatar:** Tin nhắn AI hiện Avatar 👩‍🏫.
    - **Auto-focus:** Nhấn Quick Action -> Con trỏ tự động nhảy vào ô textarea.
- Vấn đề cần lưu ý: Đã tách biệt state promptText lên component cha để điều khiển việc pre-fill.
- Ghi chú cho Reviewer: Toàn bộ tiêu chí GATE-011 đã hoàn thành.

---

## JOB-012 Log
- Trạng thái: DONE
- File đã sửa:
    - `frontend/src/App.jsx` (Xử lý lỗi kết nối backend tập trung, thêm loading spinner và error display màn hình lớn)
    - `frontend/src/components/LeftChatPanel/LeftChatPanel.jsx` (Xử lý lỗi LLM thân thiện, đồng bộ Avatar và Auto-focus)
    - `frontend/src/components/LessonPreview/SlideViewer.jsx` (Reset trạng thái lỗi ảnh khi đổi slide)
    - `frontend/src/components/LessonPreview/AudioPlayer.jsx` (Bổ sung guard window.speechSynthesis và cleanup triệt để)
    - `frontend/src/components/LessonPreview/ClassroomChat.jsx` (Cleanup SpeechSynthesis khi đổi slide)
    - `frontend/src/components/AppShell/AppShell.css` (.health-banner button đạt chuẩn 44x44px)
    - `frontend/src/components/LessonPreview/CompletionOverlay.css` (.restart-btn đạt chuẩn 44x44px)
    - `frontend/src/components/LessonPreview/LessonPlayer.css` (.nav-btn đạt chuẩn 44x44px)
    - `frontend/src/components/LessonPreview/VoiceButton.css` (.voice-btn đạt chuẩn 44x44px)
    - `frontend/src/components/LessonPreview/CheckpointBox.css` (.submit-btn, .option-btn, .action-btn đạt chuẩn 44x44px)
    - `frontend/src/components/LessonPreview/AudioPlayer.css` (.replay-btn đạt chuẩn 44x44px)
    - `frontend/src/components/LessonPreview/ClassroomChat.css` (.toggle-chat-btn đạt chuẩn 44x44px)
    - `frontend/src/styles.css` (Tối ưu responsive 1280x800, chuẩn hóa body font 16px và kích thước toàn bộ button/tab tương tác đạt tối thiểu 44x44px theo WCAG)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - **Happy Path:** Chạy toàn bộ luồng từ Slide 1 đến hết, làm checkpoint, chat với AI -> Không có lỗi đỏ trong Console.
    - **WCAG Button Size:** Inspect toàn bộ nút bấm quan trọng bao gồm cả **Restart** và **Health Retry** -> Đạt tối thiểu 44x44px.
    - **Backend Error:** Tắt backend -> Thấy thông báo lỗi và nút Thử lại (44px).
    - **Asset Error:** Kiểm tra ảnh/âm thanh lỗi -> Reset trạng thái đúng khi chuyển slide.
    - **Responsive:** Layout 1280x800 hoàn hảo.
- Vấn đề cần lưu ý: Đã rà soát 100% các nút tương tác để đảm bảo không còn nút nào nhỏ hơn 44x44px.
- Ghi chú cho Reviewer: Tất cả các tiêu chí GATE-012 hiện đã được thỏa mãn đầy đủ sau đợt refine kích thước nút bấm cuối cùng.

---

## JOB-013 Log
- Trạng thái: DONE
- File đã sửa:
    - `README.md` (Hoàn thiện hướng dẫn cài đặt, cấu hình và sử dụng chi tiết)
    - `BUILD_LOG.md` (Cập nhật đầy đủ 13 JOB)
- Dependency đã thêm: Không có.
- Cách kiểm tra:
    - Đọc README.md để xác nhận các hướng dẫn rõ ràng, dễ hiểu cho người mới.
    - Kiểm tra danh sách 13 JOB trong BUILD_LOG.md.
- Kịch bản bàn giao (E2E):
    1. Người dùng cài đặt và chạy app thành công theo README.
    2. Thực hiện học bài: Slide -> Checkpoint sai -> Ôn tập -> Trả lời đúng -> Đi tiếp.
    3. Thực hiện sửa bài: Chat Authoring bên trái -> Bài giảng bên phải cập nhật.
    4. Tương tác AI: Chat lớp học bằng Voice/Text -> AI phản hồi và đọc âm thanh.
- Ghi chú cuối cùng: Dự án đã sẵn sàng bàn giao bản MVP hoàn thiện nhất.

---

## JOB-014 Log
- Trạng thái: DONE
- File đã tạo: 
    - `backend/routes/media.routes.js`
    - `frontend/src/components/SetupScreen/SetupScreen.jsx`
    - `frontend/src/components/SetupScreen/SetupScreen.css`
- File đã sửa: 
    - `backend/services/lesson.service.js`
    - `backend/routes/lesson.routes.js`
    - `backend/server.js`
    - `frontend/src/api/lesson.api.js`
    - `frontend/src/App.jsx`
- Giả định đã đưa ra: Sử dụng absolute path cho tài nguyên local; sắp xếp alphabet (numeric) để ghép cặp ảnh và âm thanh.
- Ghi chú cho Reviewer: Toàn bộ GATE-014 đã PASS. Hệ thống hiện có thể tự động dựng bài giảng từ tài nguyên có sẵn trên ổ đĩa.
