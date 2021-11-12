//Para que se obedezcan las ordenes desde js
document.addEventListener('DOMContentLoaded', () => {
    //Declaramos una matriz de tamaño inmutable
    const matriz = document.querySelector('.matriz');
    const banderasIzquierda = document.querySelector('#banderas-izquierda');
    const resultado = document.querySelector('#resultado');
    let ancho = 10;
    //05/11/2021 cantidad de bombas
    let cantidadBombas = 20;
    let cantidadBanderas = 0;
    let cuadraditos = [];
    //08/11/2021 GameOver
    let gameOver = false;

    //8/11/2021 Comprobar victoria
    function comprobarVictoria() {
        let coincidentes = 0;
        for (i = 0; i < cuadraditos.length; i++) {
            if (cuadraditos[i].classList.contains('bandera') && cuadraditos[i].classList.contains('bomba')) {
                coincidentes++;
            }
            if (cuadraditos[i].classList.contains('hueco') == (cuadraditos.length - cantidadBombas)) {
                resultado.innerHTML = ("¡HAS GANADO!");
                gameOver = true;
            }
            if (coincidentes == cantidadBombas) {
                resultado.innerHTML = ("¡HAS GANADO!");
                gameOver = true;
            }
        }

    }

    //8/11/2021 Función añadir bandera
    function anyadirBandera(cuadradito) {
        if (gameOver) return;
        if (!cuadradito.classList.contains("anotado") && cantidadBanderas <= cantidadBombas) {
            if (!cuadradito.classList.contains("bandera")) {
                cantidadBanderas++;
                cuadradito.classList.add('bandera');
                cuadradito.innerHTML = '🚩';
                banderasIzquierda.innerHTML = cantidadBombas - cantidadBanderas;
                comprobarVictoria();
            }
            else {
                cantidadBanderas--;
                cuadradito.classList.remove('bandera');
                cuadradito.innerHTML = '';
                banderasIzquierda.innerHTML = cantidadBombas - cantidadBanderas;
            }
        }
    }

    //11/11/2021 Función anotar cuadradito
    function comprobarCuadradito(cuadradito, actualId) {
        const esBordeIzquierdo = (actualId % ancho == 0);
        const esBordeDerecho = ((actualId -(ancho -1))% ancho == 0);
    
        setTimeout(() => {
            if (actualId > 0 && !esBordeIzquierdo) {
                const nuevoId = cuadraditos[parseInt(actualId) - 1].id;
                //const nuevoId = parseInt(actualId) - 1   ....refactor
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
             }
            if (actualId > 9 && !esBordeDerecho) {
                const nuevoId = cuadraditos[parseInt(actualId) +1 -ancho].id;
                //const nuevoId = parseInt(actualId) +1 -ancho   ....refactor
                const nuevoCuadradito = document.getElementById(nuevoId);
              click(nuevoCuadradito);
            }
            if (actualId > 10) {
                const nuevoId = cuadraditos[parseInt(actualId -ancho)].id;
                //const nuevoId = parseInt(actualId) -ancho   ....refactor
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
            if (actualId > 11 && !esBordeIzquierdo) {
                const nuevoId = cuadraditos[parseInt(actualId) -1 -ancho].id;
                //const nuevoId = parseInt(actualId) -1 -ancho   ....refactor
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
            if (actualId < 98 && !esBordeDerecho) {
                const nuevoId = cuadraditos[parseInt(actualId) +1].id;
                //const nuevoId = parseInt(actualId) +1   ....refactor
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
            if (actualId < 90 && !esBordeIzquierdo) {
                const nuevoId = cuadraditos[parseInt(actualId) -1 +ancho].id;
                //const nuevoId = parseInt(actualId) -1 +ancho   ....refactor
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
            if (actualId < 88 && !esBordeDerecho) {
                const nuevoId = cuadraditos[parseInt(actualId) +1 +ancho].id;
                //const nuevoId = parseInt(actualId) +1 +ancho   ....refactor
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
            if (actualId < 89) {
                const nuevoId = cuadraditos[parseInt(actualId) +ancho].id;
                //const nuevoId = parseInt(actualId) +ancho   ....refactor
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
        }, 10)
    }
    //9/11/2021 Función click
    function click(cuadradito) {
        let actualId = cuadradito.id;
        if (gameOver) return;
        if (cuadradito.classList.contains('anotado') || cuadradito.classList.contains('bandera')) return
        if (cuadradito.classList.contains('bomba')) {
            gameOver = true;
            cuadradito.classList.add('bomba');
            cuadradito.innerHTML = '💣';
            resultado.innerHTML = ("¡HAS PERDIDO!");
        } else {
            let total = cuadradito.getAttribute('dato');
            if (total !=0) {
                cuadradito.classList.add('anotado')
                if (total == 1) cuadradito.classList.add('uno')
                if (total == 2) cuadradito.classList.add('dos')
                if (total == 3) cuadradito.classList.add('tres')
                if (total == 4) cuadradito.classList.add('cuatro')
                cuadradito.innerHTML = total;
                return;
            }
            comprobarCuadradito(cuadradito, actualId);
        }
        cuadradito.classList.add('anotado');
    }

    //Creación del tablero
    function crearTablero() {
        //05/11/2021 Creación de los vectores donde se colocan las bombas y los huecos
        const vectorBombas = Array(cantidadBombas).fill('bomba');
        const vectorVacio = Array(ancho * ancho - cantidadBombas).fill('hueco');
        //05/11/2021 Vamos a hacer que la colocación de bombas sea aleatoria
        const vectorJuego = vectorVacio.concat(vectorBombas);
        const vectorBarajado = vectorJuego.sort(() => Math.random() - 0.5);



        //Aquí he hecho un bucle cuadrado para completar la matriz 
        for (let i = 0; i < ancho * ancho; i++) {
            //Creamos los cuadraditos
            const cuadradito = document.createElement('div');
            //Llamamos a cada cuadradito
            cuadradito.setAttribute('id', i);
            //05/11/2021 Añadimos a cada cuadradito el vector barajado
            cuadradito.classList.add(vectorBarajado[i]);
            //Lo añadimos a nuestra matriz
            matriz.appendChild(cuadradito);
            //Ponemos cada cuadradito en el vector
            cuadraditos.push(cuadradito);

            //normal click 
            cuadradito.addEventListener('click', function (e) {
                click(cuadradito);
            })

            //ctrl and left click 
            cuadradito.oncontextmenu = function (e) {
                e.preventDefault();
                anyadirBandera(cuadradito);
            }
        }

        //05/11/2021 Añadir números
        for (let i = 0; i < cuadraditos.length; i++) {
            let total = 0;
            const esBordeIzquierdo = i % ancho == 0;
            const esBordeDerecho = (i - (ancho - 1)) % ancho == 0;

            if (cuadraditos[i].classList.contains('hueco')) {
                if (i > 0 && !esBordeIzquierdo && cuadraditos[i - 1].classList.contains('bomba')) total++;
                if (i > 9 && !esBordeDerecho && cuadraditos[i + 1 - ancho].classList.contains('bomba')) total++;
                if (i > 10 && cuadraditos[i - ancho].classList.contains('bomba')) total++;
                if (i > 11 && !esBordeIzquierdo && cuadraditos[i - 1 - ancho].classList.contains('bomba')) total++;
                if (i < 99 && !esBordeDerecho && cuadraditos[i + 1].classList.contains('bomba')) total++;
                if (i < 90 && !esBordeIzquierdo && cuadraditos[i - 1 + ancho].classList.contains('bomba')) total++;
                if (i < 89 && cuadraditos[i + ancho].classList.contains('bomba')) total++;
                if (i < 88 && !esBordeDerecho && cuadraditos[i + 1 + ancho].classList.contains('bomba')) total++;
                cuadraditos[i].setAttribute('dato', total);

            }
            console.log(cuadraditos[i]);
        }
    }
    crearTablero();
})