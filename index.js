const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const XLSX = require("xlsx");
constfs = require("fs");
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Babi@2003",
  database: "clg_records",
});
// const {canvas}=require("canvas");
const port = 8080;
app.use(express.static(path.join(__dirname, "public")));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
app.get("/", (req, res) => {
  //res.render("form.ejs");
  res.render("form_emp");
});
//let details = [];
const upload = multer({ storage });
app.post("/submit", upload.single("photo"), (req, res) => {
  connection.query(
    `INSERT INTO emp VALUES (${req.body.uid},'${req.body.fullname}','${req.body.dept}','${req.body.desg}','${req.body.bldgrp}','${req.body.address}','${req.body.no}');`,
    function (error, result) {
      if (error) throw error;
      console.log("Record inserted in the sql server");
    }
  );

  function appendRowToExcel(filename, sheetName, rowData) {
    try {
      const workbook = XLSX.readFile(filename);

      const sheet = workbook.Sheets[sheetName];

      const worksheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      worksheetData.push(rowData);

      const updatedSheet = XLSX.utils.aoa_to_sheet(worksheetData);

      workbook.Sheets[sheetName] = updatedSheet;

      XLSX.writeFile(workbook, filename);
      console.log("Row appended successfully!");
    } catch (error) {
      console.error("Error occurred while appending row:", error.message);
    }
  }

  const filename = "records.xlsx"; 
  const sheetName = "Sheet1"; 
  const rowData = [
    `${req.body.uid}`,
    `${req.body.fullname}`,
    `${req.body.dept}`,
    `${req.body.desg}`,
    `${req.body.bldgrp}`,
    `${req.body.address}`,
    `${req.body.no}`,
  ]; 

  appendRowToExcel(filename, sheetName, rowData);

  let { fullname, dept, bldgrp, address, uid, no, desg } = req.body;
  let img_url = req.file.filename;
  console.log(req.body.fullname);
  
  res.render("id_card", {
    fullname,
    dept,
    bldgrp,
    address,
    img_url,
    uid,
    no,
    desg,
  });
});
