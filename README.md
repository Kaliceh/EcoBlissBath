<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
  <br><br><br>
</p>

# Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:
- Docker
- NodeJs

# Installation et démarrage
Clonez le projet pour le récupérer
``` 
git clone https://github.com/OpenClassrooms-Student-Center/Eco-Bliss-Bath-V2.git
```

```
docker compose up -d
```
# Pour démarrer le frontend de l'applicatif
Rendez-vous dans le dossier frontend
```
cd ./frontend
```
Installez les dépendances du projet
```
npm i
ou
npm install (si vous préférez)
```
Démarrer le frontend
```
npm start
```
Cliquer sur le lien dans le terminal
[http://localhost:4200/](http://localhost:4200/)

# Pour démarrer les tests
Rendez-vous dans le dossier frontend
```
Installez les dépendances du projet
```
npm install cypress --save-dev
```
Lancer Cypress
```
* dans le terminal
```
npx cypress run
```
ou 
* dans l'application
```
npx cypress open
```
puis choisir "**E2E Testing**"

