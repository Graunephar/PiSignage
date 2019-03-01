#!/bin/sh


sudo apt-get install nodejs npm git xdotool firefox-esr

git clone https://github.com/Graunephar/PiSignage.git

cd ~/PiSignage

chmod 777 ./start.sh

npm install
