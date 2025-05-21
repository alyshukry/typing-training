import json
from collections import Counter
import random

# Read the trigrams file
with open("assets/substrings.json", "r", encoding="utf-8") as substrings:
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
def generate_next_letter(iterations):
    global string
    global counter

    total_matches = 0
    matches = {}
    for trigram in trigram_data: # Get all the trigrams that match the last two letters of the string
        if trigram.startswith(string[-2:]):
            matches.update({trigram: trigram_data[trigram]})
            total_matches += int(trigram_data[trigram])

    if matches:
        weights = [matches[trigram] / total_matches for trigram in matches]
        selected_trigram = random.choices(list(matches.keys()), weights = weights, k = 1)[0]
        string = string[:-2]
        string += selected_trigram
        if counter <= iterations:
            counter += 1
            generate_next_letter(iterations - 1)

generate_next_letter(5)

print(string)