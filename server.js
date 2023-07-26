/********************************************************************************* 
 * * WEB700 – Assignment 05 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 *  (including 3rd party web sites) or distributed to other students. *
 *  * Name: Omolayo Emiola Student ID: 130924228
 *  Date: 25th July, 2023 *
 * Online (Cyclic) Link: https://shy-lime-sparrow-wig.cyclic.app 
 * ********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData.js");
const students = []; 


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
          res.render("students", { message: "no results" });
        }
      })
      .catch((error) => {
        res.render("students", { message: "no results" });
      });
  } else {
    collegeData.getAllStudents()
      .then((students) => {
        if (students.length > 0) {
          res.render("students", { students: students });
        } else {
          res.render("students", { message: "no results" });
        }
      })
      .catch((error) => {
        res.render("students", { message: "no results" });
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
        res.render("courses", { message: "no results" });
      }
    })
    .catch((error) => {
      res.render("courses", { message: "no results" });
    });
});

// GET /student/num route
app.get("/student/:studentNum", (req, res) => {
  const studentNum = req.params.studentNum;
  collegeData.getStudentByNum(studentNum)
    .then((student) => {
      if (student) {
        res.render("student", { student: student });
      } else {
        res.render("not-found", { message: "No student found with the provided student number." });
      }
    })
    .catch((error) => {
      console.error("Error in GET /student/:studentNum:", error.message);
      res.status(500).send("Error occurred");
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
  res.render('addStudent'); 
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
