const express = require("express");
const { verifyToken } = require("../middleware/verify");
const { multerUpload, uploadErrorHandler } = require("../middleware/multer");
const { register, validationRules } = require("../Controller/Register");
const verify = require("../Controller/Verify");
const { validationLogin, login } = require("../Controller/Login");
const { validateForgotPassword,forgotPassword } = require("../Controller/ForgotPassword");
const { validateResetPass, resetPassword } = require("../Controller/ResetPassword");
const { validateChangePass, changePassword } = require("../Controller/ChangePassword");
const { validateChangeUsername, changeUsername } = require("../Controller/ChangeUsername");
const { validateChangePhone, changePhone } = require("../Controller/ChangePhone");
const { validateChangeEmail, changeEmail } = require("../Controller/ChangeEmail");
const uploadAvatar = require("../Controller/ChangeAvatar");

const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post("/register", validationRules(), register);
authRouter.patch("/verify", verifyToken, verify);
authRouter.post("/login", validationLogin(), login);
authRouter.put("/forgotpass", validateForgotPassword(), forgotPassword);
authRouter.patch("/resetpass", validateResetPass(), resetPassword);
authRouter.patch("/changepass", validateChangePass(), changePassword);
authRouter.patch("/changeusername", validateChangeUsername(), changeUsername);
authRouter.patch("/changephone", validateChangePhone(), changePhone);
authRouter.patch("/changeemail", validateChangeEmail(), changeEmail);
authRouter.post("/changeavatar", multerUpload.single("avatars"), uploadErrorHandler, uploadAvatar);

module.exports = authRouter;
