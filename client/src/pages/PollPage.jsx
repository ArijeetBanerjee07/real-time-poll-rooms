import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle2, BarChart3, AlertCircle, Share2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Generate or get browser ID for fairness
const getBrowserId = () => {
    let id = localStorage.getItem('poll_browser_id');
    if (!id) {
        id = uuidv4();
        localStorage.setItem('poll_browser_id', id);
    }
    return id;
};

const PollPage = () => {
    const { pollId } = useParams();
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [voted, setVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [voting, setVoting] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        fetchPoll();
        const browserId = getBrowserId();
        const hasVoted = localStorage.getItem(`voted_${pollId}`);
        if (hasVoted) setVoted(true);

        const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
        setSocket(newSocket);

        newSocket.emit('joinPoll', pollId);
        newSocket.on('pollUpdated', (updatedPoll) => {
            setPoll(updatedPoll);
        });

        return () => newSocket.close();
    }, [pollId]);

    const fetchPoll = async () => {
        try {
            const { data } = await api.get(`/polls/${pollId}`);
            setPoll(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Poll not found');
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async () => {
        if (!selectedOption) return;
        setVoting(true);
        try {
            const browserId = getBrowserId();
            const { data } = await api.post(`/polls/${pollId}/vote`, {
                optionId: selectedOption,
                browserId
            });

            // Update local poll state immediately with the response from server
            if (data.poll) {
                setPoll(data.poll);
            }

            setVoted(true);
            localStorage.setItem(`voted_${pollId}`, 'true');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to vote';
            alert(message);

            // If already voted, still show results
            if (err.response?.status === 403 || message.includes('already voted')) {
                setVoted(true);
                localStorage.setItem(`voted_${pollId}`, 'true');
                fetchPoll(); // Refresh to get latest results
            }
        } finally {
            setVoting(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <p>Loading poll details...</p>
        </div>
    );

    if (error) return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="card" style={{ textAlign: 'center', maxWidth: '400px' }}>
                <AlertCircle size={48} color="var(--error)" style={{ marginBottom: '1rem' }} />
                <h3>{error}</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>The poll you are looking for might have been removed or the link is invalid.</p>
                <button onClick={() => window.location.href = '/'} className="btn-primary" style={{ marginTop: '2rem' }}>Go Home</button>
            </div>
        </div>
    );

    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <div className="card animate-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <Users size={16} /> {totalVotes} Votes
                    </div>
                    <button style={{ background: 'transparent', color: 'var(--text-muted)' }} onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied!');
                    }}>
                        <Share2 size={20} />
                    </button>
                </div>

                <h1 style={{ fontSize: '2.5rem', marginBottom: '2.5rem', lineHeight: '1.2' }}>{poll.question}</h1>

                {!voted ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {poll.options.map((option) => (
                            <div
                                key={option._id}
                                onClick={() => setSelectedOption(option._id)}
                                style={{
                                    padding: '1.25rem 1.5rem',
                                    borderRadius: '0.75rem',
                                    border: `2px solid ${selectedOption === option._id ? 'var(--primary)' : '#334155'}`,
                                    background: selectedOption === option._id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: '2px solid var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {selectedOption === option._id && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />}
                                </div>
                                <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>{option.text}</span>
                            </div>
                        ))}

                        <button
                            className="btn-primary"
                            style={{ padding: '1.25rem', marginTop: '1.5rem', fontSize: '1.125rem' }}
                            disabled={!selectedOption || voting}
                            onClick={handleVote}
                        >
                            {voting ? 'Submitting...' : 'Submit Vote'}
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                    >
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <CheckCircle2 size={20} /> Thank you for voting!
                        </div>

                        {poll.options.map((option) => {
                            const percent = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                            return (
                                <div key={option._id}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '500' }}>{option.text}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{option.votes} votes ({percent.toFixed(1)}%)</span>
                                    </div>
                                    <div style={{ height: '32px', background: '#0f172a', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            style={{
                                                height: '100%',
                                                background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)',
                                                borderRadius: '16px'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #334155', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Want to create your own poll? <a href="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign up for free</a></p>
                </div>
            </div>
        </div>
    );
};

export default PollPage;
