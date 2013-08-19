{ exec, spawn } = require 'child_process'
request = require 'request'

CLOUDQ             = process.env.CLOUDQ            or 'http://localhost:3005/test_message'
TASK_PROJECT_PATH  = process.env.TASK_PROJECT_PATH or throw new Error('ENV TASK_PROJECT_PATH is not set')
TASK_NAME          = process.env.TASK_NAME         or throw new Error('ENV TASK_NAME is not set')
HOME_DIR           = process.env.HOME_DIR          or process.env.HOME
POLL_INTERVAL      = process.env.POLL_INTERVAL     or 600
DINGBOT_URL        = process.env.DINGBOT_URL       or null
RUNTIME_ENV_STRING = process.env.RUNTIME_ENVS      or ''

checkForJob = ->
  process.stdout.write '.'
  dingDingBot() if DINGBOT_URL

  request
    uri:  CLOUDQ
    json: true
    (err, resp, body) ->
      spawnRakeTask() if body.klass?

spawnRakeTask = ->
  console.log "\nRunning #{TASK_NAME}"
  command = "#{process.cwd()}/run.sh"
  rake = spawn "bash", [command, HOME_DIR, TASK_PROJECT_PATH, RUNTIME_ENV_STRING, TASK_NAME]
  rake.stdout.on 'data', (data) -> console.log data.toString()
  rake.stderr.on 'data', (data) -> console.log data.toString()

dingDingBot = ->
  dingbotPath = DINGBOT_URL
  request.post dingbotPath, (err, resp) ->
    if err
      console.log '[Dingbot Error] connecting to ' + DINGBOT_URL + ' : ' + err

setInterval checkForJob, parseInt(POLL_INTERVAL) * 1000
