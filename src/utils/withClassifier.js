/**
 * Initialise a new classifier from an existing NaiveBayesClassifier object. 
 * For example, the existing object may have been retrieved from a database or localstorage.
 *
 * @param  {NaiveBayesClassifier} classifier - An existing NaiveBayesClassifier
 * @return {Object} {@link NaiveBayesClassifier}
 */

'use strict';

export default function withClassifier(classifier) {
	var typeErrorMessage = 'The classifier provided is not of the correct type or has been corrupted.';
	if (typeof classifier !== 'object' || Array.isArray(classifier)) {
		throw new TypeError(typeErrorMessage);
	}

	var newClassifier = new NaiveBayesClassifier(classifier.options); //this should throw an error itself, if options isn't correct

	// Load in the vocabulary
	if (typeof classifier.vocabulary !== 'object' || Array.isArray(classifier.vocabulary)) {
		throw new TypeError(typeErrorMessage + ' Please check `classifier.vocabulary`:' + classifier.vocabulary);
	}
	Object
	.keys(classifier.vocabulary)
	.forEach(function(word) {
		newClassifier.addTokenToVocabulary(word);
	});

	// Load in categories
	if (typeof classifier.categories !== 'object' || Array.isArray(classifier.categories)) {
		throw new TypeError(typeErrorMessage + ' Please check `classifier.categories`:' + classifier.categories);
	}
	Object
	.keys(classifier.categories)
	.forEach(function(category) {
		newClassifier._getCategoryWithName(category);
	});

	// Load in other properties
	if (typeof classifier.docFrequencyCount !== 'object' || Array.isArray(classifier.docFrequencyCount)) {
		throw new TypeError(typeErrorMessage + ' Please check `classifier.docFrequencyCount`:' + classifier.docFrequencyCount);
	}
	newClassifier.docFrequencyCount = classifier.docFrequencyCount;

	if (typeof classifier.totalNumberOfDocuments !== 'number' || classifier.totalNumberOfDocuments < 0) {
		throw new TypeError(typeErrorMessage + ' Please check `classifier.totalNumberOfDocuments`:' + classifier.totalNumberOfDocuments);
	}
	newClassifier.totalNumberOfDocuments = classifier.totalNumberOfDocuments;
	
	if (typeof classifier.wordFrequencyCount !== 'object' || Array.isArray(classifier.wordFrequencyCount)) {
		throw new TypeError(typeErrorMessage + ' Please check `classifier.wordFrequencyCount`:' + classifier.wordFrequencyCount);
	}
	newClassifier.wordFrequencyCount = classifier.wordFrequencyCount;
	
	if (typeof classifier.wordCount !== 'object' || Array.isArray(classifier.wordCount)) {
		throw new TypeError(typeErrorMessage + ' Please check `classifier.wordCount`:' + classifier.wordCount);
	}
	newClassifier.wordCount = classifier.wordCount;

	//As the library gets updated in the future, I will include a mechanism to upgrade the classifier and handle backward compatibility
	// for the check, only look at major.minor and ignore .patch => do this by using parseFloat
	if (typeof parseFloat(classifier.VERSION) !== 'number' ||
		typeof parseFloat(NaiveBayesClassifier.VERSION) !== 'number' ||
		parseFloat(classifier.VERSION) !== parseFloat(NaiveBayesClassifier.VERSION)) {
		throw new Error('The classifier provided has a (major.minor) version number:' + classifier.VERSION + ' that is different to the library\'s current version number:' + NaiveBayesClassifier.VERSION);
	}

	return newClassifier;
};