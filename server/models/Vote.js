const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    pollId: {
        type: String,
        required: true,
        index: true
    },
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    browserId: {
        type: String,
        required: true
    },
    votedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent duplicate votes from same IP for same poll
voteSchema.index({ pollId: 1, ipAddress: 1 }, { unique: true });
// Compound index to prevent duplicate votes from same browser for same poll
voteSchema.index({ pollId: 1, browserId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
