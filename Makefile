.PHONY: install dev build test lint migrate seed docker-up docker-down

install:
	npm install
	cd apps/api && npm install
	cd apps/web && npm install
	cd worker && npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

migrate:
	cd apps/api && npm run migrate

seed:
	cd apps/api && npm run seed


