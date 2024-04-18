const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
// const {canvas}=require("canvas");
const port = 8080;
app.use(express.static(path.join(__dirname,"public")));
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
  res.render("form.ejs");
});
//let details = [];
const upload = multer({ storage });
app.post("/submit", upload.single("photo"), (req, res) => {
  //console.log(req.body);
  //console.log(req.file);
  let {fullname,rollno,dept,dob,validity,bldgrp,issdate,address,uid,no}=req.body;
  let img_url=req.file.filename;
  //console.log(img_url);
  //details.push({fullname,rollno,dob,validity,bldgrp,issdate,address});
  // const canvas=new canvas();
  // jsBarcode(canvas,req.body.uid,{
  //   lineColor:"#000"
  // });
  res.render("id_card",{fullname,rollno,dept,dob,validity,bldgrp,issdate,address,img_url,uid,no});
});
