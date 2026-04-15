# AI Training Guide

A comprehensive educational platform for advanced AI training methods, built for practitioners who want to train models from scratch using their own GPU.

![AI Training Guide](https://img.shields.io/badge/AI-Training%20Guide-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)

---

## Features

### Knowledge Base
- **Topics** — curated learning paths across NLP, Computer Vision, Reinforcement Learning, Generative AI, and more
- **Articles** — deep-dive technical articles with real code examples (Transformers, BERT, ViT, PPO, Diffusion Models, CLIP, Quantization)

### Training Lab
Train AI models from scratch with step-by-step guides:

| Model Type | VRAM Required | Examples |
|---|---|---|
| Language Model | 8–24 GB | GPT-2, LLaMA 3, Mistral 7B |
| Vision Model | 8–16 GB | ResNet, ViT, YOLOv8 |
| Voice Model | 8–16 GB | Whisper, XTTS, SpeechT5 |
| Image Generation | 12–24 GB | Stable Diffusion, SDXL |
| Video Generation | 24–80 GB | AnimateDiff, CogVideoX |
| AI Agent | 8–24 GB | ReAct, LangGraph, CrewAI |

- 12 training paths with full step-by-step instructions and code
- Stack system — combine models to build multimodal agents

### Datasets
14 curated open datasets from HuggingFace and official sources, filterable by model type and category.

### Customization
Full user-controlled experience — dark/light mode, theme color, font size, layout width — all saved to localStorage.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, shadcn/ui |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Drizzle ORM) |
| API | OpenAPI 3.0, Orval codegen, React Query |
| Monorepo | pnpm workspaces |

---

## Project Structure

```
/
├── artifacts/
│   ├── ai-training-guide/     # React frontend (Vite)
│   └── api-server/            # Express REST API
├── lib/
│   ├── db/                    # Drizzle ORM schema + migrations
│   ├── api-spec/              # OpenAPI YAML contract
│   ├── api-client-react/      # Generated React Query hooks
│   └── api-zod/               # Generated Zod validators
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-training-guide.git
cd ai-training-guide

# Install dependencies
pnpm install

# Set environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and SESSION_SECRET

# Push database schema
pnpm --filter @workspace/db run db:push

# Seed the database
pnpm --filter @workspace/db run db:seed

# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend (in a separate terminal)
pnpm --filter @workspace/ai-training-guide run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_training_guide
SESSION_SECRET=your_session_secret_here
PORT=8080
BASE_PATH=/
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/topics` | All topics |
| GET | `/api/topics/featured` | Featured topics |
| GET | `/api/articles` | All articles |
| GET | `/api/articles/summary` | Article stats |
| GET | `/api/training/model-types` | All model types |
| GET | `/api/training/paths` | All training paths |
| GET | `/api/training/paths/:id` | Path with steps |
| GET | `/api/training/summary` | Training stats |
| GET | `/api/datasets` | All datasets |

---

## License

MIT License — free to use, modify, and distribute.
