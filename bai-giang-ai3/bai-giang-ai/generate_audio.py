"""
generate_audio.py  –  Tạo file audio tiếng Việt cho bài giảng AI Là Gì?
──────────────────────────────────────────────────────────────────────────
Cách dùng:
  1. pip install edge-tts         (khuyên dùng – giọng tự nhiên nhất)
     hoặc: pip install gtts       (backup)
  2. python generate_audio.py
  3. Thư mục audio/ được tạo tự động cạnh file này
  4. Mở index.html bằng Chrome là nghe được tiếng Việt!
"""

import asyncio, os, sys

OUT = os.path.join(os.path.dirname(__file__), 'audio')
os.makedirs(OUT, exist_ok=True)

# ─── Toàn bộ nội dung cần đọc ────────────────────────────────────────────
AUDIO = {
  # Slide scripts
  's01': 'Chào mừng các em đến với bài học hôm nay! Chúng ta sẽ cùng khám phá về Trí Tuệ Nhân Tạo, hay còn gọi là AI! Chuẩn bị chưa nào? Bắt đầu thôi!',
  's02': 'Hoạt động một: Gắn kết! Hôm nay chúng ta sẽ gặp một người bạn rất đặc biệt đấy! Các em hãy chú ý nhé!',
  's03': 'Đây là người bạn đặc biệt của chúng ta! Một robot hút bụi đang tự chạy quanh phòng! Nó tự di chuyển, tự tránh chân bàn ghế mà không cần ai điều khiển. Thật thú vị phải không?',
  's04': 'Robot vừa rồi làm được những việc gì? Nó tự đi, tự tránh chướng ngại vật, tự quay về sạc pin! Còn con người thì có thể cảm nhận vui buồn. Bây giờ cô muốn kiểm tra xem các em hiểu chưa nhé!',
  's05': 'Hoạt động hai: Khám phá! Giờ chúng ta chơi trò chơi phân loại – AI hay Không AI?',
  's06': 'Nhìn vào các thẻ hình này nhé! Chúng ta có Robot hút bụi, Loa thông minh, Quạt điện, Bút chì, Điện thoại thông minh, và Bàn ủi. Đâu là AI? Nhớ nhé: AI là máy có thể tự học và tự quyết định!',
  's07': 'Kết quả phân loại: AI gồm Robot hút bụi, Loa thông minh, Điện thoại thông minh. Không phải AI là Quạt điện, Bút chì, Bàn ủi. Quạt chỉ quay khi bấm nút. Loa thông minh thì nghe tiếng nói và tự tìm câu trả lời – đó là AI!',
  's08': 'Hoạt động ba: Giải thích! Bây giờ cô sẽ giải thích rõ hơn AI là gì nhé!',
  's09': 'AI – Trí Tuệ Nhân Tạo có ba đặc điểm quan trọng! Một: AI là máy thông minh do con người tạo ra, không phải người thật. Hai: AI học từ dữ liệu – từ hàng triệu hình ảnh và âm thanh. Ba: AI không có cảm xúc – không biết vui, buồn, hay yêu thương.',
  's10': 'AI học từ dữ liệu máy tính, không học từ sách vở và thầy cô như các em. Dù AI rất thông minh, nó vẫn là máy – không có trái tim!',
  's11': 'Trò chơi đóng vai: Người và AI! AI chỉ làm việc khi nhận lệnh. Còn con người có cảm xúc – vui khi được khen, buồn khi bị mắng. AI không có những điều đó! Hãy trả lời câu hỏi nhé!',
  's12': 'Hoạt động bốn: Áp dụng! Đến phần thử tài nhanh trí rồi – các em đã sẵn sàng chưa?',
  's13': 'Thử tài nhanh trí! Câu một: AI là con người thông minh – Sai nhé! AI là máy. Câu hai: AI do con người tạo ra – Đúng! Câu ba: AI biết yêu thương như con người – Sai! AI không có cảm xúc. Hãy trả lời câu hỏi sau!',
  's14': 'Tình huống quan trọng! Bạn An muốn dùng ứng dụng AI trên điện thoại để nhận diện khuôn mặt. Trước khi dùng, bạn An cần làm gì? Hãy suy nghĩ nhé...',
  's15': 'Ba quy tắc vàng khi dùng công nghệ! Một: Xin phép người lớn trước khi dùng ứng dụng AI. Hai: Không chia sẻ thông tin riêng tư. Ba: Không đăng ảnh của bạn bè khi chưa xin phép. Các em nhớ chưa? Hãy trả lời câu hỏi!',
  's16': 'Hoạt động năm: Đánh giá! Chúng ta đã học được rất nhiều điều thú vị hôm nay! Cô rất tự hào về các em!',
  's17': 'Bây giờ hãy vẽ hoặc viết một điều em nhớ nhất về AI hôm nay nhé! Có thể là AI là gì, ví dụ về AI, hay quy tắc an toàn. Không có câu trả lời sai đâu!',
  's18': 'Thời gian chia sẻ! Ai muốn kể cho cả lớp nghe điều mình nhớ nhất về AI hôm nay?',
  's19': 'Tổng kết bài học! Hôm nay các em đã biết: AI là Trí Tuệ Nhân Tạo, máy thông minh do con người tạo ra. AI học từ dữ liệu và không có cảm xúc. Ví dụ AI gồm robot hút bụi, loa thông minh, điện thoại thông minh. Ba quy tắc vàng: xin phép người lớn, không chia sẻ thông tin riêng, không đăng ảnh bạn khi chưa xin phép. Hẹn gặp lại các em!',
  # Checkpoint questions
  'q04': 'Robot hút bụi tự chạy và tự tránh đồ vật. Đó có phải là AI không?',
  'q07': 'Cái nào không phải AI?',
  'q11': 'AI có biết vui hay buồn như con người không?',
  'q13': 'Câu nào đúng về AI?',
  'q15': 'Muốn dùng ứng dụng AI, việc đầu tiên em cần làm là gì?',
  # Correct explanations
  'e04': 'Chính xác! Robot hút bụi có AI vì nó tự học đường đi và tự tránh chướng ngại vật mà không cần người chỉ từng bước!',
  'e07': 'Đúng rồi! Bóng đèn không phải AI vì nó chỉ bật tắt theo công tắc, không tự học, không tự quyết định gì cả.',
  'e11': 'Đúng! AI không có cảm xúc. Dù AI rất thông minh, nó chỉ xử lý thông tin như máy tính. Chỉ có con người mới có cảm xúc thật sự!',
  'e13': 'Đúng! AI do con người tạo ra. AI không phải là người và không có cảm xúc.',
  'e15': 'Chính xác! Luôn xin phép người lớn trước. Đó là quy tắc vàng số một để dùng công nghệ an toàn!',
  # Remedial scripts
  'r04': 'Bạn ơi, robot hút bụi tự chạy quanh phòng, tự tránh chân bàn, tự về sạc pin – mà không cần ai điều khiển! Đó chính là AI. Hãy thử lại nhé!',
  'r07': 'AI cần tự học! Bóng đèn chỉ bật khi có điện, không tự học, không quyết định. Robot hút bụi tự học đường đi – đó mới là AI!',
  'r11': 'AI là máy. Robot không buồn khi bị đổ. Loa thông minh không vui khi được khen. Chỉ có con người mới có trái tim và cảm xúc thật sự!',
  'r13': 'Hãy nhớ: AI là máy móc do con người tạo ra. Không phải người, không có cảm xúc!',
  'r15': 'An toàn là số một! Hỏi bố mẹ hoặc thầy cô trước khi dùng bất kỳ ứng dụng AI nào. Người lớn sẽ giúp em dùng đúng cách!',
  # Retry questions
  't04': 'Trợ lý ảo trên điện thoại nghe và trả lời câu hỏi. Đó có phải AI không?',
  't07': 'Bút chì có phải là AI không?',
  't11': 'Ai tạo ra AI?',
  't13': 'Đúng hay Sai: AI không có cảm xúc?',
  't15': 'Em có nên chia sẻ địa chỉ nhà mình trên ứng dụng AI không?',
  # Generic
  'correct_generic': 'Tốt lắm! Tiếp tục bài học nào!',
  'wrong_generic':   'Không sao! Hãy xem đáp án đúng và tiếp tục nhé!',
}

