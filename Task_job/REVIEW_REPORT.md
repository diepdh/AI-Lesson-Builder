# REVIEW_REPORT.md

---

# RE-REVIEW — JOB-013 sau khi Coder bổ sung BUILD_LOG

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại, bản sửa sau review JOB-013 lần 1

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS — 11/11 PASS |
| GATE Criteria (RECOMMENDED) | PASS — 1/1 PASS |
| Build frontend | PASS |
| Backend syntax check | PASS |
| Contract Compliance | PASS |
| Code Quality | PASS |

> GATE PASS — JOB-013 được chấp nhận.

## Kiểm Tra Lại Lỗi Blocking

Lỗi Gate #5 đã được sửa:

- `Task_job/BUILD_LOG.md` hiện có đủ `JOB-001 Log` đến `JOB-013 Log`, bao gồm `JOB-007` và `JOB-008`.
- Root `BUILD_LOG.md` cũng đã được đồng bộ đủ `JOB-001 Log` đến `JOB-013 Log`.
- `README.md` đã bổ sung section `Checklist kiểm thử MVP`, đáp ứng tốt hơn yêu cầu bàn giao.

## Kết Luận Theo Gate

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | README có lệnh cài đặt và chạy backend + frontend đầy đủ | PASS |
| 2 | Reviewer chưa biết project: làm theo README từng bước -> app chạy được | PASS |
| 3 | README có hướng dẫn cấu hình `.env` | PASS |
| 4 | README có hướng dẫn thêm slide/audio asset | PASS |
| 5 | `BUILD_LOG.md` có đủ entry cho 13 JOB | PASS |
| 6 | E2E học bài: checkpoint sai -> review -> retry đúng -> đi tiếp | PASS |
| 7 | E2E authoring prompt -> preview cập nhật | PASS |
| 8 | E2E classroom chat đúng context | PASS |
| 9 | E2E voice hoặc fallback không crash | PASS |
| 10 | Không có request/API key từ frontend | PASS |
| 11 | Tất cả GATE-001 đến GATE-012 PASS | PASS |
| 12 | README có Troubleshooting ít nhất 3 lỗi phổ biến | PASS |

## Verification

```text
cd backend
node --check server.js
PASS

cd frontend
npm.cmd run build
✓ built in 782ms

rg API key/provider patterns in frontend
No matches
```

## Hành Động Tiếp Theo

The Brain có thể mở GATE-013. Toàn bộ chuỗi JOB-001 đến JOB-013 đã được review pass theo trạng thái hiện tại.

---

# REVIEW — JOB-013: README và kiểm thử kịch bản MVP

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại, submit JOB-013 của Coder

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL — 10/11 PASS |
| GATE Criteria (RECOMMENDED) | PASS — 1/1 PASS |
| Build frontend | PASS |
| Backend syntax check | PASS |
| Contract Compliance | FAIL |
| Code Quality | Không phát sinh vấn đề code mới |

> GATE FAIL — JOB-013 cần Coder sửa lại.

## Chi Tiết Gate Criteria

| # | Tiêu chí | Loại | Kết quả | Ghi chú |
|---|---|---|---|---|
| 1 | README có lệnh cài đặt và chạy backend + frontend đầy đủ | REQUIRED | PASS | Có `cd backend`, `npm install`, `cp .env.example .env`, `npm run dev`, `cd frontend`, `npm install`, `npm run dev`. |
| 2 | Reviewer chưa biết project: làm theo README từng bước → app chạy được | REQUIRED | PASS | Lệnh trong README khớp `package.json`; frontend build pass, backend `server.js` check pass. |
| 3 | README có hướng dẫn cấu hình `.env` | REQUIRED | PASS | Có `LLM_PROVIDER`, `LLM_API_KEY`; `.env.example` tồn tại và đủ biến chính. |
| 4 | README có hướng dẫn thêm slide/audio asset | REQUIRED | PASS | Có hướng dẫn `frontend/public/assets/slides`, `audio`, `video`. |
| 5 | `BUILD_LOG.md` có đủ entry cho 13 JOB | REQUIRED | FAIL | Thiếu `JOB-007` và `JOB-008` trong cả `Task_job/BUILD_LOG.md` và root `BUILD_LOG.md`. |
| 6 | E2E học bài: checkpoint sai → review → retry đúng → đi tiếp | REQUIRED | PASS | Đã được reviewer xác nhận qua các gate JOB-008/009/012 trước đó. |
| 7 | E2E authoring prompt → preview cập nhật | REQUIRED | PASS | Đã được reviewer xác nhận qua JOB-011. |
| 8 | E2E classroom chat trả lời đúng context | REQUIRED | PASS | Đã được reviewer xác nhận qua JOB-010. |
| 9 | E2E voice hoặc fallback không crash | REQUIRED | PASS | Đã được reviewer xác nhận qua JOB-010/012. |
| 10 | Không có request/API key từ frontend | REQUIRED | PASS | `rg` không tìm thấy `API_KEY`, provider endpoint, hoặc secret pattern trong frontend source/public/index/vite config. |
| 11 | Tất cả GATE-001 đến GATE-012 PASS | REQUIRED | PASS | Review report hiện có kết luận PASS cho các gate 001-012 sau re-review. |
| 12 | README có Troubleshooting ít nhất 3 lỗi phổ biến | RECOMMENDED | PASS | README có 3 mục: backend, AI/502, voice. |

## Danh Sách Lỗi

### Lỗi #1 — BUILD_LOG không có đủ 13 job

- **Loại:** REQUIRED
- **Tiêu chí:** GATE-013 #5
- **Vị trí:** `Task_job/BUILD_LOG.md`, root `BUILD_LOG.md`
- **Quan sát thực tế:** tìm theo header `## JOB-... Log` chỉ thấy `JOB-001` đến `JOB-006`, sau đó nhảy sang `JOB-009`, `JOB-010`, `JOB-011`, `JOB-012`, `JOB-013`. Không có `JOB-007` và `JOB-008`.
- **Mong đợi theo Gate:** BUILD_LOG phải có đủ entry cho toàn bộ 13 job.
- **Gợi ý hướng sửa:** bổ sung entry `JOB-007 Log` và `JOB-008 Log` vào `Task_job/BUILD_LOG.md`; nếu root `BUILD_LOG.md` được dùng làm artifact bàn giao thì đồng bộ luôn file đó. Nội dung phải nêu trạng thái, file đã sửa/tạo, cách kiểm tra và ghi chú reviewer tương tự các job còn lại.

## Khuyến Nghị Cải Thiện

1. README hiện có hướng dẫn chạy và troubleshooting, nhưng chưa có checklist test thủ công 10 bước đúng theo `TASK-013`. Nên thêm một section "Checklist kiểm thử MVP" để người bàn giao kiểm từng luồng: layout, load lesson, authoring, audio, checkpoint đúng/sai, review, classroom chat, voice fallback, API key.
2. README nên ghi thêm lệnh Windows PowerShell tương đương `cp .env.example .env`, ví dụ `Copy-Item .env.example .env`, vì workspace hiện chạy trên Windows.

## Verification

```text
cd backend
node --check server.js
PASS

cd frontend
npm.cmd run build
✓ built in 693ms
```

## Build Log Audit

- Coder ghi `"BUILD_LOG.md (Cập nhật đầy đủ 13 JOB)"`, nhưng thực tế thiếu `JOB-007` và `JOB-008`.
- Không phát hiện dependency mới.

## Hành Động Tiếp Theo

The Brain cần gửi REFINE_LOG cho Coder bổ sung đủ `JOB-007` và `JOB-008` trong BUILD_LOG. Sau đó Reviewer kiểm tra lại Gate #5 và README checklist nếu Coder cập nhật thêm.

---

# RE-REVIEW — JOB-012 sau khi Coder sửa lần cuối

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại, bản sửa cuối Gate #9

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS |
| GATE Criteria (RECOMMENDED) | PASS |
| Build frontend | PASS |
| Contract Compliance | PASS |
| Code Quality | PASS |

> GATE PASS — JOB-012 được chấp nhận.

## Kiểm Tra Lại Lỗi Còn Tồn

Hai nút còn fail ở lần review trước đã được sửa:

- `frontend/src/components/AppShell/AppShell.css:20-33`: `.health-banner button` đã có `min-height: 44px`, `min-width: 80px`, căn giữa nội dung.
- `frontend/src/components/LessonPreview/CompletionOverlay.css:39-53`: `.restart-btn` đã có `min-height: 44px`, `min-width: 120px`, căn giữa nội dung.

Các nhóm nút quan trọng khác vẫn giữ chuẩn 44px: `nav-btn`, `voice-btn`, `submit-btn`, `option-btn`, `replay-btn`, `toggle-chat-btn`, `send-btn`, `tab`, `retry-btn`.

## Kết Luận Theo Gate

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | Không có text tràn khỏi button/card/panel ở viewport 1280x800 | PASS |
| 2 | Không có uncaught JS error trong happy path | PASS |
| 3 | Backend down có thông báo dễ hiểu, không crash | PASS |
| 4 | Lỗi LLM có thông báo dễ hiểu, không crash | PASS |
| 5 | Slide image 404 có placeholder | PASS |
| 6 | Audio 404 không crash, có TTS fallback/skip an toàn | PASS |
| 7 | Speech recognition non-Chrome có fallback rõ | PASS |
| 8 | Chat trái không che preview ở 1280x800 | PASS |
| 9 | Nút bấm tối thiểu 44x44px | PASS |
| 10 | Có loading spinner khi load lesson | PASS |
| 11 | Font body tối thiểu 16px | PASS |

## Verification

```text
cd frontend
npm.cmd run build
✓ built in 724ms
```

## Hành Động Tiếp Theo

The Brain có thể mở GATE-012 và giao JOB-013 cho Coder.

---

# RE-REVIEW — JOB-012 sau khi Coder sửa Gate #9

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại, bản sửa sau review JOB-012 lần 1

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL — Gate #9 vẫn chưa đạt đầy đủ |
| Build frontend | PASS |
| Contract Compliance | FAIL |
| Code Quality | Cần sửa tiếp một điểm nhỏ |

> GATE FAIL — JOB-012 chưa được chấp nhận.

## Kết Quả Kiểm Tra Lại Gate #9

Coder đã sửa đúng phần lớn các nút reviewer nêu lần trước:

- `LessonPlayer.css:1-12`: `.nav-btn` đã có `min-height: 44px`, `min-width: 120px`.
- `VoiceButton.css:5-20`: `.voice-btn` đã có `min-height: 44px`, `min-width: 120px`.
- `CheckpointBox.css:42-55`: `.option-btn` đã có `min-height: 44px`.
- `CheckpointBox.css:77-88`: `.submit-btn` đã có `min-height: 44px`.
- `CheckpointBox.css:150-162`: `.action-btn` đã có `min-height: 44px`.
- `AudioPlayer.css:6-19`: `.replay-btn` đã có `min-height: 44px`, `min-width: 44px`.
- `ClassroomChat.css:32-40`: `.toggle-chat-btn` đã có `min-height: 44px`, `min-width: 44px`.
- `styles.css:179-189`: `.tab` đã có `min-height: 44px`, `min-width: 100px`.

Tuy nhiên vẫn còn button tương tác chưa đạt chuẩn 44x44px:

### Lỗi còn lại — Một số button chưa có kích thước tối thiểu 44x44px

- **Loại:** REQUIRED
- **Tiêu chí:** GATE-012 #9
- **Vị trí:**
  - `frontend/src/components/AppShell/AppShell.css:19` — `.health-banner button`
  - `frontend/src/components/LessonPreview/CompletionOverlay.css:39` — `.restart-btn`
- **Quan sát thực tế:**
  - `.health-banner button` chỉ có `padding: 4px 12px`, `font-size: 12px`, không có `min-height`/`min-width`.
  - `.restart-btn` chỉ có `padding: 12px 24px`, không có `min-height`/`min-width`.
- **Mong đợi theo Gate:** nút bấm cho giáo viên/học sinh nhỏ phải đạt tối thiểu 44x44px. Hai nút này đều là nút tương tác thực tế trong app: retry khi backend lỗi và học lại sau khi hoàn thành.
- **Gợi ý hướng sửa:** thêm `min-height: 44px` và `min-width: 44px` hoặc lớn hơn cho hai selector trên.

## Verification

```text
cd frontend
npm.cmd run build
✓ built in 705ms
```

## Hành Động Tiếp Theo

Coder cần sửa nốt hai selector `.health-banner button` và `.restart-btn`, sau đó submit lại để Reviewer kiểm tra Gate #9 lần cuối.

---

# REVIEW — JOB-012: UX, error handling và responsive

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại, submit JOB-012 của Coder

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL — 8/9 PASS |
| GATE Criteria (RECOMMENDED) | PASS — 2/2 PASS |
| Build frontend | PASS |
| Contract Compliance | FAIL |
| Code Quality | Có vấn đề cần sửa |

> GATE FAIL — JOB-012 cần Coder sửa lại trước khi mở gate.

## Chi Tiết Gate Criteria

