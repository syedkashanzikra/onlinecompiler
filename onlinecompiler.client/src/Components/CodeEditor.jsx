import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { apiPost } from "../utils/app"; // Import your API utility

function CodeEditor() {
    const [code, setCode] = useState(""); // To track the code input
    const [language, setLanguage] = useState("python"); // To track the selected language
    const [result, setResult] = useState(""); // To track the compile result

    // Function to submit code to the backend
    const submitCode = async () => {
        try {
            // Sanitize the code to prevent unnecessary escaping
            const cleanCode = code.replace(/\\/g, "");

            const res = await apiPost("/api/compile", { code: cleanCode, language });
            console.log("Result from backend:", res.result); // Log the result
            setResult(res.result); // Set the result in the state
        } catch (error) {
            console.error("Error:", error);
            setResult("Error: " + error.message); // Set the error message in case of failure
        }
    };


    return (
        <div className="code-editor-container">
            <Editor
                height="70vh"
                language={language} // Set the editor's language
                value={code}
                onChange={(newValue) => setCode(newValue)}
            />

            {/* Dropdown to select the language */}
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
            </select>

            <button className="run-button" onClick={submitCode}>
                Run Code
            </button>

            {/* Display the result in a styled div */}
            <div className="result-container">
                <h3>Result:</h3>
                <pre>{result}</pre> {/* Display the result in <pre> for better formatting */}
            </div>
        </div>
    );
}

export default CodeEditor;
