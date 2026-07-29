# RAG Mongo Demo

A full-stack demo application for indexing, searching, and exploring test cases and user stories using MongoDB Atlas Vector Search, embeddings, and AI-assisted retrieval workflows.

This project combines a React frontend with an Express backend to support:

- Excel-to-JSON conversion for test cases and user stories
- Embedding generation and storage in MongoDB
- Vector, BM25, hybrid, and reranked search
- Query preprocessing and expansion
- AI-powered summarization and deduplication
- Prompt and schema management for retrieval workflows

## Overview

The application is designed as a practical RAG-style demo for searching structured content stored in MongoDB. It demonstrates how to move from raw data to searchable embeddings and then use different retrieval strategies to improve results.

## Key Features

- Upload and convert Excel files into JSON structures
- Generate embeddings using Mistral AI
- Store documents in MongoDB with Atlas Search support
- Compare retrieval strategies:
  - Vector search
  - BM25 keyword search
  - Hybrid search
  - Reranked / fused search
- Preprocess and expand user queries
- Summarize and deduplicate results with Groq
- Configure environment and search settings through the UI

## Tech Stack

### Frontend
- React
- Material UI
- React Scripts

### Backend
- Node.js
- Express
- MongoDB Node.js driver
- Multer for file uploads

### AI / Search
- Mistral AI embeddings
- Groq for reranking and summarization
- MongoDB Atlas Vector Search

## Project Structure

```text
client/                 # React frontend
server/                 # Express backend
src/
  config/               # Search index configuration JSON files
  data/                 # Sample converted data files
  scripts/              # Data conversion, embedding, and search utilities
uploads/                # Uploaded files and generated assets
```

## Prerequisites

Before running the project, make sure you have:

- Node.js and npm installed
- A MongoDB Atlas account with Atlas Search enabled
- Mistral AI API credentials
- Groq API credentials

## Environment Configuration

Create a local environment file by copying the example file:

```bash
cp .env.example .env
```

Then update the values in `.env` with your own configuration:

```env
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>"
DB_NAME="db_stories_tests"
COLLECTION_NAME="test_cases"
VECTOR_INDEX_NAME="vector_index_test_cases"
BM25_INDEX_NAME="bm25_search"
USER_STORIES_COLLECTION_NAME="user_stories"
USER_STORIES_VECTOR_INDEX_NAME="vector_index_user_story"
MISTRAL_API_KEY="your_mistral_api_key"
MISTRAL_EMBEDDING_MODEL="mistral-embed"
GROQ_API_KEY="your_groq_api_key"
GROQ_RERANK_MODEL="openai/gpt-oss-120b"
GROQ_SUMMARIZATION_MODEL="openai/gpt-oss-120b"
```

> Make sure your MongoDB collections and Atlas Search indexes exist before running search operations.

## Installation

Install dependencies for the root project and the client:

```bash
npm install
```

## Running the Application

Start both the backend and frontend together:

```bash
npm run dev
```

This will launch:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

You can also run them separately:

```bash
npm run server
npm run client
```

## Building for Production

```bash
npm run build
```

## Typical Workflow

1. Convert data from Excel into JSON
2. Create embeddings for the documents
3. Store them in MongoDB
4. Run searches using vector, BM25, hybrid, or reranked methods
5. Review and refine results with preprocessing and summarization tools

## Notes

- The backend includes file upload support and job tracking for long-running embedding or processing tasks.
- The UI exposes the main workflows as separate sections, making it easier to experiment with retrieval pipelines.
- The repository also includes scripts under the `src/scripts` folder for data conversion and search experiments.

## License

This project is intended for demonstration and experimentation purposes.