| # | Tiêu chí | Loại | Kết quả | Ghi chú |
|---|---|---|---|---|
| 1 | Không có text tràn khỏi button/card/panel ở viewport 1280x800 | REQUIRED | PASS | Layout dùng scroll nội bộ cho panel, không thấy điểm tràn rõ qua CSS hiện tại. |
| 2 | Không có uncaught JS error trong Console ở happy path | REQUIRED | PASS | `npm.cmd run build` pass; không thấy lỗi runtime hiển nhiên trong luồng chính qua đọc code. |
| 3 | Backend down hiển thị `"Không kết nối được backend localhost"` và không crash | REQUIRED | PASS | `App.jsx:24`, `App.jsx:31` có thông báo đúng ý và render error display. |
| 4 | Lỗi LLM hiển thị `"AI đang gặp lỗi, vui lòng thử lại"` và không crash | REQUIRED | PASS | `LeftChatPanel.jsx:45`, `LeftChatPanel.jsx:57` có fallback đúng ý. |
| 5 | Slide image 404 có placeholder, không vỡ layout | REQUIRED | PASS | `SlideViewer.jsx:30-35`, `SlideViewer.css:29` có placeholder khi `imageError`. |
| 6 | Audio 404 không crash; TTS fallback hoặc bỏ qua silently | REQUIRED | PASS | `AudioPlayer.jsx:20-22` bắt `onError` và fallback qua TTS. |
| 7 | Speech recognition lỗi/non-Chrome báo `"Hãy dùng Chrome hoặc nhập bằng bàn phím"` | REQUIRED | PASS | `VoiceButton.jsx:13` có thông báo fallback đúng nội dung. |
| 8 | Cột chat trái không che khuất preview ở 1280x800 | REQUIRED | PASS | `AppShell.css` dùng flex 2 cột, `.left-panel` cố định 400px, `.right-panel` flex. |
| 9 | Nút bấm tối thiểu 44x44px theo WCAG | REQUIRED | FAIL | Nhiều nút quan trọng chưa khai báo kích thước tối thiểu 44px. |
| 10 | Có loading skeleton hoặc spinner khi `/api/lesson` chưa trả response | RECOMMENDED | PASS | `App.jsx:99-101`, `styles.css:194-214` có spinner. |
| 11 | Font body tối thiểu 16px | RECOMMENDED | PASS | `styles.css:12` đặt `body font-size: 16px`. |

## Danh Sách Lỗi

### Lỗi #1 — Nhiều nút quan trọng chưa đạt kích thước tối thiểu 44x44px

- **Loại:** REQUIRED
- **Tiêu chí:** GATE-012 #9
- **Vị trí:**
  - `frontend/src/components/LessonPreview/LessonPlayer.css:41` — `.nav-btn`
  - `frontend/src/components/LessonPreview/VoiceButton.css:5` — `.voice-btn`
  - `frontend/src/components/LessonPreview/CheckpointBox.css:72` — `.submit-btn`
  - `frontend/src/components/LessonPreview/AudioPlayer.css:6` — `.replay-btn`
  - `frontend/src/components/LessonPreview/ClassroomChat.css:31` — `.toggle-chat-btn`
  - `frontend/src/styles.css:177` — `.tab`
- **Quan sát thực tế:** các nút trên chỉ dùng `padding` hoặc `min-height: 40px`, không có `min-height: 44px` và nhiều nút cũng không có `min-width: 44px`.
- **Mong đợi theo GATE:** nút bấm quan trọng cho giáo viên/học sinh phải đạt tối thiểu 44x44px theo WCAG. Hướng dẫn reviewer của Gate còn nêu rõ cần inspect `Submit`, `Next`, `VoiceButton`.
- **Gợi ý hướng sửa:** Coder cần chuẩn hóa CSS cho toàn bộ button tương tác chính, tối thiểu `min-height: 44px` và `min-width: 44px` hoặc class shared tương đương. Ưu tiên sửa `nav-btn`, `voice-btn`, `submit-btn`, `option-btn`, `replay-btn`, `toggle-chat-btn`, `tab`, `health-banner button`.

## Khuyến Nghị Cải Thiện

1. `AudioPlayer.jsx:28` gọi trực tiếp `window.speechSynthesis.cancel()` trong `handleTTS()` mà chưa guard như `ClassroomChat.jsx`. Hiện chưa làm fail Gate #6 vì trình duyệt mục tiêu thường có `speechSynthesis`, nhưng nên thêm guard để fallback audio 404 chắc chắn không crash ở môi trường thiếu API này.
2. CSS dùng nhiều class global trùng tên như `.send-btn` và `.action-btn` ở nhiều component. Build hiện vẫn pass, nhưng rủi ro override ngoài ý muốn cao; nên scope selector theo component cha.

## Verification

```text
cd frontend
npm.cmd run build
✓ built in 697ms
```

## Build Log Audit

- Coder có cập nhật `Task_job/BUILD_LOG.md` cho JOB-012 và đánh dấu DONE.
- Claim "nâng chuẩn kích thước nút bấm 44px" chưa đúng với code hiện tại vì nhiều nút quan trọng chưa có min-size 44x44.
- Không phát hiện dependency mới.

## Hành Động Tiếp Theo

The Brain cần gửi REFINE_LOG cho Coder sửa lỗi Gate #9. Sau khi Coder sửa, Reviewer kiểm tra lại riêng kích thước button và chạy lại build frontend.

---

## REVIEW — JOB-001: Khởi tạo cấu trúc project

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

### Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| GATE Criteria (RECOMMENDED) | PASS |
| Contract Compliance | FAIL |
| Code Quality | Có vấn đề nhỏ |

> GATE FAIL — JOB-001 cần sửa lại.

### Chi Tiết Gate Criteria

| # | Tiêu chí | Loại | Kết quả | Ghi chú |
|---|---|---|---|---|
| 1 | `cd backend && npm install` chạy không lỗi | REQUIRED | PASS | Chạy bằng `npm.cmd install`; `npm` qua PowerShell bị chặn bởi ExecutionPolicy của máy. |
| 2 | `cd backend && npm run dev` khởi động server, console in `Server running on port 3000` | REQUIRED | PASS | `backend/server.js` có log tại dòng 25; chạy `node server.js` và health check thành công. |
| 3 | `GET http://localhost:3000/api/health` trả `{"ok":true}` | REQUIRED | PASS | Thực tế trả `{"ok":true,"service":"ai-lesson-builder-backend","llmConfigured":false}`. |
| 4 | `cd frontend && npm install` chạy không lỗi | REQUIRED | PASS | Chạy bằng `npm.cmd install`. |
| 5 | `cd frontend && npm run dev` khởi động Vite ở port 5173 không lỗi | REQUIRED | FAIL | Trong sandbox, Vite fail: `Cannot read directory "../../../..": Access is denied`. Khi chạy escalated, lệnh không trả lỗi trước timeout, nhưng chưa xác nhận được HTTP 5173. Ngoài ra frontend thiếu `index.html` và file app tối thiểu. |
| 6 | `frontend/vite.config.js` có proxy `/api` -> `http://localhost:3000` | REQUIRED | PASS | Có trong `frontend/vite.config.js`. |
| 7 | `.env` không tồn tại trong git, `.gitignore` có entry `.env` | REQUIRED | BLOCKED/PASS một phần | Không có git repo để kiểm tra trạng thái commit. `backend/.gitignore` có `.env`, nhưng file `backend/.env` đang tồn tại trong workspace. |
| 8 | `backend/.env.example` tồn tại với `PORT`, `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_MODEL` | REQUIRED | PASS | Đủ các biến yêu cầu. |
| 9 | `BUILD_LOG.md` có entry JOB-001 | REQUIRED | PASS | Có entry JOB-001. |
| 10 | Cấu trúc thư mục khớp layout trong `BLUEPRINT.md § 5` | REQUIRED | PASS một phần | Folder chính có đủ, nhưng frontend chưa có file bắt buộc như `index.html`, `src/main.jsx`, `src/App.jsx`, các component file. |
| 11 | `README.md` tồn tại với lệnh chạy ban đầu | RECOMMENDED | PASS | Có lệnh backend/frontend cơ bản. |

### Danh Sách Lỗi

#### Lỗi #1 — Frontend chưa khởi động được xác nhận theo GATE

- **Loại:** REQUIRED
- **Vị trí:** `frontend/vite.config.js`, runtime `npm.cmd run dev -- --host 127.0.0.1`
- **Quan sát thực tế:**
  ```text
  failed to load config from ...\frontend\vite.config.js
  error when starting dev server:
  Error: Build failed with 2 errors:
  error: Cannot read directory "../../../..": Access is denied.
  error: Could not resolve "...frontend\vite.config.js"
  ```
- **Mong đợi theo GATE:**
  ```text
  cd frontend && npm run dev khởi động Vite ở port 5173 không lỗi.
  ```
- **Gợi ý hướng sửa:** kiểm tra khả năng chạy Vite trong đường dẫn hiện tại có dấu cách và thư mục cha bị sandbox hạn chế; thêm frontend app tối thiểu để Vite có entry rõ ràng.

#### Lỗi #2 — Frontend thiếu file app tối thiểu dù folder đã có

- **Loại:** REQUIRED liên quan cấu trúc project
- **Vị trí:** `frontend/`
- **Quan sát thực tế:**
  ```text
  frontend chỉ có package.json, package-lock.json, vite.config.js.
  Không thấy index.html, src/main.jsx, src/App.jsx, styles.css hoặc component files.
  ```
- **Mong đợi theo BLUEPRINT/TASK-001:**
  ```text
  frontend/index.html
  frontend/src/main.jsx
  frontend/src/App.jsx
  frontend/src/styles.css
  các file component/api/state tối thiểu theo layout.
  ```
- **Gợi ý hướng sửa:** tạo Vite React skeleton tối thiểu và các file placeholder theo `BLUEPRINT.md § 5`.

---

## REVIEW — JOB-002: Lesson storage, validation, backup

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

### Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| Pre-check | FAIL |
| GATE Criteria (REQUIRED) | FAIL do thiếu BUILD_LOG JOB-002 |
| Contract Compliance | PASS phần lớn, có điểm cần làm rõ |
| Code Quality | Có vấn đề nhỏ |

> GATE FAIL — JOB-002 chưa được chấp nhận vì thiếu `BUILD_LOG.md` entry cho JOB-002. Các kiểm tra API chính đa số chạy được.

### Pre-check

| Điều kiện | Kết quả | Ghi chú |
|---|---|---|
| Có code/output từ Coder | PASS | Có backend route/service/utils/data. |
| Có `BUILD_LOG.md` | PASS | File tồn tại. |
| `BUILD_LOG.md` có xác nhận JOB-002 DONE | FAIL | Chỉ có entry JOB-001, không có JOB-002. |
| Có GATE cho JOB-002 | PASS | Có trong `GATE_MASTER.md`. |
| Có CONTRACT | PASS | Có `CONTRACT.md`, nhưng trạng thái vẫn pending approval. |

### Chi Tiết Gate Criteria

| # | Tiêu chí | Loại | Kết quả | Ghi chú |
|---|---|---|---|---|
| 1 | `GET /api/lesson` trả `{"ok":true,"lesson":{...}}` từ `lesson.json` | REQUIRED | PASS | Trả `ok=True`, 8 slides. |
| 2 | `PUT /api/lesson` với lesson hợp lệ ghi thành công, trả `updatedLesson` | REQUIRED | BLOCKED/PASS một phần | Ghi thành công và tạo backup, nhưng response trả field `lesson`, không phải `updatedLesson`. `CONTRACT.md` dùng `lesson`; `GATE_MASTER.md` ghi `updatedLesson`, cần Brain làm rõ. |
| 3 | `PUT /api/lesson` thiếu `lessonId` trả `ok:false`, status 422, không ghi file | REQUIRED | PASS | Status 422 quan sát được. |
| 4 | `PUT /api/lesson` với slide thiếu `id` bị reject, không ghi file | REQUIRED | PASS | Status 422 quan sát được. |
| 5 | `PUT /api/lesson` với checkpoint có `reviewSlideId` không tồn tại bị reject | REQUIRED | PASS | Status 422 quan sát được. |
| 6 | Mỗi lần `PUT /api/lesson` hợp lệ tạo backup timestamp | REQUIRED | PASS | Backup count tăng +1. |
| 7 | `GET /api/lesson/backups` trả danh sách backup mới nhất trước | REQUIRED | PASS | Trả `ok=True`, danh sách có file mới nhất đầu tiên. |
| 8 | `POST /api/lesson/restore-last` khôi phục backup mới nhất | REQUIRED | PASS | Trả `ok=True`, `lessonId=ai-la-gi-lop-1`. |
| 9 | Validate fail không tạo backup | REQUIRED | PASS theo code | `lesson.service.js` validate trước backup; chưa đo backup count riêng cho từng invalid request. |
| 10 | `lesson.json` mẫu có ít nhất 8 slide, 2 checkpoint với `reviewSlideId` hợp lệ | REQUIRED | PASS | Có 8 slide, 2 checkpoint; review slide ids: `slide-03`, `slide-07`. |
| 11 | Tất cả field bắt buộc trong slide/checkpoint có trong schema | RECOMMENDED | PASS | Validate kiểm tra các field bắt buộc. |

### Danh Sách Lỗi

#### Lỗi #1 — Thiếu `BUILD_LOG.md` entry cho JOB-002

- **Loại:** REQUIRED / Pre-check
- **Vị trí:** `BUILD_LOG.md`
- **Quan sát thực tế:**
  ```text
  BUILD_LOG.md chỉ có "## JOB-001 Log".
  Không có "## JOB-002 Log", không có trạng thái DONE, file đã sửa, cách kiểm tra cho JOB-002.
  ```
- **Mong đợi theo Reviewer rule và CONTRACT C-09:**
  ```text
  BUILD_LOG.md phải được cập nhật sau mỗi JOB.
  JOB-002 phải có trạng thái DONE trước khi review PASS.
  ```
- **Gợi ý hướng sửa:** Coder bổ sung entry JOB-002 với danh sách file: `lesson.routes.js`, `lesson.service.js`, `validate-lesson.js`, `backup-lesson.js`, `safe-json-parse.js`, `backend/data/lesson.json`, cách kiểm tra API và vấn đề còn lại nếu có.

