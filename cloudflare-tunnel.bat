@echo off
echo ===================================
echo   AdaEv - Tunel Cloudflare
echo ===================================
echo.
echo Iniciando tunel para acceso remoto...
echo La URL publica aparecera en unos segundos.
echo Busca la linea que dice: "Visit it at"
echo.
echo Para detener el tunel: Ctrl+C
echo.
cloudflared tunnel --url http://localhost:5173
pause