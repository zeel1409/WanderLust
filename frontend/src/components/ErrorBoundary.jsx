import { Component } from 'react';

/**
 * ErrorBoundary — catches any JS error in child components
 * and shows a friendly fallback UI instead of a blank white screen.
 *
 * Must be a Class Component — React's getDerivedStateFromError /
 * componentDidCatch lifecycle methods are not available in hooks.
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    // Called when a child throws — update state to show fallback
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    // Called after render — good place to log to Sentry / analytics
    componentDidCatch(error, info) {
        console.error('[ErrorBoundary] Caught error:', error);
        console.error('[ErrorBoundary] Component stack:', info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            // If a custom fallback is passed as prop, use it
            if (this.props.fallback) return this.props.fallback;

            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: '#fff',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    textAlign: 'center',
                }}>
                    {/* Icon */}
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: '#fff1f2', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        marginBottom: '1.5rem',
                        fontSize: '2.5rem',
                    }}>
                        😵
                    </div>

                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '400px', marginBottom: '2rem', lineHeight: 1.6 }}>
                        An unexpected error occurred. You can try refreshing, or go back to the home page.
                    </p>

                    {/* Show error message only in development */}
                    {import.meta.env.DEV && this.state.error && (
                        <pre style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '10px',
                            padding: '1rem 1.25rem',
                            fontSize: '0.78rem',
                            color: '#b91c1c',
                            maxWidth: '560px',
                            width: '100%',
                            textAlign: 'left',
                            overflowX: 'auto',
                            marginBottom: '2rem',
                            lineHeight: 1.5,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}>
                            {this.state.error.message}
                        </pre>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '9999px',
                                background: '#FF385C',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Try Again
                        </button>
                        <a
                            href="/"
                            style={{
                                padding: '10px 24px',
                                borderRadius: '9999px',
                                border: '1px solid #e5e7eb',
                                color: '#374151',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                textDecoration: 'none',
                                background: 'white',
                            }}
                        >
                            Go Home
                        </a>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
