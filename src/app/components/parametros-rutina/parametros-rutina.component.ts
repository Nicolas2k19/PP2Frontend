import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-parametros-rutina',
  templateUrl: './parametros-rutina.component.html',
  styleUrls: ["../styles/stylesGlobales.css",'./parametros-rutina.component.css']
})
export class ParametrosRutinaComponent implements OnInit {

  datosCsv : string [][]
  distancia : number
  epochs : number
  inputlength : number
  units: number;
  batch: number;

  constructor(){
    this.datosCsv = [[]]
  }

  ngOnInit(): void {
    const inputElement1 : HTMLInputElement= document.querySelector('#distancia-permitida');
    const inputValue1 = inputElement1.value;
    this.distancia = Number.parseInt(inputValue1)
    //cantidad-epochs
    const inputElement2 : HTMLInputElement= document.querySelector('#cantidad-epochs');
    const inputValue2 = inputElement2.value;
    this.epochs = Number.parseInt(inputValue2)

    const inputElement3 : HTMLInputElement= document.querySelector('#cantidad-inputs');
    const inputValue3 = inputElement3.value;
    this.inputlength = Number.parseInt(inputValue3)

    //cantidad-nunits
    const inputElement4 : HTMLInputElement= document.querySelector('#cantidad-nunits');
    const inputValue4 = inputElement4.value;
    this.units = Number.parseInt(inputValue4)

    //batch
     //cantidad-nunits
     const inputElement5 : HTMLInputElement= document.querySelector('#cantidad-batch');
     const inputValue5 = inputElement5.value;
     this.batch = Number.parseInt(inputValue5)


    console.log(this.distancia)
    
  }


  

   readFile(e){
    let reader = new FileReader();
    let file = (e.target.files[0])
    let thisContext = this
    reader.onload = function(e)  {
      let lines = thisContext.parseCSV(e.target.result);
      thisContext.datosCsv = (lines.slice(1))
    };

    reader.readAsBinaryString(file);
  }

  parseCSV(text) {
    // Obtenemos las lineas del texto
    let lines = text.replace(/\r/g, '').split('\n');
    return lines.map(line => {
      // Por cada linea obtenemos los valores
      let values = line.split(',');
      return values;
    });
  }


  }



  

