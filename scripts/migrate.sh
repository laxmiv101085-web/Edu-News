#!/bin/bash

# Database migration script
cd apps/api

echo "Running Prisma migrations..."
npx prisma migrate dev

echo "Generating Prisma client..."
npx prisma generate

echo "✅ Migrations completed!"

