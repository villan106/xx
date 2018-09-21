let fs = require('fs');
let unzip = require('unzip');
let stream = require('stream');
var mkdir = require('mkdirp');
var path = require('path')
var _ = require('lodash')


///fs.createReadStream('zip1.zip').pipe(unzipper.Extract({ path: 'extract' }));


function readZip(zipFile , callback) {
	var out = [];
	let ts = new Date().getTime();
	let folder  = path.join("extract2", ts.toString());
	mkdir.sync(folder)
	fs.createReadStream(zipFile).pipe(unzip.Extract({ path: folder })).on('close', () => {
		var list = walkSync('extract2');
		list.forEach((file) => {
			let ext = file.split('.').pop();
			if(ext == 'zip') {
				readZip(file, function(data) {
					console.log(file, data);
				});
				fs.unlink(file,(err) => { /*console.log(err);*/ });
			}else{
				out.push(file);
			}
		});
		callback(out);
	});	
}

var walkSync = function(dir, filelist) {
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(dir + '/' +file);
    }
  });
  return filelist;
};

readZip('final2.zip', function(file) {
	//console.log(file);
});