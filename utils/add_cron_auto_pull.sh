 /usr/bin/bash path_to_script somedir
currentDir=$pwd

# crontab -l | { cat; echo "*/1 * * * * $currentDir/auto_pull.sh"; } | crontab -