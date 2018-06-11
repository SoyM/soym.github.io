sudo apt-get install aptitude

# docker
sudo aptitude remove docker docker-engine docker.io
sudo aptitude update
sudo aptitude install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo aptitude update
sudo aptitude install docker-ce -y

# ros-turtlebot
sudo aptitude install ros-$(rosversion -d)-turtlebot \
    ros-$(rosversion -d)-turtlebot-apps \
    ros-$(rosversion -d)-turtlebot-interactions \
    ros-$(rosversion -d)-turtlebot-simulator \
    ros-$(rosversion -d)-kobuki-ftdi \
    ros-$(rosversion -d)-rocon-remocon \
    ros-$(rosversion -d)-rocon-qt-library \
    ros-$(rosversion -d)-ar-track-alvar-msgs -y

. /opt/ros/$(rosversion -d)/setup.bash 

echo "source /opt/ros/ \
$(rosversion -d) \
/setup.bash" >> ~/.bashrc

#realsense
sudo aptitude --reinstall install ros-$(rosversion -d)-librealsense -y
sudo aptitude install ros-$(rosversion -d)-realsense-camera -y




