@echo off
title AdaEv - Iniciando sistema completo
echo ===================================
echo   Iniciando AdaEv
echo ===================================
echo.

start "AdaEv Backend"  cmd /k "%~dp0backend.bat"
timeout /t 3 /nobreak >nul
start "AdaEv Frontend" cmd /k "%~dp0frontend.bat"

timeout /t 5 /nobreak >nul
echo Abriendo navegador...
start http://localhost:5173

exit