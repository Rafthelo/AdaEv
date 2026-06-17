@echo off
setlocal enabledelayedexpansion

echo ===================================
echo   Restaurar base de datos AdaEv
echo ===================================
echo.
echo ADVERTENCIA: Esto reemplazara TODOS los datos actuales
echo de la base de datos "adaev" con los del archivo elegido.
echo.

echo Archivos de respaldo disponibles en backups\:
echo.
dir /b backups\*.sql
echo.

set /p ARCHIVO="Escribe el nombre exacto del archivo a restaurar (ej. adaev_backup_2026-06-16_23-36.sql): "

if not exist "backups\%ARCHIVO%" (
    echo.
    echo ERROR: El archivo "backups\%ARCHIVO%" no existe.
    echo.
    pause
    exit /b
)

echo.
set /p CONFIRMAR="Estas seguro? Esto borrara los datos actuales. Escribe SI para continuar: "

if /i not "%CONFIRMAR%"=="SI" (
    echo.
    echo Operacion cancelada.
    pause
    exit /b
)

echo.
echo Restaurando...

mysql -u root -proot adaev < "backups\%ARCHIVO%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Base de datos restaurada exitosamente desde:
    echo backups\%ARCHIVO%
) else (
    echo.
    echo ERROR: No se pudo restaurar la base de datos.
)

echo.
pause