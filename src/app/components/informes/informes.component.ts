import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';

import { RestriccionService } from 'src/app/services/restricciones/restriccion.service';
@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent implements OnInit {

  restricciones: RestriccionDTO[] = [];
 

  constructor(
    private restriccionService: RestriccionService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getRestricciones();
  }

  getRestricciones() {
    this.spinner.show();
    this.restriccionService.getRestricciones()
      .subscribe(res => {
        this.spinner.hide();
        this.restriccionService.restricciones = res as RestriccionDTO[];
        this.restricciones= res as RestriccionDTO[];
        console.log(res);
      })
  }

  generarReporteRestricciones(): void {
    // Lógica para generar el reporte en HTML
    let popupWin = window.open('', '_blank', 'width=800, height=600');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Informe de Restricciones</title>
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
          </style>
        </head>
        <body onload="window.print()">
          <h1>Informe de Restricciones</h1>
          <table>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Fecha</th>
            </tr>
            ${this.restricciones.map(r => `
              <tr>
                <td>${r.restriccion.idRestriccion}</td>
                <td>${r.damnificada.nombre}</td>
                <td>${r.restriccion.fechaSentencia}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `);
    popupWin!.document.close();
  }



}





