import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Share2, ArrowRight, MousePointer2, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';

const Home = () => {
    const { token } = useAuth();

    // If already logged in, redirect to dashboard or show dashboard link
    // For a "Landing Page" feel, we can still show the page but provide a "Go to Dashboard" button

    return (
        <div className="home-container">
            {/* Header/Nav */}
            <header className="container" style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
                        <Logo size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>PollRooms</h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {token ? (
                        <Link to="/dashboard" className="btn-primary">Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/login" className="btn-outline" style={{ textDecoration: 'none' }}>Login</Link>
                            <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none' }}>Get Started</Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <main>
                <section className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span style={{
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: 'var(--primary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '2rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem',
                            display: 'inline-block'
                        }}>
                            Now with Real-Time Analytics 🚀
                        </span>
                        <h1 style={{ fontSize: '4.5rem', fontWeight: '800', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                            Create Interactive Polls <br />
                            <span style={{ color: 'var(--primary)' }}>In Seconds.</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
                            The simplest way to create, share, and analyze polls in real-time.
                            Engage your audience with beautiful, live-updating results.
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                            <Link to={token ? "/dashboard" : "/signup"} className="btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', textDecoration: 'none' }}>
                                Create Your First Poll <ArrowRight size={20} />
                            </Link>
                            <a href="#features" className="btn-outline" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem', textDecoration: 'none' }}>
                                See Features
                            </a>
                        </div>
                    </motion.div>

                    {/* Floating Preview Image Placeholder / Graphic */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        style={{ marginTop: '5rem', position: 'relative' }}
                    >
                        <div style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                            borderRadius: '2rem',
                            padding: '1rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
                            maxWidth: '900px',
                            margin: '0 auto'
                        }}>
                            <div style={{ background: '#334155', height: '12px', width: '100%', borderRadius: '1rem 1rem 0 0', display: 'flex', gap: '6px', padding: '10px 15px', alignItems: 'center' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                            </div>
                            <div style={{ padding: '3rem', textAlign: 'left' }}>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Which frontend framework do you prefer?</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {[
                                        { text: 'React', percent: 78, color: '#61dafb' },
                                        { text: 'Vue', percent: 45, color: '#42b883' },
                                        { text: 'Svelte', percent: 32, color: '#ff3e00' }
                                    ].map((framework, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span>{framework.text}</span>
                                                <span>{framework.percent}%</span>
                                            </div>
                                            <div style={{ height: '32px', background: '#0f172a', borderRadius: '16px', overflow: 'hidden' }}>
                                                <div style={{ width: `${framework.percent}%`, height: '100%', background: framework.color, opacity: 0.8 }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Decorative Elements */}
                        <div style={{ position: 'absolute', top: '-10%', left: '5%', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.3, zIndex: -1 }}></div>
                        <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: '200px', height: '200px', background: '#a855f7', filter: 'blur(100px)', opacity: 0.2, zIndex: -1 }}></div>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section id="features" style={{ padding: '8rem 0', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="container">
                        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Powerful Features for Better Engagement</h2>
                        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            <div className="card">
                                <Zap size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ marginBottom: '1rem' }}>Real-Time Updates</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Watch votes roll in instantly with Socket.IO integration. No refreshes required.</p>
                            </div>
                            <div className="card">
                                <Shield size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ marginBottom: '1rem' }}>Fairness Guaranteed</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Dual IP & Browser-based verification ensures one vote per person per poll.</p>
                            </div>
                            <div className="card">
                                <Share2 size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ marginBottom: '1rem' }}>Easy Sharing</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Generate unique, short links to share your polls across any platform instantly.</p>
                            </div>
                            <div className="card">
                                <MousePointer2 size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ marginBottom: '1rem' }}>One-Step Creation</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Simple and intuitive dashboard to go from question to live poll in seconds.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer style={{ padding: '4rem 0', textAlign: 'center', borderTop: '1px solid #334155' }}>
                <p style={{ color: 'var(--text-muted)' }}>&copy; 2026 PollRooms. Created for excellence.</p>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
        .home-container {
          overflow-x: hidden;
        }
        @media (max-width: 768px) {
          h1 { fontSize: 3rem !important; }
        }
      `}} />
        </div>
    );
};

export default Home;
