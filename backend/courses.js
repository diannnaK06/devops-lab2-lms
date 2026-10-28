const courses = [];

function createCourse(id, title, teacher) {
  const course = { id, title, teacher };
  courses.push(course);
  return course;
}

function getCourses() {
  return courses;
}

module.exports = { createCourse, getCourses };
