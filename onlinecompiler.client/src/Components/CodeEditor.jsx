import React, { useState } from "react";
import Editor from "@monaco-editor/react";

function CodeEditor() {
  const [code, setCode] = useState(""); 

  // Submit code logic inside the component
  const submitCode = async (code) => {
    try {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Failed to compile code.");
      }

      const result = await response.json();
      alert(result.result); // Display the compiled result
    } catch (error) {
      alert("Error: " + error.message); // Display error message if the request fails
    }
  };

  return (
    <div>
      <Editor
        height="90vh"
        language="javascript"
        value={code}
        onChange={(newValue) => setCode(newValue)}
      />
      <button onClick={() => submitCode(code)}>Run Code</button>
    </div>
  );
}

export default CodeEditor;
