
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Incidencia } from 'src/app/models/incidencia';
import { PruebaDeVida } from 'src/app/models/prueba-de-vida';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { Usuario } from 'src/app/models/usuario';
import { IncidenciaService } from 'src/app/services/incidencias/incidencia.service';
import { UsuarioService } from 'src/app/services/login/usuario.service';
import { PruebaDeVidaService } from 'src/app/services/pruebaDeVida/prueba-de-vida.service';
import { RestriccionService } from 'src/app/services/restricciones/restriccion.service';
import Chart from 'chart.js/auto';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/personas/persona.service';


@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})

export class InformesComponent implements OnInit {

  restricciones: RestriccionDTO[] = [];
  usuarios: Usuario[] = [];
  incidencias: Incidencia[] = [];
  pruebas: PruebaDeVida[] = [];
  personas1: Persona[] = [];

  informes = [
    { tipo: 'Informe de Restricciones' },
    { tipo: 'Informe de Usuarios' },
    { tipo: 'Informe de Incidencias' },
    { tipo: 'Informe de Pruebas de Vida' },
    { tipo: 'Informe de Personas' },
    { tipo: 'Informe de Infracciones de Restricciones' }
  ];
  tipo: string;
  ordenAscendente = true;

  //Config graficos

  usersChart: Chart;
  

  @ViewChild('usersChartCanvas', { static: false }) usersChartCanvas: ElementRef;


  chartOptions = {
    responsive: true
  };

  chartLabels: string[] = [];
  chartData: any[] = [];
  chartType: string = '';
  chartTitle: string = '';


  constructor(
    private restriccionService: RestriccionService,
    private usuarioService: UsuarioService,
    private incidenciaService: IncidenciaService,
    private pruebaService: PruebaDeVidaService,
    private personaService: PersonaService,
    private spinner: NgxSpinnerService
  ) { 

    
  }

  ngOnInit(): void {
    this.getRestricciones();
    this.getUsuarios();
    this.getIncidencias();
    this.getPruebas();
    this.getPersonas();
  }

  getIncidencias() {
    this.spinner.show();
    this.incidenciaService.getIncidencias()
      .subscribe(res => {
        this.spinner.hide();
        this.incidencias = res as Incidencia[];
      })

  }

  getPruebas() {
    this.spinner.show();
    this.pruebaService.getPruebasDeVida()
      .subscribe(res => {
        this.spinner.hide();
        this.pruebas = res as PruebaDeVida[];
      })
  }

  getUsuarios() {
    this.spinner.show();
    this.usuarioService.getUsuarios()
      .subscribe(user => {
        this.spinner.hide();
        this.usuarios = user as Usuario[];

      })

  }

  getPersonas() {
    this.spinner.show();
    this.personaService.getPersonas()
      .subscribe(res => {
        this.spinner.hide();
        this.personas1 = res as Persona[];
      })
  }

  getRestricciones() {
    this.spinner.show();
    this.restriccionService.getRestricciones()
      .subscribe(res => {
        this.spinner.hide();
        this.restricciones = res as RestriccionDTO[];
        this.addInformeRestricciones();
      })
  }

  addInformeRestricciones() {
    this.restricciones.forEach(restriccion => {
      this.informes.push({ tipo: `Informe de Restricción ${restriccion.restriccion.idRestriccion}` });
    });
  }



  //Generación de reportes


  //Reporte de incidencias: graficos de cant de cada tipo de incidencias, cant de incidencias por cada restriccion


