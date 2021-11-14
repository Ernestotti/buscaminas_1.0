document.addEventListener('DOMContentLoaded', () => {
    const matriz = document.querySelector('.matriz');
    const banderasIzquierda = document.querySelector('#banderas-izquierda');
    const resultado = document.querySelector('#resultado');
    let ancho = 10;
    let cantidadBombas = 20;
    let cantidadBanderas = 0;
    let cuadraditos = [];
    let gameOver = false;

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

    function comprobarCuadradito(cuadradito, actualId) {
        const esBordeIzquierdo = (actualId % ancho == 0);
        const esBordeDerecho = ((actualId -(ancho -1))% ancho == 0);
    
        setTimeout(() => {
            if (actualId > 0 && !esBordeIzquierdo) {
                const nuevoId = cuadraditos[parseInt(actualId) - 1].id;
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
             }
            if (actualId > (ancho-1) && !esBordeDerecho) {
                const nuevoId = cuadraditos[parseInt(actualId) +1 -ancho].id;
                const nuevoCuadradito = document.getElementById(nuevoId);
              click(nuevoCuadradito);
            }
            if (actualId > ancho) {
                const nuevoId = cuadraditos[parseInt(actualId -ancho)].id;
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
            if (actualId > (ancho+1) && !esBordeIzquierdo) {
                const nuevoId = cuadraditos[parseInt(actualId) -1 -ancho].id;
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
            if (actualId < (ancho*ancho-1) && !esBordeDerecho) {
                const nuevoId = cuadraditos[parseInt(actualId) +1].id;
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
            if (actualId < (ancho*ancho-ancho) && !esBordeIzquierdo) {
                const nuevoId = cuadraditos[parseInt(actualId) -1 +ancho].id;
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
            if (actualId < (ancho*ancho-(ancho+2)) && !esBordeDerecho) {
                const nuevoId = cuadraditos[parseInt(actualId) +1 +ancho].id;
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
            if (actualId < (ancho*ancho-(ancho+1))) {
                const nuevoId = cuadraditos[parseInt(actualId) +ancho].id;
                const nuevoCuadradito = document.getElementById(nuevoId);
                click(nuevoCuadradito);
            }
        }, 10);
    }

    function click(cuadradito) {
        let actualId = cuadradito.id;
        if (gameOver) return;
        if (cuadradito.classList.contains('anotado') || cuadradito.classList.contains('bandera')) return;
        if (cuadradito.classList.contains('bomba')) {
            gameOver = true;
            cuadradito.classList.add('bomba');
            cuadradito.innerHTML = '💣';
            resultado.innerHTML = ("¡HAS PERDIDO!");
        } else {
            let total = cuadradito.getAttribute('dato');
            if (total !=0) {
                cuadradito.classList.add('anotado');
                if (total == 1) cuadradito.classList.add('uno');
                if (total == 2) cuadradito.classList.add('dos');
                if (total == 3) cuadradito.classList.add('tres');
                if (total == 4) cuadradito.classList.add('cuatro');
                if (total == 5) cuadradito.classList.add('cinco');
                if (total == 6) cuadradito.classList.add('seis');
                if (total == 7) cuadradito.classList.add('siete');
                if (total == 8) cuadradito.classList.add('ocho');
                cuadradito.innerHTML = total;
                return;
            }
            comprobarCuadradito(cuadradito, actualId);
        }
        cuadradito.classList.add('anotado');
    }

    function crearTablero() {
        const vectorBombas = Array(cantidadBombas).fill('bomba');
        const vectorVacio = Array(ancho * ancho - cantidadBombas).fill('hueco');
        const vectorJuego = vectorVacio.concat(vectorBombas);
        const vectorBarajado = vectorJuego.sort(() => Math.random() - 0.5);

        for (let i = 0; i < ancho * ancho; i++) {
            const cuadradito = document.createElement('div');
 
            cuadradito.setAttribute('id', i);
            cuadradito.classList.add(vectorBarajado[i]);
            matriz.appendChild(cuadradito);
            cuadraditos.push(cuadradito);
            cuadradito.addEventListener('click', function (e) {
                click(cuadradito);
            })

            cuadradito.oncontextmenu = function (e) {
                e.preventDefault();
                anyadirBandera(cuadradito);
            }
        }

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