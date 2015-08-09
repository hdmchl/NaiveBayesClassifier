/*
 * @title: NaiveBayesClassifier
 * @author: Hadi Michael (http://hadi.io)
 * @repository: https://github.com/hadimichael/NaiveBayesClassifier
 * @license: BSD-3-Clause, see LICENSE file
 */

import {default as NaiveBayesClassifier} from './NaiveBayesClassifier';
import {default as DataStore} from './datastore/DataStore';

NaiveBayesClassifier.VERSION = require('json!../package.json').version;
NaiveBayesClassifier.DataStore = DataStore;

module.exports = NaiveBayesClassifier;