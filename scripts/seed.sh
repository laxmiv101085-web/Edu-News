#!/bin/bash

# Seed database script
cd apps/api

echo "Seeding database..."
npm run seed

echo "✅ Seeding completed!"

