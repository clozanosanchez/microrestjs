v0.5.0-beta
===========
  * Official support for Node.js 6.
  * Adopts ECMAScript 6 features (class, const, let, =>, Promise, for-of, ...).
  * Deprecates Callback style.
  * Adopts Promise style.
  * Modifies ServiceContext to be immutable and safer.
  * Improves error handling.
  * Updates dependencies.
  * Deprecates JSHint and JSCS.
  * Adopts ESLint.

v0.4.4-beta
===========
  * Reorganize the repository.
  * Adds the yellow-pages example.
  * Adds the thesis document.

v0.4.3-beta
===========
  * Disables SSLv2, SSLv3 and TLSv1.0

v0.4.2-beta
===========
  * Fixes minor bugs.

v0.4.1-beta
===========
  * Enables error 503 Service Unavailable.

v0.4.0-beta
===========
  * Reorganizes the code.
  * Enables a LoggerManager for all the platform and services.
  * Implements the ServiceFunctionalityLoader.
  * Fixes important bugs:
    * Platform credentials had the possibility to be published before the creation of services.
    * Platform credentials was not cleaned properly (during shutdown).

v0.3.0-beta
===========
  * Updates parameters aspects in the Microrestjs Service Description Specification.
  * Enables the query parameters.
  * Enables automatic checks for parameters according to the service description.
  * Removes the partial Files support.
  * Removes the partial Cookies support.
  * Improves the RunnableServiceRequests with new properties.
  * Improves the CallableServiceResponses with new properties.
  * Improves the processing and sending of CallableServices requests.
  * Enables error 405 Method Not Allowed.
  * Fixes other minor bugs and programming problems.

v0.2.0-beta
===========
  * Fixes several SSL bugs.
  * Enables basic authentication and authorization.
  * Includes the security aspects in the Microrestjs Service Description Specification.
  * Improves the management of ServiceContext.
  * Improves documentation.
  * Fixes other minor bugs.

v0.1.0-beta
===========
  * Better support for RunnableServices and CallableServices.
  * Enables the server capabilities to listen and route HTTP requests.
  * Enables SSL capabilities for secure network communications.
  * Enables the service discoverability.
  * Enables the execution of remote service operations.
  * Enables the shutdown of the platform gracefully.

v0.0.3-alpha
============
  * Includes basic support for RunnableServices.
  * Includes basic support for CallableServices.
  * Includes a logger to monitor the platform.

v0.0.2-alpha
============
  * Fixes errors related to the Microrestjs Service Description Specification schema and the service descriptions.

v0.0.1-alpha
============
  * Includes a basic implementation of the platform core objects.
  * Includes the Launcher of the platform.
  * Loads and checks the configuration file.
  * Loads and checks the service descriptions.
  * Loads the functionality of the services.
  