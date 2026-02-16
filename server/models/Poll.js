const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    pollId: {
        type: String,
        required: true,
        unique: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        text: {
            type: String,
            required: true
        },
        votes: {
            type: Number,
            default: 0
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Poll', pollSchema);
