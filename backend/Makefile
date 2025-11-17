.PHONY: build up down migrate seed test clean

build:
	docker-compose build

up:
	docker-compose up --build

down:
	docker-compose down

migrate:
	docker-compose exec backend alembic upgrade head

seed:
	docker-compose exec backend python scripts/run_seed.py

test:
	docker-compose exec backend pytest tests/ -v

clean:
	docker-compose down -v
	docker system prune -f

logs:
	docker-compose logs -f backend

worker-logs:
	docker-compose logs -f worker

