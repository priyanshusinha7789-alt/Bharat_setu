import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[BHASHA SETU] Uncaught UI error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#070b14',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #ffffff 0%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            BHASHA SETU
          </div>
          <p style={{ color: '#94a3b8', maxWidth: '480px', marginBottom: '24px', lineHeight: 1.6 }}>
            A temporary display error occurred. Please click below to refresh and load the classroom console.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              backgroundColor: '#38bdf8',
              color: '#070b14',
              padding: '12px 28px',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.35)'
            }}
          >
            Reload Website
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
