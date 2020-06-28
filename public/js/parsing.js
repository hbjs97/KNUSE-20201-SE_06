var PythonShell = require('python-shell');

var option = {
    mode: 'text',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptpath: '',
    args: []
};

PythonShell.run('../../parser.py', options, function(err, results){
    if(err) throw err;

    console.log('result: %j', results);
});