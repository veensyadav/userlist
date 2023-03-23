const express = require("express");

const userController = require("../controllers/userController");
const verifyToken = require("../services/verifyToken");

/*
    baseUrl: api/v1/userAuth/
*/
const router = express.Router();

router.post("/signup", userController.userSignup);
router.post("/login", userController.login);

router.get("/usersList", verifyToken.verifyToken, userController.userData);
router.put("/update/users/:id",verifyToken.verifyToken, userController.userDetailsUpdate);
router.delete("/delete/user/:id",verifyToken.verifyToken, userController.deleteUserData);
router.get("/csv/download",verifyToken.verifyToken, userController.exportCSVFile);
router.get("/excel/download",verifyToken.verifyToken, userController.exportExcelFileData);


module.exports = router;

