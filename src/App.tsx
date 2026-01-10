import { Dashboard } from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <div className="app-container">
        <div className="header">
          <h1>SpurTalk</h1>
          <p>Your AI-powered procrastination companion</p>
        </div>

        <Dashboard />
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
        }

        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .header h1 {
          font-size: 2.5rem;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #6366f1, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header p {
          color: #64748b;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}

export default App;