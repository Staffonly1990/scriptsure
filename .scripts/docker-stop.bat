@echo off
title docker-compose stop
cd ..
call docker-compose ps
pause
call docker-compose stop
pause