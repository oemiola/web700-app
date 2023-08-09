/********************************************************************************* 
 * * WEB700 – Assignment 05 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 *  (including 3rd party web sites) or distributed to other students. *
 *  * Name: Omolayo Emiola Student ID: 130924228
 *  Date: 25th July, 2023 *
 * Online (Cyclic) Link: https://handsome-turtleneck-shirt-crab.cyclic.app 
 * ********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData.js");



const app = express();
app.use(express.static(path.join(__dirname)));

// if there is a PUT request use this
app.use(express.urlencoded({ extended: true }));

// Parse JSON request body
app.use(express.json());

app.set("views", path.join(__dirname, "views"));

// middleware function
app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  next();
  });

// custom helper
const customHelpers={ 
  navLink: function (url, options) {
    const activeRoute = options.data.root.activeRoute; // Get the activeRoute from options
    return '<li' +
      ((url === activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') +
      '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
  },
  equalHelper: function (lvalue, rvalue, options) {
    if (arguments.length < 3) {
      throw new Error("Handlebars Helper equal needs 2 parameters");
    }
    
    if (lvalue == rvalue) {
      return options.fn(this); // Executes the "true" block
    } else {
      return options.inverse(this); // Executes the "false" block
    }
  },
  ifEqual: function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  }
};

const exphbs = require('express-handlebars').create({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: customHelpers
});

// Set up the view engine (express-handlebars)
app.engine("hbs", exphbs.engine); // Use the exphbs.engine instance here
app.set("view engine", "hbs");


// GET /students route
app.get("/students", (req, res) => {
  const course = req.query.course;
  if (course) {
    collegeData.getStudentsByCourse(course)
      .then((students) => {
        if (students.length > 0) {
          res.render("students", { students: students });
        } else {
          res.render("students", { message: "No results for the selected course." });
        }
      })
      .catch((error) => {
        res.render("students", { message: "Error retrieving students for the selected course." });
      });
  } else {
    collegeData.getAllStudents()
      .then((students) => {
        if (students.length > 0) {
          res.render("students", { students: students });
        } else {
          res.render("students", { message: "No results found." });
        }
      })
      .catch((error) => {
        res.render("students", { message: "Error retrieving all students." });
      });
  }
});


// GET /tas route
app.get("/tas", (req, res) => {
  collegeData.getTAs()
    .then((tas) => {
      if (tas.length > 0) {
        res.json(tas);
      } else {
        res.json({ message: "no results" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "no results" });
    });
});

// GET /courses route
app.get("/courses", (req, res) => {
  collegeData.getCourses()
    .then((courses) => {
      if (courses.length > 0) {
        res.render("courses", { courses: courses });
      } else {
        res.render("courses", { message: "No results found." });
      }
    })
    .catch((error) => {
      res.render("courses", { message: "Error retrieving courses." });
    });
});


// GET /student/num route
app.get("/student/:studentNum", (req, res) => {
  // Initialize an empty object to store the values
  let viewData = {};

  data.getStudentByNum(req.params.studentNum)
    .then((studentData) => {
      if (studentData) {
        viewData.student = studentData; // Store student data in the "viewData" object as "student"
      } else {
        viewData.student = null; // Set student to null if none were returned
      }
    })
    .catch(() => {
      viewData.student = null; // Set student to null if there was an error
    })
    .then(data.getCourses)
    .then((courseData) => {
      viewData.courses = courseData; // Store course data in the "viewData" object as "courses"

      // Loop through viewData.courses and once we have found the courseId that matches
      // the student's "course" value, add a "selected" property to the matching
      // viewData.courses object
      if (viewData.student && viewData.courses) {
        for (let i = 0; i < viewData.courses.length; i++) {
          if (viewData.courses[i].courseId == viewData.student.course) {
            viewData.courses[i].selected = true;
          }
        }
      } else {
        viewData.courses = []; // Set courses to empty if there was an error or no student data
      }
    })
    .catch(() => {
      viewData.courses = []; // Set courses to empty if there was an error
    })
    .then(() => {
      if (viewData.student == null) {
        // If no student - return an error
        res.status(404).send("Student Not Found");
      } else {
        res.render("student", { viewData: viewData }); // Render the "student" view
      }
    });
});

// New GET route for deleting a student
app.get("/student/delete/:studentNum", (req, res) => {
  const studentNum = req.params.studentNum;
  collegeData.deleteStudentByNum(studentNum)
    .then(() => {
      res.redirect("/students"); // Redirect to "/students" view after successful deletion
    })
    .catch((error) => {
      console.error("Error deleting student:", error.message);
      res.status(500).send("Unable to Remove Student / Student not found");
    });
});


// GET / route
app.get("/", (req, res) => {
  res.render("home"); // This will render the "home.hbs" view file
});

// GET /about route
app.get("/about", (req, res) => {
  res.render("about"); // This will render the "about.hbs" view file
});


// GET /htmlDemo route
app.get("/htmlDemo", (req, res) => {
  res.render("htmlDemo"); // This will render the "htmlDemo.hbs" view file
});


// Route for /students/add
app.get('/students/add', (req, res) => {
  collegeData.getCourses()
    .then((courses) => {
      res.render('addStudent', { courses: courses });
    })
    .catch((error) => {
      res.render('addStudent', { courses: [] });
    });
});

// GET route /courses/add
app.get("/courses/add", (req, res) => {
  console.log("Test ...............................")
  res.render("addCourse");
});

// Route for /students/add (POST)
app.post('/students/add', (req, res) => {
  // Call the addStudent function 
  collegeData.addStudent(req.body)
    .then(() => {
      // Redirect to the "/students" route on success
      res.redirect('/students');
    })
    .catch((error) => {
      // Handle any errors that occur during the addStudent function call
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

// GET  route for /course/id
app.get("/course/:id", (req, res) => {
  const courseId = parseInt(req.params.id); 
  collegeData.getCourseById(courseId) // Call the getCourseById method from the collegeData module
    .then((course) => {
      res.render("course", { course }); // Render the "course" view with the course data
    })
    .catch((error) => {
      res.status(404).render("course", { message: "Course not found" }); // Render the "course" view with an error message if the course is not found
    });
});

 // POST route for /courses/add
 app.post("/courses/add", (req, res) => {
  const courseData = {
    courseCode: req.body.courseCode,
    courseDescription: req.body.courseDescription
  };

  collegeData.addCourse(courseData)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((error) => {
      res.render("addCourse", { message: "Unable to add course. Please try again." });
    });
});
// POST route /course/update
app.post("/course/update", (req, res) => {
  const courseData = {
    courseId: req.body.courseId,
    courseCode: req.body.courseCode,
    courseDescription: req.body.courseDescription
  };

  collegeData.updateCourse(courseData)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((error) => {
      res.render("updateCourse", { message: "Unable to update course. Please try again." });
    });
});

// GET route /course/delete/:id
app.get("/course/delete/:id", (req, res) => {
  const courseId = req.params.id;

  collegeData.deleteCourseById(courseId)
    .then(() => {
      res.redirect("/courses");
    })
    .catch((error) => {
      res.status(500).send("Unable to Remove Course / Course not found");
    });
});

// POST route for /student/update
app.post("/student/update", (req, res) => {
  const studentData = req.body;

  // Validate the studentNum field
  if (!studentData.studentNum || isNaN(studentData.studentNum)) {
    return res.status(400).send("Invalid studentNum provided");
  }

  console.log("Before updateStudent:", studentData); // Debugging statement

  // Invoke the updateStudent() method with req.body as the parameter
  collegeData
    .updateStudent(studentData)
    .then(() => {
      console.log("Student updated successfully"); // Debugging statement
      res.redirect("/students");
    })
    .catch((error) => {
      console.error("Error updating student:", error.message);
      res.status(500).send("Error updating student: " + error.message);
    });

  console.log("After updateStudent"); // Debugging statement
});

// 404 route
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

// Initialize collegeData
collegeData.initialize()
  .then(() => {
    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log("Server listening on port: " + HTTP_PORT);
    });
  })
  .catch((error) => {
    console.error("Error initializing collegeData:", error);
  });

 
    

  