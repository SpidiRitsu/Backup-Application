# Testing
Currently there are only end-to-end tests available. All those tests are available under `e2e` directory.

You can check exact steps that each test takes in their respective `.js` files.


## Usage

Note: Keep in mind that those tests don't get through authentication steps! In order to run them you have to serve the frontend using `polymer`. Read README inside frontend folder to learn more.

1. Install npm packages
```bash
npm install
```
2. Run a test
```bash
node [test] [url]

#Example
node backup.js http://localhost:8081
```