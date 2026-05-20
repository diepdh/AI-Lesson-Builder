async function testJob006FinalV2() {
  const baseUrl = 'http://127.0.0.1:3000/api';
  
  const post = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  };

  const cases = [
    { label: 'Correct: "Có ạ thưa cô"', answer: 'Có ạ thưa cô' },
    { label: 'Wrong: "Không"', answer: 'Không' },
    { label: 'Wrong: "Không đúng"', answer: 'Không đúng' },
    { label: 'Wrong: "sai"', answer: 'sai' }
  ];

  for (const c of cases) {
    console.log(`\n--- Testing ${c.label} ---`);
    try {
      const data = await post(`${baseUrl}/answer/evaluate`, {
        lessonId: "ai-la-gi-lop-1",
        slideId: "slide-04",
        checkpointId: "cp-04",
        question: "Robot hút bụi có phải AI không?",
        correctAnswer: "Có",
        classAnswer: c.answer,
        knowledgePoint: "AI có thể tự nhận biết và tự quyết định",
        answerMode: "text"
      });
      console.log('Response:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
}

testJob006FinalV2();
