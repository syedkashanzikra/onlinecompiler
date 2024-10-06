import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { apiPost } from "../utils/app";
import { Button, Box, Text, useToast } from "@chakra-ui/react";
import Lottie from "react-lottie-player";
import truckAnimation from "../assets/truck-animation.json";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import ConfettiCelebration from "./ConfettiCelebration";
import { AiFillFileAdd, AiOutlineDownload, AiOutlinePlayCircle } from "react-icons/ai";

function CodeEditor() {
    const [code, setCode] = useState(""); // To track the code input
    const [language, setLanguage] = useState("python"); // To track the selected language
    const [result, setResult] = useState(""); // To track the compile result
    const [loading, setLoading] = useState(false); // To track loading state
    const [theme, setTheme] = useState("vs-dark");
    const [celebrate, setCelebrate] = useState(false);

    const toast = useToast();
    const snippets = {
        python: `print("Hello, World!")`,
        javascript: `console.log("Hello, World!");`,
        cpp: `#include<iostream>\nusing namespace std;\nint main(){\n cout << "Hello, World!";\n return 0;\n}`,
        typescript: `console.log("Hello, TypeScript!");`,
        c: `#include<stdio.h>\nint main() {\n printf("Hello, C!");\n return 0;\n}`,
        go: `package main\nimport "fmt"\nfunc main() {\n fmt.Println("Hello, Go!")\n}`,
        php: `<?php echo "Hello, PHP!"; ?>`,
        java: `public class Main {\n public static void main(String[] args) {\n System.out.println("Hello, Java!");\n }\n}`,
        dart: `void main() {\n print('Hello, Dart!');\n}`,
        nasm: `section .data\n    msg db 'Hello, Assembly (32-bit)!', 0\n\nsection .text\nglobal _start\n\n_start:\n    mov eax, 4\n    mov ebx, 1\n    mov ecx, msg\n    mov edx, 22\n    int 0x80\n\n    mov eax, 1\n    xor ebx, ebx\n    int 0x80`,
        nasm64: `section .data\n    msg db 'Hello, Assembly (64-bit)!', 0\n\nsection .text\nglobal _start\n\n_start:\n    mov rax, 1\n    mov rdi, 1\n    mov rsi, msg\n    mov rdx, 23\n    syscall\n\n    mov rax, 60\n    xor rdi, rdi\n    syscall`,
        csharp: `using System;\n\nclass Program {\n static void Main() {\n Console.WriteLine("Hello, C#!");\n }\n}`,
        fsharp: `open System\n\n[<EntryPoint>]\nlet main argv =\n printfn "Hello, F#!"\n 0 // return an integer exit code`,
        r: `print("Hello, R!")`,
        swift: `print("Hello, Swift!")`,
    };

    // Helper function to download the code as a file
    const downloadCode = () => {
        // Map language to file extension
        const fileExtensionMap = {
            python: "py",
            javascript: "js",
            cpp: "cpp",
            typescript: "ts",
            c: "c",
            go: "go",
            php: "php",
            java: "java",
            dart: "dart",
            nasm: "asm",
            nasm64: "asm",
            csharp: "cs",
            fsharp: "fs",
            r: "r",
            swift: "swift",
        };

        // Get the correct file extension based on the selected language
        const fileExtension = fileExtensionMap[language] || "txt"; // default to txt if unknown

        // Create a file blob and trigger the download
        const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `code.${fileExtension}`; // Set the filename based on the language
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const submitCode = async () => {
        setLoading(true);
        setCelebrate(false); // Disable celebration before the run
        try {
            const cleanCode = code.replace(/\\/g, "");
            const res = await apiPost("/api/compile", { code: cleanCode, language });
            console.log("Result from backend:", res.result);
            setResult(res.result);

            // Only trigger celebration if there is no error in the result
            if (res.result && !res.result.toLowerCase().includes("error")) {
                setCelebrate(true); // Trigger celebration on successful run
                setTimeout(() => setCelebrate(false), 5000); // Stop after 5 seconds
            }

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
        <div className="flex flex-col items-center w-full min-h-screen p-4 bg-gray-900 sm:p-8">
            <h1 className="mb-2 font-mono text-2xl font-bold text-center text-blue-300 sm:text-4xl">
                Code Playground
            </h1>
            <p className="mb-6 text-sm italic font-light text-center text-gray-400 sm:text-lg sm:mb-8">
                "Unleash your logic, build your ideas. The world is at your fingertips."
            </p>
            <Box className="w-full p-4 bg-gray-800 rounded-lg shadow-lg sm:w-3/4 lg:w-2/3 sm:p-6">
                <Editor
                    height="40vh"
                    className="sm:height-[60vh]"
                    theme={theme}
                    language={language}
                    value={code}
                    onChange={(newValue) => setCode(newValue)}
                    className="border rounded-md"
                />

                <FormControl fullWidth variant="filled" sx={{ mt: 2, mb: 2 }}>
                    <InputLabel id="theme-select-label">Editor Theme</InputLabel>
                    <Select
                        labelId="theme-select-label"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        style={{ backgroundColor: "#f1f1f1" }}
                    >
                        <MenuItem value="vs-dark">Dark</MenuItem>
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="hc-black">Dracula</MenuItem>
                    </Select>
                </FormControl>

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
                        <MenuItem value="typescript">TypeScript</MenuItem>
                        <MenuItem value="c">C</MenuItem>
                        <MenuItem value="go">Go</MenuItem>
                        <MenuItem value="php">PHP</MenuItem>
                        <MenuItem value="java">Java</MenuItem>
                        <MenuItem value="dart">Dart</MenuItem>
                        <MenuItem value="nasm">Assembly (32-bit)</MenuItem>
                        <MenuItem value="nasm64">Assembly (64-bit)</MenuItem>
                        <MenuItem value="csharp">C#</MenuItem>
                        <MenuItem value="fsharp">F#</MenuItem>
                        <MenuItem value="r">R</MenuItem>
                        <MenuItem value="swift">Swift</MenuItem>
                    </Select>
                </FormControl>

                <div className="flex justify-between items-center mt-8 space-x-4">
                    {/* Insert Snippet Button */}
                    <Button
                        size="lg"
                        onClick={() => setCode(snippets[language])}
                        className="flex items-center justify-center px-6 py-3 text-white transition-all duration-300 ease-in-out transform bg-blue-500 rounded-md hover:bg-blue-400 hover:scale-105"
                    >
                        <AiFillFileAdd className="mr-2" /> {/* Icon for Insert Snippet */}
                        Insert "{language}" Snippet
                    </Button>

                    {/* Run Code Button */}
                    <Button
                        size="lg"
                        onClick={submitCode}
                        className="flex items-center justify-center px-6 py-3 text-gray-900 transition-all duration-300 ease-in-out transform bg-white border-4 rounded-md border-neon-green hover:bg-gray-200 hover:border-neon-green-light hover:shadow-neon-green hover:scale-105"
                        isLoading={loading}
                    >
                        <AiOutlinePlayCircle className="mr-2" /> {/* Icon for Run Code */}
                        Run Code
                    </Button>

                    {/* Download Code Button */}
                    <Button
                        size="lg"
                        onClick={downloadCode} // Trigger download on click
                        className="flex items-center justify-center px-6 py-3 text-white transition-all duration-300 ease-in-out transform bg-green-600 rounded-md hover:bg-green-500 hover:scale-105"
                    >
                        <AiOutlineDownload className="mr-2" /> {/* Icon for Download Code */}
                        Download Code
                    </Button>
                </div>

                {/* Loading Animation */}
                {loading && (
                    <div className="flex justify-center mt-6">
                        <Lottie
                            loop
                            animationData={truckAnimation}
                            play
                            style={{ width: 150, height: 150 }}
                        />
                    </div>
                )}

                {/* Result Section */}
                {!loading && result && (
                    <Box
                        mt={8}
                        p={4}
                        sm: p={6}
                        className="bg-gray-900 rounded-lg shadow-lg"
                    >
                        <Text
                            fontSize="xl"
                            sm: fontSize="2xl"
                            fontWeight="bold"
                            mb={4}
                            className="text-center text-blue-400"
                        >
                            Output:
                        </Text>
                        <Box className="p-4 bg-black rounded-lg shadow-inner">
                            <Text fontSize="md" color="white" mb={2} className="text-center">
                                Result:
                            </Text>
                            <pre className="p-4 text-sm text-green-400 break-words whitespace-pre-wrap bg-gray-800 border border-gray-600 rounded-md">
                                {result}
                            </pre>
                        </Box>
                    </Box>
                )}
            </Box>

            <ConfettiCelebration show={celebrate} />
        </div>
    );
}

export default CodeEditor;
