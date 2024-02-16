# Beyonnex.io technical task

## Introduction

This project serves as a demo for Beyonnex, showcasing the usage of Playwright, Typescript, and Docker.

## Requirements

- [Node.js](https://nodejs.org/): JavaScript runtime for server-side development.
- [npm](https://www.npmjs.com/): Node package manager, included with Node.js installation.
- [Docker](https://www.docker.com/): Platform uses OS-level virtualization to deliver software in packaged containers

## Stack of Technologies

- [Playwright](https://playwright.dev/): A browser automation library to control web browsers using code.
- [Typescript](https://www.typescriptlang.org/): A superset of JavaScript that adds static typing to the language.
- [Faker](https://github.com/Marak/faker.js): A library for generating fake data such as names, addresses, and more.

## Local run usage 

1. Run the demo script for webkit:

    ```bash
    npx playwright test --project='chromium'
    ```

2. Run the demo for all browsers:

    ```bash
    npx playwright test
    ```

3. To open last HTML report run:
    
    ```bash
    npx playwright show-report
    ```

## Dockerized run usage 

1. Build docker image setting a tag demo-beyonnex-tests and using all files and folders from current directory

    ```bash
    docker build -t demo-beyonnex-tests .
    ```

2. Run tests within this image based on tag starting from entry point:

    ```bash
    docker run demo-beyonnex-tests
    ```    

## Credits

- [Oleksandr Timochko](https://www.linkedin.com/in/alexander-timochko/): Senior Quality Assurance Test Engineer.

## Project stages

- ![](https://i.etsystatic.com/13439930/r/il/11c715/4671538275/il_570xN.4671538275_18t6.jpg)
