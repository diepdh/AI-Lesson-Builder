/**
 * Utilities to build prompts for various AI tasks
 */

const promptBuilder = {
  // 1. Authoring Prompts
  buildAuthoringSystemPrompt: () => {
    return `Ban la tro ly AI chuyen giup giao vien tao bai giang e-learning.
Nhiem vu cua ban la hieu yeu cau nguoi dung va cap nhat lesson JSON.

Quy tac BAT BUOC:
- Tra ve JSON hop le, KHONG giai thich them ngoai JSON.
- Cau truc JSON tra ve phai bao gom:
  {
    "assistantMessage": "Loi nhan toi giao vien",
    "changeSummary": "Tom tat thay doi da thuc hien",
    "patch": [],
    "updatedLesson": { ...toan bo lesson da cap nhat... }
  }
- Khong pha cau truc lesson JSON cu.
- Khong xoa slide hoac du lieu cu neu giao vien khong yeu cau.
- Neu them checkpoint, phai co: id, type, question, options, correctAnswer, explanation, wrongFeedback, reviewSlideId.
- reviewSlideId phai tro toi mot id slide da ton tai trong bai hoc.
- Noi dung phai phu hop voi targetLearner.
- Cac field image/audio/video khong duoc thay doi neu giao vien khong yeu cau ro.`;
  },

  buildAuthoringIntentGuide: (intent) => {
    const guides = {
      add_checkpoint_current_slide: [
        '- Chi tao checkpoint cho slide hien tai.',
        '- Cau hoi bam sat knowledgePoint va script.',
        '- Neu la trac nghiem thi options toi thieu 3 phuong an, 1 dap an dung.'
      ],
      rewrite_script_current_slide: [
        '- Chi viet lai script slide hien tai.',
        '- Giu dung y chinh cua slide, cau ngan gon, de hieu.',
        '- Khong thay image/audio/video.'
      ],
      add_open_question_current_slide: [
        '- Them 1 cau hoi tu luan ngan cho slide hien tai.',
        '- Cau hoi phai do duoc muc hieu bai.'
      ],
      improve_content_current_slide: [
        '- Chi cai thien noi dung slide hien tai.',
        '- Khong can thiep media va khong sua slide khac.'
      ]
    };
    return guides[intent]?.join('\n') || '';
  },

  buildAuthoringUserPrompt: (message, currentLesson, currentSlideId, intent) => {
    const slides = Array.isArray(currentLesson?.slides) ? currentLesson.slides : [];
    const currentIndex = slides.findIndex((s) => s.id === currentSlideId);
    const safeIndex = currentIndex >= 0 ? currentIndex : 0;
    const currentSlide = slides[safeIndex] || null;
    const prevSlide = safeIndex > 0 ? slides[safeIndex - 1] : null;
    const nextSlide = safeIndex < slides.length - 1 ? slides[safeIndex + 1] : null;

    const compactSlide = (slide) => {
      if (!slide) return null;
      return {
        id: slide.id,
        order: slide.order,
        title: slide.title,
        script: slide.script,
        knowledgePoint: slide.knowledgePoint,
        checkpoint: slide.checkpoint || null
      };
    };

    const intentGuide = promptBuilder.buildAuthoringIntentGuide(intent);

    return `Yeu cau cua giao vien: "${message}"
Intent: ${intent || 'general_edit'}
Slide hien tai: ${currentSlideId || 'N/A'}
${intentGuide ? `Huong dan theo intent:
${intentGuide}
` : ''}

Metadata bai hoc:
${JSON.stringify({
  lessonId: currentLesson.lessonId,
  title: currentLesson.title,
  description: currentLesson.description,
  targetLearner: currentLesson.targetLearner,
  learningObjectives: currentLesson.learningObjectives || []
}, null, 2)}

Ngu canh slide:
${JSON.stringify({
  previousSlide: compactSlide(prevSlide),
  currentSlide: compactSlide(currentSlide),
  nextSlide: compactSlide(nextSlide)
}, null, 2)}

Du lieu bai hoc hien tai (JSON):
${JSON.stringify(currentLesson, null, 2)}`;
  },

  // 2. Classroom Chat Prompts
  buildChatSystemPrompt: (lesson, currentSlide) => {
    return `Ban la co giao AI than thien dang ho tro ca lop hoc.
Hay tra loi ngan gon, de hieu (phu hop voi ${lesson.targetLearner}).
Chi tra loi trong pham vi bai hoc hien tai.
Neu cau hoi ngoai pham vi bai hoc, hay nhe nhang keo ca lop quay lai bai hoc.

Ngu canh bai hoc:
- Ten bai: ${lesson.title}
- Doi tuong: ${lesson.targetLearner}
- Slide hien tai: ${currentSlide.title}
- Kien thuc chinh o slide nay: ${currentSlide.knowledgePoint}

Quy tac tra ve JSON:
{
  "reply": "Noi dung tra loi",
  "scope": "in_lesson" hoac "redirected",
  "speak": true
}`;
  },

  // 3. Evaluation Prompts
  buildEvaluationPrompt: (question, correctAnswer, classAnswer, knowledgePoint) => {
    return `Ban la he thong danh gia cau tra loi cua mot lop hoc.
Hay danh gia mem theo y nghia, khong yeu cau dung tung chu.

Thong tin:
- Cau hoi: ${question}
- Dap an dung: ${correctAnswer}
- Cau tra loi cua lop: ${classAnswer}
- Kien thuc slide: ${knowledgePoint}

Chi tra JSON hop le:
{
  "isCorrect": true/false,
  "feedback": "Phan hoi ngan gon, than thien cho ca lop",
  "shouldReview": true/false,
  "reviewSlideId": "ID slide de on tap neu sai, hoac null",
  "nextAction": "continue" hoac "review"
}`;
  },

  // 4. Question Generation Prompts
  buildQuestionGenerationPrompt: (lesson, slide, type) => {
    return `Ban la chuyen gia thiet ke cau hoi e-learning.
Hay tao mot cau hoi checkpoint cho slide nay.

Thong tin slide:
- Tieu de: ${slide.title}
- Kien thuc chinh: ${slide.knowledgePoint}
- Noi dung giang: ${slide.script}
- Doi tuong hoc: ${lesson.targetLearner}

Yeu cau:
- Loai cau hoi: ${type || 'multiple_choice'}
- Tra ve JSON hop le cho field "checkpoint" trong schema.
- Phai co: id, type, question, options (neu mc), correctAnswer, explanation, wrongFeedback, reviewSlideId (chinh la slide hien tai: ${slide.id}).`;
  }
};

module.exports = promptBuilder;
