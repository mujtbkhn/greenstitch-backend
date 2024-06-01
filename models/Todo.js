const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20
    },
    description: {
        type: String,
        minlength: 10,
        maxlength: 50
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    timestamp: {
        type: String,
        required: function () { return this.status === 'Completed'; }
    }
});

module.exports = mongoose.model('Todo', TodoSchema);
