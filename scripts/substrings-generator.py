import json
from collections import Counter

MIN_TRI_FREQUENCY = 500
MIN_BI_FREQUENCY = 10

with open("assets/novel.txt", "r", encoding="utf-8") as novel:
    text = novel.read()
    # Remove punctuation
    text = ''.join(char for char in text if char.isalpha() or char.isspace())
    words = [word.lower() for word in text.split()]

# Get all trigrams from each word
trigrams = []
# Get first two letters from each word
bigrams = []

for word in words:
    # Get trigrams from current word
    if len(word) >= 3:
        for i in range(len(word) - 2):
            trigrams.append(word[i:i+3])
    # Get all possible bigrams from current word
    if len(word) >= 2:
        bigrams.append(word[0:2])


# Count occurrences
trigram_counts = dict(Counter(trigrams))
trigram_counts = {k: v for k, v in trigram_counts.items() if v >= MIN_TRI_FREQUENCY}

bigram_counts = dict(Counter(bigrams))
bigram_counts = {k: v for k, v in bigram_counts.items() if v >= MIN_BI_FREQUENCY}

with open("assets/substrings.json", "w") as substrings:
    json.dump(trigram_counts, substrings, indent=4)
with open("assets/bigrams.json", "w") as bigrams:
    json.dump(bigram_counts, bigrams, indent=4)