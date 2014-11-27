/**
 * Controls fetching information from the open lsu booklet portal
 *
 * @module fetch
 * @class fetch
 */
module.exports = {
  /**
   * Waits a few seconds before polling for new data, then gets necessary
   * information from LSU. (eg. Departments are long hours data, course info is
   * short hour data.)
   *
   * @method fetchData
   * @param {int} secondsBefore number of seconds before trying to start requesting data
   * @param {int} shortHours number of hours to wait between requests
   * @param {int} longHours number of hours to wait between requests
   * @return void
   */
  fetchData: function(secondsBefore, shortHours, longHours){
    // Wait five seconds to call fetchDepartments, which runs on an interval after that
    setTimeout(function(){
      fetch.fetchDepartments(); // fetch the departments
      setInterval(function(){ // fetch them every 24 hours
        fetch.fetchDepartments();
      }, 1000*60*60*longHours);
    }, 1000*secondsBefore);
  },
  /**
   * Send a request to the public LSU course booklet that returns the names of all
   * of the departments at LSU and saves them to the database
   *
   * @method fetchDepartments
   * @return void
   */
  fetchDepartments: function(){
    var httpRequest = require('request').defaults({jar: true, debug: true});
    console.log('Fetching departments...');
    var departmentsExp = /([A-Z,'\s;pma&-]{3,})(?=<\/select>|$)/gm; // regex
    var url = 'http://appl003.lsu.edu/booklet2.nsf/Selector2?OpenForm';
    httpRequest({
      'url': url,
      headers: {
        'Host': 'appl003.lsu.edu',
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:33.0) Gecko/20100101 Firefox/33.0',
        'Referer': url,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Connection': 'keep-alive'
      }
    },
    function (httpError, httpResponse, httpBody) {
      lineArray = httpBody.match(departmentsExp);
      lineArray.forEach(function(line){
        line = line.trim();
        if(line != ''){
          department = db.department.build({
            'name': line
          });
          department.save().complete(function(err) {
            if (!!err) {
              console.log('The instance has not been saved:', err);
            } else {
              //console.log('We have a persisted instance now');
            }
          });
        }
      });
    });
  }
};
