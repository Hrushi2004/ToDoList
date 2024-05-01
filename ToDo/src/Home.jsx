import React, { useState, useRef, useEffect } from 'react';
import './Home.css'; // Import CSS file for styles
import axios from 'axios';
import { RiDeleteBin6Line } from 'react-icons/ri'; // Importing delete icon from react-icons
import { RiCheckDoubleFill } from 'react-icons/ri'; // Importing check double fill icon from react-icons

function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [todos, setTodos] = useState([]);
  const taskInputRef = useRef(null); // Ref for the input field
  useEffect(() => {
    axios.get('http://localhost:3001/get')
      .then(result => setTodos(result.data))
      .catch(err => console.log(err))
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAdd = () => {
    axios.post('http://localhost:3001/add', { task: task })
      .then(result => {
        alert('Task added successfully');
        taskInputRef.current.value = ''; // Clear the input field using ref
        // Fetch tasks again to update the list
        axios.get('http://localhost:3001/get')
          .then(result => setTodos(result.data))
          .catch(err => console.log(err));
        console.log(result);
      })
      .catch(err => console.log(err))
  };

  const handleDelete = (taskContent) => {
    axios.delete(`http://localhost:3001/delete/${taskContent}`)
      .then(result => {
        alert('Task deleted successfully');
        // Fetch tasks again to update the list
        axios.get('http://localhost:3001/get')
          .then(result => setTodos(result.data))
          .catch(err => console.log(err));
        console.log(result);
      })
      .catch(err => console.log(err))
  };

  const handleComplete = (taskContent) => {
    alert('Congratulations! Task completed: ' + taskContent);
    axios.delete(`http://localhost:3001/delete/${taskContent}`)
      .then(result => {
        axios.get('http://localhost:3001/get')
          .then(result => setTodos(result.data))
          .catch(err => console.log(err));
        console.log(result);
      })
      .catch(err => console.log(err))
  };

  const [task, setTask] = useState('');

  return (
    <div className="container">
      <div className={`wrapper ${isExpanded ? 'expanded' : ''}`}>
        {!isExpanded && (
          <div className={`fields visible`} style={{position: 'absolute', top: '-110px', left: '10px'}}>
            <h1>Click to add newTask</h1>
          </div>
        )}
        {isExpanded && (
          <div className={`fields visible`}>
            <div className='Task'>
              <input ref={taskInputRef} type="text" placeholder="Enter task to add" onChange={(e) => setTask(e.target.value)} />
              <button onClick={handleAdd}>Add</button>
            </div>
          </div>
        )}
        <div className={`arrow`} onClick={toggleExpand}  style={{position: 'absolute', top: '-10px', left: '290px'}}>
          {isExpanded ? '←' : '+'}
        </div>
      </div>
      <div className='heading'>
        <h1>ToDo List</h1>
        <table className="todo-table">
          <thead>
            <tr style={{ color: 'black' }}>
              <th>Task</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td style={{ color: 'black' }}>{todo.task}</td>
                <td>
                  <div className="action-icons" style={{ color: 'black' }}>
                    <RiDeleteBin6Line onClick={() => handleDelete(todo.task)} />
                    <span className="icon-space"></span> {/* Add space between icons */}
                    <RiCheckDoubleFill onClick={() => handleComplete(todo.task)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {todos.length === 0 && <h2>No Activities in ToDo</h2>}
      </div>
    </div>
  );
}

export default Home;
