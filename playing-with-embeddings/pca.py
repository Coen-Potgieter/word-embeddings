import json
import numpy as np
from sklearn.decomposition import PCA

react_site_data_dir = "../embeddings-site/my-app/public/data/"

# === Load Embeddings ===
print("Loaded Embeddings...")
with open(react_site_data_dir + "embeddings-data.json", "r") as f:
    embeddings = json.load(f)
print("Done.\n")

print("Extracting Vectors...")
words = list(embeddings.keys())
vecs = np.array([embeddings[word] for word in words])  # Shape: [n_words, 50]
print("Done.\n")

# === Run PCA ===
print("Performing PCA...")
pca = PCA(n_components=3)
pca.fit(vecs)

mean = pca.mean_.tolist()  # [50]
components = pca.components_.T.tolist()  # [50][3], transposed to match convention
explained_variance_ratio = pca.explained_variance_ratio_.tolist()  # Optional
print("Done.\n")


# === Save PCA Params ===
print("Saving PCA Params...")
pca_params = {
    "mean": mean,
    "components": components,
    "explained_variance_ratio": explained_variance_ratio
}

with open(react_site_data_dir + "pca_params.json", "w") as f:
    json.dump(pca_params, f, indent=2)

print("✅ PCA parameters saved to assets/pca_params.json")

