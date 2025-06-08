import React from "react";

const ExplanationSection: React.FC = () => {
  return (
    <section className="max-w-4xl text-black mx-auto px-6 py-12 h-96 overflow-y-auto scrollbar-h-1 scrollbar-w-10 scrollbar-thumb-amber-700 scrollbar-track-transparent">
      <h2 className="text-3xl font-bold mb-6">🔍 What Are Embeddings?</h2>
      <p className="mb-4 text-lg leading-relaxed">
        Embeddings are <strong>mathematical representations of meaning</strong>.
        They transform words, sentences, or entire documents into vectors—points
        in a high-dimensional space—so that{" "}
        <span className="italic">semantic similarity becomes measurable</span>.
      </p>

      <p className="mb-4 text-lg leading-relaxed">
        For example: in a well-trained embedding space, the vector for{" "}
        <code>king</code> minus <code>man</code> plus <code>woman</code> ends up
        close to the vector for <code>queen</code>. This isn't magic—it's
        statistics. These relationships emerge from patterns in massive text
        corpora.
      </p>

      <h3 className="text-2xl font-semibold mt-10 mb-4 ">
        🧠 Why Do We Need Embeddings?
      </h3>
      <p className="mb-4 text-lg leading-relaxed">
        Computers don’t understand language—they understand numbers. Before
        embeddings, we used one-hot encoding, which assigned each word a unique
        ID. But this threw away all meaning. <code>cat</code> and{" "}
        <code>dog</code> were just as different as <code>cat</code> and{" "}
        <code>refrigerator</code>.
      </p>

      <p className="mb-4 text-lg leading-relaxed">
        Embeddings fix this. They give us vectors where{" "}
        <strong>semantic closeness</strong> corresponds to
        <strong>distance in space</strong>. This is the foundation of most
        modern NLP—chatbots, search engines, translation systems, and more.
      </p>

      <h3 className="text-2xl font-semibold mt-10 mb-4 ">
        ⚙️ How Are Embeddings Learned?
      </h3>
      <p className="mb-2 text-lg leading-relaxed">
        There are two main strategies:
      </p>

      <ul className="list-disc pl-6 mb-4 space-y-2 text-lg">
        <li>
          <strong>Context-based (count/co-occurrence):</strong> Used by models
          like <code>GloVe</code>. They learn relationships by building a
          massive co-occurrence matrix and compressing it into a smaller space.
        </li>
        <li>
          <strong>Prediction-based (neural models):</strong> Used by{" "}
          <code>word2vec</code>, <code>FastText</code>, and <code>BERT</code>.
          These models learn to predict a word from its context or vice versa.
          The resulting embeddings are learned implicitly.
        </li>
      </ul>

      <h3 className="text-2xl font-semibold mt-10 mb-4 ">
        🗺️ What Does the Embedding Space Mean?
      </h3>
      <p className="mb-4 text-lg leading-relaxed">
        Imagine a map—not of places, but of concepts. In this map:
      </p>

      <ul className="list-disc pl-6 mb-4 space-y-2 text-lg">
        <li>
          <strong>Clusters:</strong> Words like "anger", "joy", "fear" group
          together.
        </li>
        <li>
          <strong>Directions:</strong> Some axes represent gender, sentiment, or
          formality.
        </li>
        <li>
          <strong>Analogies:</strong> <code>king - man + woman ≈ queen</code>{" "}
          reflects a geometric relationship.
        </li>
      </ul>

      <p className="mb-4 text-lg leading-relaxed">
        But this space isn’t neutral. It reflects the biases and patterns of the
        training data. Embeddings don’t “understand” language—they mirror how
        it’s used.
      </p>

      <h3 className="text-2xl font-semibold mt-10 mb-4 ">
        🎯 Why Should You Care?
      </h3>
      <p className="mb-4 text-lg leading-relaxed">
        If you're working with language—search, classification,
        recommendations—embeddings are your foundation. They let machines deal
        not just with text, but with{" "}
        <strong>meaning, similarity, context, and nuance</strong>.
      </p>

      <p className="mb-4 text-lg leading-relaxed">
        This site lets you explore embeddings visually—so you can see what
        language looks like from a machine’s point of view.
      </p>
    </section>
  );
};

export default ExplanationSection;
