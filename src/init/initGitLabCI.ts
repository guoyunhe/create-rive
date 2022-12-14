import fs from 'fs-extra';

const config = `# Generated By RiVE
image: node:latest

stages:
  - install
  - test
  - build

cache:
  paths:
    - node_modules/

install:
  stage: install
  script:
    - npm install

test:
  stage: test
  coverage: /All files[^|]*\|[^|]*\s+([\d\.]+)/
  dependencies:
    - install
  script:
    - npm run test:ci
  artifacts:
    when: always
    reports:
      junit:
        - junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  dependencies:
    - install
  script:
    - npm run build
`;

export function initGitLabCI() {
  fs.outputFileSync('.gitlab-ci.yml', config);
}
