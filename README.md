# ESLab-hw2
# Introduction
This is a small project in ESLab. We use tessel 2 as our development platform, with the climate module as our input module, servo as our output module. Furthermore, we display our input and output on the browser.

# Get Started
Clone code from [github](https://github.com/ywk991112/ESLab-hw2) and install dependencies.
```
git clone https://github.com/ywk991112/ESLab-hw2
cd ESLab-hw2
npm install
```
## Build Up the Web App
```
NODE_ENV=production npm run build
```
## Start the App
First, the tessel 2 environment need to be set up. For more detail: [INSTALL TESSEL 2](http://tessel.github.io/t2-start/)
Connect the board to USB and authorize by running the command
```
t2 provision
```
After the tessel can be found by running
```
t2 list
```
then Send run the code on the tessel board by running
```
t2 run index.js
```
And then point your browser to `http://{tessel board name}.local:8000`
We put our demo video on [youtube](https://www.youtube.com/watch?v=Bf1pBLWhoic)
