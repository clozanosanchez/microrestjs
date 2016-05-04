# Microrestjs
The platform for designing, developing and deploying microservices.

## Microrestjs Platform
The Microrestjs Platform is composed of several software pieces:
  * Framework: [clozanosanchez/microrestjs](https://github.com/clozanosanchez/microrestjs)
  * Service directory: [clozanosanchez/microrestjs-directory](https://github.com/clozanosanchez/microrestjs-directory)
  * Basic authentication service: [clozanosanchez/microrestjs-basic-authentication](https://github.com/clozanosanchez/microrestjs-basic-authentication)
  * Basic authorization service: [clozanosanchez/microrestjs-basic-authorization](https://github.com/clozanosanchez/microrestjs-basic-authorization)

##Microrestjs Framework
The current repository contains the Microrestjs Framework, which facilitates the development and deployment of microservices that respect the Microrestjs Service Description Specification.

## How to setup the framework:
1. Install Node.js.
2. Open a console.
3. Go to the framework source folder.
4. Execute the command "npm install".

## How to start and stop the framework:
1. Configure the settings of the framework in the file "Configuration.json".
2. Open a console.
3. Go to the framework source folder.
4. Execute the command "node Launcher.js". 
5. Press the combination Ctrl+C in the console to stop the framework.

## How to execute the test cases:
1. Open a console.
2. Go to the framework source folder.
3. Execute the command "npm run-script test" (without coverage analysis) / "npm run-script test-cov" (with coverage analysis).

## How to generate the documentation:
1. Open a console.
2. Go to the framework source folder.
3. Execute the command "npm run-script doc" (only public) / "npm run-script doc-all" (everything).

## How to start and stop the examples:
1. Open a console.
2. Go to the "deploy" subfolder.
3. Execute the command "gulp".
4. Press the combination Ctrl+C in the console to stop the examples.

## History
In April 2015, [Carlos Lozano Sánchez](https://github.com/clozanosanchez) begins his [master thesis](docs/thesis) with the purpose of improving the software development and setting the basis of the future technologies. After 8 months of work, on December 2015, the master thesis is presented and Microrestjs is released as a result.

## License
[MIT](LICENSE)