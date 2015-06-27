/***************************************************************
 * Fetch articles from wikipedia to build up a dataset that we 
 *  can use to teach our classifier.
 ***************************************************************/

'use strict';

var fs = require('fs'),
	jsonfile = require('jsonfile'),
	request = require('request'),
	htmlStrip = require('htmlstrip-native');

// Setup constants
//==============================================================
var CONST = {
	DIR: {
		ROOT: 'data',
		WIKI: 'wiki'
	},
	URL: {
		WIKI_API: 'https://en.wikipedia.org/w/api.php'
	}
};

var WORKING_DIR = __dirname + '/../' + CONST.DIR.ROOT + '/' + CONST.DIR.WIKI + '/';

var DATA_SOURCE = {
	technology: [
		'Facebook', 'Twitter', 'LinkedIn', 'Snapchat', 'Slack_(software)',
		'Apple_Inc.', 'Google', 'Microsoft', 
		'PayPal', 'Stripe_(company)', 'Braintree_(company)',
		'GitHub', 'Envato', 'Atlassian',
		'Samsung', 'Dell'
	],
	uefa: [
		// https://en.wikipedia.org/wiki/UEFA_Champions_League
		'UEFA_Champions_League',
		'Real_Madrid_C.F.', 'A.C._Milan', 'FC_Bayern_Munich', 'FC_Barcelona', 'Liverpool_F.C.', 'AFC_Ajax',
		'Inter_Milan', 'Manchester_United_F.C.', 'Juventus_F.C.', 'S.L._Benfica', 'Nottingham_Forest_F.C.', 
		'F.C._Porto', 'Celtic_F.C.', 'Hamburger_SV', 'FC_Steaua_Bucure%C8%99ti', 'Olympique_de_Marseille',
		'Borussia_Dortmund', 'Chelsea_F.C.', 'Feyenoord', 'Aston_Villa_F.C.', 'PSV_Eindhoven',
		'Red_Star_Belgrade', 'Stade_de_Reims', 'Atlético_Madrid', 'Valencia_CF', 'ACF_Fiorentina',
		'Eintracht_Frankfurt', 'FK_Partizan', 'Panathinaikos_F.C.', 'Leeds_United_A.F.C.', 
		'AS_Saint-%C3%89tienne', 'Borussia_M%C3%B6nchengladbach', 'Club_Brugge_K.V.', 'Malm%C3%B6_FF', 
		'A.S._Roma', 'U.C._Sampdoria', 'Bayer_04_Leverkusen', 'AS_Monaco_FC', 'Arsenal_F.C.',
		'Manchester_City_F.C.', 'FC_Schalke_04', 'Sporting_Clube_de_Portugal', 'FC_Shakhtar_Donetsk', 
		'PFC_CSKA_Moscow', 'Galatasaray_S.K._(football)', 'R.S.C._Anderlecht', 'Olympiacos_F.C.', 'FC_Basel'
	],
	afl: [
		// https://en.wikipedia.org/wiki/Australian_Football_League
		'Australian_Football_League',
		'Adelaide_Football_Club', 'Brisbane_Lions', 'Collingwood_Football_Club', 'Fremantle_Football_Club',
		'Gold_Coast_Football_Club', 'Greater_Western_Sydney_Giants', 'Melbourne_Football_Club',
		'North_Melbourne_Football_Club', 'Port_Adelaide_Football_Club', 'Richmond_Football_Club',
		'St_Kilda_Football_Club', 'Sydney_Swans', 'West_Coast_Eagles', 'Western_Bulldogs',
		'Hawthorn_Football_Club', 'Carlton_Football_Club', 'Essendon_Football_Club', 'Geelong_Football_Club'
	],
	nba: [
		// https://en.wikipedia.org/wiki/National_Basketball_Association
		'National_Basketball_Association',
		'Boston_Celtics', 'Brooklyn_Nets', 'Philadelphia_76ers', 'Toronto_Raptors',
		'Chicago_Bulls', 'Detroit_Pistons', 'Indiana_Pacers', 'Milwaukee_Bucks',
		'Atlanta_Hawks', 'Charlotte_Hornets', 'Miami_Heat', 'Orlando_Magic', 'Washington_Wizards',
		'Denver_Nuggets', 'Minnesota_Timberwolves', 'Oklahoma_City_Thunder', 'Portland_Trail_Blazers',
		'Utah_Jazz', 'Los_Angeles_Clippers', 'Sacramento_Kings', 'Dallas_Mavericks', 'Houston_Rockets',
		'Memphis_Grizzlies', 'New_Orleans_Pelicans', 'San_Antonio_Spurs', 'Los_Angeles_Lakers', 
		'Cleveland_Cavaliers', 'Golden_State_Warriors', 'Seattle_SuperSonics'
	],
	f1: [
		// https://en.wikipedia.org/wiki/2015_Formula_One_season
		'2015_Formula_One_season',
		'Lewis_Hamilton', 'Nico_Rosberg', 'Sebastian_Vettel', 'Kimi_Räikkönen', 'Valtteri_Bottas',
		'Felipe_Massa', 'Daniel_Ricciardo', 'Daniil_Kvyat', 'Nico_Hülkenberg', 'Romain_Grosjean',
		'Felipe_Nasr', 'Sergio_Pérez', 'Pastor_Maldonado', 'Max_Verstappen', 'Carlos_Sainz,_Jr.',
		'Marcus_Ericsson', 'Jenson_Button', 'Fernando_Alonso', 'Roberto_Merhi', 'Will_Stevens', 'Kevin_Magnussen',

		'Australian_Grand_Prix', 'Malaysian_Grand_Prix', 'Chinese_Grand_Prix', 'Bahrain_Grand_Prix',
		'Spanish_Grand_Prix', 'Monaco_Grand_Prix', 'Canadian_Grand_Prix', 'Austrian_Grand_Prix',
		'British_Grand_Prix', 'Hungarian_Grand_Prix', 'Belgian_Grand_Prix', 'Italian_Grand_Prix', 
		'Singapore_Grand_Prix', 'Japanese_Grand_Prix', 'Russian_Grand_Prix', 'United_States_Grand_Prix',
		'Mexican_Grand_Prix', 'Brazilian_Grand_Prix', 'Abu_Dhabi_Grand_Prix'
	],
	tennis: [
		// https://en.wikipedia.org/wiki/Australian_Open
		'Australian_Open',
		'Stan_Wawrinka', 'Novak_Djokovic', 'Andy_Murray', 'Rafael_Nadal', 'Roger_Federer', 'Maria_Sharapova',
		'David_Ferrer', 'Milos_Raonic', 'Serena_Williams', 'Petra_Kvitová', 'Simona_Halep', 
		'Caroline_Wozniacki', 'Ana_Ivanovic', 'Ekaterina_Makarova', 'Carla_Suárez_Navarro', 'Angelique_Kerber'
		//'Marin_Čilić', 'Tomáš_Berdych', 'Kei_Nishikori', 'Lucie_Šafářová' //<-- these pages are causing parsing issues
	],
	cricket: [
		// https://en.wikipedia.org/wiki/List_of_current_first-class_cricket_teams
		'Cricket',
		'New_South_Wales_cricket_team', 'Victoria_cricket_team', 'South_Australia_cricket_team', 
		'Queensland_cricket_team', 'Western_Australia_cricket_team', 'Tasmania_cricket_team',

		'South_Africa_national_cricket_team', 'Scotland_national_cricket_team', 'Papua_New_Guinea_national_cricket_team',
		'Sri_Lanka_national_cricket_team', 'Australia_national_cricket_team', 'Bangladesh_national_cricket_team',
		'Afghanistan_national_cricket_team', 'England_cricket_team', 'India_national_cricket_team', 
		'Hong_Kong_national_cricket_team', 'Ireland_cricket_team', 'Namibia_national_cricket_team',
		'Netherlands_national_cricket_team', 'New_Zealand_national_cricket_team', 'Pakistan_national_cricket_team',
		'United_Arab_Emirates_national_cricket_team', 'West_Indies_cricket_team', 'Zimbabwe_national_cricket_team'
	],
	swimming: [
		// https://en.wikipedia.org/wiki/List_of_top_Olympic_swimming_medalists
		'Michael_Phelps', 'Mark_Spitz', 'Matt_Biondi', 'Ryan_Lochte', 'Gary_Hall,_Jr.', 'Ian_Thorpe',
		'Aaron_Peirsol', 'Tom_Jager', 'Don_Schollander', 'Johnny_Weissmuller', 'Alexander_Popov_(swimmer)',
		'Roland_Matthes', 'Jason_Lezak', 'Matt_Grevers', 'Charles_Daniels_(swimmer)', 'Kosuke_Kitajima',

		'Jenny_Thompson', 'Kristin_Otto', 'Amy_Van_Dyken', 'Krisztina_Egerszegi', 'Dara_Torres',
		'Dawn_Fraser', 'Kornelia_Ender', 'Inge_de_Bruijn', 'Libby_Trickett', 'Janet_Evans', 'Yana_Klochkova',
		'Missy_Franklin', 'Leisel_Jones', 'Natalie_Coughlin', 'Petria_Thomas'
	],
	nrl: [
		// https://en.wikipedia.org/wiki/National_Rugby_League
		'National_Rugby_League',
		'Brisbane_Broncos', 'Canterbury-Bankstown_Bulldogs', 'Canberra_Raiders', 'Cronulla-Sutherland_Sharks',
		'Gold_Coast_Titans', 'Manly_Warringah_Sea_Eagles', 'Melbourne_Storm', 'Newcastle_Knights', 'New_Zealand_Warriors',
		'North_Queensland_Cowboys', 'Parramatta_Eels', 'Penrith_Panthers', 'South_Sydney_Rabbitohs', 
		'Sydney_Roosters', 'Wests_Tigers'
	],
	mlb: [
		// https://en.wikipedia.org/wiki/Major_League_Baseball
		'Major_League_Baseball',
		'Atlanta_Braves', 'Miami_Marlins', 'New_York_Mets', 'Philadelphia_Phillies', 'Washington_Nationals',
		'Chicago_Cubs', 'Cincinnati_Reds', 'Milwaukee_Brewers', 'Pittsburgh_Pirates', 'St._Louis_Cardinals',
		'Arizona_Diamondbacks', 'Colorado_Rockies', 'Los_Angeles_Dodgers', 'San_Diego_Padres', 'San_Francisco_Giants'
	],
	nhl: [
		// https://en.wikipedia.org/wiki/National_Hockey_League
		'National_Hockey_League',
		'Boston_Bruins', 'Buffalo_Sabres', 'Detroit_Red_Wings', 'Florida_Panthers', 'Montreal_Canadiens', 'Ottawa_Senators',
		'Tampa_Bay_Lightning', 'Toronto_Maple_Leafs', 'Carolina_Hurricanes', 'Columbus_Blue_Jackets', 'New_Jersey_Devils', 
		'New_York_Islanders', 'New_York_Rangers', 'Philadelphia_Flyers', 'Pittsburgh_Penguins', 'Washington_Capitals', 
		'Anaheim_Ducks', 'Arizona_Coyotes', 'Calgary_Flames', 'Edmonton_Oilers', 'Los_Angeles_Kings', 'San_Jose_Sharks',
		'Vancouver_Canucks', 'Chicago_Blackhawks', 'Colorado_Avalanche', 'Dallas_Stars', 'Minnesota_Wild', 
		'Nashville_Predators', 'St._Louis_Blues', 'Winnipeg_Jets'
	],
	cycling: [
		// https://en.wikipedia.org/wiki/List_of_cyclists
		'Kristin_Armstrong', 'Lance_Armstrong', 'Judith_Arndt', 'Dede_Barry', 'Ivan_Basso',
		'Mark_Beaumont_(cyclist)', 'Lyne_Bessette', 'Paolo_Bettini', 'Michael_Boogerd', 'Tom_Boonen',
		'Santiago_Botero', 'Fabian_Cancellara', 'Sara_Carrigan', 'Mark_Cavendish', 'Alberto_Contador',
		'Nicole_Cooke', 'Katheryn_Curi', 'Gunn-Rita_Dahle', 'Tom_Danielson', 'Mike_Day',
		'Ellen_van_Dijk', 'Alex_Dowsett', 'Alison_Dunlap', 'Chris_Eatough', 'Cadel_Evans',
		'Niki_Gudex', 'Liz_Hatch', 'George_Hincapie', 'Chris_Horner', 'Chris_Hoy',
		'Thor_Hushovd', 'Timothy_Jones_(cyclist)', 'Bobby_Julich', 'Jill_Kintner', 'Andreas_Kl%C3%B6den',
		'Floyd_Landis', 'Levi_Leipheimer', 'Danny_MacAskill', 'Axel_Merckx', 'Rune_Monstad',
		'Johan_Museeuw', 'Andris_Nauduzas', 'Adrien_Niyonshuti', 'Stuart_O%27Grady', 'Joseph_M._Papp',
		'Victoria_Pendleton', 'Taylor_Phinney', 'Jeremy_Powers', 'Jennie_Reed', 'Mark_Renshaw',
		'Donny_Robinson', 'Andy_Schleck', 'Fr%C3%A4nk_Schleck', 'Alexandre_Shefer', 'Marla_Streb',
		'Geraint_Thomas', 'Jan_Ullrich', 'Sarah_Ulmer', 'Rigoberto_Uran', 'Alejandro_Valverde',
		'Tejay_VanGarderen', 'Jonathan_Vaughters', 'Alexander_Vinokourov', 'Richard_Virenque', 'Jens_Voigt',
		'Marianne_Vos', 'Sam_Whittingham', 'Erik_Zabel', 'David_Zabriskie', 'Leontien_Zijlaard-Van_Moorsel',
		'Grant_Potter'
	],
	golf: [
		// https://en.wikipedia.org/wiki/List_of_golfers_with_most_PGA_Tour_wins
		'Tiger_Woods', 'Phil_Mickelson', 'Ernie_Els', 'Jim_Furyk', 'David_Duval', 'David_Toms', 'Justin_Leonard', 
		'Steve_Stricker', 'Zach_Johnson', 'Rory_McIlroy', 'Adam_Scott_(golfer)',  'Stuart_Appleby',
		'Dustin_Johnson', 'K._J._Choi', 'Sergio_Garc%C3%ADa', 'Geoff_Ogilvy', 'Mike_Weir', 'Retief_Goosen', 
		'Matt_Kuchar', 'Justin_Rose', 'Brandt_Snedeker', 'Bubba_Watson', 'Stewart_Cink', 'Bill_Haas',
		'P%C3%A1draig_Harrington', 'Hunter_Mahan', 'Jos%C3%A9_Mar%C3%ADa_Olaz%C3%A1bal', 'Rory_Sabbatini', 
		'Jonathan_Byrd_(golfer)', 'Ben_Crane', 'John_Daly_(golfer)', 'Luke_Donald', 'Billy_Mayfair', 
		'Carl_Pettersson', 'Jimmy_Walker_(golfer)', 'Nick_Watney', 'Mark_Wilson_(golfer)'
	]
};

