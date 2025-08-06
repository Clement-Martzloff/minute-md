# Office Bot

An AI-powered application built with Next.js (App Router) designed to automate the generation of meeting reports from various input sources, leveraging Large Language Models (LLMs) and structured content generation.

## Core Features

- **Meeting Report Generation:** Automates the creation of comprehensive meeting reports.
- **File Processing:** Allows users to upload and process various file types (e.g., meeting transcripts, documents) as input for report generation.
- **AI-Powered Content Synthesis:** Utilizes LLMs (e.g., via LangChain) to synthesize information from processed documents into structured JSON reports.
- **Markdown Output:** Converts structured report data into readable Markdown format for display and export.
- **Progress Tracking & Streaming:** Provides real-time feedback on the report generation process, including progress steps and streaming text output.
- **Dependency Injection:** Uses a robust dependency injection container (`ioc/container.ts`) for managing services and their implementations, adhering to Clean Architecture principles.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **AI/LLM Integration:** [LangChain.js](https://js.langchain.com/docs/) (for LLM orchestration, document processing, and structured output extraction).
- **Content Processing:** Unified (for Markdown generation).
- **Dependency Injection:** Handmade ! (implied by `ioc/container.ts` structure).

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm, pnpm, or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd office-bot
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # pnpm install
    # or
    # yarn install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the root directory. You will likely need variables for your LLM provider (e.g., `GOOGLE_CHAT_API_KEY` if using Google Chat models, or similar for other LLMs). Consult the `infrastructure/google-chat-model-factory.ts` or other LLM adapter files for specific requirements.

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `core/`: Defines the core domain logic, use cases, and ports (interfaces) following Ports & Adapters architecture.
  - `domain/`: Core entities (e.g., `document.ts`, `meeting-report.ts`) and business rules.
  - `ports/`: Interfaces for external dependencies (e.g., `content-extractor.ts`, `json-generator.ts`, `markdown-generator.ts`).
  - `usecases/`: Application-specific logic orchestrating domain objects and ports (e.g., `generate-report.ts`, `load-selected-files.ts`).
- `infrastructure/`: Concrete implementations of ports and framework-specific code.
  - `adapters/`: Implementations of core ports (e.g., `file-content-extractor.ts`).
  - `generators/`: LLM-related logic and content generation (e.g., `langchain/`, `unified-markdown-generator.ts`).
  - `console-logger.ts`: Basic logging implementation.
- `ioc/`: Dependency Injection configuration and types.
- `src/`: Next.js application code.
  - `app/`: App Router implementation (pages, layouts, API routes like `api/meeting-report/route.ts`).
  - `components/`: Shared UI components (e.g., `files-dropzone/`, `generate-report/`, `markdown-streamer/`, `progress-tracker/`).
  - `lib/`: Utility functions and hooks.

## Coding Standards & Architecture

- **Clean Architecture (Ports & Adapters/Hexagonal):** The project strictly separates concerns into distinct layers, with dependencies pointing inwards towards the core domain.
- **SOLID Principles:** Adherence to SOLID principles ensures maintainability, flexibility, and scalability.
- **Next.js App Router:** Leverages Server/Client component usage and the new file-system based routing.
- **TypeScript:** The entire codebase uses TypeScript for strong type safety and improved developer experience.
- **Dependency Inversion Principle (DIP):** High-level modules depend on abstractions (interfaces) rather than concrete implementations, facilitated by the dependency injection container.
- **No Comments:** Code is designed to be self-documenting; comments are generally avoided.
- **Alias Imports:** Uses alias imports as configured in `tsconfig.json` for cleaner import paths.

## What Could Be Done

- **Expanded LLM Integration:** Support for more LLM providers and advanced prompt engineering techniques.
- **Enhanced File Processing:** Support for a wider range of input file formats (e.g., audio transcripts, images).
- **User Authentication & Management:** Implement user accounts for personalized reports and history.
- **Report Storage & Retrieval:** Persist generated reports in a database for later access.
- **Advanced UI/UX:** Improve the user interface for file selection, report customization, and display.
- **Testing:** Increase test coverage (unit, integration, end-to-end) for core logic and UI components.
- **CI/CD:** Set up a continuous integration and deployment pipeline.
- **Error Handling & Logging:** More robust error handling and detailed logging.
- **Internationalization (i18n):** Full i18n support for the application interface.
