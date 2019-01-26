# phaser-redux

[![HitCount](http://hits.dwyl.io/kfern/phaser-redux.svg)](http://hits.dwyl.io/kfern/phaser-redux)

Este proyecto es un ejemplo de cómo usar redux para desarrollar juegos con Phaser 3, además de pretender ser una herramienta en Español para quienes estén interesados en aprender a programar juegos.

Combinar Phaser y Redux permite que el desarrollo de un juego sea más módular, fácil de depurar mediante Redux devTools y abre la posibilidad de automatizar los tests de la lógica del juego. 

![Imagen del juego y Redux devTools](https://github.com/kfern/phaser-redux/blob/master/docs/images/phaser-redux-a.png)

El ejemplo está basado en el tutorial "Making your first Phaser 3 game" https://phaser.io/tutorials/making-your-first-phaser-3-game, utiliza "Phaser 3 Webpack Project Template" https://github.com/photonstorm/phaser3-project-template, "Redux Starter Kit" https://github.com/reduxjs/redux-starter-kit y "redux-watch" https://github.com/jprichardson/redux-watch


# Instalación
```
git clone https://github.com/kfern/phaser-redux.git 
cd phaser-redux
npm install
npm start
```
Si todo fue bien, puedes acceder con el navegador a http://localhost:8000

# Idioma
El idioma oficial de la documentación y gestión del repositorio es el Español, por lo que no es necesario usar el idioma inglés para abrir o comentar un "Issue" o en los "Pull request" o hacer cualquier pregunta.

Por otra parte, el idioma para los comentarios en el código fuente es el inglés. Si envías un PR y no tienes nivel suficiente puedes usar Google Translate.
# Posibles mejoras
Lista de mejoras que se podrían implementar. Quien esté intesado en colaborar puede enviar un PR o abrir un Issue.
* ~~Poder jugar con pantalla táctil y ratón.~~ Versión 1.1.0
* Adaptar el tamaño del juego al de la pantalla.
* Refactorizar estrellas y bombas para que sean clases independientes.
* Añadir en el estado todo lo necesario para poder ver con devTools la pantalla completa en cada instante. Ahora sólo se gestionan la puntuación y la animación que se aplica al player.

