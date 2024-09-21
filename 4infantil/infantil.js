function actualizarResultadosConPartido(partido) {
    var equipo1 = partido.equipo1;
    var equipo2 = partido.equipo2;
    var resultado = partido.resultado;

    var [golesEquipo1, golesEquipo2] = resultado.split('-').map(Number);

    actualizarResultados.call(equipo1, golesEquipo1, golesEquipo2, golesEquipo1 > golesEquipo2, golesEquipo1 < golesEquipo2);
    actualizarResultados.call(equipo2, golesEquipo2, golesEquipo1, golesEquipo2 > golesEquipo1, golesEquipo2 < golesEquipo1);
}

function actualizarResultados(golesAFavor, golesEnContra, ganado, perdido) {
    this.golesAFavor += golesAFavor;
    this.golesEnContra += golesEnContra;

    if (ganado) {
        this.puntos += 3;
        this.partidosGanados++;
    } else if (perdido) {
        this.partidosPerdidos++;
    } else {
        this.puntos += 1;
        this.partidosEmpatados++;
    }
}

class Equipo {
    constructor(nombre) {
        this.nombre = nombre;
        this.puntos = 0;
        this.partidosGanados = 0;
        this.partidosPerdidos = 0;
        this.partidosEmpatados = 0;
        this.golesAFavor = 0;
        this.golesEnContra = 0;
    }
}

class Partido {
    constructor(equipo1, equipo2, resultado, fecha, hora, pista, terminado) {
        this.equipo1 = equipo1;
        this.equipo2 = equipo2;
        this.resultado = resultado;
        this.fecha = fecha;
        this.pista = pista;
        this.hora = hora;
        this.terminado = terminado;
        if (this.hora !== "99:99" && this.resultado != null && this.terminado) {
            this.actualizarResultados();
        }
    }

    actualizarResultados() {
        var [golesEquipo1, golesEquipo2] = this.resultado.split('-').map(Number);
        actualizarResultados.call(this.equipo1, golesEquipo1, golesEquipo2, golesEquipo1 > golesEquipo2, golesEquipo1 < golesEquipo2);
        actualizarResultados.call(this.equipo2, golesEquipo2, golesEquipo1, golesEquipo2 > golesEquipo1, golesEquipo2 < golesEquipo1);
    }
}

class PartidoFinal {
    constructor(equipo1, equipo2, resultado,fecha, hora, pista, terminado) {
        this.equipo1 = equipo1;
        this.equipo2 = equipo2; 
        this.resultado = resultado;
        this.fecha = fecha;
        this.hora = hora;
        this.pista = pista;
        this.terminado = terminado;
    }
}

function ordenarGrupos(ArrayEquipos) {
    ArrayEquipos.sort((equipoA, equipoB) => {
        // Ordenar por puntos de mayor a menor
        if (equipoB.puntos !== equipoA.puntos) {
            return equipoB.puntos - equipoA.puntos;
        } else {
            // Si los puntos son iguales, ordenar por mayor diferencia de goles (a favor - en contra)
            return (equipoB.golesAFavor - equipoB.golesEnContra) - (equipoA.golesAFavor - equipoA.golesEnContra);
        }
    });
}

function actualizarPartidos() {
    var table = document.getElementById('tablaGrupo');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var fechaActual = new Date();
    var horaActual = fechaActual.getHours();
    var minutosActuales = fechaActual.getMinutes();

    var hora = horaActual + ':' + (minutosActuales < 10 ? '0' : '') + minutosActuales;

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var horasPartidos = cells[3].innerText.split('-');

        if (cells.length >= 6) {
            // Verifica si la hora actual está entre las dos horas del partido
            var horaInicio = parseInt(horasPartidos[0].split(':')[0]);
            var minInicio = parseInt(horasPartidos[0].split(':')[1]);
            var horaFin = parseInt(horasPartidos[1].split(':')[0]);
            var minFin = parseInt(horasPartidos[1].split(':')[1]);

            var horaActualNum = horaActual * 100 + minutosActuales;

            if (horaActualNum >= horaInicio * 100 + minInicio && horaActualNum <= horaFin * 100 + minFin) {
                // Cambia el color de fondo de toda la fila
                for (var j = 0; j < cells.length; j++) {
                    cells[j].style.backgroundColor = 'red';
                    cells[j].style.color = 'black';
                    cells[j].style.fontWeight = 'bold';
                } 
            } else {
                // Restaura el color de fondo predeterminado de toda la fila
                for (var j = 0; j < cells.length; j++) {
                    cells[j].style.backgroundColor = 'white';
                    cells[j].style.color = 'black';
                    cells[j].style.fontWeight = 'none';
                }
            }
        }
    }
}

function updateDigitalClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const digitalClock = `${hours}:${minutes}:${seconds}`;
    document.getElementById('digital-clock').textContent = digitalClock;
}

