import React from "react";
import "./App.css";
import CodeEditor from "./Components/CodeEditor";



function App() {
    return (
        <div className="app-container flex items-center justify-center min-h-screen w-full bg-gray-900">
            <CodeEditor />
            
        </div>
    );
}

export default App;
