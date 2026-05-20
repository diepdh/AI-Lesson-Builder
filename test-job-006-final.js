async function testJob006() {
  const baseUrl = 'http://127.0.0.1:3000/api';
  
  const post = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  console.log('--- Testing Answer Evaluation (Correct: "Có") ---');
  try {
    const data = await post(`${baseUrl}/answer/evaluate`, {
      lessonId: "ai-la-gi-lop-1",
      slideId: "slide-04",
      checkpointId: "cp-04",
      question: "Robot hút bụi có phải AI không?",
      correctAnswer: "Có",
      classAnswer: "Có",
      knowledgePoint: "AI có thể tự nhận biết và tự quyết định",
      answerMode: "text"
    });
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }

  console.log('\n--- Testing Answer Evaluation (Wrong: "Không") ---');
  try {
    const data = await post(`${baseUrl}/answer/evaluate`, {
      lessonId: "ai-la-gi-lop-1",
      slideId: "slide-04",
      checkpointId: "cp-04",
      question: "Robot hút bụi có phải AI không?",
      correctAnswer: "Có",
      classAnswer: "Không",
      knowledgePoint: "AI có thể tự nhận biết và tự quyết định",
      answerMode: "text"
    });
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }

  console.log('\n--- Testing Answer Evaluation (Wrong: "Không đúng") ---');
  try {
    const data = await post(`${baseUrl}/answer/evaluate`, {
      lessonId: "ai-la-gi-lop-1",
      slideId: "slide-04",
      checkpointId: "cp-04",
      question: "Robot hút bụi có phải AI không?",
      correctAnswer: "Có",
      classAnswer: "Không đúng",
      knowledgePoint: "AI có thể tự nhận biết và tự quyết định",
      answerMode: "text"
    });
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testJob006();
