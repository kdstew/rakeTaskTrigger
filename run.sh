# loading RVM from the passed user director  i.e. /home/someuser
[[ -s "$1/.rvm/scripts/rvm" ]] && source "$1/.rvm/scripts/rvm"

# changing to the passed directory path
cd $2

date
$3 bundle exec rake $4
