## `FrequencyTable`

Build a frequency hashmap where
- the keys are the entries in `tokens`
- the values are the frequency of each entry (`tokens`)

### Parameters

| name | type | description |
| ---- | ---- | ----------- |
| `tokens` | `Array` | Normalized word array |



Returns `Object` FrequencyTable

## `NaiveBayesClassifier`

NaiveBayesClassifier constructor fuction. Takes an (optional) options object containing:
  - {Function} tokenizer => custom tokenization function

### Parameters

| name | type | description |
| ---- | ---- | ----------- |
| `options` | `Object` | Options to be used for intialisation |



Returns `Object` NaiveBayesClassifier

## `VERSION`

Library version number





## `categorize`

Determine what category `text` belongs to.
Use Laplace (add-1) smoothing to adjust for words that do not appear in our vocabulary (unknown words)

### Parameters

| name | type | description |
| ---- | ---- | ----------- |
| `text` | `String` |  |



Returns `Object` cMAP and categories

## `getOrCreateCategory`

Initialize each of our data structure entries for this new category

### Parameters

| name | type | description |
| ---- | ---- | ----------- |
| `categoryName` | `String` | Name of the category you want to get or create |



Returns `String` category

## `learn`

Train our naive-bayes classifier by telling it what `category` some `text` corresponds to.

### Parameters

| name | type | description |
| ---- | ---- | ----------- |
| `text` | `String` |  |
| `category` | `String` |  |



Returns `Object` NaiveBayesClassifier

## `tokenProbability`

Calculate probability that a `token` belongs to a `category`

### Parameters

| name | type | description |
| ---- | ---- | ----------- |
| `token` | `String` |  |
| `category` | `String` |  |



Returns `Number` probability

