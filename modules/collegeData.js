// class to hold student and course data
  class Data {
    constructor(students, courses) {
      this.students = students;
      this.courses = courses;
    }
  }

// variable to store the data collection
let dataCollection = null;

const fs = require('fs');
const path = require('path');


// defining initialize function
  function initialize() {
    return new Promise((resolve, reject) => {
      fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
        if (err) {
          reject(`Unable to read students.json: ${err}`);
          return;
        }
  
        fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
          if (err) {
            reject(`Unable to read courses.json: ${err}`);
            return;
          }
  
          try {
            var studentData = JSON.parse(studentDataFromFile);
            var courseData = JSON.parse(courseDataFromFile);
  
            dataCollection = new Data(studentData, courseData);
            resolve(dataCollection);
          } catch (error) {
            reject(`Error parsing JSON data: ${error}`);
          }
        });
      });
    });
  }

// defining getAllStudents function
  function getAllStudents() {
    return new Promise((resolve, reject) => {
      if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
        resolve(dataCollection.students);
      } else {
        reject("No results returned");
      }
    });
  }


// defining getTAs function
  function getTAs() {
    return new Promise((resolve, reject) => {
      if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
        var tas = dataCollection.students.filter((student) => student.TA);
        if (tas.length > 0) {
          resolve(tas);
        } else {
          reject("No results returned");
        }
      } else {
        reject("No results returned");
      }
    });
  }

  
  function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
     
        var matchedStudents = dataCollection.students.filter(studentByCrs => studentByCrs.course == course);
        if (matchedStudents.length > 0) {
          resolve(matchedStudents);
        } else {
          reject("No results returned");
        }
      });
  }

  function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
      var matchedStudentNum = dataCollection.students.filter(studentByNumber => studentByNumber.studentNum == num);  
      if (matchedStudentNum.length > 0) {
        resolve(matchedStudentNum);
      } else {
        reject("No results returned");
      }
    });
  }


// defining getCourses function
  function getCourses() {
    return new Promise((resolve, reject) => {
      if (dataCollection && dataCollection.courses && dataCollection.courses.length > 0) {
        resolve(dataCollection.courses);
      } else {
        reject("No results returned");
      }
    });
  }

// defining addStudent function
  function addStudent(studentData) {
    return new Promise((resolve, reject) => {
      // Set TA property to false if undefined, otherwise set it to true
      studentData.TA = studentData.TA === undefined ? false : true;
  
      // Set the studentNum property
      studentData.studentNum = dataCollection.students.length + 1;
  
      // Push the updated studentData to the students array
      dataCollection.students.push(studentData);
  
      // Resolve the promise to indicate successful addition of the student
      resolve();
    });
  }

// exporting modules 
  module.exports = {
    initialize,
    getAllStudents,
    getCourses,
    getTAs,
    getStudentByNum,
    getStudentsByCourse,
    addStudent,
  };