#### Lỗi #2 — Response `PUT /api/lesson` không khớp nguyên văn GATE-002 tiêu chí #2

- **Loại:** BLOCKED cần Brain làm rõ
- **Vị trí:** `backend/services/lesson.service.js`, dòng 37-41
- **Quan sát thực tế:**
  ```json
  {
    "ok": true,
    "lesson": {},
    "backupPath": "..."
  }
  ```
- **Mong đợi theo `GATE_MASTER.md`:**
  ```text
  PUT /api/lesson với lesson hợp lệ -> ghi thành công, trả updatedLesson.
  ```
- **Mâu thuẫn:** `CONTRACT.md` API contract lại định nghĩa response là `lesson`, không phải `updatedLesson`.
- **Gợi ý hướng xử lý:** The Brain cần chốt một field chuẩn. Nếu theo `CONTRACT.md`, tiêu chí này có thể PASS. Nếu theo `GATE_MASTER.md`, Coder cần đổi response hoặc thêm alias `updatedLesson`.

### Code Quality Summary

| Tiêu chí | Đánh giá | Ghi chú |
|---|---|---|
| Readability | PASS | Code module ngắn, dễ đọc. |
| Error Handling | WARNING | `restoreLastBackup()` gọi `backupLesson()` nhưng không kiểm tra backup fail trước khi ghi restore. |
| Single Responsibility | PASS | Route/service/utils tách hợp lý cho JOB-002. |
| No Obvious Smell | WARNING | `safe-json-parse.js` được tạo nhưng chưa dùng trong JOB-002 flow. |
| Reproducibility | PASS | JSON storage và backup timestamp rõ ràng. |

### BUILD_LOG Audit

- **Giả định của Coder:** JOB-001 đã xong và cấu trúc sẵn sàng cho task tiếp theo.
- **Scope creep phát hiện:** Coder đã triển khai nhiều phần JOB-002 nhưng chưa ghi log.
- **Vấn đề cần escalate lên The Brain:** `CONTRACT.md` vẫn ở trạng thái pending approval; `GATE_MASTER.md` và `CONTRACT.md` mâu thuẫn tên field response `PUT /api/lesson`.

### Hành Động Tiếp Theo

- JOB-001: FAIL. Coder cần tạo frontend app skeleton tối thiểu và bảo đảm `npm run dev` kiểm chứng được.
- JOB-002: FAIL do thiếu BUILD_LOG JOB-002. Sau khi bổ sung log và Brain làm rõ field `lesson` vs `updatedLesson`, có thể review lại nhanh; implementation API hiện đạt phần lớn tiêu chí chức năng.
# RE-REVIEW — JOB-001 và JOB-002 sau khi Coder sửa

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

## Kết Quả Tổng

| JOB | Kết quả | Ghi chú |
|---|---|---|
| JOB-001 | PASS | Skeleton frontend đã có entry point; backend và frontend khởi động được. |
| JOB-002 | PASS | Root `BUILD_LOG.md` đã bổ sung JOB-002; API lesson/validate/backup/restore đạt gate. |

> GATE PASS — JOB-001 và JOB-002 được chấp nhận.

## Kiểm Tra Lại JOB-001

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | `cd backend && npm install` chạy không lỗi | PASS | `npm.cmd install` trả `up to date`. |
| 2 | Backend khởi động server port 3000 | PASS | Chạy `node server.js`, health endpoint phản hồi. |
| 3 | `GET /api/health` trả `ok:true` | PASS | `{"ok":true,"service":"ai-lesson-builder-backend","llmConfigured":false}`. |
| 4 | `cd frontend && npm install` chạy không lỗi | PASS | `npm.cmd install` trả `up to date`. |
| 5 | `cd frontend && npm run dev` khởi động Vite port 5173 | PASS | Chạy ngoài sandbox: `VITE_LISTEN process=21308`, `VITE_HTTP status=200 length=634`. |
| 6 | `vite.config.js` có proxy `/api` -> backend | PASS | Có target `http://localhost:3000`. |
| 7 | `.gitignore` có `.env` | PASS một phần | `backend/.gitignore` có `.env`; root không phải git repo nên không kiểm được trạng thái commit. |
| 8 | `.env.example` đủ biến tối thiểu | PASS | Có `PORT`, `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_MODEL`. |
| 9 | `BUILD_LOG.md` có entry JOB-001 | PASS | Root `BUILD_LOG.md` đã cập nhật. |
| 10 | Cấu trúc thư mục khớp Blueprint | PASS | Đã có `frontend/index.html`, `src/main.jsx`, `src/App.jsx`, `styles.css`, các folder/file placeholder api/components/state. |
| 11 | README có lệnh chạy ban đầu | PASS | Có lệnh backend/frontend. |

## Kiểm Tra Lại JOB-002

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | `GET /api/lesson` trả lesson từ JSON | PASS | `GET_LESSON ok=True slides=8`. |
| 2 | `PUT /api/lesson` hợp lệ ghi thành công, trả `updatedLesson` | PASS | `PUT_VALID ok=True hasUpdatedLesson=True backupDelta=1`. |
| 3 | Thiếu `lessonId` bị reject status 422, không ghi file | PASS | `PUT_MISSING_LESSON_ID status=422`, `INVALID_BACKUP_DELTA=0`. |
| 4 | Slide thiếu `id` bị reject | PASS | `PUT_MISSING_SLIDE_ID status=422`. |
| 5 | `reviewSlideId` không tồn tại bị reject | PASS | `PUT_BAD_REVIEW_ID status=422`. |
| 6 | PUT hợp lệ tạo backup timestamp | PASS | Backup delta tăng 1. |
| 7 | `GET /api/lesson/backups` trả danh sách backup mới nhất trước | PASS | `GET_BACKUPS ok=True count=5 first=lesson-2026-05-19T07-21-20-254Z.json`. |
| 8 | `POST /api/lesson/restore-last` restore được backup | PASS | `RESTORE ok=True lessonId=ai-la-gi-lop-1`. |
| 9 | Validate fail không tạo backup | PASS | Invalid missing `lessonId` có backup delta 0. |
| 10 | Lesson mẫu có ít nhất 8 slide, 2 checkpoint | PASS | 8 slide, 2 checkpoint. |
| 11 | Field bắt buộc trong schema được validate | PASS | `validate-lesson.js` kiểm tra root, slide, checkpoint và cross-reference `reviewSlideId`. |

## BUILD_LOG Audit Sau Sửa

- Root `BUILD_LOG.md` đã có `JOB-001 Log` và `JOB-002 Log`, đều ở trạng thái `DONE`.
- `Task_job/BUILD_LOG.md` vẫn là bản cũ chỉ có `JOB-001`; nếu `Task_job` được dùng làm artifact store chính thì cần đồng bộ để tránh nhầm report.
- Không còn lỗi blocking từ review trước.

## Hành Động Tiếp Theo

The Brain có thể mở gate tiếp theo và giao JOB-003 cho Coder.

---

# REVIEW — JOB-003: LLM adapter và prompt utilities

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL — 9/10 tiêu chí đạt, 1 tiêu chí REQUIRED fail |
| GATE Criteria (RECOMMENDED) | PASS |
| Contract Compliance | FAIL do lỗi REQUIRED #6 |
| Code Quality | Có vấn đề nhỏ |

> GATE FAIL — JOB-003 cần sửa lại.

## Chi Tiết Gate Criteria

| # | Tiêu chí | Loại | Kết quả | Ghi chú |
|---|---|---|---|---|
| 1 | `callLLM({systemPrompt, userPrompt})` hoạt động với `LLM_PROVIDER=mock`, không gọi API ngoài | REQUIRED | PASS | Script trực tiếp trả string JSON từ mock: `MOCK_TEXT_IS_STRING=true`. |
| 2 | `callLLMForJSON({...})` trả object khi JSON hợp lệ; throw khi text rác | REQUIRED | PASS | Mock JSON parse được; monkey patch `callLLM` trả `not json` thì throw `LLM returned invalid JSON format`. |
| 3 | `safeJsonParse` xử lý markdown fence | REQUIRED | PASS | `safeJsonParse('```json\n{"a":1}\n```').a` trả `1`. |
| 4 | `safeJsonParse` trả `null` cho JSON không hợp lệ | REQUIRED | PASS | `safeJsonParse('abc') === null`. |
| 5 | Timeout (`LLM_TIMEOUT`) được xử lý | REQUIRED | PASS một phần | Code truyền `timeout: this.timeout` vào cả OpenAI/Gemini/Anthropic axios calls. Chưa có wrapper đổi Axios timeout thành error type riêng. |
| 6 | API key không có -> lỗi `LLMConfigError` rõ ràng, không crash server | REQUIRED | FAIL | Thực tế ném generic `Error`, `name=Error`, message `LLM_API_KEY is missing in environment configuration`. |
| 7 | Provider không nhận dạng được -> lỗi rõ ràng | REQUIRED | PASS | Với `LLM_PROVIDER=xyz`, `LLM_API_KEY=fake`, ném `Unknown LLM provider: xyz`. |
| 8 | `prompt-builder.js` export đủ 5 hàm | REQUIRED | PASS | Cả 5 export đều là function. |
| 9 | Không có API key trong `frontend/src/` | REQUIRED | PASS | `rg "LLM_API_KEY|api_key|apiKey|sk-|AIza|anthropic" frontend/src` không có kết quả. |
| 10 | Adapter dễ mở rộng provider mới qua function + providers map | RECOMMENDED | PASS | Có `providers` map trong `llm.service.js`. |

## Danh Sách Lỗi

### Lỗi #1 — Missing API key không dùng `LLMConfigError`

- **Loại:** REQUIRED
- **Vị trí:** `backend/services/llm.service.js`, hàm `_validateConfig()`, dòng ~41-44
- **Quan sát thực tế:**
  ```text
  NO_KEY_THROW=true
  name=Error
  message=LLM_API_KEY is missing in environment configuration
  ```
- **Mong đợi theo GATE-003 tiêu chí #6:**
  ```text
  API key không có -> lỗi LLMConfigError rõ ràng, không crash server.
  ```
- **Gợi ý hướng sửa:** tạo class lỗi cấu hình riêng tên `LLMConfigError` hoặc set `error.name = 'LLMConfigError'`, rồi dùng lỗi đó trong `_validateConfig()` khi thiếu key hoặc config LLM không hợp lệ.

## Code Quality Summary

| Tiêu chí | Đánh giá | Ghi chú |
|---|---|---|
| Readability | PASS | Module ngắn, provider adapter dễ đọc. |
| Error Handling | WARNING | Có timeout axios, nhưng lỗi config hiện là generic `Error`; timeout cũng chưa được normalize thành lỗi domain rõ ràng. |
| Single Responsibility | PASS | `llm.service.js`, `prompt-builder.js`, `safe-json-parse.js`, `json-response.js` tách hợp lý. |
| No Obvious Smell | WARNING | `llm.service.js` export singleton đọc env tại constructor; nếu test/runtime đổi env sau khi require thì cần clear cache. Chấp nhận được trong app thật nhưng cần chú ý test. |
| Reproducibility | PASS | Mock provider cho phép test không cần API key thật. |

## BUILD_LOG Audit

- Root `BUILD_LOG.md` có `JOB-003 Log`, trạng thái `DONE`.
- `Task_job/BUILD_LOG.md` vẫn là bản cũ, chưa có `JOB-002` và `JOB-003`. Nếu `Task_job` là artifact store chính, cần đồng bộ file này.
- Không phát hiện scope creep nghiêm trọng.

## Hành Động Tiếp Theo

The Brain chưa nên mở JOB-004. Coder cần sửa lỗi `LLMConfigError` cho tiêu chí REQUIRED #6, sau đó submit lại JOB-003 để review nhanh.

---

# RE-REVIEW — JOB-003 sau khi Coder sửa

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS — 9/9 REQUIRED đạt |
| GATE Criteria (RECOMMENDED) | PASS |
| Contract Compliance | PASS |
| Code Quality | Có cảnh báo nhỏ, không blocking |

> GATE PASS — JOB-003 được chấp nhận.

## Kiểm Tra Lại Gate Criteria

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | `callLLM` hoạt động với `LLM_PROVIDER=mock` | PASS | `MOCK_TEXT_IS_STRING=true`. |
| 2 | `callLLMForJSON` parse JSON và throw khi text rác | PASS | `MOCK_JSON_HAS_REPLY=true`, `INVALID_JSON_THROW=true`. |
| 3 | `safeJsonParse` xử lý markdown fence | PASS | `FENCE_PARSE_A=1`. |
| 4 | `safeJsonParse` trả `null` với JSON không hợp lệ | PASS | `BAD_PARSE_NULL=true`. |
| 5 | Timeout được cấu hình | PASS | `llm.service.js` truyền `timeout: this.timeout` cho OpenAI/Gemini/Anthropic axios calls. |
| 6 | Thiếu API key -> `LLMConfigError` rõ ràng | PASS | `NO_KEY_THROW=true name=LLMConfigError message=LLM_API_KEY is missing in environment configuration`. |
| 7 | Provider không nhận dạng -> lỗi rõ ràng | PASS | `BAD_PROVIDER_THROW=true name=LLMConfigError message=Unknown LLM provider: xyz`. |
| 8 | `prompt-builder.js` export đủ 5 hàm | PASS | `PROMPT_EXPORTS=true,true,true,true,true`. |
| 9 | Không có API key trong `frontend/src/` | PASS | `rg "LLM_API_KEY|api_key|apiKey|sk-|AIza|anthropic" frontend/src` không có kết quả. |
| 10 | Adapter dễ mở rộng provider mới | PASS | Có `providers` map trong `llm.service.js`. |

