import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { apiPost } from "../utils/app";
import { Button, Box, Text, useToast } from "@chakra-ui/react";
import Lottie from "react-lottie-player";
import truckAnimation from "../assets/truck-animation.json";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

function CodeEditor() {
    const [code, setCode] = useState(""); // To track the code input
    const [language, setLanguage] = useState("python"); // To track the selected language
    const [result, setResult] = useState(""); // To track the compile result
    const [loading, setLoading] = useState(false); // To track loading state
    const toast = useToast();

    const submitCode = async () => {
        setLoading(true);
        try {
            const cleanCode = code.replace(/\\/g, "");
            const res = await apiPost("/api/compile", { code: cleanCode, language });
            console.log("Result from backend:", res.result);
            setResult(res.result);
        } catch (error) {
            console.error("Error:", error);
            setResult("Error: " + error.message);
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-gray-900 p-4 sm:p-8">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-blue-300 font-mono text-center">Code Playground</h1>
            <p className="text-sm sm:text-lg text-gray-400 mb-6 sm:mb-8 italic font-light text-center">
                "Unleash your logic, build your ideas. The world is at your fingertips."
            </p>
            <Box className="w-full sm:w-3/4 lg:w-2/3 shadow-lg rounded-lg bg-gray-800 p-4 sm:p-6">
                <Editor
                    height="40vh" // Reduced for mobile, adjustable for larger screens
                    className="sm:height-[60vh]" // Adjust height for larger screens
                    theme="vs-dark"
                    language={language}
                    value={code}
                    onChange={(newValue) => setCode(newValue)}
                    className="border rounded-md"
                />

                {/* Language Selector */}
                <FormControl fullWidth variant="filled" sx={{ mt: 2, mb: 2 }}>
                    <InputLabel id="language-select-label">Language</InputLabel>
                    <Select
                        labelId="language-select-label"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{ backgroundColor: "#f1f1f1" }}
                    >
                        <MenuItem value="javascript">JavaScript</MenuItem>
                        <MenuItem value="python">Python</MenuItem>
                        <MenuItem value="cpp">C++</MenuItem>
                    </Select>
                </FormControl>

                {/* Run Code Button */}
                <Button
                    size="lg"
                    mt={4}
                    onClick={submitCode}
                    className="w-full rounded-md bg-white text-gray-900 border-4 border-neon-green hover:bg-gray-200 hover:border-neon-green-light hover:shadow-neon-green transform hover:scale-105 transition-all duration-300 ease-in-out"
                    isLoading={loading}
                >
                    Run Code
                </Button>

                {/* Loading Animation */}
                {loading && (
                    <div className="flex justify-center mt-6">
                        <Lottie
                            loop
                            animationData={truckAnimation}
                            play
                            style={{ width: 150, height: 150 }} // Adjusted for better responsiveness
                        />
                    </div>
                )}

                {/* Result Section */}
                {!loading && result && (
                    <Box mt={8} p={4} sm: p={6} className="bg-gray-900 rounded-lg shadow-lg">
                        <Text fontSize="xl" sm: fontSize="2xl" fontWeight="bold" mb={4} className="text-blue-400 text-center">
                            Output:
                        </Text>
                        <Box className="bg-black rounded-lg p-4 shadow-inner">
                            <Text fontSize="md" color="white" mb={2} className="text-center">
                                Result:
                            </Text>
                            <pre className="text-sm text-green-400 bg-gray-800 p-4 rounded-md border border-gray-600 whitespace-pre-wrap break-words">
                                {result}
                            </pre>
                        </Box>
                    </Box>
                )}
            </Box>
        </div>
    );
}

export default CodeEditor;
