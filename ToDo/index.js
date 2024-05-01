// Import necessary modules using ES module syntax
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import TodoModel from './Models/Todo.js'; // Assuming TodoModel is exported from Todo.js

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://hrushikesh2004k:GmESgpHgkrW6b6or@cluster0.5torxmz.mongodb.net/ToDo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB Connected");
}).catch(err => {
  console.error("MongoDB Connection Error:", err);
});

app.get('/get',(req, res)=> {
    TodoModel.find()
    .then(result => res.json(result))
    .catch(err => res.json(err))
})
app.post('/add', (req, res) => {
  const task = req.body.task;
  TodoModel.create({
    task: task
  }).then(result => res.json(result))
    .catch(err => res.json(err));
});
// Delete a todo by ID
app.delete('/delete/:content', (req, res) => {
    const todoContent = req.params.content;
    TodoModel.findOneAndDelete({ task: todoContent })
      .then(result => {
        if (!result) {
          return res.status(404).json({ message: 'Todo not found' });
        }
        return res.json({ message: 'Todo deleted successfully' });
      })
      .catch(err => {
        console.error('Error deleting todo:', err);
        return res.status(500).json({ message: 'Internal server error' });
      });
  });
 
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server Is Running on port ${PORT}`);
});

// Close MongoDB connection when the app is terminated
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection disconnected through app termination');
    process.exit(0);
  });
});
