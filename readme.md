# Rake Task Trigger

### Description

Node worker to spawn a rake task when a message is pulled from a queue.

This worker monitors for a cloudq message on the queue specified.  When a message is
found it runs the specified rake task.

Polls cloudq every 10 minutes by default for a trigger message.

### Environment Variables

    CLOUDQ: uri for cloudq server to monitor with queue name.
      ** example: 'http://localhost:3005/queue_to_monitor'
    TASK_PROJECT_PATH:  Local file path to art vandelay project/repository.
      ** Required, no default
    TASK_NAME:  Name of rake task to run.
      ** Required, no default
      ** example: rake_environment:best_rake_task
    HOME_DIR:  Path to home directory of user where rvm is installed. 
      ** defaults to current users home directory.  i.e. /home/your_username
    POLL_INTERVAL:  Interval in seconds that cloudq is checked
      ** defaults to 600 seconds or 10 minutes
    DINGBOT_URL: Url to dingbot server service can check in at
      ** defaults to null, and will not try to checkin
    RUNTIME_ENVS: Environment variables that will be used when running the rake task

### Configure to start/monitor with upstart on Ubuntu server

    ** edit upstart_job/rakeTaskTrigger.conf to verify paths and Environment Variable values.

    sudo cp upstart_job/* /etc/init/
    
### To start and stop:

    start <fileNameOfUpstartJob>    i.e. start rakeTaskTrigger    
    stop  <fileNameOfUpstartJob>    i.e. stop  rakeTaskTrigger

### Example Config
    cp upstart_job/rakeTaskTrigger.conf upstart_job/rakeTaskTrigger_production.conf
    vi upstart_job/rakeTaskTrigger_production.conf
        ** change config values for dev environment
    sudo cp upstart_job/rakeTaskTrigger_production.conf /etc/init/
    To Start: start rakeTaskTrigger_production
    To Stop: stop rakeTaskTrigger_production
