/********************************************************************************* 
 * * WEB700 – Assignment 04 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source 
 *  (including 3rd party web sites) or distributed to other students. *
 *  * Name: Omolayo Emiola Student ID: 130924228
 *  Date: 12th July, 2023 *
 * Online (Cyclic) Link: https://shy-lime-sparrow-wig.cyclic.app 
 * ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var collegeData = require("./modules/collegeData.js");

var app = express();
app.use(express.static(path.join(__dirname)));

// if there is a PUT request use this
app.use(express.urlencoded({ extended: true }));

// Parse JSON request body
app.use(express.json());

// GET /students route
app.get("/students", (req, res) => {
  const course = req.query.course;
  if (course) {
    collegeData.getStudentsByCourse(course)
      .then((students) => {
        if (students.length > 0) {
          res.json(students);
        } else {
          res.json({ message: "no results" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "no results" });
      });
  } else {
    collegeData.getAllStudents()
      .then((students) => {
        if (students.length > 0) {
          res.json(students);
        } else {
          res.json({ message: "no results" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "no results" });
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
        res.json(courses);
      } else {
        res.json({ message: "no results" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "no results" });
    });
});

// GET /student/num route
app.get("/student/:num", (req, res) => {
  const num = req.params.num;
  collegeData.getStudentByNum(num)
    .then((student) => {
      if (student) {
        res.json(student);
      } else {
        res.json({ message: "no results" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "no results" });
    });
});

// GET / route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html"));
});

// GET /about route
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// GET /htmlDemo route
app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

// start from here

// Route for /students/add
app.get('/students/add', (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

// Route for /students/add (POST)
app.post('/students/add', (req, res) => {
  // Call the addStudent function with req.body as the parameter
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

// end here

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