## Code Quality Summary

| Tiêu chí | Đánh giá | Ghi chú |
|---|---|---|
| Readability | PASS | Lỗi cấu hình được tách bằng `LLMConfigError`, code rõ hơn. |
| Error Handling | PASS một phần | Config error đã rõ; timeout vẫn dựa trên Axios timeout, chấp nhận theo GATE-003. |
| Single Responsibility | PASS | Module LLM, prompt builder, parser và response helper tách riêng. |
| No Obvious Smell | WARNING | `llm.service.js` vẫn export singleton đọc env tại constructor; khi test đổi env cần clear require cache. Không block. |
| Reproducibility | PASS | Mock provider hoạt động không cần API key thật. |

## BUILD_LOG Audit Sau Sửa

- Root `BUILD_LOG.md` và `Task_job/BUILD_LOG.md` đều đã có entry `JOB-003`.
- Không còn lỗi blocking từ review trước.

## Hành Động Tiếp Theo

The Brain có thể mở GATE-003 và giao JOB-004 cho Coder.

---

# REVIEW — JOB-004: Backend authoring AI

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| Contract Compliance | FAIL |
| Code Quality | Cần cải thiện |

> GATE FAIL — JOB-004 cần sửa lại.

## Chi Tiết Gate Criteria

| # | Tiêu chí | Loại | Kết quả | Ghi chú |
|---|---|---|---|---|
| 1 | `POST /api/ai/authoring` với `{message,currentSlideId}` trả `{ok:true, assistantMessage, changeSummary, updatedLesson}` | REQUIRED | PASS | Endpoint trả `200`, `ok:true`, có các field yêu cầu. |
| 2 | `updatedLesson` trong response pass validate | REQUIRED | PASS theo validate hiện tại | `updatedLesson` mock có 1 slide và pass `validate-lesson.js`. |
| 3 | Sau request thành công, `lesson.json` được cập nhật trên disk | REQUIRED | PASS | Request thành công đã ghi `lesson.json`. |
| 4 | Backup được tạo trước khi ghi lesson mới | REQUIRED | PASS | `BACKUP_DELTA=1`. |
| 5 | Nếu LLM trả lesson sai schema -> giữ lesson cũ, trả `ok:false`, status 422 | REQUIRED | CHƯA KIỂM ĐỦ | Code path có xử lý qua `lessonService.updateLesson`, nhưng mock hiện không có chế độ trả invalid schema để test qua API. |
| 6 | Nếu LLM timeout/lỗi API -> trả `ok:false`, status 502; lesson không bị xóa | REQUIRED | CHƯA KIỂM ĐỦ | Code route map lỗi không chứa `invalid` sang 502, nhưng chưa test runtime với provider lỗi. |
| 7 | Prompt authoring gửi LLM có context lesson hiện tại | REQUIRED | PASS | `authoring.service.js` dùng `buildAuthoringUserPrompt(message, currentLesson, currentSlideId)`. |
| 8 | `assistantMessage` là text, không phải JSON thô | REQUIRED | PASS | Response trả text `"Tôi đã hiểu yêu cầu..."`. |
| 9 | Authoring không xóa slide nếu message chỉ yêu cầu thêm checkpoint | REQUIRED | FAIL | Prompt `"Thêm checkpoint cho slide 4"` làm `lesson.json` từ 8 slide thành mock lesson 1 slide. |

## Danh Sách Lỗi

### Lỗi #1 — Authoring xóa/thay toàn bộ bài học khi chỉ yêu cầu thêm checkpoint

- **Loại:** REQUIRED
- **Vị trí:** `backend/services/llm.service.js`, mock response trong `_mockResponse()`; luồng ghi tại `backend/services/authoring.service.js`
- **Quan sát thực tế:**
  ```text
  Request:
  POST /api/ai/authoring
  {"message":"Thêm checkpoint cho slide 4","currentSlideId":"slide-04"}

  Response:
  ok=true
  updatedLesson.lessonId="mock-lesson"
  updatedLesson.slides.length=1

  Side effect:
  lesson.json bị ghi thành lesson mock 1 slide.
  Trước test lesson mẫu có 8 slide, 2 checkpoint.
  ```
- **Mong đợi theo GATE-004 tiêu chí #9:**
  ```text
  Authoring không xóa slide nếu message chỉ yêu cầu thêm checkpoint.
  Với yêu cầu thêm checkpoint cho slide-04, lesson phải giữ nguyên các slide hiện có và chỉ cập nhật checkpoint/nội dung liên quan.
  ```
- **Gợi ý hướng sửa:** mock provider cho authoring phải trả `updatedLesson` dựa trên `currentLesson` trong prompt, không trả lesson hard-coded. Tối thiểu trong mock nên parse lesson hiện tại từ userPrompt hoặc để `authoring.service.js` có guard chống thay thế lesson hàng loạt khi user chỉ yêu cầu thêm checkpoint.

### Lỗi #2 — `restore-last` không khôi phục đúng bản trước khi test vì backup mock mới nhất bị chọn lại

- **Loại:** WARNING phát hiện trong quá trình cleanup, liên quan JOB-002 nhưng ảnh hưởng review JOB-004
- **Vị trí:** `backend/services/lesson.service.js`, `restoreLastBackup()`
- **Quan sát thực tế:**
  ```text
  POST /api/lesson/restore-last
  RESTORE ok=True lessonId=mock-lesson slides=1
  ```
  Sau khi authoring ghi mock lesson, restore-last vẫn khôi phục mock vì backup mới nhất cũng là mock.
- **Mong đợi:**
  ```text
  Restore latest meaningful backup trước thay đổi lỗi, hoặc tránh backup current broken state thành latest rồi restore nhầm.
  ```
- **Gợi ý hướng sửa:** lọc backup đích trước khi tạo backup current, hoặc API restore cần nhận tên backup cụ thể. Tôi đã khôi phục thủ công workspace về backup 8 slide `lesson-2026-05-19T07-34-36-091Z.json`.

## Code Quality Summary

| Tiêu chí | Đánh giá | Ghi chú |
|---|---|---|
| Readability | PASS | Route/service dễ đọc. |
| Error Handling | WARNING | Lỗi LLM/invalid schema có xử lý, nhưng chưa đủ test hook để ép mock trả invalid schema. |
| Single Responsibility | PASS | `authoring.service.js` điều phối đúng tầng. |
| No Obvious Smell | FAIL | Mock authoring hard-code lesson mới và có thể phá dữ liệu bài học thật. |
| Reproducibility | WARNING | Test authoring có side effect ghi `lesson.json`; cần mock an toàn hơn. |

## BUILD_LOG Audit

- `BUILD_LOG.md` và `Task_job/BUILD_LOG.md` đều có `JOB-004 DONE`.
- Coder ghi “Flow Authoring đã khép kín: Chat -> AI -> Validate -> Backup -> Write -> Response”, nhưng thiếu kiểm tra không phá lesson hiện tại.
- Scope creep/data corruption risk: request thêm checkpoint dẫn tới thay toàn bộ bài học bằng mock lesson.

## Hành Động Tiếp Theo

The Brain chưa nên mở GATE-004. Coder cần sửa mock authoring và/hoặc guard trong `authoring.service.js` để đảm bảo yêu cầu thêm checkpoint không xóa slide hiện có. Sau khi sửa, cần test lại:

1. Bắt đầu với lesson 8 slide.
2. Gọi `POST /api/ai/authoring` với `"Thêm checkpoint cho slide 4"`.
3. Response `ok:true`.
4. `updatedLesson.slides.length` vẫn là 8 hoặc nhiều hơn nếu thật sự thêm slide theo yêu cầu.
5. `slide-04` có checkpoint mới/cập nhật.
6. Backup tăng 1 và lesson cũ có thể khôi phục được.

---

# RE-REVIEW — JOB-004 sau khi Coder sửa

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS |
| Contract Compliance | PASS |
| Code Quality | Có cảnh báo nhỏ, không blocking |

> GATE PASS — JOB-004 được chấp nhận.

## Kiểm Tra Lại Gate Criteria

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | `POST /api/ai/authoring` trả `{ok:true, assistantMessage, changeSummary, updatedLesson}` | PASS | `AUTHORING ok=True hasAssistant=True hasSummary=True`. |
| 2 | `updatedLesson` pass validate | PASS | Request thành công qua `lessonService.updateLesson`, tức validate đã pass. |
| 3 | Request thành công cập nhật `lesson.json` trên disk | PASS | `slide-04` có checkpoint `cp-04-mock` sau request. |
| 4 | Backup được tạo trước khi ghi lesson mới | PASS | `backupDelta=1`. |
| 5 | LLM trả lesson sai schema -> giữ lesson cũ, trả lỗi | PASS | Monkey patch `callLLMForJSON` trả `slides: []` cho kết quả `ok:false`, `error:"LLM returned an invalid lesson update"`, `lessonChanged:false`. Route code map lỗi có chữ `invalid` sang HTTP 422. |
| 6 | LLM/provider error -> trả lỗi và không xóa lesson | PASS | Với `LLM_PROVIDER=xyz`, service trả `ok:false`, `error:"AI Authoring failed"`, `details:"Unknown LLM provider: xyz"`, `lessonChanged:false`. Route code map lỗi này sang HTTP 502. |
| 7 | Prompt authoring có context lesson hiện tại | PASS | `authoring.service.js` dùng `buildAuthoringUserPrompt(message, currentLesson, currentSlideId)`. |
| 8 | `assistantMessage` là text, không phải JSON thô | PASS | Response có assistant text. |
| 9 | Không xóa slide khi chỉ thêm checkpoint | PASS | Trước request 8 slide, sau request vẫn 8 slide: `slidesBefore=8 slidesAfter=8 cp04=cp-04-mock`. |

## Code Quality Summary

| Tiêu chí | Đánh giá | Ghi chú |
|---|---|---|
| Readability | PASS | Route/service rõ ràng. |
| Error Handling | PASS | Invalid schema và provider error đều không làm đổi lesson. |
| Single Responsibility | PASS | Authoring service điều phối, lesson service validate/backup/write. |
| No Obvious Smell | WARNING | Mock parse JSON từ prompt bằng regex `\{[\s\S]*\}`; đủ cho test hiện tại nhưng không nên dùng cho provider thật. |
| Reproducibility | PASS | Mock provider đã patch dựa trên lesson hiện tại, không còn hard-code thay toàn bộ lesson. |

## BUILD_LOG Audit Sau Sửa

- `BUILD_LOG.md` và `Task_job/BUILD_LOG.md` đều có `JOB-004 DONE`.
- Lỗi blocking trước đó đã được xử lý: mock authoring giữ nguyên lesson hiện tại và chỉ thêm/cập nhật checkpoint liên quan.

## Hành Động Tiếp Theo

The Brain có thể mở GATE-004 và giao JOB-005 cho Coder.

---

# REVIEW — JOB-005: Backend classroom chat và voice

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS |
| GATE Criteria (RECOMMENDED) | PASS |
| Contract Compliance | PASS |
| Code Quality | Có cảnh báo nhỏ, không blocking |

> GATE PASS — JOB-005 được chấp nhận.

## Chi Tiết Gate Criteria

| # | Tiêu chí | Loại | Kết quả | Bằng chứng |
|---|---|---|---|---|
| 1 | `POST /api/chat` trả `{ok:true, reply, scope, speak}` | REQUIRED | PASS | `CHAT ok=True hasReply=True scope=in_lesson speakType=Boolean`. |
| 2 | `reply` là text, không phải JSON thô | REQUIRED | PASS | `replyStartsJson=False`. |
| 3 | `scope` có giá trị `in_lesson` hoặc `redirected` | REQUIRED | PASS | Runtime trả `scope=in_lesson`. |
| 4 | Prompt gửi LLM có `lessonTitle`, `targetLearner`, `currentSlideTitle`, `knowledgePoint` | REQUIRED | PASS | Monkey patch xác nhận đủ 4 context field đều có giá trị. |
| 5 | `POST /api/voice/chat` trả cùng format với `/api/chat` | REQUIRED | PASS | `VOICE ok=True hasReply=True scope=in_lesson speakType=Boolean`. |
| 6 | `chatHistory` được đưa vào context | REQUIRED | PASS | Captured user prompt có cả `Câu trước` và `Trả lời trước`. |
| 7 | LLM error trả `{ok:false,error:"..."}`, không crash server | REQUIRED | PASS | Monkey patch LLM throw: service trả `ok:false`, `error:"AI Assistant is currently unavailable"`, `details:"mock llm failure"`. Route map lỗi sang HTTP 502. |
| 8 | `speak` field là boolean | RECOMMENDED | PASS | Runtime trả `Boolean`. |

## Code Quality Summary

| Tiêu chí | Đánh giá | Ghi chú |
|---|---|---|
| Readability | PASS | `chat.service.js`, `voice.service.js`, routes ngắn và rõ. |
| Error Handling | PASS | LLM error được catch và không làm crash service. |
| Single Responsibility | PASS | Voice service tái dùng chat service đúng phạm vi MVP. |
| No Obvious Smell | WARNING | `lessonId` nhận từ request chưa được đối chiếu với `lesson.lessonId`; MVP một lesson nên chưa blocking. |
| Reproducibility | PASS | Mock provider cho phép test không cần API key thật. |

## BUILD_LOG Audit

- `BUILD_LOG.md` và `Task_job/BUILD_LOG.md` đều có `JOB-005 DONE`.
- Không phát hiện scope creep.
- Không có vấn đề cần escalate lên The Brain.

