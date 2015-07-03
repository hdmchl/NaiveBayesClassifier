/**
 * Train our naive-bayes classifier by telling it what `category` some `text` corresponds to.
 *
 * @param  {String} text - Some text that should be learnt
 * @param  {String} category - The category to which the text provided belongs to
 * @return {Object} NaiveBayesClassifier
 */

'use strict';

NaiveBayesClassifier.prototype.learn = function(text, category) {
	category = this.getOrCreateCategory(category); //get or create a category

	this.docFrequencyCount[category] += 1; //update our count of how many documents mapped to this category
	this.totalNumberOfDocuments += 1; //update the total number of documents we have learned from

	var tokens = this.tokenizer(text); //break up the text into tokens
	var tokenFrequencyTable = this.frequencyTable(tokens); //get a frequency count for each token in the text

	// Update our vocabulary and our word frequency counts for this category
	// =============================================================================
	Object
	.keys(tokenFrequencyTable)
	.forEach(function learnToken(token) { //for each token in our tokenFrequencyTable
		if (token === '_') { return; } //skip empty tokens

		this.addWordToVocabulary(token); //add this word to our vocabulary if not already existing

		var frequencyOfTokenInText = tokenFrequencyTable[token]; //look it up once, for speed

		//update the frequency information for this word in this category
		if (!this.wordFrequencyCount[category][token]) {
			this.wordFrequencyCount[category][token] = frequencyOfTokenInText; //set it for the first time
		} else {
			this.wordFrequencyCount[category][token] += frequencyOfTokenInText; //add to what's already there in the count
		}

		this.wordCount[category] += frequencyOfTokenInText; //add to the count of all words we have seen mapped to this category
	}.bind(this));

	return this;
};

NaiveBayesClassifier.prototype.createLearnStreamForCategory = function(category) {
	return stream ? new stream.Writable({
		decodeStrings: false,
		write: function write(chunk, encoding, next) {
			var text = chunk.toString('utf8');

			this.learn(text, category);

			next();
		}.bind(this)
	}) : null;
};