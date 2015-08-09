///**
// * Build a frequency hashmap where the keys are the entries in `tokens`
// * and the values are the frequency of each entry (`token`).
// *
// * @param  {Array} tokens - Normalized word array
// * @return {Object} FrequencyTable
// */
//NaiveBayesClassifier.prototype.frequencyTable = function(tokens) {
//	var frequencyTable = {};
//
//	tokens.forEach(function updateFrequencyTableForToken(token) {
//		//we need to ensure our tokens are unique, to avoid clashing with existing object properties (e.g. 'constructor')
//		token = '_' + token;
//
//		if (!frequencyTable[token]) {
//			frequencyTable[token] = 1;
//		} else {
//			frequencyTable[token] += 1;
//		}
//	});
//
//	return frequencyTable;
//};
//
///**
// * Calculate probability that a `token` belongs to a `category`
// *
// * @param  {String} token - The token (usually a word) for which we want to calculate a probability
// * @param  {String} category - The category we want to calculate for
// * @return {Number} probability
// */
//NaiveBayesClassifier.prototype.tokenProbability = function(token, category) {
//	// Recall => P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]
//	// =============================================================================
//
//	//how many times this word has occurred in documents mapped to this category
//	var tokenFrequencyCount = this.dataStore.getTokenFrequencyCount(category, token) || 0; //count(wi,cj)
//
//	//what is the count of all words that have ever been mapped to this category
//	var tokenCount = this.dataStore.getTokenCount(category); //SUM[(for w in v) count(w,cj)
//
//	//use laplace Add-1 Smoothing equation
//	//=> ( P(wi|Cj) = count(wi,cj) + 1 ) / ( SUM[(for w in v) count(w,cj)] + |VocabSize| )
//	return ( tokenFrequencyCount + 1 ) / ( tokenCount + this.dataStore.getVocabularySize() );
//};