## Hành Động Tiếp Theo

The Brain có thể mở GATE-005 và giao JOB-006 cho Coder.

---

# REVIEW — JOB-006: Backend answer evaluation và question generation

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| GATE Criteria (RECOMMENDED) | FAIL |
| Contract Compliance | FAIL |
| Code Quality | Cần cải thiện |

> GATE FAIL — JOB-006 cần sửa lại.

## Chi Tiết Gate Criteria

| # | Tiêu chí | Loại | Kết quả | Bằng chứng |
|---|---|---|---|---|
| 1 | `POST /api/answer/evaluate` trả `{ok,isCorrect,feedback,shouldReview,reviewSlideId,nextAction}` | REQUIRED | PASS | `EVAL_RIGHT ok=True isCorrect=True nextAction=continue`. |
| 2 | `nextAction` chỉ là `continue` hoặc `review` | REQUIRED | PASS | Runtime trả `continue`. |
| 3 | Đánh giá mềm: `classAnswer="Có ạ"` với `correctAnswer="Có"` -> `isCorrect:true` | REQUIRED | PASS | `EVAL_RIGHT ... isCorrect=True`. |
| 4 | Khi `isCorrect:false`, `reviewSlideId` là slide tồn tại | REQUIRED | FAIL | Với `classAnswer="Không"`, API vẫn trả `isCorrect=True`, `nextAction=continue`, `reviewSlideId=null`. Không có luồng sai. |
| 5 | `feedback` là text thân thiện, phù hợp độ tuổi | REQUIRED | PASS một phần | Có feedback text, nhưng chỉ feedback đúng; chưa có feedback sai. |
| 6 | `POST /api/question/generate` trả checkpoint đủ fields | REQUIRED | FAIL | `GEN ok=True cpId=... type=` rỗng, `hasQuestion=False`, `optionsCount=0`, `correct=False`, `reviewSlideId=` rỗng. |
| 7 | `POST /api/question/regenerate` trả câu hỏi khác formulation với generate | REQUIRED | FAIL | `questionSame=True`; thực tế cả hai đều thiếu `question`. |
| 8 | LLM trả JSON sai trong evaluate -> `{ok:false}`, không crash | REQUIRED | PASS | Monkey patch LLM throw `bad json`: service trả `{"ok":false,"error":"Evaluation failed","details":"bad json"}`. |
| 9 | `type: short_text` generate không có options hoặc `options:null` | RECOMMENDED | FAIL/CHƯA ĐẠT | Generate hiện không tạo checkpoint schema hợp lệ cho cả multiple_choice, nên short_text chưa đạt. |

## Danh Sách Lỗi

### Lỗi #1 — Trả lời sai vẫn được đánh giá đúng

- **Loại:** REQUIRED
- **Vị trí:** `backend/services/llm.service.js`, `_mockResponse()`, dòng ~169-176
- **Quan sát thực tế:**
  ```text
  Request /api/answer/evaluate:
  correctAnswer = "Có"
  classAnswer = "Không"

  Response:
  EVAL_WRONG ok=True isCorrect=True nextAction=continue reviewSlideId=
  ```
- **Mong đợi theo GATE-006:**
  ```text
  Với câu trả lời sai, response phải có isCorrect:false,
  nextAction:"review", và reviewSlideId là slide tồn tại trong lesson.
  ```
- **Gợi ý hướng sửa:** mock evaluation cần xét `classAnswer` so với `correctAnswer` ở mức tối thiểu. Nếu sai, trả `isCorrect:false`, `shouldReview:true`, `reviewSlideId` lấy từ checkpoint hiện tại hoặc fallback slide hợp lệ.

### Lỗi #2 — Question generation không trả checkpoint schema bắt buộc

- **Loại:** REQUIRED
- **Vị trí:** `backend/services/question.service.js` và `backend/services/llm.service.js`
- **Quan sát thực tế:**
  ```text
  GEN ok=True
  cpId=cp-slide-04-gen-1779178542709
  type=
  hasQuestion=False
  optionsCount=0
  correct=False
  reviewSlideId=
  ```
- **Mong đợi theo GATE-006:**
  ```text
  checkpoint phải có id, type, question, options nếu multiple_choice,
  correctAnswer, explanation, wrongFeedback, reviewSlideId.
  ```
- **Gợi ý hướng sửa:** mock LLM cần nhận diện prompt sinh câu hỏi và trả object checkpoint đầy đủ. `question.service.js` cũng nên validate checkpoint output trước khi trả `ok:true`.

### Lỗi #3 — Regenerate không tạo câu hỏi khác

- **Loại:** REQUIRED
- **Vị trí:** `backend/services/question.service.js`, `regenerateQuestion()`
- **Quan sát thực tế:**
  ```text
  REGEN ok=True cpId=cp-slide-04-gen-1779178542719 questionSame=True
  ```
- **Mong đợi theo GATE-006:**
  ```text
  /api/question/regenerate trả checkpoint khác formulation so với lần generate trước.
  ```
- **Gợi ý hướng sửa:** thêm instruction riêng cho regenerate, ví dụ truyền `isRegenerate` hoặc prompt “tạo câu hỏi tương tự nhưng diễn đạt khác”; mock cũng phải trả `question` khác giữa generate/regenerate.

## Code Quality Summary

| Tiêu chí | Đánh giá | Ghi chú |
|---|---|---|
| Readability | PASS | Code route/service ngắn và dễ đọc. |
| Error Handling | WARNING | Evaluate catch được lỗi JSON; question generation chưa validate output schema trước khi `ok:true`. |
| Single Responsibility | PASS | Answer và question service tách đúng concern. |
| No Obvious Smell | FAIL | `regenerateQuestion()` chỉ gọi lại `generateQuestion()` không khác logic; mock LLM không hỗ trợ question generation schema. |
| Reproducibility | WARNING | Mock provider chưa đủ behavior để test luồng sai và sinh câu hỏi. |

## BUILD_LOG Audit

- `BUILD_LOG.md` và `Task_job/BUILD_LOG.md` đều có `JOB-006 DONE`.
- Coder ghi “checkpoint đầy đủ fields” nhưng runtime API không trả đủ fields.
- Coder ghi đã kiểm tra `classAnswer` gần đúng -> đúng, nhưng chưa kiểm tra câu trả lời sai.

## Hành Động Tiếp Theo

The Brain chưa nên mở GATE-006. Coder cần sửa:

1. Mock/evaluation logic để câu trả lời sai trả `isCorrect:false`, `nextAction:"review"`, `reviewSlideId` hợp lệ.
2. `question.service.js` hoặc mock LLM để `/api/question/generate` trả checkpoint đủ schema.
3. `/api/question/regenerate` phải tạo câu hỏi khác formulation với `generate`.
4. Validate checkpoint output trước khi trả `ok:true`; thiếu field bắt buộc thì trả `ok:false`.

---

# RE-REVIEW — JOB-006 sau khi Coder sửa

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| GATE Criteria (RECOMMENDED) | PASS |
| Contract Compliance | FAIL |
| Code Quality | Cần sửa thêm một lỗi blocking |

> GATE FAIL — JOB-006 vẫn cần sửa lại.

## Kiểm Tra Lại Gate Criteria

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | `POST /api/answer/evaluate` trả đủ field | PASS | Response có `ok`, `isCorrect`, `feedback`, `shouldReview`, `reviewSlideId`, `nextAction`. |
| 2 | `nextAction` chỉ là `continue` hoặc `review` | PASS | Runtime trả `continue` hoặc `review`. |
| 3 | `classAnswer="Có ạ"` với `correctAnswer="Có"` -> `isCorrect:true` | PASS | `EVAL_RIGHT ok=True isCorrect=True nextAction=continue`. |
| 4 | Khi `isCorrect:false`, `reviewSlideId` là slide tồn tại | FAIL theo case bắt buộc | Với `classAnswer="Không"`, API vẫn trả `isCorrect=True`, `nextAction=continue`, `reviewSlideId=null`. |
| 5 | `feedback` là text thân thiện | PASS một phần | Có feedback đúng và feedback sai khi classAnswer chứa chữ `sai`. |
| 6 | `/api/question/generate` trả checkpoint đủ schema | PASS | `GEN ok=True`, có `type=multiple_choice`, `question`, `optionsCount=2`, `correctAnswer`, `explanation`, `wrongFeedback`, `reviewSlideId=slide-02`. |
| 7 | `/api/question/regenerate` trả formulation khác | PASS | `REGEN ... questionSame=False`. |
| 8 | LLM trả JSON sai trong evaluate -> `ok:false`, không crash | PASS từ review trước | Monkey patch LLM throw trả `ok:false`, không crash. |
| 9 | `short_text` không có options hoặc `options:null` | PASS | `SHORT ok=True type=short_text options=null`. |

## Lỗi Blocking Còn Lại

### Lỗi #1 — Câu trả lời “Không” vẫn bị đánh giá đúng

- **Loại:** REQUIRED
- **Vị trí:** `backend/services/llm.service.js`, mock evaluation branch trong `_mockResponse()`
- **Quan sát thực tế:**
  ```text
  ANS=Không isCorrect=True nextAction=continue reviewSlideId=
  ANS=sai isCorrect=False nextAction=review reviewSlideId=slide-03
  ANS=Không đúng isCorrect=True nextAction=continue reviewSlideId=
  ```
- **Mong đợi theo GATE-006:**
  ```text
  Test evaluate sai: đổi classAnswer thành "Không" -> phải trả isCorrect:false, reviewSlideId hợp lệ.
  ```
- **Gợi ý hướng sửa:** logic mock đang không nhận diện được chuỗi tiếng Việt `"Không"` trong `classAnswer`. Coder cần sửa phần extract/normalize `classAnswer` để nhận diện cả `"Không"`, `"không"`, `"Không đúng"`, không phụ thuộc vào mojibake hoặc regex sai encoding.

## Ghi Nhận Các Phần Đã Sửa Thành Công

- `/api/question/generate` đã trả checkpoint đủ schema.
- `/api/question/regenerate` đã tạo câu hỏi khác formulation.
- `short_text` trả `options:null`, đạt tiêu chí recommended.
- Case `classAnswer="sai"` đã trả `isCorrect:false`, `nextAction=review`, `reviewSlideId=slide-03`.

## Hành Động Tiếp Theo

The Brain chưa nên mở GATE-006. Coder chỉ cần sửa tiếp evaluation mock để case `classAnswer="Không"` và `"Không đúng"` trả sai đúng theo gate, sau đó submit lại để review nhanh.

---

# RE-REVIEW LẦN 2 — JOB-006 sau khi Coder sửa tiếp

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| GATE Criteria (RECOMMENDED) | PASS |
| Contract Compliance | FAIL |

> GATE FAIL — JOB-006 vẫn chưa được chấp nhận.

## Kiểm Tra Lại Lỗi Còn Lại

Coder đã thêm logic:

```js
const isWrong = classAnswer.includes('không') ||
                classAnswer.includes('sai') ||
                classAnswer.includes('no') ||
                classAnswer.includes('chưa');
```

Tuy nhiên khi chạy trực tiếp service trong cùng process, input tiếng Việt vẫn bị trích xuất thành dạng mojibake:

```text
[LLM Mock] Extracted classAnswer: "kh?ng"
ANS=Không ok=true isCorrect=true nextAction=continue reviewSlideId=

[LLM Mock] Extracted classAnswer: "kh?ng ??ng"
ANS=Không đúng ok=true isCorrect=true nextAction=continue reviewSlideId=

[LLM Mock] Extracted classAnswer: "sai"
ANS=sai ok=true isCorrect=false nextAction=review reviewSlideId=slide-03
```

## Kết Luận Theo Gate

| Case | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|
| `classAnswer="Có ạ thưa cô"` | `isCorrect:true`, `nextAction:"continue"` | PASS | PASS |
| `classAnswer="Không"` | `isCorrect:false`, `nextAction:"review"`, `reviewSlideId` hợp lệ | `isCorrect:true`, `nextAction:"continue"` | FAIL |
| `classAnswer="Không đúng"` | `isCorrect:false`, `nextAction:"review"`, `reviewSlideId` hợp lệ | `isCorrect:true`, `nextAction:"continue"` | FAIL |
| `classAnswer="sai"` | `isCorrect:false`, `nextAction:"review"` | PASS | PASS |

Các phần khác vẫn đạt từ lần re-review trước:

- `/api/question/generate` trả checkpoint đủ schema.
- `/api/question/regenerate` tạo câu hỏi khác.
- `short_text` trả `options:null`.

## Hành Động Tiếp Theo

Coder cần sửa nhận diện phủ định để robust với tiếng Việt có dấu và trường hợp bị mất dấu/mojibake. Tối thiểu nên nhận diện thêm các dạng:

- `không`
- `khong`
- `kh?ng`
- `ko`
- `không đúng`
- `khong dung`
- `kh?ng ??ng`

Sau khi sửa, test bắt buộc phải có:

```text
ANS=Không isCorrect=false nextAction=review reviewSlideId=slide-03
ANS=Không đúng isCorrect=false nextAction=review reviewSlideId=slide-03
```

---

# RE-REVIEW LẦN 3 — JOB-006 sau khi Coder sửa nhận diện phủ định

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại, không có git repository tại root

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS |
| GATE Criteria (RECOMMENDED) | PASS |
| Contract Compliance | PASS |
| Code Quality | Có cảnh báo nhỏ, không blocking |

> GATE PASS — JOB-006 được chấp nhận.

## Kiểm Tra Lại Lỗi Blocking

Kết quả qua service trực tiếp:

