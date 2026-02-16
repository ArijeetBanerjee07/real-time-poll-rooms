import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { io } from 'socket.io-client';
import { PlusCircle, ExternalLink, BarChart3, Copy, Check, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('create');
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);

    // Create Poll State
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [createdPoll, setCreatedPoll] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('pollUpdated', (updatedPoll) => {
            setPolls(prevPolls => prevPolls.map(p =>
                p.pollId === updatedPoll.pollId ? updatedPoll : p
            ));
        });

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (activeTab === 'my-polls') {
            fetchMyPolls();
        }
    }, [activeTab]);

    const fetchMyPolls = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/polls/my-polls');
            setPolls(data);

            // Join rooms for all my polls to get live updates
            if (socket) {
                data.forEach(poll => {
                    socket.emit('joinPoll', poll.pollId);
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addOption = () => setOptions([...options, '']);
    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = [...options];
            newOptions.splice(index, 1);
            setOptions(newOptions);
        }
    };

    const handleCreatePoll = async (e) => {
        e.preventDefault();
        if (options.filter(opt => opt.trim()).length < 2) return alert('At least 2 options required');

        try {
            const { data } = await api.post('/polls', {
                question,
                options: options.filter(opt => opt.trim())
            });
            setCreatedPoll(data);
            setQuestion('');
            setOptions(['', '']);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create poll');
        }
    };

    const copyToClipboard = (pollId) => {
        const url = `${window.location.origin}/poll/${pollId}`;
        navigator.clipboard.writeText(url);
        setCopiedId(pollId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                        <Logo size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>PollRooms</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</span>
                    <button onClick={logout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', background: '#1e293b', padding: '0.4rem', borderRadius: '0.75rem', width: 'fit-content' }}>
                <button
                    onClick={() => { setActiveTab('create'); setCreatedPoll(null); }}
                    style={{
                        background: activeTab === 'create' ? 'var(--primary)' : 'transparent',
                        color: 'white',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600'
                    }}
                >
                    Create Poll
                </button>
                <button
                    onClick={() => setActiveTab('my-polls')}
                    style={{
                        background: activeTab === 'my-polls' ? 'var(--primary)' : 'transparent',
                        color: 'white',
                        padding: '0.6rem 1.25rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600'
                    }}
                >
                    My Shared Polls
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'create' ? (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="card"
                        style={{ maxWidth: '700px' }}
                    >
                        {createdPoll ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <Check size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Poll Created Successfully!</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Share this link with others to start collecting votes.</p>

                                <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', border: '1px solid #334155' }}>
                                    <input
                                        readOnly
                                        value={`${window.location.origin}/poll/${createdPoll.pollId}`}
                                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                                    />
                                    <button onClick={() => copyToClipboard(createdPoll.pollId)} style={{ background: 'transparent', color: 'var(--primary)' }}>
                                        {copiedId === createdPoll.pollId ? <Check size={20} /> : <Copy size={20} />}
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <button onClick={() => setCreatedPoll(null)} className="btn-outline">Create Another</button>
                                    <a href={`/poll/${createdPoll.pollId}`} target="_blank" className="btn-primary">
                                        View Poll <ExternalLink size={18} />
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleCreatePoll}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Poll Question</label>
                                    <input
                                        placeholder="e.g. What is your favorite programming language?"
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        required
                                    />
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600' }}>Options</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {options.map((option, index) => (
                                            <div key={index} style={{ display: 'flex', gap: '0.75rem' }}>
                                                <input
                                                    placeholder={`Option ${index + 1}`}
                                                    value={option}
                                                    onChange={(e) => {
                                                        const newOpts = [...options];
                                                        newOpts[index] = e.target.value;
                                                        setOptions(newOpts);
                                                    }}
                                                    required
                                                />
                                                {options.length > 2 && (
                                                    <button type="button" onClick={() => removeOption(index)} style={{ padding: '0.5rem', color: 'var(--error)', background: 'transparent' }}>
                                                        <PlusCircle style={{ transform: 'rotate(45deg)' }} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" onClick={addOption} style={{ marginTop: '1rem', color: 'var(--primary)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <PlusCircle size={18} /> Add Option
                                    </button>
                                </div>

                                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                                    Create Poll
                                </button>
                            </form>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="my-polls"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="grid-2"
                    >
                        {loading ? (
                            <p>Loading polls...</p>
                        ) : polls.length === 0 ? (
                            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                                <p style={{ color: 'var(--text-muted)' }}>You haven't created any polls yet.</p>
                                <button onClick={() => setActiveTab('create')} className="btn-primary" style={{ marginTop: '1.5rem' }}>Create Your First Poll</button>
                            </div>
                        ) : (
                            polls.map(poll => (
                                <div key={poll.pollId} className="card animate-fade">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem' }}>{poll.question}</h3>
                                        <button onClick={() => copyToClipboard(poll.pollId)} style={{ padding: '0.4rem', borderRadius: '0.4rem', background: '#334155', color: 'white' }}>
                                            {copiedId === poll.pollId ? <Check size={16} /> : <Copy size={16} />}
                                        </button>
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            <span>Total Votes</span>
                                            <span>{poll.options.reduce((sum, opt) => sum + opt.votes, 0)}</span>
                                        </div>
                                        {/* Simplified Result Bars */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {poll.options.slice(0, 3).map((opt, i) => {
                                                const total = poll.options.reduce((sum, o) => sum + o.votes, 0);
                                                const percent = total > 0 ? (opt.votes / total) * 100 : 0;
                                                return (
                                                    <div key={i}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                                            <span>{opt.text}</span>
                                                            <span>{percent.toFixed(0)}%</span>
                                                        </div>
                                                        <div style={{ background: '#0f172a', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${percent}%` }}
                                                                style={{ background: 'var(--primary)', height: '100%' }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {poll.options.length > 3 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+ {poll.options.length - 3} more options</p>}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <a href={`/poll/${poll.pollId}`} target="_blank" className="btn-primary" style={{ flex: 1, fontSize: '0.875rem' }}>
                                            Open Poll <ExternalLink size={16} />
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
