const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create Poll (Protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { question, options } = req.body;

        if (!question || !options || options.length < 2) {
            return res.status(400).json({ message: 'Poll must have a question and at least 2 options.' });
        }

        const pollId = uuidv4().substring(0, 8); // Short ID for shareable link
        const poll = new Poll({
            pollId,
            question,
            options: options.map(opt => ({ text: opt, votes: 0 })),
            createdBy: req.userId
        });

        await poll.save();
        res.status(201).json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get My Polls (Protected)
router.get('/my-polls', authMiddleware, async (req, res) => {
    try {
        const polls = await Poll.find({ createdBy: req.userId }).sort({ createdAt: -1 });
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Public Poll
router.get('/:pollId', async (req, res) => {
    try {
        const poll = await Poll.findOne({ pollId: req.params.pollId });
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Vote in a Poll
router.post('/:pollId/vote', async (req, res) => {
    try {
        const { optionId, browserId } = req.body;
        const { pollId } = req.params;
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (!optionId || !browserId) {
            return res.status(400).json({ message: 'Option ID and Browser ID are required.' });
        }

        // Check if user already voted (Backend validation for Fairness)
        const existingVoteIP = await Vote.findOne({ pollId, ipAddress });
        if (existingVoteIP) {
            return res.status(403).json({ message: 'You have already voted in this poll (IP restricted).' });
        }

        const existingVoteBrowser = await Vote.findOne({ pollId, browserId });
        if (existingVoteBrowser) {
            return res.status(403).json({ message: 'You have already voted in this poll (Browser restricted).' });
        }

        // Save vote
        const vote = new Vote({
            pollId,
            optionId,
            ipAddress,
            browserId
        });
        await vote.save();

        // Increment vote count in Poll model
        const poll = await Poll.findOneAndUpdate(
            { pollId, "options._id": optionId },
            { $inc: { "options.$.votes": 1 } },
            { new: true }
        );

        if (!poll) {
            return res.status(404).json({ message: 'Poll or option not found' });
        }

        // Emit real-time update via Socket.IO
        const io = req.app.get('io');
        io.to(pollId).emit('pollUpdated', poll);

        res.json({ message: 'Vote recorded successfully', poll });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(403).json({ message: 'You have already voted in this poll.' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
