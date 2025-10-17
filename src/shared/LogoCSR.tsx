import { useState, useEffect } from "react";
import "./LogoCSR.css";
import { Logo } from "@/assets";
import { getAPIConfig } from "@configs/api-config";

// Client-Side Rendered React Component
// This component renders in the BROWSER using React

const LogoCSR = () => {
  const [clicks, setClicks] = useState(0);
  const [config, setConfig] = useState({
    secretKey: "",
    publicApiUrl: "",
    publicAppName: "",
  });

  // Load config only on client-side to prevent hydration mismatch
  useEffect(() => {
    const API_CONFIG = getAPIConfig();
    setConfig({
      secretKey: API_CONFIG.strapiURL,
      publicApiUrl: API_CONFIG.baseURL ?? "",
      publicAppName: API_CONFIG.firebaseConfig.projectId ?? "",
    });
  }, []);

  const handleClick = () => {
    setClicks((prev) => prev + 1);
  };

  return (
    <div className="csr-component">
      <h2>⚛️ Client-Side Rendering (CSR)</h2>

      <div className="logo-container">
        {/*
          For CSR with React, we import the SVG as an image
          This renders on the client side using React
        */}
        <div className="" onClick={handleClick}>
          {/* Use a plain <img> in React CSR instead of the Astro-only <Icon> component */}
          <Logo />
        </div>
      </div>

      <div className="interaction">
        <button onClick={handleClick} className="btn">
          Click to Toggle Size
        </button>
        <p className="counter">Clicks: {clicks}</p>
      </div>

      {/* Environment Variables Section */}
      <div className="env-section">
        <h3>🔐 Environment Variables (CSR)</h3>
        <div className="env-grid">
          <div className="env-item blocked">
            <span className="env-label">SECRET_API_KEY:</span>
            <span className="env-value">
              {config.secretKey === "" ? "❌ undefined" : config.secretKey}
            </span>
            <span className="env-badge">🚫 Blocked</span>
          </div>
          <div className="env-item public">
            <span className="env-label">PUBLIC_API_URL:</span>
            <span className="env-value">{config.publicApiUrl || "Loading..."}</span>
            <span className="env-badge">✅ Available</span>
          </div>
          <div className="env-item public">
            <span className="env-label">PUBLIC_APP_NAME:</span>
            <span className="env-value">{config.publicAppName || "Loading..."}</span>
            <span className="env-badge">✅ Available</span>
          </div>
        </div>
        <p className="env-note">
          <strong>🔒 Security:</strong> Only PUBLIC_ prefixed variables are
          available in the browser. Secret keys are protected and return
          undefined!
        </p>
      </div>

      <div className="explanation">
        <h3>How it works:</h3>
        <ul>
          <li>✅ Component loads in the browser (client-side)</li>
          <li>✅ React renders and manages the UI</li>
          <li>✅ Interactive - responds to user actions</li>
          <li>✅ State updates in real-time</li>
          <li>✅ Requires JavaScript to work</li>
        </ul>

        <div className="code-example">
          <strong>Code:</strong>
          <pre>
            <code>{`<img src="/src/assets/icons/logo.svg" />\n\n// In the page:\n<LogoCSR client:load />`}</code>
          </pre>
          <p>
            <code>client:load</code> directive tells Astro to hydrate this
            component on page load
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoCSR;
