# docker
sudo apt-get remove docker docker-engine docker.io
sudo apt-get update
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get update
sudo apt-get install docker-ce

# ros-turtlebot
sudo apt-get install ros-$(rosversion -d)-turtlebot \
    ros-$(rosversion -d)-turtlebot-apps \
    ros-$(rosversion -d)-turtlebot-interactions \
    ros-$(rosversion -d)-turtlebot-simulator \
    ros-$(rosversion -d)-kobuki-ftdi \
    ros-$(rosversion -d)-rocon-remocon \
    ros-$(rosversion -d)-rocon-qt-library \
    ros-$(rosversion -d)-ar-track-alvar-msgs

. /opt/ros/$(rosversion -d)/setup.bash 
echo "source /opt/ros/ \
$(rosversion -d) \
/setup.bash" >> ~/.bashrc

#realsense
sudo apt-get --reinstall install ros-$(rosversion -d)-librealsense
sudo apt-get install ros-$(rosversion -d)-realsense-camera




