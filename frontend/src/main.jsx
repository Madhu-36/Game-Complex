import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
  }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        style: { padding: 40, background: '#1a1a2e', color: '#e94560', fontFamily: 'monospace', minHeight: '100vh' }
      },
        React.createElement('h1', null, '⚠️ Application Error'),
        React.createElement('pre', { style: { whiteSpace: 'pre-wrap', color: '#fff', marginTop: 20 } },
          this.state.error ? this.state.error.toString() : 'Unknown error'
        ),
        React.createElement('pre', { style: { whiteSpace: 'pre-wrap', color: '#aaa', marginTop: 10, fontSize: 12 } },
          this.state.info ? this.state.info.componentStack : ''
        )
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    React.createElement(ErrorBoundary, null,
      React.createElement(App)
    )
  );
} else {
  document.body.innerHTML = '<h1 style="color:red">Fatal: #root element not found</h1>';
}
