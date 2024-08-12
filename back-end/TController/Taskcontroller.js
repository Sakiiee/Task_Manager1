const TaskMod= require('../TaskModel/TaskModel')

//get 
 const getTasks = async (req, res) => {
    try {
      const tasks = await TaskMod.find();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


//post
const createTask = async (req, res) => {
    const { title, description, dueDate, status } = req.body;
  
    try {
      const newTask = new TaskMod({ title, description, dueDate, status });
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

//Delete
 const deleteTask = async (req, res) => {
    const  _id  = req.params._id;
  
    try {
      const deletedTask = await TaskMod.findByIdAndDelete(_id);
      if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

//Update
const updateTask = async (req, res) => {
    const  _id  = req.params._id;
  
    try {
      const updatedTask = await TaskMod.findByIdAndUpdate(_id, req.body, { new: true });
      if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };




module.exports={getTasks,createTask,deleteTask,updateTask}