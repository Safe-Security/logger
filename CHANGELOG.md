## [2.1.1](https://github.com/Safe-Security/logger/compare/v2.1.0...v2.1.1) (2024-11-25)


### Bug Fixes

* fixed issues with masking circular references ([#19](https://github.com/Safe-Security/logger/issues/19)) ([8cd3a17](https://github.com/Safe-Security/logger/commit/8cd3a17ba310354c044a424230981d2a0d84986a))

# [2.1.0](https://github.com/Safe-Security/logger/compare/v2.0.0...v2.1.0) (2024-11-22)


### Features

* added mask support on global logger ([#18](https://github.com/Safe-Security/logger/issues/18)) ([5953e8d](https://github.com/Safe-Security/logger/commit/5953e8d891b25ddfe4fbabaea560d7b0ca84d38f))

# [2.0.0](https://github.com/Safe-Security/logger/compare/v1.2.1...v2.0.0) (2022-12-13)


### Features

* add support to log additional attributes by default ([#17](https://github.com/Safe-Security/logger/issues/17)) ([1d022c7](https://github.com/Safe-Security/logger/commit/1d022c7c12c52e5b36aa98e8d097104aea59af93))


### BREAKING CHANGES

* add arbitrary parameters to be part of every log line by default

## [1.2.1](https://github.com/Safe-Security/logger/compare/v1.2.0...v1.2.1) (2022-10-12)


### Bug Fixes

* updated metadata to exclude error object ([#16](https://github.com/Safe-Security/logger/issues/16)) ([3061b4f](https://github.com/Safe-Security/logger/commit/3061b4f2b7d18a03c56e76d20b35ef74ba8ef6c5))

# [1.2.0](https://github.com/Safe-Security/logger/compare/v1.1.0...v1.2.0) (2022-09-30)


### Bug Fixes

* release v1.1.7 with reverted changes ([366809d](https://github.com/Safe-Security/logger/commit/366809dae8a003adb4362e95d0af85a8c507d0c0))
* updated logger not to exit after logging an uncaughtException ([#7](https://github.com/Safe-Security/logger/issues/7)) ([da283a1](https://github.com/Safe-Security/logger/commit/da283a1dbadedccd9b194a1be46122bb51b67d50))


### Features

* added auto-release and logger to use metadata ([#11](https://github.com/Safe-Security/logger/issues/11)) ([e3703a3](https://github.com/Safe-Security/logger/commit/e3703a3ca582b1a113f3bdbd02dabbe5901af9cb))
* added support to include service ([#6](https://github.com/Safe-Security/logger/issues/6)) ([b809dd2](https://github.com/Safe-Security/logger/commit/b809dd23c64b0cad9d354202ae0e69e58aca7a40))
* Update logger to use metadata ([#12](https://github.com/Safe-Security/logger/issues/12)) ([1f66fe4](https://github.com/Safe-Security/logger/commit/1f66fe476ac368a9c7e84a4482ce807cd4ee4258))


### Reverts

* Revert "feat: updated logger to use metadata (#9)" ([8c2b239](https://github.com/Safe-Security/logger/commit/8c2b239e0df0c80598c35504821346abf1aec54d)), closes [#9](https://github.com/Safe-Security/logger/issues/9)
