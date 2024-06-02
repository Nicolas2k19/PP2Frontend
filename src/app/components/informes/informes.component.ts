
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

import { BaseChartDirective } from 'ng2-charts';

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
    { tipo: 'Informe de Incidencias' }
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
      })
  }

  //Generación de reportes


  generarReportes(tipoTraido: string) {
    console.log(`Generando e imprimiendo el ${tipoTraido}`);
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
        this.generarInforme('Informe de Usuarios', ['ID', 'Email', 'Rol', 'ID Grupo'], this.usuarios.map(u => ({
          ID: u.idUsuario,
          'Email': u.email,
          'Rol': u.rolDeUsuario,
          'ID Grupo': u.idUsuario
        })), this.usuarios
        ); 
      break;
      default:
        console.log('Tipo de informe no soportado');
    }
  }



  //Generación de cada reporte (VER SI SE PUEDE MEJORAR EL CODIGO)

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
          <canvas id="usersChart"></canvas>
          <script>
            var ctx = document.getElementById('usersChart').getContext('2d');
            var usersChart = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: ['Titulo'],
                datasets: [{
                  label: 'Cantidad de Usuarios',
                  data: [${lista.length}],
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgba(255, 99, 132, 1)',
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
  

}




