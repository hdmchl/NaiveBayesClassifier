/**
 * Multinomial Naive-Bayes Classifier
 *
 * This is a naive-bayes classifier that uses Laplace Smoothing.
 *
 * Takes an (optional) options object containing:
 *   - `tokenizer`  => custom tokenization function
 *
 */
var NaiveBayesClassifier = function(options) {
	this.options = {};
	
	if (typeof options !== 'undefined') {
		if (!options || typeof options !== 'object' || Array.isArray(options)) {
			throw TypeError('NaiveBayesClassifier got invalid `options`: `' + options + '`. Please pass in an object.');
		}
		this.options = options;
	}

	/**
	 * Given an input string, tokenize it into an array of word tokens.
	 * This tokenizer adopts a naive "Bag of words" assumption
	 * This is the default tokenization function used if user does not provide one in `options`.
	 *
	 * @param  {String} text
	 * @return {Array}
	 */
	var defaultTokenizer = function(text) {
		//remove punctuation from text (anything that isn't a word char or a space), and enforce lowercase
		var rgxPunctuation = new RegExp(/[^\w\s]/g);

		var sanitized = text.replace(rgxPunctuation, ' ').toLowerCase();

		return sanitized.split(/\s+/);
	};

	this.tokenizer = this.options.tokenizer || defaultTokenizer;

	// Setup counters/hasmaps that will be used to speed up our algorithm
	// =============================================================================
	
	//initialize our vocabulary and its size - restrict access to it using setter/getter
	var vocabulary = {},
		vocabularySize = 0;
	this.addWordToVocabulary = function(word) {
		if (!vocabulary[word]) {
			vocabulary[word] = true;
			vocabularySize += 1;
		}
	};
	this.getVocabularySize = function() {
		return vocabularySize;
	};

	//hashmap of our category names
	this.categories = {};

	// To find prior probability: P(Cj) = docCount(C=cj) / Ndoc
	// =============================================================================

	//document frequency table for each of our categories
	//=> for each category, how often were documents mapped to it
	this.docFrequencyCount = {}; //docCount(class)

	this.totalNumberOfDocuments = 0; //Ndoc => number of documents we have learned from

	// To find the likelihood: P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]
	// =============================================================================

	//word frequency table for each of our categories
	//=> for each category, how frequent was a given word mapped to it
	this.wordFrequencyCount = {}; //count(wi,cj)

	//word count table for each of our categories
	//=> for each category, how many words in total were mapped to it
	this.wordCount = {}; //SUM[(for w in v) count(w,cj)
};

/**
 * Initialize each of our data structure entries for this new category
 *
 * @param  {String} categoryName
 */
NaiveBayesClassifier.prototype.Category = function(categoryName) {
	if (!categoryName || typeof categoryName !== 'string') {
		throw TypeError('Category creator got invalid category name: `' + categoryName + '`. Please pass in a String.');
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
 * Build a frequency hashmap where
 * - the keys are the entries in `tokens`
 * - the values are the frequency of each entry (`tokens`)
 *
 * @param  {Array} tokens (normalized word array)
 * @return {Object}
 */
NaiveBayesClassifier.prototype.FrequencyTable = function(tokens) {
	var frequencyTable = {};

	tokens.forEach(function (token) {
		if (!frequencyTable[token]) {
			frequencyTable[token] = 1;
		} else {
			frequencyTable[token] += 1;
		}
	});

	return frequencyTable;
};

/**
 * train our naive-bayes classifier by telling it what `category`
 * some `text` corresponds to.
 *
 * @param  {String} text
 * @param  {String} class
 */
NaiveBayesClassifier.prototype.learn = function(text, category) {
	var self = this; //get reference to instance

	category = self.Category(category); //get or create a category

	self.docFrequencyCount[category] += 1; //update our count of how many documents mapped to this category
	self.totalNumberOfDocuments += 1; //update the total number of documents we have learned from

	var tokens = self.tokenizer(text); //break up the text into tokens
	var tokenFrequencyTable = self.FrequencyTable(tokens); //get a frequency count for each token in the text

	// Update our vocabulary and our word frequency counts for this category
	// =============================================================================
	Object
	.keys(tokenFrequencyTable)
	.forEach(function(token) { //for each token in our tokenFrequencyTable
		
		self.addWordToVocabulary(token); //add this word to our vocabulary if not already existing

		var frequencyOfTokenInText = tokenFrequencyTable[token]; //look it up once, for speed

		//update the frequency information for this word in this category
		if (!self.wordFrequencyCount[category][token]) {
			self.wordFrequencyCount[category][token] = frequencyOfTokenInText; //set it for the first time
		} else {
			self.wordFrequencyCount[category][token] += frequencyOfTokenInText; //add to what's already there in the count
		}

		self.wordCount[category] += frequencyOfTokenInText; //add to the count of all words we have seen mapped to this category
	});

	return self;
};

/**
 * Calculate probability that a `token` belongs to a `category`
 *
 * @param  {String} token
 * @param  {String} category
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
	return ( wordFrequencyCount + 1 ) / ( wordCount + this.getVocabularySize() );
};

/**
 * Determine what category `text` belongs to.
 * Use Laplace (add-1) smoothing to adjust for words that do not appear in our vocabulary (unknown words)
 *
 * @param  {String} text
 * @return {Object} cMAP and categories
 */
NaiveBayesClassifier.prototype.categorize = function (text) {
	var self = this,  //get reference to instance
			maxProbability = -Infinity,
			totalProbabilities = 0,
			cMAP = {}, //category of “maximum a posteriori” => most likely category
			categoryProbabilities = {}; //probabilities of all categories

	var tokens = self.tokenizer(text),
		tokenFrequencyTable = self.FrequencyTable(tokens);

	Object
	.keys(self.categories)
	.forEach(function(category) { //for each category, find the probability of the text belonging to it
		if (!self.categories[category]) { return; } //ignore categories that have been switched off

		// 1. Find overall probability of this category
		//=> P(Cj) = docCount(C=cj) / Ndoc
		// =============================================================================
		
		//Put of all documents we've ever looked at, how many were mapped to this category
		var categoryProbability = self.docFrequencyCount[category] / self.totalNumberOfDocuments;

		//take the log to avoid underflow with large datasets - http://www.johndcook.com/blog/2012/07/26/avoiding-underflow-in-bayesian-computations/
		var logCategoryProbability = Math.log(categoryProbability); //start with P(Cj), we will add P(wi|Cj) incrementally below

		// 2. Find probability of each word in this categogy
		//=> P(wi|Cj) = count(wi,cj) / SUM[(for w in v) count(w,cj)]
		// =============================================================================

		Object
		.keys(tokenFrequencyTable)
		.forEach(function(token) { //for each token in our token frequency table

			//determine the log of the probability of this token belonging to the current category
			//=> log( P(w|c) )
			var tokenProbability = self.tokenProbability(token, category);
			//and add it to our running probability that the text belongs to the current category
			logCategoryProbability += Math.log(tokenProbability); //TODO: look into *frequencyTable[token];

			// console.log('token: %s | category: `%s` | probability: %d', token, category, tokenProbability);
		});

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
	});

	//normalise (out of 1) the probabilities, so that they make a bit more sense to the average person
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

module.exports = function(options) {
	return new NaiveBayesClassifier(options);
};