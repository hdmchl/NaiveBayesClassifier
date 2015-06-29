/**
 * Determine the category some `text` most likely belongs to.
 * Use Laplace (add-1) smoothing to adjust for words that do not appear in our vocabulary (i.e. unknown words).
 *
 * @param  {String} text - Raw text that needs to be tokenized and categorised.
 * @return {String} category - Category of “maximum a posteriori” (i.e. most likely category), or 'unclassified'
 * @return {Number} probability - The probablity for the category specified
 * @return {Object} categories - Hashmap of probabilities for each category 
 */

'use strict';

NaiveBayesClassifier.prototype.categorize = function (text) {
	var maxProbability = -Infinity,
		totalProbabilities = 0,
		cMAP = {}, //category of “maximum a posteriori” => most likely category
		categoryProbabilities = {}; //probabilities of all categories

	var tokens = this.tokenizer(text),
		tokenFrequencyTable = this.frequencyTable(tokens);

	Object
	.keys(this.categories)
	.forEach(function(category) { //for each category, find the probability of the text belonging to it
		if (!this.categories[category]) { return; } //ignore categories that have been switched off

		// 1. Find overall probability of this category
		//=> P(Cj) = docCount(C=cj) / Ndoc
		// =============================================================================
		
		//Put of all documents we've ever looked at, how many were mapped to this category
		var categoryProbability = this.docFrequencyCount[category] / this.totalNumberOfDocuments;

		//take the log to avoid underflow with large datasets - http://www.johndcook.com/blog/2012/07/26/avoiding-underflow-in-bayesian-computations/
		var logCategoryProbability = Math.log(categoryProbability); //start with P(Cj), we will add P(wi|Cj) incrementally below

		// 2. Find probability of each word in this category
		//=> P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]
		// =============================================================================

		Object
		.keys(tokenFrequencyTable)
		.forEach(function(token) { //for each token in our token frequency table

			//determine the log of the probability of this token belonging to the current category
			//=> log( P(w|c) )
			var tokenProbability = this.tokenProbability(token, category);
			//and add it to our running probability that the text belongs to the current category
			logCategoryProbability += Math.log(tokenProbability) * tokenFrequencyTable[token];

			// console.log('token: %s | category: `%s` | probability: %d', token, category, tokenProbability);
		}.bind(this));

		// 3. Find the most likely category, thus far...
		// =============================================================================

		categoryProbability = Math.exp(logCategoryProbability); //reverse the log and get an actual value
		totalProbabilities += categoryProbability; //calculate totals as we go, we'll use this to normalise later

		if (logCategoryProbability > maxProbability) { //find cMAP
			maxProbability = logCategoryProbability;
			cMAP = {
				category: category,
				probability: categoryProbability
			};
		}

		categoryProbabilities[category] = categoryProbability;
	}.bind(this));

	//normalise (out of 1) the probabilities, so that they are easier to relate to
	Object
	.keys(categoryProbabilities)
	.forEach(function(category) {
		categoryProbabilities[category] /= totalProbabilities;
	});

	return {
		category: cMAP.category || 'unclassified',
		probability: (cMAP.probability /= totalProbabilities) || -Infinity,
		categories: categoryProbabilities
	};
};