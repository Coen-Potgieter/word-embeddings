import * as tf from "@tensorflow/tfjs";

function calcDotProduct(vec1: tf.Tensor1D, vec2: tf.Tensor1D): number {
  return tf.dot(vec1, vec2).dataSync()[0];
}

function calcEuclidNorm(vec: tf.Tensor1D): number {
  return tf.norm(vec, 2).dataSync()[0];
}

export function calcCosSim(
  vec1: tf.Tensor1D | undefined,
  vec2: tf.Tensor1D | undefined,
): number | null {
  if (vec1 && vec2) {
    return (
      calcDotProduct(vec1, vec2) / (calcEuclidNorm(vec1) * calcEuclidNorm(vec2))
    );
  }
  return null;
}

type PCAParams = {
  mean: number[];
  components: number[][];
};

// Load and cache PCA parameters once
let pcaPromise: Promise<PCAParams> | null = null;

async function loadPCAParams(): Promise<PCAParams> {
  if (!pcaPromise) {
    pcaPromise = fetch("/data/pca_params.json").then((res) => {
      if (!res.ok) throw new Error("Failed to load PCA params");
      return res.json();
    });
  }
  return pcaPromise;
}

/**
 * Reduces a 50D tf.Tensor1D to 3D using precomputed PCA params.
 * @param input A tf.Tensor1D of shape [50]
 * @returns A tf.Tensor1D of shape [3]
 */
export async function applyPCA(input: tf.Tensor1D): Promise<tf.Tensor1D> {
  const { mean, components } = await loadPCAParams();

  // Convert to tensors
  const meanTensor = tf.tensor1d(mean);
  const componentsTensor = tf.tensor2d(components); // shape: [50, 3]

  // Apply PCA
  return tf.tidy(() => {
    const centered = input.sub(meanTensor); // [50]
    const reduced = tf.matMul(centered.expandDims(0), componentsTensor); // [1, 3]
    return reduced.squeeze(); // [3]
  });
}

export function vectorOperation(
  vec1: tf.Tensor1D,
  vec2: tf.Tensor1D,
  opp: string,
): tf.Tensor1D {
  if (opp === "+") {
    return vec1.add(vec2);
  } else if (opp === "-") {
    return vec1.sub(vec2);
  } else {
    throw Error;
  }
}

// export function findClosestWord(
//   vec: tf.Tensor1D,
//   excludedKeys: string[],
//   embeddings: any,
// ): [string, number] {
//   // Naive Solution
//   let bestWord = "";
//   let bestSim = -2;

//   let i = 0;
//   for (const [key, value] of embeddings) {
//     if (excludedKeys.includes(key)) continue; // Now this works!

//     const checkVec = tf.tensor1d(value);
//     const sim = calcDotProduct(vec, checkVec);

//     if (sim > bestSim) {
//       bestWord = key;
//       bestSim = sim;
//     }

//     // checkVec.dispose(); // Important: Clean up tensors
//     i += 1;
//   }

//   return [bestWord, bestSim];

//   // TODO: gotta make this efficient. Or try naive and see if performance is that bad...
//   // TODO: Also, think about using `useEffect` and state for the new word in `WordMath.tsx`

// }

export async function findMostSimilar(
  queryTensor: tf.Tensor1D,
  vectorMap: Map<string, tf.Tensor1D>,
  excludedKeys: string[] = [],
  batchSize = 10000,
): Promise<[string, number]> {
  // Now returns a tuple of string and number
  // Normalize the query vector
  const normalizedQuery = queryTensor.div(tf.norm(queryTensor));

  let maxSimilarity = -1;
  let bestKey = "";

  // Convert excludedKeys to Set for faster lookups
  const excludedSet = new Set(excludedKeys);

  // Process in batches to avoid memory issues
  const keys = Array.from(vectorMap.keys()).filter((k) => !excludedSet.has(k));

  for (let i = 0; i < keys.length; i += batchSize) {
    const batchKeys = keys.slice(i, i + batchSize);
    const batchTensors = batchKeys.map((k) => vectorMap.get(k)!);

    // Stack all vectors in the batch into a 2D tensor
    const batchMatrix = tf.stack(batchTensors);

    // Normalize all vectors in the batch (L2 normalization)
    const norms = tf.norm(batchMatrix, "euclidean", 1);
    const normalizedBatch = batchMatrix.div(norms.expandDims(1));

    // Compute cosine similarity (dot product with normalized vectors)
    const similarities = tf
      .matMul(normalizedBatch, normalizedQuery.reshape([50, 1]))
      .reshape([-1]);

    // Find max similarity in this batch
    const { values, indices } = tf.topk(similarities, 1);
    const currentMax = await values.data();
    const index = await indices.data();

    if (currentMax[0] > maxSimilarity) {
      maxSimilarity = currentMax[0];
      bestKey = batchKeys[index[0]];
    }

    // Clean up tensors to avoid memory leaks
    tf.dispose([
      batchMatrix,
      norms,
      normalizedBatch,
      similarities,
      values,
      indices,
    ]);
  }

  return [bestKey, maxSimilarity]; // Now returning both key and similarity
}
