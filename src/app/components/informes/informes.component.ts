
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




  informes = [
    { tipo: 'Informe de Restricciones' },
    { tipo: 'Informe de Usuarios' },
    { tipo: 'Informe de Incidencias' },
  ];
  tipo: string;

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
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getRestricciones();
    this.getUsuarios();
    this.getIncidencias();
    this.getPruebas();
  }

  getIncidencias() {

    //Tengo que hacer la llamada al back para traer todas

  }

  getPruebas() {

    //Tengo que hacer la llamada al back para traer todas

  }

  getUsuarios() {
    this.spinner.show();
    this.usuarioService.getUsuarios()
      .subscribe(user => {
        this.spinner.hide();
        this.usuarios = user as Usuario[];
        console.log(user);
      })

  }

  getRestricciones() {
    this.spinner.show();
    this.restriccionService.getRestricciones()
      .subscribe(res => {
        this.spinner.hide();
        this.restricciones = res as RestriccionDTO[];
        console.log(res);
        this.addInformeRestricciones();
      })
  }

  addInformeRestricciones() {
    this.restricciones.forEach(restriccion => {
      this.informes.push({ tipo: `Informe de Restricción ${restriccion.restriccion.idRestriccion}` });
    });
    console.log(this.informes);
  }




  //Generación de reportes


  generarReportes(tipoTraido: string) {
    console.log(`Generando e imprimiendo el ${tipoTraido}`);

    const restriccionPattern = /^Informe de Restricción (\d+)$/;
    const match = tipoTraido.match(restriccionPattern);

    if (match) {
      const restriccionId = parseInt(match[1], 10);
      const restriccion = this.restricciones.find(r => r.restriccion.idRestriccion === restriccionId);

      if (restriccion) {
        this.generarInformeRestriccion(
          tipoTraido,
          ['ID', 'Victimario', 'Victimario DNI', 'Damnificada', 'Damnificada DNI', 'Fecha Sentencia', 'Distancia'],
          [{
            ID: restriccion.restriccion.idRestriccion,
            'Victimario': `${restriccion.victimario.nombre} ${restriccion.victimario.apellido}`,
            'Victimario DNI': restriccion.victimario.dni,
            'Damnificada': `${restriccion.damnificada.nombre} ${restriccion.damnificada.apellido}`,
            'Damnificada DNI': restriccion.damnificada.dni,
            'Fecha Sentencia': restriccion.restriccion.fechaSentencia,
            'Distancia': restriccion.restriccion.distancia
          }],
          this.pruebas.filter(p => p.idRestriccion === restriccionId),
          this.incidencias.filter(i => i.idRestriccion === restriccionId)
        );
      }else{
        console.error("No se encontro la restriccion con ID ${restriccionId");
      }
      } else {
        console.log("entre al else antes del switch")

        switch (tipoTraido) {
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
              })), this.restricciones
            );
            break;
          case 'Informe de Usuarios':
            this.generarInformeUser('Informe de Usuarios', ['ID', 'Email', 'Rol', 'IdGrupo'], this.usuarios.map(u => ({
              ID: u.idUsuario,
              'Email': u.email,
              'Rol': u.rolDeUsuario,
              'IdGrupo': u.idGrupo
            })), this.usuarios
            );
            break;
          case 'Informe de restricción':
          default:
            console.log('Tipo de informe no soportado');
        }
      }
    }
  





  generarInformeRestriccion(tipoTraido: string, arg1: string[], arg2: { ID: number; Victimario: string; 'Victimario DNI': string; Damnificada: string; 'Damnificada DNI': string; 'Fecha Sentencia': Date; Distancia: number; }[], arg3: PruebaDeVida[], arg4: Incidencia[]) {
    
    throw new Error('Method not implemented.');
  }





  //Que reportes va a haber? 

  //Reporte de una restricción especifica: cant de incidencias y tipo, canti de pruebas de vida(fallidas y no), 


  //Reporte de incidencias: graficos de cant de cada tipo de incidencias, cant de incidencias por cada restriccion


  //Basico solo con tablas 

  generarInforme(titulo, columnas, datos, lista) {
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
          </script>
        </body>
      </html>
    `);
    popupWin!.document.close();
  }


  //Reporte de usuarios: graficos de cant de cada tipo de usuario y Cant de cada usuario x grupo


  generarInformeUser(titulo, columnas, datos, lista) {

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
          <button id="printButton" onclick="printPage()">Imprimir</button>
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
              }, 1000); // Ajusta el tiempo según sea necesario
            }
          </script>
        </body>
      </html>
    `);
    popupWin!.document.close();
  }



}




