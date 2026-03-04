import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('React ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0a0a0a',
                    color: '#fff',
                    gap: '16px',
                    fontFamily: 'Inter, sans-serif',
                    padding: '24px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: '3rem' }}>⚠️</div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 800 }}>
                        Something went wrong
                    </h2>
                    <p style={{ color: '#888', maxWidth: 400 }}>
                        {this.state.error?.message || 'An unexpected error occurred.'}
                    </p>
                    <button
                        onClick={() => { this.setState({ hasError: false, error: null }); window.history.back(); }}
                        style={{
                            padding: '12px 28px',
                            background: '#ff2d20',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'Outfit, sans-serif',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Go Back
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
