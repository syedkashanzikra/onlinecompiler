# Online Code Compiler - React, ASP.NET Core, Docker & Three.js

This project is a web-based **code editor and compiler**, similar to platforms like LeetCode or Codeforces. It allows users to write, compile, and run code in multiple programming languages with a real-time output interface.

The stack consists of **React.js** for the frontend, **ASP.NET Core** for the backend, and **Docker** for containerization. The project uses **Monaco Editor** for an enhanced code-editing experience, **Three.js** for 3D visual effects, **TailwindCSS** and **Material UI** for styling, and **React Icons** for adding intuitive icons to the UI.

## Features

- **Code editor** using **Monaco Editor** for a seamless coding experience.
- **Multiple language support** (C#, Python, C++, Go, JavaScript, Dart, Assembly, etc.) via the **Piston API**.
- **Backend** built using **ASP.NET Core 8.0** for compiling and executing code.
- **Real-time output** of code execution results with support for error handling.
- **3D visual effects** for celebrations using **Three.js** after successful code execution.
- **Dockerized** for easy deployment and isolation of the environment.
- **TailwindCSS** for modern and responsive design and **Material UI** for intuitive components.
- **React Icons** for consistent, beautiful icons across the interface.

---

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation and Setup](#installation-and-setup)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
- [API Endpoints](#api-endpoints)
  - [Compile Code](#compile-code-post-apicompile)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Docker Setup](#docker-setup)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Technologies Used

### Frontend

- **React.js**: The core library for building the user interface.
- **Monaco Editor**: A powerful code editor used for writing code in the frontend.
- **Three.js**: Used for creating 3D effects and interactive celebrations upon successful code execution.
- **TailwindCSS**: A utility-first CSS framework for fast, modern UI design.
- **Material UI**: For pre-built, customizable React components and design.
- **React Icons**: Icon library used to enhance the UI with professional icons.

### Backend

- **ASP.NET Core 8.0**: The web framework used for building the backend API that handles code compilation requests.
- **Piston API**: Provides support for compiling and executing code in multiple languages.
- **Docker**: Used for containerizing the application to make deployment and environment management easier.

---

## Installation and Setup

### Prerequisites

- **Node.js** (for running the frontend React application)
- **.NET Core SDK 8.0** (for the ASP.NET Core backend)
- **Docker** (optional, for containerization)
- **Visual Studio 2022** or **Visual Studio Code** (for development)
- **Piston API** (used for multi-language support)

### Installation Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/syedkashanzikra/onlinecompiler.git
   cd onlinecompiler-master
   ```

2. **Setting Up the Frontend**:

   Navigate to the frontend directory and install the necessary dependencies:

   ```bash
   cd OnlineCompiler.client
   npm install
   ```

3. **Setting Up the Backend**:

   Navigate to the backend directory and restore the necessary NuGet packages:

   ```bash
   cd OnlineCompiler.Server
   dotnet restore
   ```

4. **Setting Up the Piston API** (for multi-language support):

   - The Piston API allows you to compile multiple languages. You don't need an API key.
   - The backend project is already configured to use Piston's public API for compiling code.

---

## API Endpoints

### Compile Code (POST `/api/compile`)

**Description**: This endpoint accepts code and the programming language, compiles the code, and returns the output or an error message.

#### Request Body:

```json
{
  "code": "console.log('Hello, world!');",
  "language": "javascript"
}
```

#### Response:

```json
{
  "result": "Hello, world!"
}
```

#### Example (C#):

```json
{
  "code": "Console.WriteLine('Hello, world!');",
  "language": "csharp"
}
```

#### Response (C#):

```json
{
  "result": "Hello, world!"
}
```

---

## Project Structure

```
online-code-compiler/
├── OnlineCompiler.Server/                  # ASP.NET Core backend code
│   ├── Controllers/          # API Controllers for compiling code
│   ├── Models/               # Request and response models
│   └── Services/             # Code compilation logic, including the Piston API integration
│   └── Program.cs            # Entry point for ASP.NET Core app
│
├── OnlineCompiler.client/                 # React frontend code
│   ├── public/               # Static assets
│   ├── src/                  # Main source folder
│   │   ├── components/       # React components
│   │   ├── threejs/          # Three.js components for 3D celebration
│   │   ├── App.js            # Main application component
│   └── package.json          # Frontend dependencies
│
├── docker-compose.yml        # Docker setup for both frontend and backend
├── README.md                 # Project README
└── .gitignore                # Git ignore file
```

---

## Running the Project

### Frontend

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Start the React development server:

   ```bash
   npm start
   ```

   This will start the development server at `http://localhost:5173`.

### Backend

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Start the ASP.NET Core application:

   ```bash
   dotnet run
   ```

   This will launch the backend API on `http://localhost:7293`.

### Docker Setup

1. **Build and Run the Application with Docker**:

   From the root directory, you can use Docker Compose to spin up both the frontend and backend:

   ```bash
   docker-compose up --build
   ```

   This will start both the frontend (`http://localhost:5173`) and the backend API (`http://localhost:7293`).

---

## Screenshots

### Code Editor 


![image](https://github.com/user-attachments/assets/73c74281-4e8d-4f1e-82f6-66305fe9cec0)


### Compilation Output and Confetti Effect

![image](https://github.com/user-attachments/assets/05b6bb1a-41f3-49d8-be50-38b55a25d75f)

---

## Contributing

We welcome contributions to the project! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Make your changes and commit them (`git commit -m "Add some feature"`).
4. Push to the branch (`git push origin feature-branch-name`).
5. Open a Pull Request.

Please ensure your code follows the project's coding standards and is well-tested.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Summary of Additions:

- **Three.js**: Added for 3D celebration effects.
- **Docker**: Instructions for running both frontend and backend using Docker.
- **Material UI & React Icons**: Mentioned as part of the UI improvement.
- **Piston API**: Detailed how it supports multiple languages.