# ─── Thử edge-tts trước (giọng tốt hơn), fallback sang gTTS ─────────────
async def gen_edge(key, text, voice='vi-VN-HoaiMyNeural'):
    import edge_tts
    path = f'{OUT}/{key}.mp3'
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(path)
    return os.path.getsize(path) > 0

def gen_gtts(key, text):
    from gtts import gTTS
    import time, random
    path = f'{OUT}/{key}.mp3'
    for attempt in range(4):
        try:
            tts = gTTS(text=text, lang='vi', slow=False)
            tts.save(path)
            if os.path.getsize(path) > 0:
                return True
        except Exception as e:
            print(f'  gTTS attempt {attempt+1} failed: {e}')
            time.sleep(3 + attempt * 2 + random.uniform(0,1))
    return False

async def main():
    # Check what's already done
    todo = {k: v for k, v in AUDIO.items()
            if not os.path.exists(f'{OUT}/{k}.mp3') or os.path.getsize(f'{OUT}/{k}.mp3') == 0}

    if not todo:
        print('✅ Tất cả file audio đã có! Mở index.html bằng Chrome là dùng được.')
        return

    print(f'🎙️  Tạo {len(todo)}/{len(AUDIO)} file audio...\n')

    # Detect available engine
    use_edge = False
    try:
        import edge_tts
        use_edge = True
        print('✅ Dùng edge-tts (Microsoft Neural Voice – giọng tự nhiên)\n')
    except ImportError:
        try:
            import gtts
            print('✅ Dùng gTTS (Google Translate TTS)\n')
        except ImportError:
            print('❌ Lỗi: Cần cài đặt edge-tts hoặc gtts!')
            print('   Chạy: pip install edge-tts')
            sys.exit(1)

    ok = 0
    for i, (key, text) in enumerate(todo.items(), 1):
        print(f'[{i:02d}/{len(todo)}] {key}.mp3 ...', end=' ', flush=True)
        success = False
        if use_edge:
            try:
                success = await gen_edge(key, text)
            except Exception as e:
                print(f'edge-tts lỗi ({e}), thử gTTS...', end=' ')
                try:
                    import gtts
                    success = gen_gtts(key, text)
                except ImportError:
                    pass
        else:
            success = gen_gtts(key, text)

        print('✅ OK' if success else '❌ Thất bại')
        if success:
            ok += 1

    print(f'\n🎉 Hoàn thành: {ok}/{len(todo)} files')
    print(f'📁 Thư mục: {OUT}')
    print('\n👉 Bước tiếp theo: Mở index.html bằng Chrome!')

if __name__ == '__main__':
    asyncio.run(main())
