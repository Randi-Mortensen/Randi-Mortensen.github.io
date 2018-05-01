# Mongodb-Express-EJS
## Node.js, Express.js, Mongoose and MongoDB CRUD
# Sådan oprettes en Node.js, Express.js og MongoDB CRUD Web Application
## Tutorial til at oprette en Node.js, Express.js og MongoDB CRUD Web Application fra bunden ved hjælp af Express.js grundlæggende funktion.

# node js & mongoodb skal være installeret inden du starter
# Start mongodb her: C:\MongoDB\Server\3.6\bin\mongod.exe

* Dette er vejledningen til, hvordan man opretter en Node.js, Express.js og MongoDB CRUD Web Application fra bunden med grundlæggende brug af Express.js. Til datamodellering bruger vi Mongoose.js-modulet og til brugergrænseflade (User Interface) eller frontend, bruger vi "ejs" i stedet for jade, der leveres med Express.js-projektgenerering. Spild ikke din tid, lad os komme i gang.

## 1. Opret webapplikationsprojekt
* Opret repositori på github og clone til din maskine
* Åben Virtual studie code og stil dig i mappen med dit repositori
* Installer express-generator hvis du ikke allerede har gjort det
```javascript
npm install express-generator –g
```
* Der efter:
```javascript
express --view=ejs
```
* Der efter:
```javascript
npm install
```
* Der efter:
```javascript
npm install mongoose --save
```
* Nu skal du åbne og redigere app.js fra roden af projektmappen. Tilføj Mongoose.js for callback til MongoDB.
```javascript
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/product')
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));
```
* Vi skal teste forbindelsen til MongoDB server ved at køre applikationen ved hjælp af "nodemon". Hvis der ikke er installeret nogen "nodemon", skal du køre denne kommando først.
```javascript
npm install -g nodemon
```
* Kør derefter applikationen.
```javascript
nodemon
```
* Du bør se denne besked i konsolen, hvis alt er ok.
```javascript
[nodemon] 1.11.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node ./bin/www`
connection succesful
```
## 2. Opret Mongoose.js Model
* For at oprette Mongoose.js-modellen skal du først oprette en modelmappe der hedder.
* models
* Derefter oprette en ny Javascript-fil, til Mongoose.js-modellen.
* models/Employee.js
* Nu skal du åbne og redigere den fil og tilføje Mongoose require.
```javascript
var mongoose = require('mongoose');

