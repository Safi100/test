const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const http = require('http');

const app = express();

const server = http.createServer(app);

const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`); 
    // Other socket.io event handlers...
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});


mongoose.connect('mongodb+srv://safio100:safio100@cluster0.szszf4r.mongodb.net/todoapp?retryWrites=true&w=majority&appName=Cluster0',)
.then(() => { 
    console.log("database connected successfully");
})
.catch((err) => { 
    console.log(err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

const Todo = require('./todo.model');

app.get('/get-todos', async (req, res) => {
    try{
        const todos = await Todo.find().sort({completed: -1, createdAt: 1});
        res.status(200).json(todos);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
});

app.post('/create-todo', async (req, res) => {
    try{
        const { title } = req.body;
        const todo = new Todo({
            title: title.trim(),
        });    
        await todo.save();
        io.emit('todoCreated', todo);
        res.status(200).json(todo);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }    
});
app.delete('/delete-todo/:id', async (req, res) => {
    try{
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw new Error('Invalid ID');
        const { id } = req.params;
        const todo = await Todo.findByIdAndDelete(id);
        if(!todo) throw new Error('Todo not found');
        io.emit('todoDeleted', { id }); // Emitting an event after a todo is deleted
        res.status(200).json(todo);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
});
server.listen(3000, () => {
    console.log('Server running on port 3000');
});
