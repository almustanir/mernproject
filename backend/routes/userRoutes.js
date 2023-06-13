const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT)

router
  .route("/")
  .get(usersControllers.getAllusers) //TO read
  .post(usersControllers.createNewUser) //To create
  .patch(usersControllers.updateUser) //To update
  .delete(usersControllers.deleteUser); //To delete

module.exports = router;