// Tilføj derefter modelfelter som denne.
var EmployeeSchema = new mongoose.Schema({
  name: String,
  address: String,
  position: String,
  salary: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Employee', EmployeeSchema);
```
## 3. Opret Controller for CRUD Operations
* For at gøre vores applikation mere modulær og møde For at gøre vores applikation mere modulær og møde MVC-mønster, skal vi oprette controller til CRUD-operationer. Til det skal du oprette en ny "controllers" -mappe og oprette en ny Javascript-fil som controller. Vi skal oprette controlleren til CRUD-operationer. For det skal du oprette en ny mappe "controllers" og derefter oprette en ny Javascript-fil som controller.

* Opret Mappe  controllers
* Derefter oprette en ny Javascript-fil, til Mongoose.js-modellen.
* controllers/EmployeeController.js
* Åbn og rediger EmployeeController.js-filen. Tilføj dette require til filen.
```javascript
var mongoose = require("mongoose");
//Add model require.
var Employee = mongoose.model("Employee");
//Opret controller objekt til CRUD operationer.
var employeeController = {};
//Tilføj vis liste over medarbejderfunktion.
employeeController.list = function(req, res) {
  Employee.find({}).exec(function (err, employees) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/employees/index", {employees: employees});
    }
  });
};
//Tilføj vis enkeltmedarbejder ved id-funktion.
employeeController.show = function(req, res) {
  Employee.findOne({_id: req.params.id}).exec(function (err, employee) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/employees/show", {employee: employee});
    }
  });
};
//Tilføj create medarbejderfunktion
employeeController.create = function(req, res) {
  res.render("../views/employees/create");
};
//Tilføj Gem ny medarbejderfunktion.
employeeController.save = function(req, res) {
  var employee = new Employee(req.body);

  employee.save(function(err) {
    if(err) {
      console.log(err);
      res.render("../views/employees/create");
    } else {
      console.log("Successfully created an employee.");
      res.redirect("/employees/show/"+employee._id);
    }
  });
};
//Tilføj rediger medarbejder ved id-funktion, det omdirigerer bare til at redigere side.
employeeController.edit = function(req, res) {
  Employee.findOne({_id: req.params.id}).exec(function (err, employee) {
    if (err) {
      console.log("Error:", err);
    }
    else {
      res.render("../views/employees/edit", {employee: employee});
    }
  });
};
//Tilføj opdaterings medarbejderfunktion til opdatering af aktuelt redigeret medarbejder.
employeeController.update = function(req, res) {
  Employee.findByIdAndUpdate(req.params.id, { $set: { name: req.body.name, address: req.body.address, position: req.body.position, salary: req.body.salary }}, { new: true }, function (err, employee) {
    if (err) {
      console.log(err);
      res.render("../views/employees/edit", {employee: req.body});
    }
    res.redirect("/employees/show/"+employee._id);
  });
};
//Tilføj slette medarbejder ved id-funktion for at fjerne enkeltmedarbejdersdata.
employeeController.delete = function(req, res) {
  Employee.remove({_id: req.params.id}, function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("Employee deleted!");
      res.redirect("/employees");
    }
  });
};
//Eksporter medarbejder controller som et modul.
module.exports = employeeController;
```
## 4. Opret routes
* Åbn og rediger routes/employees.js
* Først skal du tilføje express require and create router
```javascript
var express = require('express');
var router = express.Router();
//Tilføj alle ruter til CRUD-funktioner
// Get all employees
router.get('/', employee.list);

// Get single employee by id
router.get('/show/:id', employee.show);

// Create employee
router.get('/create', employee.create);

// Save employee
router.post('/save', employee.save);

// Edit employee
router.get('/edit/:id', employee.edit);

// Edit update
router.post('/update/:id', employee.update);

// Edit update
router.post('/delete/:id', employee.delete);
//export router as a module.
module.exports = router;
```
* Derefter skal du åbne og redigere app.js og derefter tilføje employee route as require efter users require.
```javascript
var employees = require('./routes/employees');
```
* use after use of users.
```javascript
app.use('/employees', employees);
```
## 5. Opret visninger for CRUD brugergrænseflade.
* Fordi vi skaber separate views for employee CRUD, skal du tilføje en ny mappe i views mappen og navngive den employee.
* Lav en ny index.ejs i views/employee mappen.
* Åbn og rediger index.ejs og tilføj HTML-kode som denne.
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Employee List</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <div class="container">
      <h3><a href="/employees/create">Create Employee</a></h3>
      <h1>Employee List</h1>
      <% if(employees.length>0) { %>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>

          <% for(var i=0; i<employees.length;i++) { %>
            <tr>
              <td><a href="/employees/show/<%= employees[i]._id%>"><%= employees[i].name%></a></td>
              <td><%= employees[i].position%></td>
            </tr>
          <% } %>
        </tbody>
      </table>
      <% } else { %>
        <div>No employees found.</div>
      <% } %>
    </div>
  </body>
</html>
```
* Opret show.ejs her employees/show.ejs
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Employee Detail</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <div class="container">
      <h3><a href="/employees">Employee List</a></h3>
      <h1>Employee Detail</h1>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>:</td>
            <td><%= employee.name %></td>
          </tr>
          <tr>
            <td>Address</td>
            <td>:</td>
            <td><%= employee.address %></td>
          </tr>
          <tr>
            <td>Position</td>
            <td>:</td>
            <td><%= employee.position %></td>
          </tr>
          <tr>
            <td>Salary</td>
            <td>:</td>
            <td>$<%= employee.salary %>/year</td>
          </tr>
        </tbody>
      </table>
      <h3><a href="/employees/edit/<%= employee._id%>">EDIT</a></h3>
      <form action="/employees/delete/<%= employee._id%>" method="post">
        <button type="submit">DELETE</button>
      </form>
    </div>
  </body>
