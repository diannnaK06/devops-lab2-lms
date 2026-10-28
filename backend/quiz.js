function checkAnswers(questions, answers) {
  let correct = 0;

  questions.forEach((question, index) => {
    if (question.correctAnswer === answers[index]) {
      correct++;
    }
  });

  const score = questions.length === 0
    ? 0
    : Math.round((correct / questions.length) * 100);

  return {
    correct,
    total: questions.length,
    score,
    passed: score >= 80
  };
}

module.exports = { checkAnswers };
