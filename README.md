# logger

This package provides the logging configuration typically used in Safe Security.

## Motivation

Currently in Safe Security, all the services that require logging functionality imported a library & configured it as per the service needs.
Although this seems _okay_ initially, it becomes a challenge to do this across multiple services as care needs to be taken to keep the 
dependency versions consistent across, code reusability takes a back seat since the configuration is duplicated everywhere, and is prone to human errors.

In order to solve this problem, the `winston` library used currently has been encapsulated in this package along with the desired defaults set up so that 
the client does not have to worry about setting up a verbose configuration in multiple files.

## Installation
```bash
npm install logger-safe-security
```

```bash
yarn add logger-safe-security
```

## Usage
The introduction of this package makes it very easy for clients to consume & leverage the logging capabilities.

In Javascript:
```js
const { createLogger } = require("logger-safe-security");
const logger = createLogger({ logLevel: "info" });
logger.info("Hello world!");
```

In Typescript:
```js
import { createLogger } from "logger-safe-security";
const logger = createLogger({ logLevel: "info" });
logger.info("Hello world!");
```

Additionally, one can pass `service` metadata while importing it within the context of a service. For example:
```js
const { createLogger } = require("logger-safe-security");
const logger = createLogger({ service: "sample" });
logger.info("This log line will include service metadata");
```

## Definition
The logger exported as part of this package contains the following definition:
- Log format: 
  - The default log format is set to `JSON`. Hence, all the log messages will be represented (printed) as JSON objects.
  - Timestamp will be added to all log lines in `yyyy-MM-dd'T'HH:mm:ss.SSSZ` format.
  - Application errors will be captured in the logs.
  - String interpolation is supported.
- Log level: 
  - The default log level is `INFO`.
- Transports:
  - All logs will be written to `Console` by default.
  - Exceptions & Promise Rejections will be handled & written to `Console` as well.
- Metadata:
  - `{ "type" : "application" }` is added as default metadata to easily identify application logs. This can further be extended to differentiate 
  from audit logs and add parsing/filtering rules (for e.g. in Datadog) as needed.
  - Additionally, all other metadata passed to the log messages will be stored under `metadata` property for easy identification & grouping.