// Make sure that the folder we want to work in, exists
//==============================================================
var ensureExists = function (path, mask, cb) {
	if (typeof mask === 'function') { // allow the `mask` parameter to be optional
		cb = mask;
		mask = '0777';
	}

	fs.mkdir(path, mask, function(err) {
		if (err) {
			if (err.code === 'EEXIST') {
				cb(null); // ignore the error if the folder already exists
			} else {
				cb(err); // something else went wrong
			}
		} else {
			cb(null); // successfully created folder
		}
	});
};

// Build dataset from wikipedia
// No need to optimise here, let's just take our time and do it synchronously, one request at a time
// Wikipedia API Documentation at: https://www.mediawiki.org/wiki/API:Main_page
//==============================================================
var buildDataSet = function(category, index) {
	request(CONST.URL.WIKI_API + '?action=parse&format=json&prop=text&page=' + DATA_SOURCE[category][index], function (error, response, body) {
		if (error){
			return console.error('Request error:', error);
		}

		if (!error && response.statusCode === 200) {
			try {
				body = JSON.parse(body);
			} catch (err) {
				return console.error('Error parsing:', err);
			}

			/* jshint ignore:start */
			//grab actual article content by looking for <p> tags
			var articleHtml = body.parse.text['*'].match(/(\<p\>).*(\<\/p\>)/g);

			//strip html tags
			var article = htmlStrip.html_strip(articleHtml, {
				include_script : false,
				include_style : false,
				compact_whitespace : true
			});

			//remove references to source, e.g. [ 71 ]
			article = article.replace(/(\[ \d* \])/g, '');
			/* jshint ignore:end */

			// console.log(article);

			//save to disk
			var file = WORKING_DIR + category + '/' + DATA_SOURCE[category][index].toLowerCase() + '.json';

			jsonfile.writeFile(file, {category: category, article: article}, {spaces: 2}, function (err) {
				if (err) {
					return console.error('Error writing to disk', err);
				}

				console.log('Fetched and saved data for `' + DATA_SOURCE[category][index] + '`');

				//process next request, one at a time...
				if (!!DATA_SOURCE[category][index+1]) {
					buildDataSet(category, index+1);
				}
			});
		}
	});
};

