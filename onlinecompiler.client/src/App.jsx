import React from "react";
import "./App.css"; // Link to the CSS file for styling
import CodeEditor from "./Components/CodeEditor"; // Import the CodeEditor component

function App() {
    return (
        <div className="app-container">
            <div className="editor-container">
                <CodeEditor />
            </div>
        </div>
    );
}

export default App;
