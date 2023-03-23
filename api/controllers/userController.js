const AppError = require("../../utill/appError");
const catchAsync = require("../../utill/catchAsync");
const db = require("../../db-setup");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CsvParser = require("json2csv").Parser;
const excel = require("exceljs");
const emailSent = require("../services/mailController");

// create main model
const User = db.userAuth;

/* API for sign Up and alert mail send*/

exports.userSignup = catchAsync(async (req, res, next) => {
  const emailExists = await User.findOne({
    where: { email: req.body.email },
  });
  const password = await bcrypt.hash(req.body.password, 8);
  if (emailExists) {
    return next(new AppError("Email already registered", 404));
  } else {
    const newUserDetails = await User.create({
        userName: req.body.userName,
        name: req.body.name,
        email: req.body.email,
        password: password,
        phoneNumber: req.body.phoneNumber,
        userType: "user"
    });
    const emailAdd = req.body.email;
    const name = req.body.name;
    emailSent.alertMail(
      emailAdd,
      name
    );

    res.status(200).json({
      status: "success",
      data: {
        user: newUserDetails,
      },
    });
  }
});

/* API for loginand alert mail send */

exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
      const isMatch = await bcrypt.compare(req.body.password, user.password);
        console.log(isMatch,"isMatch");
      if (isMatch) {
        const token = jwt.sign({ id: user.id }, "secret", {
          expiresIn: "24hr",
        });

        const emailAdd = user.email;
        const name = user.name;

        emailSent.alertMail(
          emailAdd,
          name
        );

        return res.send({
          object: "user",
          data: { user, token },
          message: "signin success",
        });
      } else {
        return next(new AppError("Please enter a valid password", 404));
      }
  } else {
    return next(new AppError("user not found", 404));
  }
});

/* API for getting user list only to admin */

exports.userData = catchAsync(async (req, res, next)=>{
  const userId = req.user.id;
  const userAdminCheck = await User.findOne({ where: { id: userId } });
  if(userAdminCheck.userType === "admin"){
    const userDetails = await User.findAll();
    return res.send({
      object: "User Data Details",
      data: userDetails,
      message: "Get All User Data Successfully",
    });
  } else {
    return next(new AppError("Enable to found users Data", 404));
  }
});

/* API to update user details by admin */

exports.userDetailsUpdate = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const adminId = req.user.id;
  const userAdminCheck = await User.findOne({ where: { id: adminId } });
  if(userAdminCheck.userType === "admin"){
    userUpdateDetails = await User.update(req.body, { where: { id: userId }})

    return res.send({
      object: "Update User",
      data: userUpdateDetails,
      message: "User Updated Successfully",
    });
  } else {
    return next(new AppError("Enable to found user Id", 404));
  }
});

/* API to delete user detail by admin */

exports.deleteUserData = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const adminId = req.user.id;
  const userAdminCheck = await User.findOne({ where: { id: adminId } });
  if(userAdminCheck.userType === "admin"){
    userDetails = await User.destroy({ where: { id: userId }})

    return res.send({
      object: "Update User",
      data: userDetails,
      message: "User Updated Successfully",
    });
  } else {
    return next(new AppError("Enable to found user Id", 404));
  }
});


/* API to export user list as a csv fileby admin admin */

exports.exportCSVFile = catchAsync(async (req, res, next) => {
  const adminId = req.user.id;
  const userAdminCheck = await User.findOne({ where: { id: adminId } });
  if(userAdminCheck.userType === "admin"){
    await User.findAll().then((objs) => {
    let usersData = [];
    objs.forEach((obj) => {
      const { id, userName, name, email, password, phoneNumber } = obj;
      usersData.push({ id, userName, name, email, password,  phoneNumber});
    });

    const csvFields = ["Id", "UserName", "Name", "Email","Password","PhoneNumber"];
    const csvParser = new CsvParser({ csvFields });
    const csvData = csvParser.parse(usersData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=usersData.csv");      
    return res.send({
      object: "DATA",
      data: csvData,
      message: "Data Successfully",
    });
    })
  } else {
    return next(new AppError("User is not an admin", 404));
  }
});


/* API to export user list as a excel .xlsx fileby admin admin */

exports.exportExcelFileData = catchAsync(async (req, res, next) => {
  const adminId = req.user.id;
  const userAdminCheck = await User.findOne({ where: { id: adminId } });
  if(userAdminCheck.userType === "admin"){
    await User.findAll().then((objs) => {
      let userData = [];
  
      objs.forEach((obj) => {
        userData.push({
          id: obj.id,
          userName: obj.userName,
          name: obj.name,
          email: obj.email,
          password: obj.password,
          phoneNumber: obj.phoneNumber
        });
      });
  
      let workbook = new excel.Workbook();
      let worksheet = workbook.addWorksheet("UserDetails");
  
      worksheet.columns = [
        { header: "Id", key: "id", width: 5 },
        { header: "UserName", key: "userName", width: 25 },
        { header: "Name", key: "name", width: 25 },
        { header: "EMail", key: "email", width: 30 },
        { header: "Password", key: "published", width: 30 },
        { header: "PhoneNumber", key: "phoneNumber", width: 30 },
      ];
  
      // Add Array Rows
      worksheet.addRows(userData);
  
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "userData.xlsx"
      );
  
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    });
  } else {
    return next(new AppError("User is not an admin", 404));
  }
});

