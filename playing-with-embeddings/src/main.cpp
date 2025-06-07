#include <Eigen/Dense>
#include <algorithm>
#include <fstream>
#include <iostream>
#include <string>
#include <utility>


std::vector<std::vector<float>> createEmbeddings(std::string_view embeddingsLoc, const int vecSize, const int dictSize);
void extractDictionary(std::string_view embeddingsLoc, std::string_view saveLoc, const int vecSize);
float cosineSimilarity(std::vector<std::vector<float>> &embeddings, const int word1, const int word2);
std::vector<std::string> loadDictionary(std::string_view dictLoc);
std::pair<int, float> findMostSimilarWord(std::vector<std::vector<float>> &embeddings, Eigen::VectorXf &targetWord, const std::vector<int> &exclusions);
int returnIndex(std::vector<std::string> &myDict, std::string_view targetWord);
void printOperation1(std::vector<std::vector<float>> &embeddings, std::string_view word1, std::string_view word2, std::string_view word3);
void printOperation2(std::vector<std::vector<float>> &embeddings, std::string_view word1, std::string_view word2);
void printOperation3(std::vector<std::vector<float>> &embeddings, std::string_view word1, std::string_view word2);
void compareSim(std::vector<std::vector<float>> &embeddings, std::string_view word1, std::string_view word2);
void createJsonDataFile(std::vector<std::vector<float>> &embeddings, const std::vector<std::string>& myDict, std::string_view saveFile);

int main() {
    /* extractDictionary("assets/glove.6B.50d.txt", "assets/myDict.txt", 50); */
    /* return 0; */

    const int dictSize = 400000;
    const int vecSize = 50;
    /* const int vecSize = 100; */
    /* const int vecSize = 200; */
    /* const int vecSize = 300; */
    const std::string fileLoc = "assets/glove.6B." + std::to_string(vecSize) + "d.txt";

    std::vector<std::vector<float>> embeddings;
    try {
        embeddings = createEmbeddings(fileLoc, vecSize, dictSize);
    } catch(const std::invalid_argument& e) {
        std::cerr << e.what() << '\n';
        return 1; 
    }

    // Save Embeddings as typescript Map
    std::vector<std::string> myDict = loadDictionary("assets/myDict.txt");

    try {
        createJsonDataFile(embeddings, myDict, "../embeddings-site/my-app/public/data/embeddings-data.json");
    } catch(const std::invalid_argument& e) {
        std::cerr << e.what() << '\n';
        return 1;
    }

    return 0;


    /* // word1 - word2 + word3 */
    /* printOperation1(embeddings, "king", "man", "woman"); */
    /* printOperation1(embeddings, "prince", "man", "woman"); */
    /* printOperation1(embeddings, "he", "man", "woman"); */
    /* printOperation1(embeddings, "paris", "france", "italy"); */
    /* printOperation1(embeddings, "berlin", "germany", "japan"); */
    /* printOperation1(embeddings, "go", "going", "run"); */
    /* printOperation1(embeddings, "walking", "walk", "swim"); */
    /* printOperation1(embeddings, "good", "better", "bad"); */
    /* printOperation1(embeddings, "fast", "faster", "slow"); */
    /* printOperation1(embeddings, "hitler", "germany", "italy"); */
    /* printOperation1(embeddings, "man", "old", "young"); */
    /* printOperation1(embeddings, "dog", "bark", "meow"); */
    /* printOperation1(embeddings, "yen", "china", "america"); */
    printOperation1(embeddings, "man", "woman", "gay");

    /* /1*     // word1 + word2 *1/ */
    /* /1*     printOperation2(embeddings, "dog", "beast"); *1/ */
    /* /1*     /2* printOperation2(embeddings, "baseball", "indian"); *2/ *1/ */
    /*     printOperation2(embeddings, "man", "man"); */
    /*     printOperation2(embeddings, "man", "flamboyant"); */
    /*     printOperation2(embeddings, "men", "flamboyant"); */
    /*     printOperation2(embeddings, "gender", "confused"); */
    /*     printOperation2(embeddings, "man", "make-up"); */
    /*     printOperation2(embeddings, "man", "makeup"); */
    /*     printOperation2(embeddings, "man", "liberal"); */
    /*     printOperation2(embeddings, "man", "rainbow"); */
    printOperation2(embeddings, "man", "gay");

    /*     // word 1 - word 2 */
    /*     /1* printOperation3(embeddings, "man", "woman"); *1/ */
    /*     printOperation3(embeddings, "man", "insecure"); */

    /* /1*     compareSim(embeddings, "dog", "beast"); *1/ */
    /* /1*     compareSim(embeddings, "cat", "beast"); *1/ */
    /* /1*     compareSim(embeddings, "religion", "logic"); *1/ */
    /*     /1* compareSim(embeddings, "religion", "truth"); *1/ */
    /*     compareSim(embeddings, "religion", "truth"); */
    /*     compareSim(embeddings, "religion", "fake"); */
    /*     compareSim(embeddings, "woman", "logic"); */
    /*     compareSim(embeddings, "man", "logic"); */
    /*     compareSim(embeddings, "man", "hysterical"); */
    printOperation2(embeddings, "liberal", "gay");

    return 0;
}


