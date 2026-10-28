const courseList = document.getElementById('course-list');
const quizResult = document.getElementById('quiz-result');
const accountResult = document.getElementById('account-result');

async function loadCourses() {
  try {
    const response = await fetch('/api/courses');
    const courses = await response.json();

    if (!response.ok) {
      throw new Error('Could not load courses');
    }

    courseList.replaceChildren();

    courses.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card';

      const title = document.createElement('h3');
      title.textContent = course.title;

      const teacher = document.createElement('p');
      teacher.textContent = `Teacher: ${course.teacher}`;

      const button = document.createElement('button');
      button.textContent = 'View course';
      button.addEventListener('click', () => {
        alert(`Selected course: ${course.title}`);
      });

      card.append(title, teacher, button);
      courseList.appendChild(card);
    });
  } catch (error) {
    courseList.textContent = 'Failed to load courses.';
  }
}

document.getElementById('submit-quiz').addEventListener('click', async () => {
  const selected = document.querySelector('input[name="answer"]:checked');

  if (!selected) {
    quizResult.textContent = 'Please select an answer.';
    return;
  }

  try {
    const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: [selected.value] })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Quiz failed');
    }

    quizResult.textContent =
      `Score: ${result.score}% — ${result.passed ? 'Passed!' : 'Try again!'}`;
  } catch (error) {
    quizResult.textContent = error.message;
  }
});

document.getElementById('register').addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) {
    accountResult.textContent = 'Please fill in all fields.';
    return;
  }

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    accountResult.textContent =
      `Welcome, ${result.username}! Registration successful.`;
  } catch (error) {
    accountResult.textContent = error.message;
  }
});

loadCourses();
