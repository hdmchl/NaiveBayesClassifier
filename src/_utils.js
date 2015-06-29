/**
 * Add a word to our vocabulary and increment the {@link NaiveBayesClassifier#vocabularySize} counter.
 *
 * @param  {String} word - Word to be added to the vocabulary
 * @return {undefined}
 */

'use strict';

NaiveBayesClassifier.prototype.addWordToVocabulary = function(word) {
	if (!this.vocabulary[word]) {
		this.vocabulary[word] = true;
		this.vocabularySize += 1;
	}
};

/**
 * Retrieve a category.
 * If it does not exist, then initialize the necessary data structures for a new category.
 *
 * @param  {String} categoryName - Name of the category you want to get or create
 * @return {String} category
 */
NaiveBayesClassifier.prototype.getOrCreateCategory = function(categoryName) {
	if (!categoryName || typeof categoryName !== 'string') {
		throw new TypeError('Category creator got invalid category name: `' + categoryName + '`. Please pass in a String.');
	}

	//simple singleton for each category
	if (!this.categories[categoryName]) {
		//setup counters
		this.docFrequencyCount[categoryName] = 0;
		this.wordFrequencyCount[categoryName] = {};
		this.wordCount[categoryName] = 0;

		//add new category to our list
		this.categories[categoryName] = true;
	}

	return this.categories[categoryName] ? categoryName : undefined;
};

/**
 * Build a frequency hashmap where the keys are the entries in `tokens`
 * and the values are the frequency of each entry (`token`).
 *
 * @param  {Array} tokens - Normalized word array
 * @return {Object} FrequencyTable
 */
NaiveBayesClassifier.prototype.frequencyTable = function(tokens) {
	var frequencyTable = {};

	tokens.forEach(function updateFrequencyTableForToken(token) {
		//we need to ensure our tokens are unique, to avoid clashing with existing object properties (e.g. 'constructor')
		token = '_' + token;

		if (!frequencyTable[token]) {
			frequencyTable[token] = 1;
		} else {
			frequencyTable[token] += 1;
		}
	});

	return frequencyTable;
};

/**
 * Calculate probability that a `token` belongs to a `category`
 *
 * @param  {String} token - The token (usually a word) for which we want to calculate a probability
 * @param  {String} category - The category we want to calculate for
 * @return {Number} probability
 */
NaiveBayesClassifier.prototype.tokenProbability = function(token, category) {
	// Recall => P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]
	// =============================================================================

	//how many times this word has occurred in documents mapped to this category
	var wordFrequencyCount = this.wordFrequencyCount[category][token] || 0; //count(wi,cj)

	//what is the count of all words that have ever been mapped to this category
	var wordCount = this.wordCount[category]; //SUM[(for w in v) count(w,cj)

	//use laplace Add-1 Smoothing equation
	//=> ( P(wi|Cj) = count(wi,cj) + 1 ) / ( SUM[(for w in v) count(w,cj)] + |VocabSize| )
	return ( wordFrequencyCount + 1 ) / ( wordCount + this.vocabularySize );
};