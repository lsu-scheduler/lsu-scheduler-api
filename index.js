require('newrelic');
var express = require('express');
var app = express();
var compress = require('compression');
var pg = require('pg');
var httpRequest = require('request').defaults({jar: true, debug: true});

app.set('port', (process.env.PORT || 5000));

app.use(compress());
app.use(express.static(__dirname + '/dist'));

// Example select statement from db
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL || "postgres://selby@localhost/lsu-scheduler", function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.send(result.rows); }
    });
  });
});

// Example fetch request to get lsu course info
app.get('/fetch/courses', function (request, response) {
  var url = 'http://appl003.lsu.edu/booklet2.nsf/All/02FDBC283730AC5386257D69002EC178?OpenDocument&SemesterDesc=Spring+2015&Department=ACCOUNTING';
  // -H 'Cookie: __utma=70724879.1274179569.1412707450.1412707450.1412982781.2; __utmz=70724879.1412982781.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); sso-logout-time="Thu Nov 06 2014 19:56:55 GMT-0600 (Central Standard Time)"; __utma=1.944113822.1415309095.1415309095.1415309095.1; __utmb=1.2.10.1415309095; __utmc=1; __utmz=1.1415309095.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmt=1'
  httpRequest({
    'url': url,
    headers: {
     'Host': 'appl003.lsu.edu',
     'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:33.0) Gecko/20100101 Firefox/33.0',
     'Referer': 'http://appl003.lsu.edu/booklet2.nsf/Selector2?OpenForm',
     'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
     'Connection': 'keep-alive'
    }
  },
  function (httpError, httpResponse, httpBody) {
    response.send(httpBody);
  });
});

// Start the server
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