std::vector<std::vector<float>> createEmbeddings(std::string_view embeddingsLoc, const int vecSize, const int dictSize) {
    // Load in File
    std::ifstream fin;
    fin.open(embeddingsLoc);

    // Error Check
    if (!fin) throw std::invalid_argument("Given File Path Does Not Exist");

    // Create Vector
    std::vector<std::vector<float>> embeddings(dictSize, std::vector<float>(vecSize));

    std::string entry;
    double weight;
    int wordIndex = 0;
    int weightIndex = 0;
    while (fin >> entry) {

        // Next word
        if (weightIndex >= vecSize) {
            wordIndex += 1;
            weightIndex = 0;

            if (wordIndex % 10000 == 0) {
                std::cout << "Loaded " << wordIndex << " words...\n";
            }
            continue;
        }

        // Check for float
        try {
            weight = std::stof(entry);
            embeddings[wordIndex][weightIndex] = weight;
        } catch (const std::invalid_argument &e) {
            if (wordIndex != 0) std::cout << "Something happened that should not have, come to line 49...\n";
            continue;
        }
        weightIndex += 1;
    }

    fin.close();
    return embeddings;
}

void extractDictionary(std::string_view embeddingsLoc, std::string_view saveLoc, const int vecSize) {

    std::ofstream fout;
    fout.open(saveLoc);
    if (!fout) {
        std::cerr << "Cannot open file\n";
        return;
    }

    std::ifstream fin;
    fin.open(embeddingsLoc);
    if (!fin) {
        std::cerr << "Cannot open file\n";
        return;
    }

    std::string line;
    int i = 0;
    while (std::getline(fin, line)) {
        std::string word = line.substr(0, line.find_first_of(" "));
        std::cout << "Saving Word " << i << ": " << word << '\n';
        fout << "\"" << word << "\"" << ": " << i << '\n';
        i += 1;
    }

    fout.close();
    return;
}

std::vector<std::string> loadDictionary(std::string_view dictLoc) {

    std::ifstream fin;
    fin.open(dictLoc);
    if (!fin) {
        std::cerr << "Cannot open file\n";
        exit(1);
    }

    std::string line;
    std::vector<std::string> myDict;
    int i = 0;
    while (std::getline(fin, line)) {
        myDict.push_back(line.substr(1, line.find_first_of("\"", 1) - 1));
    }

    fin.close();
    return myDict;
}
float cosineSimilarity(std::vector<std::vector<float>> &embeddings,
                       const int word1, const int word2) {

    std::vector<std::string> myDict = loadDictionary("assets/myDict.txt");
    std::cout << "Computing Cosine Similarity Between: " << myDict.at(word1)
        << " & " << myDict.at(word2) << '\n';

    Eigen::VectorXf eigenVec1 = Eigen::VectorXf::Map(embeddings.at(word1).data(), embeddings.at(word1).size());
    Eigen::VectorXf eigenVec2 = Eigen::VectorXf::Map(embeddings.at(word2).data(), embeddings.at(word2).size());

    float cosine_sim = (eigenVec1.transpose() * eigenVec2).value() / (eigenVec1.norm() * eigenVec2.norm());

    return cosine_sim;
}

std::pair<int, float> findMostSimilarWord(std::vector<std::vector<float>> &embeddings, Eigen::VectorXf &targetWord, const std::vector<int> &exclusions) {
    int closestIdx = 0;
    float maxSim = -1.1;
    float cos_sim;

    int i = 0;
    for (const std::vector<float> &word : embeddings) {
        Eigen::VectorXf testWord = Eigen::VectorXf::Map(word.data(), word.size());
        cos_sim = (testWord.transpose() * targetWord).value() / (testWord.norm() * targetWord.norm());
        if (cos_sim > maxSim) {

            bool isExcluded = false;
            for (const int &excl : exclusions) {
                if (excl == i) {
                    isExcluded = true;
                    break;
                }
            }
            if (!isExcluded) {
                closestIdx = i;
                maxSim = cos_sim;
            }
        }
        i++;
    }

    return std::make_pair(closestIdx, maxSim);
}

int returnIndex(std::vector<std::string> &myDict, std::string_view targetWord) {
    auto it = std::find(myDict.begin(), myDict.end(), targetWord);
    if (it == myDict.end()) {
        std::cerr << "Word was not found\n";
    }

    return std::distance(myDict.begin(), it);
}

