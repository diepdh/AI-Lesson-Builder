# USER_GUIDE.md

## 1. Doi tuong su dung

Tai lieu nay danh cho giao vien hoac nguoi van hanh muon dung **AI Lesson Builder** de mo bai giang, chinh sua bang AI, chay slide, kiem tra checkpoint va dung tro giang AI trong lop.

## 2. Mo ung dung

Truoc khi dung, can co 2 cua so terminal dang chay:

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

Sau do mo trinh duyet:

```text
http://localhost:5173
```

Neu dung voice, nen dung Google Chrome.

## 3. Giao dien chinh

Ung dung co 2 vung chinh:

| Vung | Chuc nang |
|---|---|
| Panel trai: Authoring AI | Chat voi AI de chinh sua bai giang |
| Panel phai: Preview | Xem va chay bai hoc nhu hoc sinh se thay |

O panel phai co 2 tab:

- `Preview`: chay bai hoc.
- `JSON`: xem du lieu bai hoc hien tai.

## 4. Chay bai hoc

1. Mo app tai `http://localhost:5173`.
2. Doi bai hoc load xong.
3. Xem slide hien tai o panel phai.
4. Bam `Trang sau` de chuyen slide.
5. Bam `Trang truoc` de quay lai slide truoc neu can.
6. Neu slide co audio, app se co phat audio.
7. Neu audio loi hoac thieu file, app co the dung giong doc may theo noi dung script.

## 5. Lam checkpoint

Khi toi slide co checkpoint, cau hoi se tu hien.

Voi cau hoi trac nghiem:

1. Chon mot dap an.
2. App gui dap an de AI/backend danh gia.
3. Neu dung, bam tiep tuc va nut `Trang sau` duoc mo.
4. Neu sai, app huong dan quay ve slide on tap.

Voi cau hoi nhap ngan:

1. Nhap cau tra loi cua lop.
2. Bam `Gui cau tra loi`.
3. Xem phan hoi va lam theo huong dan.

## 6. On tap sau khi tra loi sai

Neu lop tra loi sai:

1. App chuyen ve slide on tap phu hop.
2. Doc lai noi dung hoac nghe lai audio.
3. Bam `Quay lai cau hoi`.
4. Tra loi lai checkpoint.
5. Khi tra loi dung, tiep tuc bai hoc.

## 7. Dung tro giang AI trong bai hoc

Trong phan Preview, bam nut mo chat tro giang.

Cach dung:

1. Nhap cau hoi lien quan bai hoc, vi du: `AI la gi?`.
2. Bam gui.
3. AI tra loi theo ngu canh slide hien tai.
4. Neu response co cau hinh doc, app se doc cau tra loi bang TTS.

Luu y:

- Chat tro giang dung cho hoc sinh/lop hoc.
- Chat nay tach biet voi Authoring AI o panel trai.

## 8. Dung voice

Voice dung Web Speech API cua trinh duyet.

Tren Chrome:

1. Bam `Noi voi co`.
2. Cho phep quyen microphone.
3. Noi cau hoi bang tieng Viet.
4. App gui transcript toi tro giang AI.
5. AI tra loi bang text va co the doc len.

Tren trinh duyet khong ho tro:

- App se hien fallback.
- Hay nhap cau hoi bang ban phim.

## 9. Chinh sua bai giang bang AI

Panel trai la Authoring AI. Dung vung nay de yeu cau AI chinh bai.

Cach gui prompt:

1. Nhap yeu cau vao o chat.
2. Bam `Gui`.
3. Doi AI xu ly.
4. Xem phan hoi va phan tom tat thay doi.
5. Neu co `updatedLesson`, preview ben phai cap nhat ngay.

Vi du prompt:

```text
Hay viet lai loi thoai slide hien tai cho hoc sinh lop 3 de hieu hon.
```

```text
Hay them mot checkpoint trac nghiem cho slide nay.
```

```text
Hay lam noi dung slide nay sinh dong hon nhung van ngan gon.
```

## 10. Dung quick actions

Panel trai co cac nut thao tac nhanh nhu:

- `Them checkpoint`
- `Sua loi thoai`
- `Tao cau hoi`
- `Cai thien noi dung`

Khi bam quick action:

1. App dien prompt mau vao o nhap.
2. Ban co the sua lai noi dung prompt.
3. Bam `Gui` de thuc su gui cho AI.

Quick action khong tu gui ngay.

## 11. Xem du lieu JSON

Tab `JSON` o panel phai dung de kiem tra du lieu bai hoc hien tai.

Dung tab nay khi:

- Muon xem slide/checkpoint da duoc AI cap nhat chua.
- Muon kiem tra duong dan anh/audio/video.
- Muon debug khi preview hien thi chua dung.

Khong nen chinh truc tiep JSON trong giao dien vi tab nay chi de xem.

## 12. Them anh, audio, video

Dat file vao cac thu muc:

```text
frontend/public/assets/slides/
frontend/public/assets/audio/
frontend/public/assets/video/
```

Sau do cap nhat duong dan trong `backend/data/lesson.json`, vi du:

```json
{
  "image": "/assets/slides/slide-01.jpg",
  "audio": "/assets/audio/slide-01.mp3",
  "video": "/assets/video/demo.mp4"
}
```

Luu y:

- Khong dung duong dan tuyet doi tren may.
- Nen dung duong dan bat dau bang `/assets/`.
- Neu anh loi, app hien thi placeholder.
- Neu audio loi, app fallback sang TTS neu co script.

## 13. Khi gap loi

| Loi | Cach xu ly |
|---|---|
| Khong ket noi backend | Kiem tra terminal backend con chay khong |
| Backend loi sau khi AI chinh bai | Kiem tra `backend/data/backups/` va restore ban gan nhat |
| AI khong phan hoi | Kiem tra `.env`, provider, API key hoac dung `LLM_PROVIDER=mock` |
| Voice khong nhan | Dung Chrome va cap quyen microphone |
| Slide khong hien anh | Kiem tra file asset va path trong `lesson.json` |
| Nut Next bi khoa | Hoan thanh checkpoint dung truoc |

## 14. Quy trinh demo de xuat

1. Mo app va gioi thieu layout 2 cot.
2. Chay vai slide dau.
3. Toi checkpoint, tra loi sai de demo review flow.
4. Quay lai checkpoint, tra loi dung de mo khoa Next.
5. Mo chat tro giang va hoi mot cau theo noi dung slide.
6. Demo voice neu dung Chrome.
7. Chuyen sang panel trai, dung quick action `Sua loi thoai`.
8. Gui prompt, cho AI phan hoi.
9. Xem Preview va tab JSON cap nhat.