  generarReportes(tipoTraido: string, imprimir : boolean) {
    const restriccionPattern = /^Informe de Restricción (\d+)$/;
    const match = tipoTraido.match(restriccionPattern);

    if (match) {
      const restriccionId = parseInt(match[1], 10);
      const restriccion = this.restricciones.find(r => r.restriccion.idRestriccion === restriccionId);

      if (restriccion) {
        this.generarInformeRestriccion(
          tipoTraido,
          ['ID', 'Victimario', 'Victimario DNI', 'Damnificada', 'Damnificada DNI', 'Fecha Sentencia', 'Distancia', 'Responsable'],
          [{
            ID: restriccion.restriccion.idRestriccion,
            'Victimario': `${restriccion.victimario.nombre} ${restriccion.victimario.apellido}`,
            'Victimario DNI': restriccion.victimario.dni,
            'Damnificada': `${restriccion.damnificada.nombre} ${restriccion.damnificada.apellido}`,
            'Damnificada DNI': restriccion.damnificada.dni,
            'Fecha Sentencia': restriccion.restriccion.fechaSentencia,
            'Distancia': restriccion.restriccion.distancia,
            'Responsable': restriccion.administrativo.email
          }],
          this.pruebas.filter(p => p.idRestriccion === restriccionId),
          this.incidencias.filter(i => i.idRestriccion === restriccionId),imprimir
        );
      } else {

      }
    } else {

      switch (tipoTraido) {
        case 'Informe de Infracciones de Restricciones':
          const titulo = 'Informe de Infracciones de Restricciones';
          const columnas = ['ID', 'Victimario', 'Victimario DNI', 'Damnificada', 'Damnificada DNI', 'Fecha Sentencia', 'Distancia', 'Responsable'];
          const datos = this.restricciones.map(r => ({
            ID: r.restriccion.idRestriccion,
            'Victimario': `${r.victimario.nombre} ${r.victimario.apellido}`,
            'Victimario DNI': r.victimario.dni,
            'Damnificada': `${r.damnificada.nombre} ${r.damnificada.apellido}`,
            'Damnificada DNI': r.damnificada.dni,
            'Fecha Sentencia': r.restriccion.fechaSentencia,
            'Distancia': r.restriccion.distancia
          }))
          const incidencias = this.incidencias;

          this.generarInformeInfraccionRestricciones(titulo, columnas, datos, incidencias,imprimir);
          break;
        case 'Informe de Personas':
          this.generarInforme(
            'Informe de Personas',
            ['ID', 'Nombre', 'Apellido', 'DNI', 'Telefono', 'Fecha Nacimiento'],
            this.personas1.map(item => ({
              ID: item.idPersona,
              Nombre: item.nombre,
              Apellido: item.apellido,
              DNI: item.dni,
              Telefono: item.telefono,
              'Fecha Nacimiento': item.fechaNacimiento, 
            })), this.personas1,imprimir
          );
          break;

        case 'Informe de Restricciones':
          this.generarInforme(
            'Informe de Restricciones',
            ['ID', 'Victimario', 'Victimario DNI', 'Damnificada', 'Damnificada DNI', 'Fecha Sentencia', 'Distancia'],
            this.restricciones.map(r => ({
              ID: r.restriccion.idRestriccion,
              'Victimario': `${r.victimario.nombre} ${r.victimario.apellido}`,
              'Victimario DNI': r.victimario.dni,
              'Damnificada': `${r.damnificada.nombre} ${r.damnificada.apellido}`,
              'Damnificada DNI': r.damnificada.dni,
              'Fecha Sentencia': r.restriccion.fechaSentencia,
              'Distancia': r.restriccion.distancia
            })), this.restricciones, imprimir
          );
          break;
        case 'Informe de Usuarios':
          this.generarInformeUser('Informe de Usuarios', ['ID', 'Email', 'Rol', 'IdGrupo'], this.usuarios.map(u => ({
            ID: u.idUsuario,
            'Email': u.email,
            'Rol': u.rolDeUsuario,
            'IdGrupo': u.idGrupo
          })), this.usuarios, imprimir
          );
          break;
        case 'Informe de Incidencias':
          this.generarInformeIncidencias(
            'Informe de Incidencias',
            ['ID', 'IDRestriccion', 'Fecha', 'Descripcion', 'Topico', 'Peligrosidad'],
            this.incidencias.map(r => ({
              ID: r.idIncidencia,
              'IDRestriccion': r.idRestriccion,
              'Fecha': r.fecha,
              'Descripcion': r.descripcion,
              'Topico': r.topico,
              'Peligrosidad': r.peligrosidad
            })), this.incidencias, imprimir
          );
          break;
        case 'Informe de Pruebas de Vida':
          this.generarInformePrueba(
            'Informe de Pruebas de Vida',
            ['ID', 'IDRestriccion', 'Fecha', 'Descripcion', 'Estado', 'IDPersona', 'Accion'],
            this.pruebas.map(r => ({
              ID: r.idPruebaDeVida,
              'IDRestriccion': r.idRestriccion,
              'Fecha': r.fecha,
              'Descripcion': r.descripcion,
              'Estado': r.estado,
              'IDPersona': r.idPersonaRestriccion,
              'Accion': r.accion

            })), this.pruebas, imprimir
          );
          break;
        default:
          console.log('Tipo de informe no soportado');
      }
    }
  }


  // Reporte de una restriccion particular, grafico de incidencias por tipo y estado de pruebas de vida. 


