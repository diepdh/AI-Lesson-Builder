/**
 * Validate lesson schema based on BLUEPRINT.md and CONTRACT.md
 */
function validateLesson(lesson) {
  const errors = [];

  if (!lesson) {
    return { valid: false, errors: ['Lesson data is missing'] };
  }

  // Root validation
  if (!lesson.lessonId) errors.push('Missing lessonId');
  if (!lesson.title) errors.push('Missing title');
  if (!Array.isArray(lesson.slides) || lesson.slides.length === 0) {
    errors.push('Slides must be a non-empty array');
  }

  // Slide validation
  const slideIds = new Set();
  if (Array.isArray(lesson.slides)) {
    lesson.slides.forEach((slide, index) => {
      const path = `slides[${index}]`;
      if (!slide.id) errors.push(`${path}: Missing id`);
      if (slide.id && slideIds.has(slide.id)) errors.push(`${path}: Duplicate slide id ${slide.id}`);
      if (slide.id) slideIds.add(slide.id);
      
      if (slide.order === undefined) errors.push(`${path}: Missing order`);
      if (!slide.title) errors.push(`${path}: Missing title`);
      if (!slide.image) errors.push(`${path}: Missing image`);
      if (!slide.script) errors.push(`${path}: Missing script`);
      if (!slide.knowledgePoint) errors.push(`${path}: Missing knowledgePoint`);

      // Checkpoint validation
      if (slide.checkpoint) {
        const cp = slide.checkpoint;
        const cpPath = `${path}.checkpoint`;
        if (!cp.id) errors.push(`${cpPath}: Missing id`);
        if (!cp.type) errors.push(`${cpPath}: Missing type`);
        if (!cp.question) errors.push(`${cpPath}: Missing question`);
        if (!cp.correctAnswer) errors.push(`${cpPath}: Missing correctAnswer`);
        if (!cp.reviewSlideId) errors.push(`${cpPath}: Missing reviewSlideId`);
      }
    });

    // Cross-reference validation: reviewSlideId must exist
    lesson.slides.forEach((slide, index) => {
      if (slide.checkpoint && slide.checkpoint.reviewSlideId) {
        if (!slideIds.has(slide.checkpoint.reviewSlideId)) {
          errors.push(`slides[${index}].checkpoint: reviewSlideId "${slide.checkpoint.reviewSlideId}" does not exist`);
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = { validateLesson };
