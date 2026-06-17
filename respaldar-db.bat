@echo off
setlocal enabledelayedexpansion

set FECHA=%date:~-4%-%date:~3,2%-%date:~0,2%
set HORA=%time:~0,2%-%time:~3,2%
set HORA=%HORA: =0%

set ARCHIVO=backups\adaev_backup_%FECHA%_%HORA%.sql

echo ===================================
echo   Respaldando base de datos AdaEv
echo ===================================
echo.

mysqldump -u root -proot adaev > "%ARCHIVO%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Respaldo creado exitosamente:
    echo %ARCHIVO%
) else (
    echo.
    echo ERROR: No se pudo crear el respaldo.
)

echo.
pause