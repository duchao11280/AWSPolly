# Project AWS Polly 


## Require: 
  Node version v14 or lastest
## Installation
- Clone git:  git clone https://github.com/duchao11280/AWSPolly.git
  - In terminal: 
    - cd AWSPolly
    - cd Polly
    - npm install
- Open AWSPolly/Polly/routes/index.js to config your AWS key( accessKeyId, secretAccessKey, sessionToken and region 
- using <b> npm start </b> to run 

## Hosting using EC2 
  - Create EC2 instance
  - Config Inbound Rule using port 3002
  - Connect EC2 instance
  - Clone git:  git clone https://github.com/duchao11280/AWSPolly.git
  - In terminal: 
    - cd AWSPolly
    - cd Polly
    - npm install
    - open file index.js to config aws key: 
      - cd routes
      - vi index.js
      - Press <b>i</b> in your keyboard to edit.
      - edit your aceeskeyId, secretAccessKey,sessionToken and region.
      - Press <b>ESC</b> and type <b>:wq</b> to quit.
    - npm start

## If your node is in the old version, please update:
  Open terminal and type:
   - npm i -g n
   - mkdir ~/.local
   - N_PREFIX=$HOME/.local n stable
   - export PATH="$HOME/.local/bin:$PATH"
  
  Now, check your version: node --version
