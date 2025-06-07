import * as tf from "@tensorflow/tfjs";

function calcDotProduct(vec1: tf.Tensor1D, vec2: tf.Tensor1D): number {
  return tf.dot(vec1, vec2).dataSync()[0];
}

function calcEuclidNorm(vec: tf.Tensor1D): number {
  return tf.norm(vec, 2).dataSync()[0];
}

export function calcCosSim(
  nums1: number[] | undefined,
  nums2: number[] | undefined,
): number | null {
  if (nums1 && nums2) {
    const vec1 = tf.tensor1d(nums1);
    const vec2 = tf.tensor1d(nums2);
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
