# TrickCode

The all-in-one platform to master algorithms, ace technical interviews, and build the future with a community of elite developers.

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/naammmdz/trickcode.git
   cd trickcode
   ```
2. **Start Backend (Spring Boot):**
   ```bash
   cd be/backend-mono
   ./mvnw spring-boot:run
   ```
3. **Start Frontend (React + Vite):**
   ```bash
   cd fe
   npm install
   npm run dev
   ```

## Features

- **Algorithm Challenges**: Diverse coding challenges repository with automated test case system using JDoodle.
- **Contests**: Real-time competitive events with global leaderboard rankings.
- **Interview Prep**: Curated questions for technical interviews with Mock interview environment and AI-driven feedback.
- **News Feed**: Tech news & updates for the developer community.
- **Real-time Collaboration**: Multi-user cursor support to debug and refactor code simultaneously.
- **Premium Interface**: Professional dark theme interface with stunning 3D WebGL effects.

## Configuration

| Variable | Description | Default | Location |
|----------|-------------|---------|----------|
| `JDOODLE_CLIENT_ID` | JDoodle API Client ID for code execution | - | Backend |
| `JDOODLE_CLIENT_SECRET` | JDoodle API Secret | - | Backend |
| `VITE_API_URL` | Backend Server URL | `http://localhost:8080` | Frontend |
| `PORT` | Frontend dev server port | `5173` | Frontend |

## Documentation

- [API Endpoints Checklist](./API_Endpoints_Checklist.md)
- [Demo Checklist](./DEMO_CHECKLIST.md)
- [Non-Functional Requirements](./NON_FUNCTIONAL_REQUIREMENTS.md)
- [Frontend Structure](./FE_STRUCTURE_MOVE.md)

## License

MIT
