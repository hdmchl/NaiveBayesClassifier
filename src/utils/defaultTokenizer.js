export default function defaultTokenizer(text) {
	//remove punctuation from text (anything that isn't a word char or a space), and enforce lowercase
	var rgxPunctuation = new RegExp(/[^\w\s]/g);
	var sanitized = text.replace(rgxPunctuation, ' ').toLowerCase();

	return sanitized.split(/\s+/);
};
