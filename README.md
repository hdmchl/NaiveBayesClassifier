NaiveBayesClassifier is a Multinomial Naive-Bayes Classifier that uses Laplace Smoothing.

It is based on the OpenCoursesOnline Stanford NLP video series by Professor Dan Jurafsky & Chris Manning, found here: https://www.youtube.com/watch?v=c3fnHA6yLeY.

The code itself is extensively documented with inline comments. You will also find auto-generated documentation here.

#USAGE

##Loading NaiveBayesClassifier

NaiveBayesClassifier is shipped in a UMD format, meaning that it is available as a CommonJS/AMD module or browser globals.

##Create a classifier

```js
var NaiveBayesClassifier = require('./../../naive-bayes-classifier/dist/NaiveBayesClassifier'),
	classifier = new NaiveBayesClassifier();
```

##Learning
```js
classifier.learn('amazing, awesome movie!! Yeah!!', 'positive');
classifier.learn('terrible, shitty thing. Damn. Sucks!!', 'negative');
classifier.learn('I dont really know what to make of this.', 'neutral');
```

##Categorising
```js
classifier.categorize('awesome, cool, amazing!! Yay.');
```

#LICENSE (BSD-3-Clause)

Copyright (C) 2015, Hadi Michael. All rights reserved.

NaiveBayesClassifier can be downloaded from: https://github.com/hadimichael/NaiveBayesClassifier

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its contributors 
may be used to endorse or promote products derived from this software without 
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.