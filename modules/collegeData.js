const Sequelize = require('sequelize');
const sequelize = new Sequelize('gjxbytqd', 'gjxbytqd', 'mQC5iDcizYYaCwjN3Vq8QuPp-Dm_oN6n', {
  host: 'batyr.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});


// Define the Student model
const Student = sequelize.define('Student', {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  addressStreet: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  addressCity: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  addressProvince: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  TA: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// Define the Course model
const Course = sequelize.define('Course', {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  courseDescription: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Define the relationship between Course and Student
Course.hasMany(Student, { foreignKey: 'course' });

// Synchronize the models with the database
sequelize.sync().then(() => {
  console.log('Database synchronized successfully.');
}).catch((err) => {
  console.error('Error synchronizing database:', err);
});



// defining initialize function
module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    sequelize
      .authenticate()
      .then(() => {
        console.log('Database connection has been established successfully.');
        return sequelize.sync();
      })
      .then(() => {
        console.log('Database synchronized successfully.');
        resolve();
      })
      .catch((err) => {
        console.error('Error connecting to the database:', err);
        reject("Unable to sync the database.");
      });
  });
};

// defining getAllStudents function
module.exports.getAllStudents = function () {
  return new Promise(function (resolve, reject) {
    Student.findAll()
      .then((students) => {
        if (students.length > 0) {
          resolve(students);
        } else {
          reject("No results returned");
        }
      })
      .catch((err) => {
        reject("Error retrieving students: " + err);
      });
  });
};


// defining getTAs function
module.exports.getTAs = function () {
return new Promise(function (resolve, reject) {
  reject();
});
 }; /////////////////////////

// defining getStudentsByCourse function
module.exports.getStudentsByCourse = function (course) { // (course)
  return new Promise(function (resolve, reject) {
    Student.findAll({
      where: {
        course: course
      }
    })
    .then((students) => {
      if (students.length > 0) {
        resolve(students);
      } else {
        reject("No results returned");
      }
    })
    .catch((err) => {
      reject("Error retrieving students by course: " + err);
    });
  });
};


// defining getStudentByNum function
module.exports.getStudentByNum = function (num) {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      where: {
        studentNum: num
      }
    })
    .then((students) => {
      if (students.length > 0) {
        resolve(students[0]);
      } else {
        reject("No results returned");
      }
    })
    .catch((err) => {
      reject("Error retrieving student by number: " + err);
    });
  });
};


// defining getCourses function
module.exports.getCourses = function (course) {
  return new Promise(function (resolve, reject) {
    Course.findAll()
      .then((courses) => {
        if (courses.length > 0) {
          resolve(courses);
        } else {
          reject("No results returned");
        }
      })
      .catch((err) => {
        reject("Error retrieving courses: " + err);
      });
  });
};


// defining addStudent function
module.exports.addStudent = function (studentData) {
  return new Promise(function (resolve, reject) {
    // Ensure the TA property is set properly
    studentData.TA = studentData.TA ? true : false;

    // Replace any blank values ("") with null
    for (const prop in studentData) {
      if (studentData[prop] === "") {
        studentData[prop] = null;
      }
    }

    // Invoke the Student.create() function
    Student.create(studentData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to create student: " + err);
      });
  });
};


// defining getCourseById function
module.exports.getCourseById = function (id) {
  return new Promise(function (resolve, reject) {
    Course.findAll({
      where: {
        courseId: id
      }
    })
    .then((courses) => {
      if (courses.length > 0) {
        resolve(courses[0]);
      } else {
        reject("No results returned");
      }
    })
    .catch((err) => {
      reject("Error retrieving course by ID: " + err);
    });
  });
};


// defining updateStudent function
module.exports.updateStudent = function (studentData) {
  return new Promise(function (resolve, reject) {
    // Ensure the TA property is set properly
    studentData.TA = studentData.TA ? true : false;

    // Replace any blank values ("") with null
    for (const prop in studentData) {
      if (studentData[prop] === "") {
        studentData[prop] = null;
      }
    }

    // Invoke the Student.update() function and filter the operation by "studentNum"
    Student.update(studentData, {
      where: {
        studentNum: studentData.studentNum
      }
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to update student: " + err);
      });
  });
};

// addCourse(CourseData)
module.exports.addCourse = function (courseData) {
  return new Promise(function (resolve, reject) {
    // Replace any blank values ("") with null
    for (const prop in courseData) {
      if (courseData[prop] === "") {
        courseData[prop] = null;
      }
    }

    // Invoke the Course.create() function
    Course.create(courseData)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to create course: " + err);
      });
  });
};

// updateCourse(CourseData)
module.exports.updateCourse = function (courseData) {
  return new Promise(function (resolve, reject) {
    // Replace any blank values ("") with null
    for (const prop in courseData) {
      if (courseData[prop] === "") {
        courseData[prop] = null;
      }
    }

    // Invoke the Course.update() function and filter the operation by "courseId"
    Course.update(courseData, {
      where: {
        courseId: courseData.courseId
      }
    })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("Unable to update course: " + err);
      });
  });
};

// deleteCoursebyId(ID)
module.exports.deleteCourseById = function (id) {
  return new Promise(function (resolve, reject) {
    Course.destroy({
      where: {
        courseId: id
      }
    })
      .then((rowsDeleted) => {
        if (rowsDeleted > 0) {
          resolve(); // Course was successfully deleted
        } else {
          reject("Course not found"); // Course with the specified id was not found
        }
      })
      .catch((err) => {
        reject("Unable to delete course: " + err);
      });
  });
};
// defining deleteStudentByNum(studentNum) function

module.exports.deleteStudentByNum = function (studentNum) {
  return new Promise((resolve, reject) => {
    Student.destroy({
      where: { studentNum: studentNum },
    })
      .then((deletedRows) => {
        if (deletedRows > 0) {
          resolve("Student successfully deleted.");
        } else {
          reject("Student not found or not deleted.");
        }
      })
      .catch((err) => {
        reject("Error deleting student: " + err);
      });
  });
};

