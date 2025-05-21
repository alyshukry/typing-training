total_weight = sum(bigram_data.values())
weights = [count/total_weight for count in bigram_data.values()]
string = random.choices(list(bigram_data.keys()), weights=weights, k=1)[0]