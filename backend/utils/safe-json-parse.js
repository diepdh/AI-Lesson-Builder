/**
 * Safely parse JSON from LLM response, stripping markdown fences if present
 */
function safeJsonParse(text) {
  if (typeof text !== 'string') return null;

  try {
    // Strip markdown code fences: ```json ... ``` or ``` ... ```
    let cleanText = text.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Safe JSON parse failed:', error.message);
    return null;
  }
}

module.exports = { safeJsonParse };
