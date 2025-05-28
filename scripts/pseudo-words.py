import json
from collections import Counter
import random

# Read the trigrams file
with open("assets/trigrams.json", "r", encoding="utf-8") as substrings:
    trigram_data = json.load(substrings)

global bigram_data
# Read the bigrams file
with open("assets/bigrams.json", "r", encoding="utf-8") as bigrams:
    bigram_data = json.load(bigrams)
# Pick a random bigram (with weight)
total_bi_weight = sum(bigram_data.values())
bi_weights = [count/total_bi_weight for count in bigram_data.values()]
# Pick the bigram and use it as the initial string
string = random.choices(list(bigram_data.keys()), weights = bi_weights, k = 1)[0]

counter = 0 # Counter for the amount of times to iterate
def generate_word(iterations):
    global string
    global counter

    total_matches = 0
    matches = {}
    for trigram in trigram_data: # Get all the trigrams with the first two letters that match the last two letters of the string
        if trigram.startswith(string[-2:]):
            matches.update({trigram: trigram_data[trigram]}) # Add to a dictionary
            total_matches += int(trigram_data[trigram]) # Add values to one variable for weighted probability

    if matches:
        weights = [matches[trigram] / total_matches for trigram in matches] # Weights for the random choice
        selected_trigram = random.choices(list(matches.keys()), weights = weights, k = 1)[0] # Select trigram randomly

        string = string[:-2] # Remove last two letters of the string before adding the trigram
        string += selected_trigram # Add the trigram to the string
        if counter <= iterations: # Run multiple times
            counter += 1
            generate_word(iterations - 1)

# Create multiple words and store them in a dictionary
word_dict = {}
for i in range(10000):  # Generate 10000 words
    string = random.choices(list(bigram_data.keys()), weights = bi_weights, k = 1)[0]  # Reset string
    counter = 0  # Reset counter
    generate_word(random.randint(2, 7))  # Generate new word
    word_dict[str(i)] = string  # Add to dictionary with index as key

# Write to file
with open("assets/pseudo-words.json", "w") as substrings:
    json.dump(word_dict, substrings, indent = 4)