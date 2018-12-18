
'use strict';
const prompt = require('prompt');
const colors = require('colors/safe');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

let child;


prompt.start();
prompt.message = colors.green('-->');
prompt.delimiter = colors.green(':');
 
//
// get the version number
//

exec("./scripts/download-extract.sh")

console.log(colors.green('What version of oc do you wish to switch to ? \n - 3.7\n - 3.9\n - 3.10\n - 3.11\n'));
prompt.get(['version'], function (err, result) {
  if (result.version != 3.7 && result.version !=  3.9 && result.version !=  3.10 && result.version !=  3.11){
      console.log("Version not present")
  } else {
    console.log("Command-line input received:");
    console.log('Change to Version : ' + result.version);
    
      exec("sudo rm /usr/local/bin/oc && sudo ln -s /opt/openshift/"+result.version+"/oc /usr/local/bin/oc")
      .then(changeToVersion => exec("oc version"))
      .then(newVersion => {
        console.log("Change to Version: ", result);
        console.log("New Version Number : ",newVersion.stdout);
        if (newVersion.stderr){
          return newVersion.stderr;
        }
      })
      .catch(err);

    
      ;
  }
});