void printOperation1(std::vector<std::vector<float>> &embeddings, std::string_view word1, std::string_view word2, std::string_view word3) {

    // word1 - word2 + word3
    std::vector<std::string> myDict = loadDictionary("assets/myDict.txt");
    int word1Idx = returnIndex(myDict, word1);
    int word2Idx = returnIndex(myDict, word2);
    int word3Idx = returnIndex(myDict, word3);

    int vecSize = embeddings.at(0).size();

    Eigen::VectorXf vec1 = Eigen::VectorXf::Map(embeddings.at(word1Idx).data(), vecSize);
    Eigen::VectorXf vec2 = Eigen::VectorXf::Map(embeddings.at(word2Idx).data(), vecSize);
    Eigen::VectorXf vec3 = Eigen::VectorXf::Map(embeddings.at(word3Idx).data(), vecSize);
    Eigen::VectorXf result = vec1 - vec2 + vec3;

    auto [index, cosSim] = findMostSimilarWord(embeddings, result, {word1Idx, word2Idx, word3Idx});
    std::cout << "The Result of \"" << word1 << "\" - \"" << word2 << "\" + \""
        << word3 << "\" is: \n\t" << myDict.at(index)
        << " With similarity of " << cosSim << "\n\n";
}

void printOperation2(std::vector<std::vector<float>> &embeddings, std::string_view word1, std::string_view word2) {

    // word1 + word2
    std::vector<std::string> myDict = loadDictionary("assets/myDict.txt");
    int word1Idx = returnIndex(myDict, word1);
    int word2Idx = returnIndex(myDict, word2);

    int vecSize = embeddings.at(0).size();

    Eigen::VectorXf vec1 = Eigen::VectorXf::Map(embeddings.at(word1Idx).data(), vecSize);
    Eigen::VectorXf vec2 = Eigen::VectorXf::Map(embeddings.at(word2Idx).data(), vecSize);
    Eigen::VectorXf result = vec1 + vec2;

    auto [index, cosSim] = findMostSimilarWord(embeddings, result, {word1Idx, word2Idx});
    std::cout << "The Result of \"" << word1 << "\" + \"" << word2 << "\""
        << " is: \n\t" << myDict.at(index) << " With similarity of "
        << cosSim << "\n\n";
}

void printOperation3(std::vector<std::vector<float>> &embeddings, std::string_view word1, std::string_view word2) {

    // word1 - word2
    std::vector<std::string> myDict = loadDictionary("assets/myDict.txt");
    int word1Idx = returnIndex(myDict, word1);
    int word2Idx = returnIndex(myDict, word2);

    int vecSize = embeddings.at(0).size();

    Eigen::VectorXf vec1 = Eigen::VectorXf::Map(embeddings.at(word1Idx).data(), vecSize);
    Eigen::VectorXf vec2 = Eigen::VectorXf::Map(embeddings.at(word2Idx).data(), vecSize);
    Eigen::VectorXf result = vec1 - vec2;

    auto [index, cosSim] = findMostSimilarWord(embeddings, result, {word1Idx, word2Idx});
    std::cout << "The Result of \"" << word1 << "\" - \"" << word2 << "\""
        << " is: \n\t" << myDict.at(index) << " With similarity of "
        << cosSim << "\n\n";
}

void compareSim(std::vector<std::vector<float>> &embeddings, std::string_view word1, std::string_view word2) {

    // Cos_sim(word1, word2)
    std::vector<std::string> myDict = loadDictionary("assets/myDict.txt");
    int word1Idx = returnIndex(myDict, word1);
    int word2Idx = returnIndex(myDict, word2);

    int vecSize = embeddings.at(0).size();
    Eigen::VectorXf vec1 = Eigen::VectorXf::Map(embeddings.at(word1Idx).data(), vecSize);
    Eigen::VectorXf vec2 = Eigen::VectorXf::Map(embeddings.at(word2Idx).data(), vecSize);
    float cosSim = vec1.dot(vec2) / (vec1.norm() * vec2.norm());

    std::cout << "Similarity between \"" << word1 << "\" & \"" << word2
        << "\" is: " << cosSim << "\n\n";
}


void createJsonDataFile(std::vector<std::vector<float>> &embeddings, const std::vector<std::string>& myDict, std::string_view saveFile) {

    const int vecSize = embeddings.at(0).size();
    const int dictSize = myDict.size();
    std::ofstream fout;
    fout.open(saveFile);
    if (!fout) {
        throw std::invalid_argument("Could not open file");
    }

    fout << "{\n";

    int wordCount = 0;
    for (int i = 0; i < myDict.size(); i++) {

        if (myDict.at(i) == "\\") {
            std::cout << "\\ Skipped successfully :)\n";
            continue;
        }
        fout << "\t\"" << myDict.at(i) << "\": [";
        int j = 0;
        for (const float& elem : embeddings.at(i)) {
            if (j == vecSize - 1) {
                fout << elem << "";
            } else {
                fout << elem << ", ";
            }

            j += 1;
            if (j % 10 == 0) fout << "\n\t\t";
        }

        wordCount += 1;

        if (wordCount != dictSize - 1) {
            fout << "],\n";
        } else {
            fout << "]\n";
        }

        if (wordCount % 10000 == 0) std::cout << std::to_string(wordCount) + " words saved\n";
    }
    fout << "}";

    fout.close();
    return;
}
