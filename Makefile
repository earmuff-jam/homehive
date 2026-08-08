SHELL := /bin/bash

.ONESHELL:

prettier:
	cd src
	npm run prettierc

prettier-fix:
	cd src
	npm run prettierw

eslint:
	cd src
	npm run lint

eslint-fix:
	cd src
	npm run lintFix

test:
	cd src
	npm run test

playwright:
	npx playwright test

playwright-ui:
	npx playwright test --ui

start:
	npx netlify dev

# runs all cleanup commands such as formatting and linting
jscode: prettier-fix eslint-fix test