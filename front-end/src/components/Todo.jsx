import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/Todo.css';  
const TodoTable = () => {
  const [todos, setTodos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null); 
  const [currentTodo, setCurrentTodo] = useState({
    _id: null,
    title: '',
    description: '',
    dueDate: '',
    status: ''
  });
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    axios.get('http://localhost:5000/getTasks')
      .then(response => {
        // Convert the dueDate to a proper date format
        const todosWithFormattedDate = response.data.map(todo => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''
        }));
        setTodos(todosWithFormattedDate);
      })
      .catch(error => console.error('There was an error fetching the todos!', error));
  }, []);

  const handleDelete = (_id) => {
    axios.delete(`http://localhost:5000/deleteTask/${_id}`)
      .then(() => setTodos(todos.filter(todo => todo._id !== _id)))
      .catch(error => console.error('There was an error deleting the todo!', error));
  };

  const handleEdit = (todo) => {
    setEditMode(true);
    setCurrentTodo({
      _id: todo._id,
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      status: todo.status
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/updateTask/${currentTodo._id}`, currentTodo)
      .then(response => {
        const updatedTodo = {
          ...response.data,
          dueDate: response.data.dueDate ? new Date(response.data.dueDate).toISOString().split('T')[0] : ''
        };
        setTodos(todos.map(todo => (todo._id === currentTodo._id ? updatedTodo : todo)));
        setEditMode(false);
        setCurrentTodo({
          _id: null,
          title: '',
          description: '',
          dueDate: '',
          status: ''
        });
        setSelectedTodo(updatedTodo); 
      })
      .catch(error => console.error('There was an error updating the todo!', error));
  };

  const handleChange = (e) => {
    setCurrentTodo({ ...currentTodo, [e.target.name]: e.target.value });
  };

  const handleNewTodoChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/createTask', newTodo)
      .then(response => {
        const addedTodo = {
          ...response.data,
          dueDate: response.data.dueDate ? new Date(response.data.dueDate).toISOString().split('T')[0] : ''
        };
        setTodos([...todos, addedTodo]);
        setNewTodo({
          title: '',
          description: '',
          dueDate: '',
          status: 'pending'
        });
      })
      .catch(error => console.error('There was an error adding the todo!', error));
  };

  const handleSelectTodo = (todo) => {
    setSelectedTodo(todo); 
  };

  const handleLogout = () => {
    // Remove the token from localStorage or any other authentication mechanism
    localStorage.removeItem('authToken');
    // Redirect to login page or perform any other action
    window.location.href = '/login';
  };

  return (
    <div className="todo-container">
       <div className="header">
        <h2>Task List</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {editMode ? (
        <div className="form-container">
          <h3>Edit Task</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <input type="text" name="title" value={currentTodo.title} onChange={handleChange} placeholder="Title" required />
            <input type="text" name="description" value={currentTodo.description} onChange={handleChange} placeholder="Description" required />
            <input type="date" name="dueDate" value={currentTodo.dueDate} onChange={handleChange} required />
            <select name="status" value={currentTodo.status} onChange={handleChange} required>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit">Update</button>
          </form>
        </div>
      ) : (
        <div className="form-container">
          <h3>Add New Task</h3>
          <form onSubmit={handleAddTodo}>
            <input type="text" name="title" value={newTodo.title} onChange={handleNewTodoChange} placeholder="Title" required />
            <input type="text" name="description" value={newTodo.description} onChange={handleNewTodoChange} placeholder="Description" required />
            <input type="date" name="dueDate" value={newTodo.dueDate} onChange={handleNewTodoChange} required />
            <select name="status" value={newTodo.status} onChange={handleNewTodoChange} required>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <button type="submit">Add Task</button>
          </form>
        </div>
      )}
      <table className="todo-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map(todo => (
            <tr key={todo._id}>
              <td onClick={() => handleSelectTodo(todo)}>{todo.title}</td>
              <td>{todo.description}</td>
              <td>{todo.dueDate}</td>
              <td>{todo.status}</td>
              <td>
                <button onClick={() => handleEdit(todo)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(todo._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTodo && (
        <div className="todo-details">
          <h3>Todo Details</h3>
          <p><strong>Title:</strong> {selectedTodo.title}</p>
          <p><strong>Description:</strong> {selectedTodo.description}</p>
          <p><strong>Due Date:</strong> {selectedTodo.dueDate}</p>
          <p><strong>Status:</strong> {selectedTodo.status}</p>
        </div>
      )}
    </div>
  );
};

export default TodoTable;
