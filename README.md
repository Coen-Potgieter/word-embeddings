# word-embeddings

# Word Embedding Playground 💬

An interactive React web app for exploring the structure and logic of word embeddings using the GloVe dataset. Includes real-time vector arithmetic, similarity search, and PCA-based 3D visualization—all powered by precomputed data processed in C++.

## 📌 What It Does

- **Explore Word Embeddings**: See how semantic relationships are encoded in vector space.
- **Linguistic Arithmetic**: Try famous analogies like `king - man + woman = queen`, or make your own with up to 5 terms.
- **3D Visualization**: Type any valid words and see their vectors projected into 3D space via PCA.
- **Efficient Frontend-Only Architecture**: No backend required—large embedding data and PCA projections are preprocessed in C++ and served as static JSON for the React app to consume on the fly.
- **Learn as You Play**: Built-in educational content explains what embeddings are, how they work, and why they matter.

## 🧠 Behind the Scenes

- Used the [GloVe 6B](https://nlp.stanford.edu/projects/glove/) dataset (400K vocab, 50d–300d vectors).
- A custom C++ pipeline parses the dataset, computes PCA and pre-generates optimized JSON payloads.
- This structure enables high performance in the browser without a backend or WebAssembly.

## 🛠️ Setup (React Site)

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Install & Run

```bash
git clone https://github.com/yourusername/word-embedding-playground.git
cd word-embedding-playground/embeddings-site/frontend
npm install
npm run dev  # or npm start, depending on setup
```

This will launch the site locally. Make sure the precomputed JSON embedding files are in the correct `public/` directory.

## 💬 Example Use Cases

- `Hitler - Germany + Italy ≈ Mussolini`
- `Paris - France + Germany ≈ Berlin`
- Real-time similarity comparison: Type "man" vs "woman", see the cosine similarity.

## 📖 Learn

Includes an embedded explanation of:

- What embeddings are
- How they are trained
- Why they encode semantic meaning
- What PCA is and why it's used here

---

## 🤔 Why This Matters

Word embeddings are one of the key breakthroughs that allowed NLP to make the leap from symbolic to statistical reasoning. This project breaks that black box open and makes it explorable—visually, interactively, and intuitively.


# Contributions

- [GloVe: Global Vectors for Word Representation](https://nlp.stanford.edu/projects/glove/)
