'use strict';

export default class AbstractDataStore {
	constructor() {
		if (this.constructor.name === 'AbstractDataStore') {
			throw new TypeError('Cannot construct `AbstractDataStore` instance directly');
		}

		if (!this.addWordToVocabulary) {
			throw new Error('DataStore must override `addWordToVocabulary` method');
		}

		if (!this.getVocabularySize) {
			throw new Error('DataStore must override `getVocabularySize` method');
		}

		if (!this.getOrCreateCategory) {
			throw new Error('DataStore must override `getOrCreateCategory` method');
		}

		if (!this.getDocFrequencyCount) {
			throw new Error('DataStore must override `getDocFrequencyCount` method');
		}

		if (!this.incrementDocFrequencyCount) {
			throw new Error('DataStore must override `incrementDocFrequencyCount` method');
		}

		if (!this.getTokenFrequencyCount) {
			throw new Error('DataStore must override `getTokenFrequencyCount` method');
		}

		if (!this.incrementTokenFrequencyCount) {
			throw new Error('DataStore must override `incrementTokenFrequencyCount` method');
		}

		if (!this.getTokenCount) {
			throw new Error('DataStore must override `getTokenCount` method');
		}

		if (!this.incrementTotalNumberOfDocuments) {
			throw new Error('DataStore must override `incrementTotalNumberOfDocuments` method');
		}
	}
}