```text
SERVICE ANS=Không ok=true isCorrect=false nextAction=review reviewSlideId=slide-03
SERVICE ANS=Không đúng ok=true isCorrect=false nextAction=review reviewSlideId=slide-03
SERVICE ANS=sai ok=true isCorrect=false nextAction=review reviewSlideId=slide-03
```

Kết quả qua API runtime:

```text
API ANS=Có ạ thưa cô ok=True isCorrect=True nextAction=continue reviewSlideId=
API ANS=Không ok=True isCorrect=False nextAction=review reviewSlideId=slide-03
API ANS=Không đúng ok=True isCorrect=False nextAction=review reviewSlideId=slide-03
API ANS=sai ok=True isCorrect=False nextAction=review reviewSlideId=slide-03
```

## Kiểm Tra Lại Question Generation

```text
GEN ok=True fields=True/True/True/True/True/True/True options=2
REGEN ok=True questionSame=False
SHORT ok=True type=short_text options=null
```

## Kết Luận Theo Gate

| Tiêu chí chính | Kết quả |
|---|---|
| Evaluate đúng mềm với `"Có ạ"` | PASS |
| Evaluate sai với `"Không"` | PASS |
| Evaluate sai với `"Không đúng"` | PASS |
| `reviewSlideId` khi sai là slide tồn tại | PASS |
| Generate checkpoint đủ schema | PASS |
| Regenerate khác formulation | PASS |
| `short_text` không có options | PASS |

## Code Quality Summary

| Tiêu chí | Đánh giá | Ghi chú |
|---|---|---|
| Readability | PASS | Logic rõ ràng hơn trước. |
| Error Handling | PASS | Evaluate và question service có catch lỗi LLM. |
| Single Responsibility | PASS | Answer/question services tách đúng trách nhiệm. |
| No Obvious Smell | WARNING | Regex chống mojibake trong mock là giải pháp test pragmatic, không nên áp dụng cho LLM thật. |
| Reproducibility | PASS | Mock provider đủ để test đúng/sai, generate/regenerate. |

## Hành Động Tiếp Theo

The Brain có thể mở GATE-006 và giao JOB-007 cho Coder.

---

# REVIEW — JOB-007 Frontend API client và app shell

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| GATE Criteria (RECOMMENDED) | FAIL |
| Contract Compliance | FAIL |
| Build frontend | PASS |

> GATE FAIL — JOB-007 chưa được chấp nhận.

## Blocking Findings

### 1. Cột trái chưa có input prompt, nút gửi, lịch sử hội thoại

`frontend/src/App.jsx:40-46` chỉ render placeholder:

```jsx
<div className="placeholder-msg">Authoring Chat Panel (Task-011)</div>
```

Không có `input`/`textarea`, không có nút gửi, không có vùng history message. Vi phạm GATE-007 REQUIRED #2.

### 2. Tab JSON chưa render lesson hiện tại từ `/api/lesson`

`frontend/src/App.jsx:50-63` có hai nút `Preview` và `JSON`, nhưng không có state active tab, không có handler chuyển tab, và phần content chỉ render preview placeholder với `lesson.title`/`lesson.description`.

Không có `<pre>` hoặc component nào render JSON lesson đã load từ `/api/lesson`. Vi phạm GATE-007 REQUIRED #4. Vì tab không hoạt động thật, tiêu chí REQUIRED #3 chỉ đạt phần hiển thị nhãn tab, chưa đạt hành vi tối thiểu của tab workspace.

### 3. Quick actions chưa hiển thị ở cột trái

Không thấy các action như thêm checkpoint, sửa lời thoại, tạo câu hỏi, cải thiện giao diện trong `App.jsx` hoặc `LeftChatPanel`. Vi phạm GATE-007 RECOMMENDED #10.

### 4. BUILD_LOG trong `Task_job` chưa có JOB-007

Root `BUILD_LOG.md` có entry JOB-007, nhưng `Task_job/BUILD_LOG.md` hiện chỉ tới JOB-006. Artifact trong thư mục job đang lệch trạng thái. Đây không phải gate UI trực tiếp, nhưng gây thiếu dấu vết review/build trong bộ hồ sơ chính.

## Các Mục Đạt

| Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|
| Layout 2 cột | PASS một phần | `frontend/src/App.jsx:40` và `frontend/src/App.jsx:48`, CSS `.left-panel`/`.right-panel` |
| Backend status connected/disconnected | PASS | `frontend/src/components/AppShell/AppShell.jsx:15-20` |
| Backend down có banner và retry | PASS | `frontend/src/components/AppShell/AppShell.jsx:7-10` |
| `fetch` chỉ nằm trong API client | PASS | `rg` chỉ thấy `window.fetch` tại `frontend/src/api/client.js:22` |
| Không thấy API key trong `frontend/src` | PASS | `rg` không thấy `LLM_API_KEY`, `api_key`, `apiKey`, `sk-`, `AIza` trong `frontend/src` |
| Frontend compile | PASS | `npm.cmd run build` pass, Vite build thành công |

## Kết Luận Theo Gate

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | Layout 2 cột | PASS |
| 2 | Cột trái có input prompt, nút gửi, lịch sử hội thoại | FAIL |
| 3 | Cột phải có tab Preview và JSON | PARTIAL |
| 4 | Tab JSON render lesson hiện tại từ `/api/lesson` | FAIL |
| 5 | Hiển thị backend connected/disconnected | PASS |
| 6 | Backend down có banner, không crash, có retry | PASS theo source |
| 7 | `api/client.js` là module duy nhất chứa `fetch` | PASS |
| 8 | Không hard-code API key/backend URL trong `frontend/src` | PASS |
| 9 | Responsive 1280x800 không overflow | PASS theo CSS source, chưa browser visual |
| 10 | Quick actions ở cột trái | FAIL |

## Yêu Cầu Coder Sửa

1. Implement panel trái tối thiểu cho JOB-007: chat history area, prompt input, send button. Chưa cần gọi authoring API nếu JOB-011 mới xử lý logic, nhưng UI shell bắt buộc phải có đủ phần tử.
2. Implement tab state cho `Preview`/`JSON`.
3. Tab `JSON` phải render `lesson` hiện tại load từ `/api/lesson`, ví dụ `JSON.stringify(lesson, null, 2)` trong vùng scroll được.
4. Thêm quick action buttons ở cột trái theo GATE recommended.
5. Đồng bộ `Task_job/BUILD_LOG.md` với entry JOB-007.

---

# RE-REVIEW — JOB-007 sau khi Coder sửa lỗi

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-19  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS |
| GATE Criteria (RECOMMENDED) | PASS |
| Contract Compliance | PASS |
| Build frontend | PASS |

> GATE PASS — JOB-007 được chấp nhận.

## Kết Quả Kiểm Tra Lại

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Layout 2 cột left authoring / right preview | PASS | `frontend/src/App.jsx:59`, `frontend/src/App.jsx:92`; CSS `.left-panel`, `.right-panel` |
| 2 | Cột trái có input prompt, nút gửi, lịch sử hội thoại | PASS | `frontend/src/App.jsx:63-89` |
| 3 | Cột phải có tab `Preview` và `JSON` | PASS | `frontend/src/App.jsx:94-106` |
| 4 | Tab `JSON` render lesson hiện tại từ `/api/lesson` | PASS | Lesson load qua `lessonApi.getLesson()` tại `frontend/src/App.jsx:22-28`, render JSON tại `frontend/src/App.jsx:120-121` |
| 5 | UI hiển thị backend connected/disconnected | PASS | `frontend/src/components/AppShell/AppShell.jsx:15-20` |
| 6 | Backend down có banner cảnh báo, app không crash, có retry | PASS | `frontend/src/components/AppShell/AppShell.jsx:7-10`; API client catch network error |
| 7 | `api/client.js` là module duy nhất chứa `fetch` | PASS | `rg` chỉ thấy `window.fetch` tại `frontend/src/api/client.js:22` |
| 8 | Không có API key/backend URL hard-code trong `frontend/src` | PASS | Không thấy API key/LLM URL trong `frontend/src`; `vite.config.js` có proxy localhost theo GATE-001 |
| 9 | Layout 1280x800 không overflow | PASS theo source/build | Flex layout, scroll nội bộ; `npm.cmd run build` pass |
| 10 | Quick actions ở cột trái | PASS | `frontend/src/App.jsx:50-55`, `frontend/src/App.jsx:70-75` |

## Verification

```text
npm.cmd run build
✓ built in 675ms
```

Grep bảo mật/API:

```text
frontend/src/api/client.js:22    const response = await window.fetch(endpoint, config);
```

Không phát hiện `fetch` trực tiếp trong component. Không phát hiện API key trong `frontend/src`.

## Ghi Chú Không Blocking

- `onRetryHealth` hiện chỉ retry health check; nếu app load lúc backend down rồi backend bật lại, lesson có thể cần thao tác reload hoặc gọi thêm `loadLesson()` ở JOB UX sau. Gate #6 chỉ yêu cầu có retry và không crash, nên không block JOB-007.
- `Preview` vẫn là placeholder cho `Lesson Player (Task-008)`, phù hợp phạm vi JOB-007.

## Hành Động Tiếp Theo

The Brain có thể mở GATE-007 và giao JOB-008 cho Coder.

---

# REVIEW — JOB-008 Lesson preview player

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| GATE Criteria (RECOMMENDED) | FAIL |
| Contract Compliance | FAIL |
| Build frontend | PASS |

> GATE FAIL — JOB-008 chưa được chấp nhận.

## Blocking Findings

### 1. Slide thiếu image / image 404 chưa có placeholder text

`frontend/src/components/LessonPreview/SlideViewer.jsx:17-23` render trực tiếp:

```jsx
<img src={slide.image} alt={slide.title} className="slide-media" />
```

Không có state kiểm soát lỗi ảnh, không có `onError`, không có fallback khi `slide.image` rỗng/null, và không render placeholder text. Nếu ảnh 404, browser chỉ hiện broken image. Vi phạm GATE-008 REQUIRED #7.

### 2. Audio lỗi/404 chưa có TTS fallback

`frontend/src/components/LessonPreview/AudioPlayer.jsx:8-16` chỉ gọi `audio.play()` và log warning khi autoplay fail. Element `<audio>` ở `AudioPlayer.jsx:27-33` không có `onError`, component không nhận `script`, và không dùng `window.speechSynthesis`.

Vì vậy khi audio file không load được, app không phát `script` bằng SpeechSynthesis. Vi phạm GATE-008 RECOMMENDED #11.

## Các Mục Đạt

| Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|
| Preview dùng dữ liệu lesson từ `/api/lesson` | PASS | `App.jsx` load qua `lessonApi.getLesson()`, truyền vào `<LessonPlayer lesson={lesson} />` |
| Hiển thị slide đầu tiên sau load | PASS theo source | `LessonPlayer.jsx:9`, `LessonPlayer.jsx:12-14`, render `currentIndex = 0` |
| Next/Previous hoạt động, không vượt biên | PASS | `LessonPlayer.jsx:22-34`, prev disabled ở `LessonPlayer.jsx:52-55` |
| Slide có audio có autoplay hoặc nút play/replay | PASS | `LessonPlayer.jsx:60-62`, `AudioPlayer.jsx:8-23` |
| Audio đổi theo slide | PASS theo source | `AudioPlayer` có `key={currentSlide.id}` tại `LessonPlayer.jsx:61` |
| Nút replay phát lại từ đầu | PASS | `AudioPlayer.jsx:18-23` |
| Slide có video render video player | PASS | `SlideViewer.jsx:9-16` |
| CompletionOverlay hiển thị sau slide cuối | PASS | `LessonPlayer.jsx:22-27`, `LessonPlayer.jsx:72` |
| Frontend compile | PASS | `npm.cmd run build` pass |

## Kết Luận Theo Gate

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | Preview hiển thị slide đầu tiên sau load | PASS |
| 2 | Next/Previous hoạt động đúng | PASS |
| 3 | Slide có audio phát tự động hoặc khi bấm play | PASS |
| 4 | Audio cũ dừng khi chuyển slide | PASS theo source |
| 5 | Replay audio từ đầu | PASS |
| 6 | Slide có video render video player | PASS |
| 7 | Slide thiếu image có placeholder text, không crash | FAIL |
| 8 | ProgressBar hiển thị đúng tiến trình | PASS một phần |
| 9 | Đến slide cuối có CompletionOverlay | PASS |
| 10 | Lesson đến từ `/api/lesson`, không hard-code | PASS |
| 11 | TTS fallback khi audio lỗi | FAIL |

## Verification

```text
npm.cmd run build
✓ built in 803ms
```

## Yêu Cầu Coder Sửa

1. `SlideViewer` cần xử lý ảnh thiếu/404: nếu `slide.image` rỗng hoặc `img.onError`, hiển thị placeholder text rõ ràng và không để broken image.
2. `AudioPlayer` cần nhận `script` hoặc callback fallback từ `LessonPlayer`, xử lý `audio.onError`, rồi dùng `window.speechSynthesis` đọc `script` khi audio load fail.
3. Nên chỉnh `ProgressBar` text thành dạng rõ hơn như `Slide 1 / 8` hoặc `Slide X / tổng Y` để khớp wording gate.

---

# RE-REVIEW — JOB-008 sau khi Coder sửa lỗi

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS |
| GATE Criteria (RECOMMENDED) | PASS |
| Contract Compliance | PASS |
| Build frontend | PASS |

> GATE PASS — JOB-008 được chấp nhận.