function startDigitalClock() {
    updateDigitalClock();
    setInterval(updateDigitalClock, 1000);
}

// Crear instancias de equipos
var pilar = new Equipo("Pilar");
var booling = new Equipo("Booling");
var patinalon = new Equipo("Patinalon");
var tenis = new Equipo("Tenis");

// Crear instancias de partidos
var partido1 = new Partido(patinalon, booling, '2-10',"Viernes", "19:15 - 20:00", "Villa",true);
var partido2 = new Partido(pilar, tenis, '1-7',"Sabado", "12:15 - 13:00", "Villa",true);
var TercerCuarto = new PartidoFinal(patinalon, pilar , '2-3',"Sabado", "16:00 - 16:45", "Villa",true);
var Final = new PartidoFinal(booling, tenis, '0-0',"Sabado", "19:00 - 19:45", "Villa",false);

function ordenarClasificacion(datosClasificacion) {
    datosClasificacion.sort(function(a, b) {
        // Ordenar por puntos
        if (b[1] !== a[1]) {
            return b[1] - a[1]; // Primer criterio: Puntos
        }
    
        // Segundo criterio: Menor número de goles recibidos
        if (a[6] !== b[6]) {
            return a[6] - b[6];
        }
        // Tercer criterio: Mayor diferencia de goles (goles a favor - goles en contra)
        if (b[7] !== a[7]) {
            return b[7] - a[7];
        }
        return 0;
    });
}

function mostrarTablas() {
    var grupoNombre = document.getElementById('nombreGrupo');
    var tablaClasificaciones = document.getElementById('tablaClasificacion');
    var tbodyPartidos = document.getElementById('cuerpoGrupo');
    var tbodyClasificacion = document.getElementById('cuerpoClasif');
    var clasificacionGrupo = document.getElementById('clasificacionGrupo');

    // Muestra todos los partidos
    tablaClasificaciones.style.visibility = 'visible';

    var datosPartidos = [
        [partido1.equipo1.nombre, partido1.resultado, partido1.equipo2.nombre, partido1.fecha, partido1.hora, partido1.pista, 'No'],
        [partido2.equipo1.nombre, partido2.resultado, partido2.equipo2.nombre, partido2.fecha, partido2.hora, partido2.pista, 'No'],
        ['3º', 'Y', '4º', 'Puesto', '---------', '---------', '---------'],
        [TercerCuarto.equipo1.nombre, TercerCuarto.resultado, TercerCuarto.equipo2.nombre, TercerCuarto.fecha, TercerCuarto.hora, TercerCuarto.pista, 'No'],
        ['1º', 'Y', '2º', 'Puesto', '---------', '---------', '---------'],
        [Final.equipo1.nombre, Final.resultado, Final.equipo2.nombre, Final.fecha, Final.hora, Final.pista, 'No'],
        ['Sabado 21:00', 'Entrega', '', 'De', '', 'Premios', 'Sabado 21:00']
    ];

    tbodyPartidos.innerHTML = '';
    datosPartidos.forEach(function(fila) {
        var nuevaFila = tbodyPartidos.insertRow();
        fila.forEach(function(dato) {
            var celda = nuevaFila.insertCell();
            celda.innerHTML = dato;
        });
    });

    ordenarGrupos([pilar, booling, patinalon, tenis]);

    var datosClasificacion = [
        [patinalon.nombre, patinalon.puntos, patinalon.partidosGanados, patinalon.partidosEmpatados, patinalon.partidosPerdidos, patinalon.golesAFavor, patinalon.golesEnContra,patinalon.golesAFavor-patinalon.golesEnContra],
        [pilar.nombre, pilar.puntos, pilar.partidosGanados, pilar.partidosEmpatados, pilar.partidosPerdidos, pilar.golesAFavor, pilar.golesEnContra,pilar.golesAFavor-pilar.golesEnContra],
        [booling.nombre, booling.puntos, booling.partidosGanados, booling.partidosEmpatados, booling.partidosPerdidos, booling.golesAFavor, booling.golesEnContra,booling.golesAFavor-booling.golesEnContra],
        [tenis.nombre, tenis.puntos, tenis.partidosGanados, tenis.partidosEmpatados, tenis.partidosPerdidos, tenis.golesAFavor, tenis.golesEnContra,tenis.golesAFavor-tenis.golesEnContra]
    ];

    ordenarClasificacion(datosClasificacion);

    tbodyClasificacion.innerHTML = '';
    datosClasificacion.forEach(function(fila) {
        var nuevaFila = tbodyClasificacion.insertRow();
        fila.forEach(function(dato) {
            var celda = nuevaFila.insertCell();
            celda.innerHTML = dato;
        });
    });

    tablaClasificaciones.style.visibility = 'visible';
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarTablas();
    startDigitalClock();
});