  generarInformeRestriccion(
    tipoTraido: string,
    arg1: string[],
    arg2: { ID: number; Victimario: string; 'Victimario DNI': string; Damnificada: string; 'Damnificada DNI': string; 'Fecha Sentencia': Date; Distancia: number; 'Responsable': string }[],
    arg3: PruebaDeVida[],
    arg4: Incidencia[], imprimir: boolean
  ) {
    // Crear una nueva ventana emergente para el informe
    let popupWin = window.open('', '_blank', 'width=800, height=600');
    popupWin!.document.open();
    popupWin!.document.write(`
        <html>
        <button id="printButton" onclick="printPage()">Imprimir</button>
          <head>
            <title>${tipoTraido}</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>
            <style>
              table {
                width: 100%;
                border-collapse: collapse;
              }
              table, th, td {
                border: 1px solid black;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
              canvas {
                margin-top: 20px;
              }
              #printButton {
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <h1>${tipoTraido}</h1>
            <table id="infoTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Victimario</th>
                  <th>Victimario DNI</th>
                  <th>Damnificada</th>
                  <th>Damnificada DNI</th>
                  <th>Fecha Sentencia</th>
                  <th>Distancia</th>
                  <th>Responsable</th>
                </tr>
              </thead>
              <tbody>
                ${arg2.map(item => `
                  <tr>
                    <td>${item.ID}</td>
                    <td>${item.Victimario}</td>
                    <td>${item['Victimario DNI']}</td>
                    <td>${item.Damnificada}</td>
                    <td>${item['Damnificada DNI']}</td>
                    <td>${item['Fecha Sentencia']}</td>
                    <td>${item.Distancia}</td>
                    <td>${item.Responsable}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <canvas id="incidenciaChart"></canvas>
            <canvas id="pruebaDeVidaChart"></canvas>
            <script>
          function printPage() {
            var printButton = document.getElementById('printButton');
            printButton.style.display = 'none';
            window.print();
            setTimeout(function() {
              printButton.style.display = 'block';
            }, 800); // Ajusta el tiempo según sea necesario
          }
          ${imprimir ? 'setTimeout(printPage, 300);' : ''}
    
              // Agrupar incidencias por tipo
          const incidenciaTipos = ${JSON.stringify(arg4.map(incidencia => incidencia.topico))};
          const incidenciaTipoCount = incidenciaTipos.reduce((acc, tipo) => {
            acc[tipo] = (acc[tipo] || 0) + 1;
            return acc;
          }, {});

          // Crear gráfico de torta para incidencias por tipo
          const incidenciaChartCtx = document.getElementById('incidenciaChart').getContext('2d');
          new Chart(incidenciaChartCtx, {
            type: 'pie',
            data: {
              labels: Object.keys(incidenciaTipoCount),
              datasets: [{
                label: 'Incidencias por Tipo',
                data: Object.values(incidenciaTipoCount),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }]
            },
            options: {
              resposive: true,
              title: {
                display: true,
                text: 'Gráfico de torta de incidencias por tipo'
              }
            }
          });
    
          // Agrupar pruebas de vida por estado
          const pruebaDeVidaEstados = ${JSON.stringify(arg3.map(prueba => prueba.estado))};
          const pruebaDeVidaEstadoCount = pruebaDeVidaEstados.reduce((acc, estado) => {
            acc[estado] = (acc[estado] || 0) + 1;
            return acc;
          }, {});

          // Crear gráfico de torta para pruebas de vida por estado
          const pruebaDeVidaChartCtx = document.getElementById('pruebaDeVidaChart').getContext('2d');
          new Chart(pruebaDeVidaChartCtx, {
            type: 'pie',
            data: {
              labels: Object.keys(pruebaDeVidaEstadoCount),
              datasets: [{
                label: 'Pruebas de Vida por Estado',
                data: Object.values(pruebaDeVidaEstadoCount),
                backgroundColor: [
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
              }]
            },
            options: {
              resposive: true,
              title: {
                display: true,
                text: 'Gráfico de torta de estado de pruebas de vida'
              }
            }
          });
        </script>
      </body>
    </html>
      `);
    popupWin!.document.close();
  }


  //Basico solo con tablas 

  generarInforme(titulo, columnas, datos, lista,imprimir) {

    let popupWin = window.open('', '_blank', 'width=800, height=600');
  popupWin!.document.open();
  popupWin!.document.write(`
    <html>
      <button id="printButton" onclick="printPage()">Imprimir</button>
      <head>
        <title>${titulo}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid black;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          canvas {
            margin-top: 20px;
          }
          #printButton {
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <table>
          <tr>
            ${columnas.map(col => `<th>${col}</th>`).join('')}
          </tr>
          ${datos.map(d => `
            <tr>
              ${columnas.map(col => `<td>${d[col]}</td>`).join('')}
            </tr>
          `).join('')}
        </table>
        <script>
          function printPage() {
            var printButton = document.getElementById('printButton');
            printButton.style.display = 'none';
            window.print();
            setTimeout(function() {
              printButton.style.display = 'block';
            }, 800); // Ajusta el tiempo según sea necesario
          }
          ${imprimir ? 'setTimeout(printPage, 300);' : ''}
        </script>
      </body>
    </html>
  `);
  popupWin!.document.close();
  }


  //Reporte de usuarios: graficos de cant de cada tipo de usuario y Cant de cada usuario x grupo


  generarInformeUser(titulo, columnas, datos, lista,imprimir) {
    console.log("Entre a generar informe usuario")
    // Calcular la cantidad de usuarios por rol
    const roles = {};
    datos.forEach(d => {
      if (d.Rol in roles) {
        roles[d.Rol]++;
      } else {
        roles[d.Rol] = 1;
      }
    });
    //Calcular la cantidad de usuarios x grupo
    const grupos = {};
    datos.forEach(d => {
      if (d.IdGrupo in grupos) {
        grupos[d.IdGrupo]++;
      } else {
        grupos[d.IdGrupo] = 1;
      }
    });
    // Crear etiquetas y datos para el gráfico
    const labels = Object.keys(roles);
    const data = labels.map(label => roles[label]);

    const labels2 = Object.keys(grupos).map(key => `Cant de usuarios en Grupo #${key}`);
    const data2 = Object.values(grupos);

    let popupWin = window.open('', '_blank', 'width=800, height=600');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
      <button id="printButton" onclick="printPage()">Imprimir</button>
        <head>
          <title>${titulo}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            canvas {
              margin-top: 20px;
            }
            #printButton {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>${titulo}</h1>
          <table>
            <tr>
              ${columnas.map(col => `<th>${col}</th>`).join('')}
            </tr>
            ${datos.map(d => `
              <tr>
                ${columnas.map(col => `<td>${d[col]}</td>`).join('')}
              </tr>
            `).join('')}
          </table>
          <canvas id="usersChart"></canvas>
          <canvas id="usersChart2"></canvas>
          
          <script>
            var ctx = document.getElementById('usersChart').getContext('2d');
            var usersChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ${JSON.stringify(labels)},
                datasets: [{
                  label: 'Cantidad de Usuarios por Rol',
                  data: ${JSON.stringify(data)},
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }, 
                title: {
                  display: true,
                  text: 'Gráfico de barras de cantidad de usuarios por cada rol'
                }
              }
            });


            var ctx = document.getElementById('usersChart2').getContext('2d');
            var usersChart2 = new Chart(ctx, {
              type: 'pie',
              data: {
                labels: ${JSON.stringify(labels2)},
                datasets: [{
                  label: 'Cantidad de Usuarios por Grupo',
                  data: ${JSON.stringify(data2)},
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
            },
            options: {
              resposive: true,
              title: {
                display: true,
                text: 'Gráfico de torta de cantidad de usuarios por cada grupo'
              }
            }
          });
  
            function printPage() {
            var printButton = document.getElementById('printButton');
            printButton.style.display = 'none';
            window.print();
            setTimeout(function() {
              printButton.style.display = 'block';
            }, 800); // Ajusta el tiempo según sea necesario
          }
          ${imprimir ? 'setTimeout(printPage, 300);' : ''}
          </script>
        </body>
      </html>
    `);
    popupWin!.document.close();
  }


  //Reporte de incidencias ; grafico de cantidad por restriccion, grafico por topico y grafico por peligrosidad


  generarInformeIncidencias(titulo, columnas, datos, lista,imprimir) {

    // Agrupar datos por restriccion, topico y peligrosidad
    const groupBy = (key) => {
      return lista.reduce((acc, obj) => {
        const prop = obj[key];
        if (!acc[prop]) {
          acc[prop] = 0;
        }
        acc[prop]++;
        return acc;
      }, {});
    };

    const incidenciasPorRestriccion = groupBy('idRestriccion');
    const incidenciasPorTopico = groupBy('topico');
    const incidenciasPorPeligrosidad = groupBy('peligrosidad');

    // Crear arrays para Chart.js
    const labelsRestriccion = Object.keys(incidenciasPorRestriccion);
    const dataRestriccion = Object.values(incidenciasPorRestriccion);

    const labelsTopico = Object.keys(incidenciasPorTopico);
    const dataTopico = Object.values(incidenciasPorTopico);

    const labelsPeligrosidad = Object.keys(incidenciasPorPeligrosidad);
    const dataPeligrosidad = Object.values(incidenciasPorPeligrosidad);

    let popupWin = window.open('', '_blank', 'width=800, height=600');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
      <button id="printButton" onclick="printPage()">Imprimir</button>
        <head>
          <title>${titulo}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            canvas {
              margin-top: 20px;
            }
            #printButton {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>${titulo}</h1>
          <table>
            <tr>
              ${columnas.map(col => `<th>${col}</th>`).join('')}
            </tr>
            ${datos.map(d => `
              <tr>
                ${columnas.map(col => `<td>${d[col]}</td>`).join('')}
              </tr>
            `).join('')}
          </table>

          <canvas id="chartRestriccion"></canvas>
          <canvas id="chartTopico"></canvas>
          <canvas id="chartPeligrosidad"></canvas>

          <script>
              function printPage() {
            var printButton = document.getElementById('printButton');
            printButton.style.display = 'none';
            window.print();
            setTimeout(function() {
              printButton.style.display = 'block';
            }, 800); // Ajusta el tiempo según sea necesario
          }
          ${imprimir ? 'setTimeout(printPage, 300);' : ''}

            // Crear gráficos
            function crearGrafico(id, labels, data, label) {
              var ctx = document.getElementById(id).getContext('2d');
              new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: labels,
                  datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                  }]
                },
                options: {
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: true
                      }
                    }]
                  }
                }
              });
            }

            // Crear gráficos con los datos agrupados
            crearGrafico('chartRestriccion', ${JSON.stringify(labelsRestriccion)}, ${JSON.stringify(dataRestriccion)}, 'Incidencias por Restricción');
            crearGrafico('chartTopico', ${JSON.stringify(labelsTopico)}, ${JSON.stringify(dataTopico)}, 'Incidencias por Tópico');
            crearGrafico('chartPeligrosidad', ${JSON.stringify(labelsPeligrosidad)}, ${JSON.stringify(dataPeligrosidad)}, 'Incidencias por Peligrosidad');
          </script>
        </body>
      </html>
    `);
    popupWin!.document.close();
  }


  //Reporte de pruebas de vida: grafico por restriccion y grafico por estado.

  generarInformePrueba(titulo, columnas, datos, lista,imprimir) {

    // Agrupar datos por restriccion y estado
    const groupBy = (key) => {
      return lista.reduce((acc, obj) => {
        const prop = obj[key];
        if (!acc[prop]) {
          acc[prop] = 0;
        }
        acc[prop]++;
        return acc;
      }, {});
    };

    const pruebasPorRestriccion = groupBy('idRestriccion');
    const pruebasPorEstado = groupBy('estado');

    // Crear arrays para Chart.js
    const labelsRestriccion = Object.keys(pruebasPorRestriccion);
    const dataRestriccion = Object.values(pruebasPorRestriccion);

    const labelsEstado = Object.keys(pruebasPorEstado);
    const dataEstado = Object.values(pruebasPorEstado);

    let popupWin = window.open('', '_blank', 'width=800, height=600');
    popupWin!.document.open();
    popupWin!.document.write(`
    <html>
    <button id="printButton" onclick="printPage()">Imprimir</button>
      <head>
        <title>${titulo}</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid black;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          canvas {
            margin-top: 20px;
          }
          #printButton {
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <h1>${titulo}</h1>
        <table>
          <tr>
            ${columnas.map(col => `<th>${col}</th>`).join('')}
          </tr>
          ${datos.map(d => `
            <tr>
              ${columnas.map(col => `<td>${d[col]}</td>`).join('')}
            </tr>
          `).join('')}
        </table>

        <canvas id="chartRestriccion"></canvas>
        <canvas id="chartEstado"></canvas>

        <script>
          function printPage() {
            var printButton = document.getElementById('printButton');
            printButton.style.display = 'none';
            window.print();
            setTimeout(function() {
              printButton.style.display = 'block';
            }, 800); // Ajusta el tiempo según sea necesario
          }
          ${imprimir ? 'setTimeout(printPage, 300);' : ''}

          // Crear gráficos
          function crearGrafico(id, labels, data, label) {
            var ctx = document.getElementById(id).getContext('2d');
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [{
                  label: label,
                  data: data,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }
            });
          }

          // Crear gráficos con los datos agrupados
          crearGrafico('chartRestriccion', ${JSON.stringify(labelsRestriccion)}, ${JSON.stringify(dataRestriccion)}, 'Pruebas de Vida por Restricción');
          crearGrafico('chartEstado', ${JSON.stringify(labelsEstado)}, ${JSON.stringify(dataEstado)}, 'Pruebas de Vida por Estado');
        </script>
      </body>
    </html>
  `);
    popupWin!.document.close();
  }


  //REPORTE DE RESTRICCIONES X TIPO DE INCIDENCIA (1ERO POR INFRACCION )

  generarInformeInfraccionRestricciones(titulo: string, columnas: string[], datos: any[], incidencias: any[],imprimir:boolean) {
    // Filtrar las restricciones que tuvieron una incidencia del tipo "InfraccionDeRestriccion"
    const restriccionesConInfraccion = incidencias.filter(incidencia => incidencia.topico === 'InfraccionDeRestriccion');

    // Obtener IDs únicos de las restricciones con infracción
    const restriccionesConInfraccionIDs = [...new Set(restriccionesConInfraccion.map(incidencia => incidencia.idRestriccion))];

    // Filtrar los datos para obtener solo las restricciones con infracción
    const datosFiltrados = datos.filter(dato => restriccionesConInfraccionIDs.includes(dato.ID));


    // Contar total de restricciones y total de restricciones con infracción
    const totalRestricciones = datos.length;
    const totalRestriccionesConInfraccion = datosFiltrados.length;

    // Crear datos para el gráfico
    const labels = ['Total de Restricciones', 'Restricciones con Infracción'];
    const data = [totalRestricciones, totalRestriccionesConInfraccion];

    let popupWin = window.open('', '_blank', 'width=800, height=600');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
      <button id="printButton" onclick="printPage()">Imprimir</button>
        <head>
          <title>${titulo}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.3/Chart.min.js"></script>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
            canvas {
              margin-top: 20px;
            }
            #printButton {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>${titulo}</h1>
          <table>
            <tr>
              ${columnas.map(col => `<th>${col}</th>`).join('')}
            </tr>
            ${datosFiltrados.map(d => `
              <tr>
                ${columnas.map(col => `<td>${d[col]}</td>`).join('')}
              </tr>
            `).join('')}
          </table>
          <canvas id="chartRestricciones"></canvas>
          <script>
            function printPage() {
            var printButton = document.getElementById('printButton');
            printButton.style.display = 'none';
            window.print();
            setTimeout(function() {
              printButton.style.display = 'block';
            }, 800); // Ajusta el tiempo según sea necesario
          }
          ${imprimir ? 'setTimeout(printPage, 300);' : ''}
  
            // Crear gráfico
            var ctx = document.getElementById('chartRestricciones').getContext('2d');
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ${JSON.stringify(labels)},
                datasets: [{
                  label: 'Cantidad de Restricciones',
                  data: ${JSON.stringify(data)},
                  backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                  ],
                  borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                },
                title: {
                  display: true,
                  text: 'Comparación de Restricciones'
                }
              }
            });
          </script>
        </body>
      </html>
    `);
    popupWin!.document.close();
  }




  //Generacion de reporte para imprimir



  //ACCIONES FRONT


  imprimir(tipoTraido : string){
    this.generarReportes(tipoTraido,true);
  
  }






  vistaprevia(tipoTraido: string){

    this.generarReportes(tipoTraido,false);

  }


  ordenamiento() {
    if (this.ordenAscendente) {
      // Orden ascendente por tipo
      this.informes.sort((a, b) => {
        if (a.tipo < b.tipo) return -1;
        if (a.tipo > b.tipo) return 1;
        return 0;
      });
      console.log("Informes ordenados ascendentemente:");
      console.log(this.informes);
    } else {
      // Orden descendente por tipo
      this.informes.sort((a, b) => {
        if (a.tipo > b.tipo) return -1;
        if (a.tipo < b.tipo) return 1;
        return 0;
      });
      console.log("Informes ordenados descendentemente:");
      console.log(this.informes);
    }
  
    // Cambia el estado de ordenamiento para el próximo clic
    this.ordenAscendente = !this.ordenAscendente;
  }

}