</html>
```
* Opret create.ejs her employees/create.ejs

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Create Employee</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <div class="container">
      <h3><a href="/employees">Employee List</a></h3>
      <h1>Create New Employee</h1>
      <form action="/employees/save" method="post">
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td><input type="text" name="name" /></td>
            </tr>
            <tr>
              <td>Address</td>
              <td><textarea name="address"></textarea></td>
            </tr>
            <tr>
              <td>Position</td>
              <td><input type="text" name="position" /></td>
            </tr>
            <tr>
              <td>Salary</td>
              <td><input type="number" name="salary" /></td>
            </tr>
            <tr>
              <td colspan="2"><input type="submit" value="Save" /></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </body>
</html>
```
* Opret edit.ejs her employees/edit.ejs
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Edit Employee</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <div class="container">
      <h3><a href="/employees">Employee List</a></h3>
      <h1>Edit Employee</h1>
      <form action="/employees/update/<%= employee._id%>" method="post">
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td><input type="text" name="name" value="<%= employee.name %>" /></td>
            </tr>
            <tr>
              <td>Address</td>
              <td><textarea name="address"><%= employee.address %></textarea></td>
            </tr>
            <tr>
              <td>Position</td>
              <td><input type="text" name="position" value="<%= employee.position %>" /></td>
            </tr>
            <tr>
              <td>Salary</td>
              <td><input type="number" name="salary" value="<%= employee.salary %>" /></td>
            </tr>
            <tr>
              <td colspan="2"><button type="submit">Update</button></td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </body>
</html>
```
* Den sidste ting at gøre er styling synspunkterne. Bare åbn og rediger offentlige / stylesheets / style.css og erstatt derefter alle CSS-koder med disse koder.

```css
body {
  padding: 30px;
  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
  color: #555555;
}

a {
  color: #00B7FF;
}

.container {
  padding: 20px;
  background-color: #efefef;
  width: 400px;
  border-radius: 6px;
}
.container h3 a {
  text-decoration: none;
  padding: 10px 20px;
  background-color: #00AE4D;
  border-radius: 6px;
  color: #FFFFFF;
}

.container h3 a:hover, .container table tr td button:hover {
  background-color: #78F5AE;
  color: #999999;
}

.container table {
  width: 360px;
}

.container table tr td {
  padding: 5px;
}

.container table tr td input, .container table tr td textarea {
  border: solid 1px #dddddd;
  padding: 5px 10px;
  border-radius: 6px;
  width: 100%;
  color: #777777;
}

.container table tr td button {
  border: solid 1px #AABF5C;
  background-color: #00AE4D;
  border-radius: 6px;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 10px 0;
  padding: 10px 20px;
}

.container form button {
  border: solid 1px #CB2027;
  background-color: #DD4B39;
  border-radius: 6px;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 10px 0;
  padding: 10px 20px;
}

.container .list-table {
  width: 360px;
  border: solid 2px #DDDDDD;
  border-spacing: 0;
}

.container .list-table th {
  border-bottom: solid 2px #DDDDDD;
}
```
* Endelig kan du bare køre og teste applikations CRUD-funktionerne med:
```javascript
nodemon
```
* Åbn din browser og gå til denne URL "localhost: 3000 / employees". Hvis du ser siden med meddelelsen "Ingen medarbejdere fundet." og en create knap, er det tydeligt, at din CRUD-funktion er klar til at blive testet i browseren.
### Noter: Denne vejledning er bare den grundlæggende brug af express.js og mongoose.js på toppen af node.js.
