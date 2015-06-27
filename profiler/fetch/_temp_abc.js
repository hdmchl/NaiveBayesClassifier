//Get news headlines from the Australian Broadcasting Corp. (abc.net)
//==============================================================

var fs = require('fs'),
    jsonfile = require('jsonfile'),
    FeedParser = require('feedparser'),
    request = require('request');

var DATA_SOURCE = [
  {
    url: 'http://www.abc.net.au/news/feed/45910/rss.xml',
    category: 'topstories'
  },
  {
    url: 'http://www.abc.net.au/news/feed/45924/rss.xml',
    category: 'sport'
  },
  {
    url: 'http://www.abc.net.au/news/feed/51892/rss.xml',
    category: 'business'
  },
  {
    url: 'http://www.abc.net.au/news/feed/46800/rss.xml',
    category: 'entertainment'
  }
];

var CONST = {
  dir: '../data/abc'
};

var ensureExists = function (path, mask, cb) {
    if (typeof mask == 'function') { // allow the `mask` parameter to be optional
        cb = mask;
        mask = 0777;
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
};

var buildDataSetForSource = function(sourceIndex) {
  var feedparser = new FeedParser(),
      req = request(DATA_SOURCE[sourceIndex].url),
      fileObj = [];

  req.on('error', function (error) {
    console.error('Request error: ', error);
  });
  req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedparser);
  });

  feedparser.on('error', function(error) {
    console.error('Feedparser error: ', error);
  });
  feedparser.on('readable', function() {
    var stream = this,
        meta = this.meta,
        item;

    while (item = stream.read()) {
      fileObj.push({
        title: item.title,
        description: item.description.replace(/(<[a-z]*>|<\/[a-z]*>)/g, '')
      });
    }
  });
  feedparser.on('end', function(err) {
    if (err) {
      console.error(err, err.stack);
      return;
    }

    var file = __dirname + '/' + CONST.dir + '/' + DATA_SOURCE[sourceIndex].category + '.json';

    jsonfile.writeFile(file, {articles: fileObj}, {spaces: 2}, function (err) {
      if (err) {
        console.error(err);
        return;
      }

      if (!!DATA_SOURCE[sourceIndex+1]) {
        buildDataSetForSource(sourceIndex+1);
      }
    });
  });
};

ensureExists(__dirname + '/' + CONST.dir, 0744, function(err) {
    if (err) {
      // handle folder creation error
      console.error('Data folder could not be created');
    } else {
      // folder is created, let's get this show on the road
      buildDataSetForSource(0);
    }
});