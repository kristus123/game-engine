@echo off
setlocal enabledelayedexpansion

set COMMITMSG=Auto commit

for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i

if "%BRANCH%"=="master" (
    set /a RAND=%RANDOM% * %RANDOM%
    set NEWBRANCH=feature-!RAND!
    git checkout -b !NEWBRANCH!
    set BRANCH=!NEWBRANCH!
)

git pull origin %BRANCH%

git add .

git commit -m "!COMMITMSG!" 2>nul

git push -u origin %BRANCH%

gh pr view %BRANCH% >nul 2>&1

if errorlevel 1 (
    gh pr create --fill
)
