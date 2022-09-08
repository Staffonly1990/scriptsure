@echo off
title docker-compose exec
cd ..
call docker-compose ps
pause
call docker-compose -f docker-compose.yml up -d --build
pause