## Kết Quả Kiểm Tra Lại

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Preview hiển thị slide đầu tiên sau load | PASS | `LessonPlayer.jsx` khởi tạo `currentIndex = 0`, render `SlideViewer` |
| 2 | Next/Previous hoạt động đúng | PASS | `LessonPlayer.jsx` có `handleNext`, `handlePrev`, prev disabled ở slide đầu |
| 3 | Slide có audio phát tự động hoặc khi bấm play | PASS | `AudioPlayer.jsx` gọi `load()`/`play()` và có replay button |
| 4 | Audio cũ dừng khi chuyển slide | PASS theo source | `AudioPlayer` được remount bằng `key={currentSlide.id}` |
| 5 | Replay audio từ đầu | PASS | `AudioPlayer.jsx` set `currentTime = 0` rồi `play()` |
| 6 | Slide có video render video player | PASS | `SlideViewer.jsx` render `<video controls autoPlay>` khi có `slide.video` |
| 7 | Slide thiếu image/404 có placeholder text, không crash | PASS | `SlideViewer.jsx` có `imageError`, `onError`, `.image-placeholder` |
| 8 | ProgressBar hiển thị đúng tiến trình | PASS | `ProgressBar.jsx` render `Trang {current} / {total}` |
| 9 | Đến slide cuối có CompletionOverlay | PASS | `LessonPlayer.jsx` set `isCompleted`, render `CompletionOverlay` |
| 10 | Lesson đến từ `/api/lesson`, không hard-code | PASS | `App.jsx` load qua `lessonApi.getLesson()` và truyền `lesson` vào `LessonPlayer` |
| 11 | TTS fallback khi audio lỗi | PASS | `AudioPlayer.jsx` xử lý `onError`, dùng `SpeechSynthesisUtterance(script)` |

## Verification

```text
npm.cmd run build
✓ built in 626ms
```

## Ghi Chú Không Blocking

- `SlideViewer` chưa reset `imageError` khi đổi `slide.image`. Nếu một slide bị 404 rồi chuyển sang slide khác trong cùng instance, placeholder có thể bám sang slide sau. Coder nên thêm `useEffect(() => setImageError(false), [slide?.image])` ở lần refine UX.
- `AudioPlayer` đã có TTS fallback, nhưng chưa cleanup `speechSynthesis.cancel()` khi component unmount/chuyển slide. Nên bổ sung ở JOB-012 để tránh TTS cũ tiếp tục đọc trong một số trình duyệt.

## Hành Động Tiếp Theo

The Brain có thể mở GATE-008 và giao JOB-009 cho Coder.

---

# REVIEW — JOB-009 Checkpoint runtime và review flow

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| Build frontend | PASS |
| Contract Compliance | FAIL |

> GATE FAIL — JOB-009 chưa được chấp nhận.

## Blocking Findings

### 1. Payload gửi `POST /api/answer/evaluate` thiếu context bắt buộc

`frontend/src/components/LessonPreview/CheckpointBox.jsx:18-23` chỉ gửi:

```jsx
{
  lessonId,
  slideId,
  checkpointId: checkpoint.id,
  classAnswer: finalAnswer
}
```

Thiếu `question`, `correctAnswer`, `knowledgePoint` và `answerMode`. Backend `answer.service.js` dùng các field này để build prompt đánh giá. Payload này chưa đúng theo gate và làm evaluation thiếu ngữ cảnh. Vi phạm GATE-009 REQUIRED #4.

### 2. Review slide không có banner/nút "Quay lại câu hỏi"

Khi trả lời sai, `LessonPlayer.jsx:60-66` chỉ chuyển `currentIndex` sang `reviewSlideId` và tắt checkpoint:

```jsx
setCurrentIndex(reviewIndex);
setShowCheckpoint(false);
```

Không lưu checkpoint gốc, không có state review mode, không render banner hoặc nút "Quay lại câu hỏi" trên review slide. Vi phạm GATE-009 REQUIRED #7.

### 3. Không có flow quay đúng về slide checkpoint ban đầu

Vì không lưu `originalCheckpointSlideId`/`returnToCheckpointIndex`, review slide không có nút quay lại. User chỉ có thể tự bấm Next/Prev theo tuyến slide bình thường. Vi phạm GATE-009 REQUIRED #8.

### 4. Không lưu `checkpointPassed`, checkpoint đã pass vẫn hỏi lại khi quay lại slide

Không có state dạng `checkpointPassed`, `passedCheckpoints`, hoặc map theo checkpoint id trong `LessonPlayer.jsx`. Sau khi trả lời đúng, `handleCorrect()` chỉ chuyển slide tiếp theo (`LessonPlayer.jsx:51-58`). Nếu quay lại slide checkpoint, `handleNext()` sẽ mở checkpoint lại như ban đầu. Vi phạm GATE-009 REQUIRED #10.

### 5. Submit không có answer không hiển thị validation message

`CheckpointBox.jsx:12-15` chỉ `return` im lặng khi answer rỗng:

```jsx
if (!finalAnswer.trim()) return;
```

Không có validation message trong UI. Vi phạm GATE-009 REQUIRED #11.

## Các Mục Đạt / Đạt Một Phần

| Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|
| Multiple choice render options | PASS | `CheckpointBox.jsx:57-68` |
| Short text render input | PASS | `CheckpointBox.jsx:70-87` |
| Next disabled khi checkpoint đang hiển thị | PASS một phần | `LessonPlayer.jsx:104-107`; tuy nhiên trước khi show checkpoint, Next vẫn là nút mở checkpoint |
| Response đúng hiển thị feedback và có nút tiếp tục | PASS | `CheckpointBox.jsx:90-102`, `handleCorrect()` |
| Response sai chuyển sang `reviewSlideId` | PASS một phần | `LessonPlayer.jsx:60-66`; thiếu return flow |
| Frontend compile | PASS | `npm.cmd run build` pass |

## Kết Luận Theo Gate

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | Slide có checkpoint -> Next disabled | PARTIAL |
| 2 | Multiple choice hiển thị options | PASS |
| 3 | Short text hiển thị text input | PASS |
| 4 | Submit gọi `POST /api/answer/evaluate` với đúng payload | FAIL |
| 5 | `nextAction: continue` -> Next mở khóa, feedback hiển thị | PASS một phần |
| 6 | `nextAction: review` -> chuyển đúng `reviewSlideId` | PASS một phần |
| 7 | Review slide có banner/nút "Quay lại câu hỏi" | FAIL |
| 8 | Bấm "Quay lại câu hỏi" quay đúng checkpoint ban đầu | FAIL |
| 9 | Retry đúng -> Next mở khóa, đi tiếp bình thường | FAIL do thiếu return flow rõ ràng |
| 10 | `checkpointPassed` state đúng, không hỏi lại checkpoint đã pass | FAIL |
| 11 | Submit không có answer có validation message, không gọi API | FAIL |

## Verification

```text
npm.cmd run build
✓ built in 788ms
```

## Yêu Cầu Coder Sửa

1. Gửi đủ payload cho `answerApi.evaluate`: `lessonId`, `slideId`, `checkpointId`, `question`, `correctAnswer`, `classAnswer`, `knowledgePoint`, `answerMode`.
2. Dùng `nextAction` từ response, không chỉ dựa vào `isCorrect`.
3. Khi sai, lưu checkpoint gốc và chuyển tới `reviewSlideId`; trên review slide render banner/nút "Quay lại câu hỏi".
4. Nút "Quay lại câu hỏi" phải quay đúng về slide checkpoint ban đầu và hiển thị lại checkpoint để retry.
5. Thêm `checkpointPassed` state theo checkpoint id; checkpoint đã pass thì không hỏi lại và Next đi tiếp.
6. Khi submit rỗng, hiển thị validation message trong UI và không gọi API.

---

# RE-REVIEW — JOB-009 sau khi Coder sửa lỗi

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| Build frontend | PASS |
| Contract Compliance | FAIL |

> GATE FAIL — JOB-009 gần đạt, nhưng còn 1 REQUIRED chưa đúng.

## Blocking Finding Còn Lại

### 1. Slide có checkpoint nhưng nút Next chưa bị `disabled`

GATE-009 REQUIRED #1 yêu cầu: slide có checkpoint thì nút Next bị `disabled`, không chỉ ẩn. Trong code hiện tại, ở slide có checkpoint chưa pass, nút `.nav-btn.next` vẫn bật và được dùng để mở checkpoint:

```jsx
disabled={showCheckpoint}
```

Điều này nằm tại `frontend/src/components/LessonPreview/LessonPlayer.jsx:132-140`. Khi `showCheckpoint === false`, nút không disabled, text đổi thành `"Làm bài tập"` và click vào `handleNext()` sẽ mở checkpoint. Như vậy DOM button không có `disabled` ngay khi đang ở slide checkpoint, trái với tiêu chí gate.

Yêu cầu sửa: khi slide có checkpoint chưa pass, hiển thị checkpoint runtime bằng một control riêng hoặc tự hiện checkpoint theo thiết kế, nhưng nút Next dùng để đi tiếp phải có `disabled` cho đến khi checkpoint pass.

## Các Lỗi Trước Đã Sửa

| Lỗi lần trước | Kết quả | Bằng chứng |
|---|---|---|
| Payload evaluate thiếu context | PASS | `CheckpointBox.jsx:24-33` gửi `question`, `correctAnswer`, `knowledgePoint`, `answerMode` |
| Không dùng `nextAction` | PASS | `CheckpointBox.jsx:48-53` dùng `evaluation.nextAction` |
| Không có review banner | PASS | `LessonPlayer.jsx:91-98` |
| Không có nút quay lại câu hỏi | PASS | `LessonPlayer.jsx:78-83`, `LessonPlayer.jsx:94-96` |
| Không có `checkpointPassed` | PASS | `passedCheckpoints` tại `LessonPlayer.jsx:13`, update tại `LessonPlayer.jsx:58-60` |
| Submit rỗng không có validation | PASS | `CheckpointBox.jsx:16-18`, render tại `CheckpointBox.jsx:103` |

## Kết Luận Theo Gate

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | Slide có checkpoint -> Next disabled | FAIL |
| 2 | Multiple choice hiển thị options | PASS |
| 3 | Short text hiển thị input tự do | PASS |
| 4 | Submit gọi `POST /api/answer/evaluate` đúng payload | PASS |
| 5 | `nextAction: continue` -> feedback, đi tiếp được | PASS |
| 6 | `nextAction: review` -> chuyển đúng `reviewSlideId` | PASS |
| 7 | Review slide có banner/nút "Quay lại câu hỏi" | PASS |
| 8 | Bấm "Quay lại câu hỏi" quay đúng checkpoint ban đầu | PASS |
| 9 | Retry đúng -> đi tiếp bình thường | PASS |
| 10 | `checkpointPassed` không hỏi lại checkpoint đã pass | PASS |
| 11 | Submit rỗng có validation, không gọi API | PASS |

## Verification

```text
npm.cmd run build
✓ built in 742ms
```

## Hành Động Tiếp Theo

Coder chỉ cần sửa tiêu chí #1: tách nút mở checkpoint khỏi nút Next hoặc tự hiện checkpoint trên slide có checkpoint; nút Next phải disabled cho đến khi checkpoint pass.

---

# RE-REVIEW LẦN 2 — JOB-009 sau khi Coder sửa Next disabled

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS |
| Build frontend | PASS |
| Contract Compliance | PASS |

> GATE PASS — JOB-009 được chấp nhận.

## Kiểm Tra Lại Tiêu Chí Blocking

Coder đã sửa tiêu chí #1 đúng hướng:

- `LessonPlayer.jsx:29-36`: checkpoint tự động hiển thị khi slide hiện tại có checkpoint và chưa pass.
- `LessonPlayer.jsx:80`: `isNextDisabled = currentSlide?.checkpoint && !passedCheckpoints.has(currentSlide.checkpoint.id)`.
- `LessonPlayer.jsx:132`: nút Next dùng `disabled={isNextDisabled}`.

Như vậy trên slide checkpoint chưa pass, DOM button Next thật sự bị disabled. Sau khi `handleCorrect(checkpointId)` chạy, checkpoint được thêm vào `passedCheckpoints`, `isNextDisabled` chuyển false và Next mở khóa.

## Kết Luận Theo Gate

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | Slide có checkpoint -> Next disabled | PASS |
| 2 | Multiple choice hiển thị options | PASS |
| 3 | Short text hiển thị input tự do | PASS |
| 4 | Submit gọi `POST /api/answer/evaluate` đúng payload | PASS |
| 5 | `nextAction: continue` -> feedback, đi tiếp được | PASS |
| 6 | `nextAction: review` -> chuyển đúng `reviewSlideId` | PASS |
| 7 | Review slide có banner/nút "Quay lại câu hỏi" | PASS |
| 8 | Bấm "Quay lại câu hỏi" quay đúng checkpoint ban đầu | PASS |
| 9 | Retry đúng -> Next mở khóa, đi tiếp bình thường | PASS |
| 10 | `checkpointPassed` không hỏi lại checkpoint đã pass | PASS |
| 11 | Submit rỗng có validation, không gọi API | PASS |

## Verification

```text
npm.cmd run build
✓ built in 627ms
```

## Ghi Chú Không Blocking

- `useEffect` của auto checkpoint phụ thuộc vào `passedCheckpoints` là `Set`; hiện cách update tạo `new Set(...)` nên React vẫn nhận thay đổi. Chấp nhận được trong phạm vi JOB-009.

## Hành Động Tiếp Theo

The Brain có thể mở GATE-009 và giao JOB-010 cho Coder.

---

# REVIEW — JOB-010 Classroom chat và voice trong preview

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| GATE Criteria (RECOMMENDED) | PASS |
| Build frontend | PASS |
| Contract Compliance | FAIL |

> GATE FAIL — JOB-010 chưa được chấp nhận.

## Blocking Findings

