'use strict';
const prompt = require('prompt');
const colors = require('colors/safe');
const request = require('request');
const fs = require('fs');
const readlineSync = require('readline-sync');
const extract_oc = require('./extract');
const change_oc = require('./change')
const cliAnimation = require('chalk-animation');


let child;


prompt.start();
prompt.message = colors.green('-->');
prompt.delimiter = colors.green(':');

//
// get the version number
//

var download_oc = function(callback){
  let url;
  console.log(colors.blue("================================= Download OC ======================================"))
  let result = readlineSync.question(colors.blue("Do you wish to install an oc binary yes/no ? "));
  if (result == "yes" || result == "y"){
    let version = readlineSync.question(colors.blue('What version of oc do you wish to install ? \n - 3.7\n - 3.9\n - 3.10\n - 3.11\n'));
    exports.version = version;
    switch(version) {
      case "3.7":
          url = "https://github.com/openshift/origin/releases/download/v3.7.2/openshift-origin-client-tools-v3.7.2-282e43f-linux-64bit.tar.gz"
          break;
      case "3.9":
          url = 'https://github.com/openshift/origin/releases/download/v3.9.0/openshift-origin-client-tools-v3.9.0-191fece-linux-64bit.tar.gz';
          break;
      case "3.10":
          // issue with this url using rc0 instead
          url = "https://github.com/openshift/origin/releases/download/v3.10.0/openshift-origin-client-tools-v3.10.0-dd10d17-linux-64bit.tar.gz"
          //url = "https://github.com/openshift/origin/releases/download/v3.10.0-rc.0/openshift-origin-server-v3.10.0-rc.0-c20e215-linux-64bit.tar.gz"
          break;
      case "3.11":
          url = "https://github.com/openshift/origin/releases/download/v3.11.0/openshift-origin-client-tools-v3.11.0-0cbc58b-linux-64bit.tar.gz"
          break;
      default:
          url = false;
          console.log(colors.blue("No binary present"));
          break;
    }

    if(url && !(fs.existsSync(version+".tar.gz")) ) {
      var req = request({
          uri: url,
          method: "GET",
          timeout: 10000,
          followRedirect: true,
          maxRedirects: 10
        }).pipe(fs.createWriteStream(version +".tar.gz"))
        // Add loading animation
        const loading = cliAnimation.radar('===================================================================================>'); 
      req.on('close', function(){
        console.log(colors.blue('Request finished writing to file'));
        extract_oc(function(){
          console.log('Extract completed');
        });
      });  
        
    } else {
      console.log(colors.blue('Binary Already Download'));
      extract_oc(function(){
        console.log('Extract completed');
      });
    }  
  } else{ 
    console.log(colors.blue('Skipping Binary Download'));
    change_oc(function(){
      console.log('Extract completed');
    });
  }
};

module.exports = download_oc;
