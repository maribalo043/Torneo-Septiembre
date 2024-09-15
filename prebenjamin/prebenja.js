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
    constructor(equipo1, equipo2, resultado,fecha, hora, pista) {
        this.equipo1 = equipo1;
        this.equipo2 = equipo2; 
        this.resultado = resultado;
        this.hora = hora;
        this.pista = pista;
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
var corre = new Equipo("Corredoria");
var patinalon = new Equipo("Patinalon");

// Crear instancias de partidos
var partido1 = new Partido(patinalon, corre, '0-0',"Viernes 20/09", "17:00 - 17:45", "Villa",false); 
var partido2 = new Partido(corre, pilar, '0-0',"Sabado 21/09", "10:00 - 10:45", "Villa",false);
var partido3 = new Partido(pilar, patinalon, '0-0',"Domingo 22/09", "10:00 - 10:45", "Villa",false);

function mostrarTablas() {
    var grupoNombre = document.getElementById('nombreGrupo');
    var tablaClasificaciones = document.getElementById('tablaClasificacion');
    var tbodyPartidos = document.getElementById('cuerpoGrupo');
    var tbodyClasificacion = document.getElementById('cuerpoClasif');
    var clasificacionGrupo = document.getElementById('clasificacionGrupo');

    // Muestra todos los partidos
    tablaClasificaciones.style.visibility = 'visible'; // Asegúrate de que la tabla esté visible

    // Datos de partidos
    var datosPartidos = [
        [partido1.equipo1.nombre, partido1.resultado, partido1.equipo2.nombre, partido1.hora, partido1.hora, partido1.pista, 'No'],
        [partido2.equipo1.nombre, partido2.resultado, partido2.equipo2.nombre, partido2.hora, partido2.hora, partido2.pista, 'No'],
        [partido3.equipo1.nombre, partido3.resultado, partido3.equipo2.nombre, partido3.hora, partido3.hora, partido3.pista, 'No'],
        ['21:00', 'Entrega', '', 'De', '', 'Premios', '21:00']
    ];

    tbodyPartidos.innerHTML = '';
    datosPartidos.forEach(function(fila) {
        var nuevaFila = tbodyPartidos.insertRow();
        fila.forEach(function(dato) {
            var celda = nuevaFila.insertCell();
            celda.innerHTML = dato;
        });
    });

    // Mostrar la clasificación del grupo
    ordenarGrupos([pilar, corre, patinalon]); // Ordena los equipos por puntos, goles, etc.

    // Datos de clasificación
    var datosClasificacion = [
        [pilar.nombre, pilar.puntos, pilar.partidosGanados, pilar.partidosEmpatados, pilar.partidosPerdidos, pilar.golesAFavor, pilar.golesEnContra,pilar.golesAFavor-pilar.golesEnContra],
        [corre.nombre, corre.puntos, corre.partidosGanados, corre.partidosEmpatados, corre.partidosPerdidos, corre.golesAFavor, corre.golesEnContra,corre.golesAFavor-corre.golesEnContra],
        [patinalon.nombre, patinalon.puntos, patinalon.partidosGanados, patinalon.partidosEmpatados, patinalon.partidosPerdidos, patinalon.golesAFavor, patinalon.golesEnContra,patinalon.golesAFavor-patinalon.golesEnContra]
    ];

    tbodyClasificacion.innerHTML = '';
    datosClasificacion.forEach(function(fila) {
        var nuevaFila = tbodyClasificacion.insertRow();
        fila.forEach(function(dato) {
            var celda = nuevaFila.insertCell();
            celda.innerHTML = dato;
        });
    });

    // Asegúrate de que la tabla de clasificación esté visible
    tablaClasificaciones.style.visibility = 'visible';
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarTablas();
    startDigitalClock();
});
