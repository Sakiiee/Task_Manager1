const express = require("express")
const router = express.Router();
const TaskController = require('../TController/Taskcontroller')



router.get('/getTasks',TaskController.getTasks);
router.post('/createTask',TaskController.createTask);
router.delete('/deleteTask/:_id',TaskController.deleteTask)
router.put('/updateTask/:_id',TaskController.updateTask);



module.exports = router

