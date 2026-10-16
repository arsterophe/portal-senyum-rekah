@echo off
set "PATH=C:\Program Files\Altair\RapidMiner\AI Studio 2026.0.2\jre\bin;%PATH%"
npx firebase-tools emulators:exec --only firestore "npm run test:rules"