### 1. Chat panel trong preview chưa thể mở/đóng

GATE-010 REQUIRED #1 yêu cầu chat panel trong preview có thể mở/đóng. Hiện `LessonPlayer.jsx:115-121` render `ClassroomChat` trực tiếp khi không hiển thị checkpoint:

```jsx
{!showCheckpoint && (
  <ClassroomChat ... />
)}
```

`ClassroomChat.jsx` cũng không có state `isOpen`, nút toggle, hoặc UI collapse/expand. Panel luôn hiện, nên không đạt tiêu chí mở/đóng.

### 2. VoiceButton chưa có đủ trạng thái rõ ràng `idle` / `listening` / `processing` / `error`

GATE-010 REQUIRED #7 yêu cầu VoiceButton có trạng thái rõ ràng: `idle`, `listening`, `processing`, `error`.

Hiện `VoiceButton.jsx` chỉ có:

- `isListening` tại `VoiceButton.jsx:5`
- `error` tại `VoiceButton.jsx:6`
- disabled từ parent nhưng không hiển thị processing state rõ ràng

Không có state enum hoặc UI text/class cho `processing`. Khi transcript đã nhận và parent đang gọi API, button chỉ bị disabled qua prop, chưa hiển thị trạng thái "processing" trong VoiceButton. Vi phạm REQUIRED #7.

### 3. Browser không hỗ trợ voice chưa hiện đúng fallback text theo gate

GATE-010 REQUIRED #6 yêu cầu browser không hỗ trợ thì hiện fallback và không crash. Code có fallback, nhưng message hiện tại ở `VoiceButton.jsx:11-13` là:

```text
Trình duyệt không hỗ trợ nhận diện giọng nói.
```

Theo contract UX của project/GATE-012, fallback cần hướng dẫn rõ `"Hãy dùng Chrome hoặc nhập bằng bàn phím"`. Đây là blocking theo tinh thần Gate vì non-Chrome user chưa được hướng dẫn hành động thay thế.

## Các Mục Đạt

| Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|
| Text chat gọi `/api/chat` | PASS | `ClassroomChat.jsx:39-44` |
| Payload text chat có `currentSlideId` | PASS | `ClassroomChat.jsx:40-42`, `LessonPlayer.jsx:116-119` |
| Reply hiển thị trong chat history | PASS | `ClassroomChat.jsx:46-50`, render `messages` tại `ClassroomChat.jsx:97-102` |
| Chat history preview độc lập với authoring chat trái | PASS | State `messages` local trong `ClassroomChat.jsx:8` |
| Voice nhận transcript rồi gọi API | PASS | `VoiceButton.jsx:26-29`, `ClassroomChat.jsx:63-73` |
| TTS reply đúng thông số | PASS | `ClassroomChat.jsx:19-27`: `vi-VN`, rate `0.9`, pitch `1.1` |
| Chat gửi đúng slide hiện tại | PASS | `currentSlideId={currentSlide?.id}` tại `LessonPlayer.jsx:118` |
| Loading state khi chờ API | PASS | `isProcessing`, loading bubble tại `ClassroomChat.jsx:103-108` |
| Frontend compile | PASS | `npm.cmd run build` pass |

## Cảnh Báo Không Blocking

- `ClassroomChat.jsx` không gửi `mode` vào `/api/chat` và `/api/voice/chat`, dù backend route có nhận `mode`. Backend hiện không dùng `mode` đáng kể nên chưa block Gate-010, nhưng nên gửi `classroomMode?.mode`.
- `chatHistory` frontend dùng `{ role, text }`, trong khi backend `chat.service.js` đang map `m.content`. Vì vậy history context gửi lên có thể thành `undefined`. Gate-010 không bắt rõ AI phải nhớ history, nhưng đây là bug cần sửa trước E2E sâu.

## Kết Luận Theo Gate

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | Chat panel có thể mở/đóng | FAIL |
| 2 | Text chat gọi `/api/chat` với `currentSlideId` đúng | PASS |
| 3 | Reply hiển thị trong chat history | PASS |
| 4 | Chat history preview độc lập với authoring chat | PASS |
| 5 | VoiceButton Chrome: listening -> transcript -> gửi API | PASS theo source |
| 6 | Browser không hỗ trợ có fallback, không crash | FAIL |
| 7 | VoiceButton có trạng thái `idle` / `listening` / `processing` / `error` | FAIL |
| 8 | TTS đọc reply với `vi-VN`, rate `0.9`, pitch `1.1` | PASS |
| 9 | Chat gửi `currentSlideId` đúng slide đang xem | PASS |
| 10 | Loading state trong chat khi chờ API | PASS |

## Verification

```text
npm.cmd run build
✓ built in 736ms
```

## Yêu Cầu Coder Sửa

1. Thêm toggle mở/đóng chat panel trong preview; panel phải có thể đóng và mở lại.
2. Đổi `VoiceButton` sang state rõ ràng, ví dụ `status: 'idle' | 'listening' | 'processing' | 'error'`, và render UI tương ứng.
3. Khi browser không hỗ trợ speech recognition, hiển thị fallback rõ: `"Hãy dùng Chrome hoặc nhập bằng bàn phím"`.
4. Nên gửi thêm `mode: classroomMode?.mode` và chuẩn hóa `chatHistory` thành field backend đọc được (`content` hoặc sửa backend đọc `text`).

---

# RE-REVIEW — JOB-010 sau khi Coder sửa lỗi

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS |
| GATE Criteria (RECOMMENDED) | PASS |
| Build frontend | PASS |
| Contract Compliance | PASS |

> GATE PASS — JOB-010 được chấp nhận.

## Kết Quả Kiểm Tra Lại

| # | Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Chat panel trong preview có thể mở/đóng | PASS | `ClassroomChat.jsx:11`, `ClassroomChat.jsx:95-109` |
| 2 | Text chat gọi `/api/chat` với `currentSlideId` đúng | PASS | `ClassroomChat.jsx:40-46`, `LessonPlayer.jsx:116-119` |
| 3 | Reply hiển thị trong chat history | PASS | `ClassroomChat.jsx:48-52`, render tại `ClassroomChat.jsx:115-120` |
| 4 | Chat history preview độc lập với authoring chat | PASS | State `messages` local tại `ClassroomChat.jsx:8` |
| 5 | VoiceButton Chrome: listening -> transcript -> gửi API | PASS | `VoiceButton.jsx:22-30`, `ClassroomChat.jsx:65-76` |
| 6 | Browser không hỗ trợ có fallback rõ, không crash | PASS | `VoiceButton.jsx:10-14` |
| 7 | VoiceButton có trạng thái `idle` / `listening` / `processing` / `error` | PASS | `VoiceButton.jsx:5`, `VoiceButton.jsx:75-85`, CSS `.voice-btn.processing/.error` |
| 8 | TTS đọc reply với `vi-VN`, rate `0.9`, pitch `1.1` | PASS | `ClassroomChat.jsx:20-27` |
| 9 | Chat gửi `currentSlideId` đúng slide đang xem | PASS | `currentSlideId={currentSlide?.id}` tại `LessonPlayer.jsx:118` |
| 10 | Loading state trong chat khi chờ API | PASS | `isProcessing`, loading bubble tại `ClassroomChat.jsx:121-126` |

## Các Cảnh Báo Trước Đã Sửa

- `mode` đã được gửi trong text chat và voice chat: `ClassroomChat.jsx:44`, `ClassroomChat.jsx:74`.
- `chatHistory` đã map sang `{ role, content }`, khớp backend đang đọc `m.content`: `ClassroomChat.jsx:45`, `ClassroomChat.jsx:75`.

## Verification

```text
npm.cmd run build
✓ built in 677ms
```

## Ghi Chú Không Blocking

- `VoiceButton` đang tạo lại `SpeechRecognition` khi `status` đổi vì `useEffect` phụ thuộc `[onTranscript, status]`. Chưa làm fail gate, nhưng nên tối ưu ở JOB-012 để tránh lifecycle phức tạp.

## Hành Động Tiếp Theo

The Brain có thể mở GATE-010 và giao JOB-011 cho Coder.

---

# REVIEW — JOB-011 Left authoring chat integration

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | FAIL |
| GATE Criteria (RECOMMENDED) | PASS |
| Build frontend | PASS |
| Contract Compliance | FAIL |

> GATE FAIL — JOB-011 chưa được chấp nhận.

## Blocking Finding

### 1. Quick action tự gửi prompt thay vì chỉ điền vào input

GATE-011 REQUIRED #6 yêu cầu quick action buttons hoạt động theo kiểu: click -> điền sẵn prompt vào input, **không tự gửi**.

Hiện tại `frontend/src/components/LeftChatPanel/LeftChatPanel.jsx:78-84` gọi trực tiếp:

```jsx
onClick={() => handleSendPrompt(action.prompt)}
```

Điều này lập tức thêm user message, gọi `/api/ai/authoring`, và update lesson nếu backend trả thành công. Như vậy sai behavior bắt buộc của gate.

Yêu cầu sửa: đưa state `prompt` lên `LeftChatPanel` hoặc truyền `presetPrompt` xuống `PromptInput`; quick action chỉ set input value. User phải bấm `Gửi` hoặc Enter để submit.

## Các Mục Đạt

| Tiêu chí | Kết quả | Bằng chứng |
|---|---|---|
| Nhập prompt -> gửi -> user message xuất hiện | PASS | `LeftChatPanel.jsx:16-19`, render messages tại `LeftChatPanel.jsx:67-70` |
| Loading indicator khi chờ response | PASS | `LeftChatPanel.jsx:19`, `LeftChatPanel.jsx:71-75` |
| AI response kèm `changeSummary` | PASS | `LeftChatPanel.jsx:24-30`, `ChatMessage.jsx:11-15` |
| `updatedLesson` cập nhật Preview và JSON | PASS | `LeftChatPanel.jsx:32-34`, `App.jsx:48-52`, JSON render `App.jsx:90-92` |
| Backend `ok:false` hiển thị lỗi, preview giữ lesson cũ | PASS | `LeftChatPanel.jsx:35-40`; chỉ update khi có `updatedLesson` |
| Authoring chat độc lập với classroom chat | PASS | authoring state ở `App.jsx:13`, classroom state local trong `ClassroomChat` |
| Chat history authoring giữ khi preview re-render | PASS | `authoringMessages` nằm ở `App.jsx`, không nằm trong `LessonPlayer` |
| Input disabled khi loading | PASS | `PromptInput.jsx:25`, `PromptInput.jsx:30-32` |
| Frontend compile | PASS | `npm.cmd run build` pass |

## Kết Luận Theo Gate

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | Nhập prompt -> gửi -> user message xuất hiện | PASS |
| 2 | Loading indicator hiển thị | PASS |
| 3 | AI response xuất hiện kèm `changeSummary` | PASS |
| 4 | `updatedLesson` cập nhật Preview và JSON ngay | PASS |
| 5 | Backend `ok:false` hiển thị lỗi, preview giữ lesson cũ | PASS |
| 6 | Quick action click -> điền prompt, không tự gửi | FAIL |
| 7 | Authoring chat không ảnh hưởng classroom chat history | PASS |
| 8 | Authoring chat history giữ khi lesson preview re-render | PASS |
| 9 | Input disabled lúc loading, re-enable sau response | PASS |

## Verification

```text
npm.cmd run build
✓ built in 706ms
```

## Hành Động Tiếp Theo

Coder cần sửa quick action để chỉ prefill input, không gọi API ngay. Sau đó reviewer kiểm lại riêng tiêu chí #6.

---

# RE-REVIEW — JOB-011 sau khi Coder sửa Quick Actions

**Reviewer:** The Reviewer  
**Ngày review:** 2026-05-20  
**Phiên bản code:** workspace hiện tại

## Kết Quả Tổng

| Hạng mục | Kết quả |
|---|---|
| GATE Criteria (REQUIRED) | PASS |
| GATE Criteria (RECOMMENDED) | PASS |
| Build frontend | PASS |
| Contract Compliance | PASS |

> GATE PASS — JOB-011 được chấp nhận.

## Kiểm Tra Lại Tiêu Chí Blocking

Quick action đã được sửa đúng:

- `LeftChatPanel.jsx:7`: state `promptText` được đưa lên component cha.
- `LeftChatPanel.jsx:55-57`: `handleQuickAction()` chỉ gọi `setPromptText(presetPrompt)`.
- `LeftChatPanel.jsx:88-94`: quick action gọi `handleQuickAction(action.prompt)`, không gọi API.
- `LeftChatPanel.jsx:100-105`: `PromptInput` nhận `value={promptText}` và `onChange={setPromptText}`.
- `PromptInput.jsx:6-10`: chỉ gửi khi user bấm `Gửi` hoặc Enter.

## Kết Luận Theo Gate

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | Nhập prompt -> gửi -> user message xuất hiện | PASS |
| 2 | Loading indicator hiển thị | PASS |
| 3 | AI response xuất hiện kèm `changeSummary` | PASS |
| 4 | `updatedLesson` cập nhật Preview và JSON ngay | PASS |
| 5 | Backend `ok:false` hiển thị lỗi, preview giữ lesson cũ | PASS |
| 6 | Quick action click -> điền prompt, không tự gửi | PASS |
| 7 | Authoring chat không ảnh hưởng classroom chat history | PASS |
| 8 | Authoring chat history giữ khi lesson preview re-render | PASS |
| 9 | Input disabled lúc loading, re-enable sau response | PASS |

## Verification

```text
npm.cmd run build
✓ built in 689ms
```

## Hành Động Tiếp Theo

The Brain có thể mở GATE-011 và giao JOB-012 cho Coder.

---