// Group sub-categories into parent categories
// We are trying to build a "bag of words"
//==============================================================
var concat = function(categories, category) {
	var files = []; //these are all the files we want to concat

	categories.forEach(function(cat) {

		files = files.concat(DATA_SOURCE[cat].map(function(val) {
			return WORKING_DIR + cat + '/' + val.toLowerCase() + '.json';
		}));

	});

	// read the data from disk and concat it into a variable
	// again, not too concerned about perf here... so let's do it synchronously and not mess up the whole read/write from disk
	var data = '';
	files.forEach(function(val) {
		var obj = jsonfile.readFileSync(val);
		data += ' ' + obj.article;
	});

	fs.writeFile(WORKING_DIR + category.toLowerCase() + '.txt', data, function (err) {
		if (err) {
			return console.error('Error writing to disk.', err);
		}

		console.log('Successfully concatenated `' + category + '` from ' + files.length + ' files.');
	});
};

// APP ENTRY OPTIONS: CONCAT or FETCHING
//==============================================================
if (!!process.env.CONCAT && !!process.env.CAT) {
	var categories = process.env.CONCAT.split(',');

	categories = categories.filter(function(val) {
		return !!DATA_SOURCE[val]; //only concat categories that we know about...
	});

	concat(categories, process.env.CAT);
}

if (!!process.env.FETCH && !!DATA_SOURCE[process.env.FETCH]) {
	ensureExists(WORKING_DIR + process.env.FETCH, '0744', function(err) {
		if (err) {
			console.error('Data folder could not be created automatically. Consider creating it manually and trying again.', err);
		} else {
			buildDataSet(process.env.FETCH, 0); //start fetching data
		}
	});
}