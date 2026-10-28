const test = require('node:test');
const assert = require('node:assert');

const { createCourse, getCourses } = require('./courses');
const { checkAnswers } = require('./quiz');
const { registerUser, loginUser } = require('./users');

test('Create a course', () => {
  const course = createCourse(1, 'DevOps Basics', 'Teacher');

  assert.strictEqual(course.title, 'DevOps Basics');
  assert.strictEqual(getCourses().length, 1);
});

test('Calculate quiz score', () => {
  const questions = [
    { correctAnswer: 'A' },
    { correctAnswer: 'B' }
  ];

  const result = checkAnswers(questions, ['A', 'B']);

  assert.strictEqual(result.score, 100);
  assert.strictEqual(result.passed, true);
});

test('Register and login user', () => {
  registerUser('student1', 'test123', 'student');

  assert.strictEqual(loginUser('student1', 'test123'), true);
  assert.strictEqual(loginUser('student1', 'wrong'), false);
});

test('Reject duplicate user', () => {
  assert.throws(() => {
    registerUser('student1', 'another123');
  });
});
