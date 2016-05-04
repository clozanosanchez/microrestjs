microrestjs
===========
The platform for designing, developing and deploying microservices.

The platform is composed of a:
  *framework: [clozanosanchez/microrestjs](https://github.com/clozanosanchez/microrestjs)
  *service directory: [clozanosanchez/microrestjs-directory](https://github.com/clozanosanchez/microrestjs-directory)
  *basic authentication service: [clozanosanchez/microrestjs-basic-authentication](https://github.com/clozanosanchez/microrestjs-basic-authentication)
  *basic authorization service: [clozanosanchez/microrestjs-basic-authorization](https://github.com/clozanosanchez/microrestjs-basic-authorization)
-
The current repository corresponds to the framework to develop and deploy microservices that respect the Microrestjs Service Description Specification.
-

*How to setup the framework:*

1. Install Node.js.
2. Open a console.
3. Go to the framework source folder.
4. Execute the command "npm install".

*How to start and stop the framework:*

1. Configure the settings of the framework in the file "Configuration.json".
2. Open a console.
3. Go to the framework source folder.
4. Execute the command "node Launcher.js". 
5. Press the combination Ctrl+C in the console to stop the framework.

*How to execute the test cases:*

1. Open a console.
2. Go to the framework source folder.
3. Execute the command "npm run-script test" (without coverage analysis) / "npm run-script test-cov" (with coverage analysis).

*How to generate the documentation:*

1. Open a console.
2. Go to the framework source folder.
3. Execute the command "npm run-script doc" (only public) / "npm run-script doc-all" (everything).

*How to start and stop the demo:*

1. Open a console.
2. Go to the "deploy" subfolder.
3. Execute the command "gulp".
4. Press the combination Ctrl+C in the console to stop the demo.

----------------------------------------------------------------------------------
MASTER THESIS - EUROPEAN MASTER IN SOFTWARE ENGINEERING (EMSE)

Technische Universität Kaiserslautern & Universidad Politécnica de Madrid

Presented: December 15th, 2015

Author: Carlos Lozano Sánchez

Supervisors: 
* Prof. Dr. Paul Müller (Technische Universität Kaiserslautern)
* Prof. Dr. Ricardo Imbert Paredes (Universidad Politécnica de Madrid)
* Dr. Markus Hillenbrand (Technische Universität Kaiserslautern)
