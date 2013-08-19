(function() {
  var CLOUDQ, DINGBOT_URL, HOME_DIR, POLL_INTERVAL, RUNTIME_ENV_STRING, TASK_NAME, TASK_PROJECT_PATH, checkForJob, dingDingBot, exec, request, spawn, spawnRakeTask, _ref;

  _ref = require('child_process'), exec = _ref.exec, spawn = _ref.spawn;

  request = require('request');

  CLOUDQ = process.env.CLOUDQ || 'http://localhost:3005/test_message';

  TASK_PROJECT_PATH = process.env.TASK_PROJECT_PATH || (function() {
    throw new Error('ENV TASK_PROJECT_PATH is not set');
  })();

  TASK_NAME = process.env.TASK_NAME || (function() {
    throw new Error('ENV TASK_NAME is not set');
  })();

  HOME_DIR = process.env.HOME_DIR || process.env.HOME;

  POLL_INTERVAL = process.env.POLL_INTERVAL || 600;

  DINGBOT_URL = process.env.DINGBOT_URL || null;

  RUNTIME_ENV_STRING = process.env.RUNTIME_ENVS || '';

  checkForJob = function() {
    process.stdout.write('.');
    if (DINGBOT_URL) dingDingBot();
    return request({
      uri: CLOUDQ,
      json: true
    }, function(err, resp, body) {
      if (body.klass != null) return spawnRakeTask();
    });
  };

  spawnRakeTask = function() {
    var command, rake;
    console.log("\nRunning " + TASK_NAME);
    command = "" + (process.cwd()) + "/run.sh";
    rake = spawn("bash", [command, HOME_DIR, TASK_PROJECT_PATH, RUNTIME_ENV_STRING, TASK_NAME]);
    rake.stdout.on('data', function(data) {
      return console.log(data.toString());
    });
    return rake.stderr.on('data', function(data) {
      return console.log(data.toString());
    });
  };

  dingDingBot = function() {
    var dingbotPath;
    dingbotPath = DINGBOT_URL;
    return request.post(dingbotPath, function(err, resp) {
      if (err) {
        return console.log('[Dingbot Error] connecting to ' + DINGBOT_URL + ' : ' + err);
      }
    });
  };

  setInterval(checkForJob, parseInt(POLL_INTERVAL) * 1000);

}).call(this);
