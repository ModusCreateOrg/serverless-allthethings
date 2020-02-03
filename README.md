# Serverless AllTheThings

[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Powered by Modus_Create](https://img.shields.io/badge/powered_by-Modus_Create-blue.svg?longCache=true&style=flat&logo=data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIwIDMwMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOTguODI0IDE0OS40OThjMCAxMi41Ny0yLjM1NiAyNC41ODItNi42MzcgMzUuNjM3LTQ5LjEtMjQuODEtODIuNzc1LTc1LjY5Mi04Mi43NzUtMTM0LjQ2IDAtMTcuNzgyIDMuMDkxLTM0LjgzOCA4Ljc0OS01MC42NzVhMTQ5LjUzNSAxNDkuNTM1IDAgMCAxIDQxLjEyNCAxMS4wNDYgMTA3Ljg3NyAxMDcuODc3IDAgMCAwLTcuNTIgMzkuNjI4YzAgMzYuODQyIDE4LjQyMyA2OS4zNiA0Ni41NDQgODguOTAzLjMyNiAzLjI2NS41MTUgNi41Ny41MTUgOS45MjF6TTY3LjgyIDE1LjAxOGM0OS4xIDI0LjgxMSA4Mi43NjggNzUuNzExIDgyLjc2OCAxMzQuNDggMCA4My4xNjgtNjcuNDIgMTUwLjU4OC0xNTAuNTg4IDE1MC41ODh2LTQyLjM1M2M1OS43NzggMCAxMDguMjM1LTQ4LjQ1OSAxMDguMjM1LTEwOC4yMzUgMC0zNi44NS0xOC40My02OS4zOC00Ni41NjItODguOTI3YTk5Ljk0OSA5OS45NDkgMCAwIDEtLjQ5Ny05Ljg5NyA5OC41MTIgOTguNTEyIDAgMCAxIDYuNjQ0LTM1LjY1NnptMTU1LjI5MiAxODIuNzE4YzE3LjczNyAzNS41NTggNTQuNDUgNTkuOTk3IDk2Ljg4OCA1OS45OTd2NDIuMzUzYy02MS45NTUgMC0xMTUuMTYyLTM3LjQyLTEzOC4yOC05MC44ODZhMTU4LjgxMSAxNTguODExIDAgMCAwIDQxLjM5Mi0xMS40NjR6bS0xMC4yNi02My41ODlhOTguMjMyIDk4LjIzMiAwIDAgMS00My40MjggMTQuODg5QzE2OS42NTQgNzIuMjI0IDIyNy4zOSA4Ljk1IDMwMS44NDUuMDAzYzQuNzAxIDEzLjE1MiA3LjU5MyAyNy4xNiA4LjQ1IDQxLjcxNC01MC4xMzMgNC40Ni05MC40MzMgNDMuMDgtOTcuNDQzIDkyLjQzem01NC4yNzgtNjguMTA1YzEyLjc5NC04LjEyNyAyNy41NjctMTMuNDA3IDQzLjQ1Mi0xNC45MTEtLjI0NyA4Mi45NTctNjcuNTY3IDE1MC4xMzItMTUwLjU4MiAxNTAuMTMyLTIuODQ2IDAtNS42NzMtLjA4OC04LjQ4LS4yNDNhMTU5LjM3OCAxNTkuMzc4IDAgMCAwIDguMTk4LTQyLjExOGMuMDk0IDAgLjE4Ny4wMDguMjgyLjAwOCA1NC41NTcgMCA5OS42NjUtNDAuMzczIDEwNy4xMy05Mi44Njh6IiBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+)](https://moduscreate.com)

Serverless software architecture – the golden goose to many and just a fad to others. This controversial architecture hasn’t been around for long and like many software engineers I stumbled upon it when Amazon Web Services (AWS) announced Lambda about 5 years ago… and it was love at first sight.

This project and repository is a demonstration of the power of serverless and is meant to accompany the [Modus Create serverless blog series](https://moduscreate.com/blog/serverless-allthethings-1/ "Modus Create Serverless Blog Series").

- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Build the Docker image](#build-the-docker-image)
  - [Run a command on the Docker image](#run-a-command-on-the-docker-image)
    - [Install dependencies](#install-dependencies)
    - [Start](#start)
    - [Lint](#lint)
    - [Test](#test)
    - [Interactive](#interactive)
- [Modus Create](#modus-create)
- [Licensing](#licensing)

## Installation

1. Install [git](https://git-scm.com "Git")

   - Recommended installation notes:
     - Linux: install via a native package management tool, e.g. [apt](https://help.ubuntu.com/lts/serverguide/apt.html.en "Advanced Packaging Tool")
     - MacOS: install via [Xcode](https://developer.apple.com/xcode/ "Xcode") command line tools (`$ xcode-select --install`) or install [Xcode](https://developer.apple.com/xcode/ "Xcode") (via the [Mac App Store](https://developer.apple.com/app-store/mac/ "Mac App Store"))
     - Windows: install via a [Bash](https://www.gnu.org/software/bash/ "Bash")-like environment, e.g. [Git for Windows](https://gitforwindows.org "Git for Windows")
   - Confirm installation via the following command: `$ git --version`

2. Install [Docker](https://docs.docker.com/install/ "Docker Installation Guide")

3. [Create a global .gitignore](https://help.github.com/articles/ignoring-files/#create-a-global-gitignore "How to create a global .gitignore")

   - Note: It is bad practice to include operating system and IDE lines in a project's .gitignore _unless they are required by the project_. This project does not require a specific operating system nor IDE so ensure your global .gitignore includes lines for all files relevant to your [operating system(s) and IDE(s)](https://github.com/github/gitignore "GitHub example .gitignore files")

4. Clone the repository

   ```bash
   git clone git@github.com:ModusCreateOrg/serverless-allthethings.git
   ```

5. Change your current directory to the local clone of the repository

   ```bash
   cd serverless-allthethings
   ```

6. Build the Docker image (see below)
7. Install dependencies (see below)
8. Deploy Support CloudFormation Stack (see below)
9. (If forked: ) Integrate [Travis](https://travis-ci.com/ "Travis") with repository to build automagically Branch CloudFormation Stack
   - You must add the following environment variables to the [Travis](https://travis-ci.com/ "Travis") build configuration:
     - AWS_DEFAULT_REGION
     - AWS_ACCESS_KEY_ID
     - AWS_SECRET_ACCESS_KEY
10. If you're testing with Lighthouse, do it on the fallback route: `/pwa`

## Getting Started

### Build the Docker image

- Build the [Docker](https://www.docker.com/ "Docker") image

  ```bash
  docker build -t serverless-allthethings .
  ```

### Run a command on the Docker image

- Run commands via the [Docker](https://www.docker.com/ "Docker") image

  ```bash
  docker run --mount src="$(pwd)",target=/opt/serverless-allthethings,type=bind serverless-allthethings COMMAND
  ```

#### Install dependencies

- Install [npm](https://www.npmjs.com "Npm") dependencies

  ```bash
  docker run --mount src="$(pwd)",target=/opt/serverless-allthethings,type=bind serverless-allthethings bash ./bin/install.sh
  ```

#### Start

- Start the development server. You can access the website at: `http://localhost`

  ```bash
  docker run --mount src="$(pwd)",target=/opt/serverless-allthethings,type=bind -p 80:80 -e APPSYNC_GRAPHQL_API_REGION="us-east-1" serverless-allthethings
  ```

#### Lint

- Lint files using [ESLint](https://eslint.org "ESLint"), [stylelint](https://stylelint.io "Stylelint") and [Prettier](https://prettier.io "Prettier")

  - Note: It is strongly recommended to incorporate [ESLint](https://eslint.org "ESLint"), [stylelint](https://stylelint.io "Stylelint"), [Prettier](https://prettier.io "Prettier") and [EditorConfig](https://editorconfig.org "EditorConfig") into your IDE's syntax checking, highlighting and `on save` event

- Check for errors via:

  ```bash
  docker run --mount src="$(pwd)",target=/opt/serverless-allthethings,type=bind serverless-allthethings npm run lint
  ```

- Automagically fix any automagically-fixable errors via:

  ```bash
  docker run --mount src="$(pwd)",target=/opt/serverless-allthethings,type=bind serverless-allthethings npm run lint-fix
  ```

- Check if any configuration rules conflict with [Prettier](https://prettier.io "Prettier") via:

  ```bash
  docker run --mount src="$(pwd)",target=/opt/serverless-allthethings,type=bind serverless-allthethings npm run lint-check-rules
  ```

#### Test

- Test files via unit and snapshot test using [Jest](https://jestjs.io/ "Jest")

  ```bash
  docker run --mount src="$(pwd)",target=/opt/serverless-allthethings,type=bind serverless-allthethings npm run test:unit
  ```

#### Interactive

- Run [Docker](https://www.docker.com/ "Docker") in interactive mode

  ```bash
  docker run --mount src="$(pwd)",target=/opt/serverless-allthethings,type=bind -it serverless-allthethings /bin/bash
  ```

## Modus Create

[Modus Create](https://moduscreate.com) is a digital product consultancy. We use a distributed team of the best talent in the world to offer a full suite of digital product design-build services; ranging from consumer facing apps, to digital migration, to agile development training, and business transformation.

<a href="https://moduscreate.com/?utm_source=labs&utm_medium=github&utm_campaign=serverless-allthethings"><img src="https://res.cloudinary.com/modus-labs/image/upload/h_80/v1533109874/modus/logo-long-black.svg" height="80" alt="Modus Create"/></a>
<br />

This project is part of [Modus Labs](https://labs.moduscreate.com/?utm_source=labs&utm_medium=github&utm_campaign=serverless-allthethings).

<a href="https://labs.moduscreate.com/?utm_source=labs&utm_medium=github&utm_campaign=serverless-allthethings"><img src="https://res.cloudinary.com/modus-labs/image/upload/h_80/v1531492623/labs/logo-black.svg" height="80" alt="Modus Labs"/></a>

## Licensing

This project is [MIT licensed](./LICENSE).
