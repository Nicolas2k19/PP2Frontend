import { Component, OnInit } from '@angular/core';
import { RestriccionService } from '../../services/restricciones/restriccion.service';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { Icon, Style, Stroke, Fill } from 'ol/style';
import { Circle } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
import { UbicacionService } from 'src/app/services/ubicaciones/ubicacion.service';
import { Ubicacion } from 'src/app/models/ubicacion';
import { UbicacionDto } from 'src/app/models/ubicacion-dto';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioService } from 'src/app/services/login/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { MapService } from '../../services/mapa/mapa.service';
import RestriccionFisica from 'src/app/models/RestriccionFisica/RestriccionFisica';

@Component({
  selector: 'app-restricciones',
  templateUrl: './restricciones.component.html',
  styleUrls: ['./restricciones.component.css'],
  providers: [RestriccionService]
})
export class RestriccionesComponent implements OnInit {

  //UBICACIONES UTILIZADAS PARA MOSTRAR EN EL MAPA
  restriccionesFisicas : RestriccionFisica[]
  ubicacionVictimario: Ubicacion;
  ubicacionDamnificada: Ubicacion;
  ubicacionDto: UbicacionDto;
  intervalo;

  constructor(public restriccionService: RestriccionService, private comunicacion: ComunicacionService,
    private ubicacionService: UbicacionService, private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService,private mapService: MapService) { }

  ngOnInit() {
    this.mapService.iniciarMapa('map');
    this.getRestricciones(localStorage.getItem("emailUsuario"));
    this.getUsuarioByEmail(localStorage.getItem("emailUsuario"));
    
  }


  /**
   * Trae las restricciones físicas disponibles
   * @author Nicolás
   */
  getRestriccionesFisicas(id : number){
    this.restriccionService.getRestriccionesFisicasPorId(id)
    .subscribe(res =>{
        this.restriccionesFisicas=res as RestriccionFisica[]
        this.mostrarRestriccion();
    })
  }


  getRestricciones(email: string) {
    this.spinnerService.show();
    this.restriccionService.getRestriccionesAdministrativo(email)
      .subscribe(res => {
        this.spinnerService.hide();
        this.restriccionService.restricciones = res as RestriccionDTO[];
      })
  }

  seleccionarRestriccion(restriccion: RestriccionDTO,fila) {
    this.desmarcarCeldas();
    console.log(fila)
    console.log(document.querySelectorAll("tr"))
    if(fila==null){
      document.querySelectorAll("tr")[1].style.backgroundColor = "#b780ff"
    }
    else{
      fila.style.backgroundColor = "#b780ff"
      fila.style.color = "white";
    }

    this.getRestriccionesFisicas(restriccion.restriccion.idRestriccion);
    this.comunicacion.enviarRestriccion(restriccion);
    
    let thisjr = this;
    //CADA 15 SEGUNDOS ACTUALIZO EL MAPA
    clearInterval(this.intervalo);
    this.intervalo = setInterval(function () {
      thisjr.mostrarRestriccion();
    }, 15000);
  }


  desmarcarCeldas(){
    document.querySelectorAll("tr").forEach(fila =>{
      fila.style.backgroundColor = "inherit"
      fila.style.color = "white";
    })
  }

  /**
   * Marca en color violeta claro la restricción vigilada
   * @author nicolás
   */
  marcarRestriccion(){
   // document.querySelector()
  }

  getUsuarioByEmail(mail: string){
    this.usuarioService.getUsuarioByEmail(mail)
    .subscribe(res => {
      this.comunicacion.enviarUsuario(res as Usuario);
      console.log(this.comunicacion.administrativo.email);
      this.seleccionarRestriccion(this.restriccionService.restricciones[0],null);
    })
  }

  

  mostrarRestriccion() {
    var markerVictimario: Feature;
    var markerDamnificada: Feature;
    var perimetro: Feature;

    //GET UBICACIONES Y SET the this.ubicaciones
    this.ubicacionService.getUbicacionesRestriccion(this.comunicacion.restriccionDTO.restriccion.idRestriccion)
      .subscribe(res => {

        this.ubicacionDto = res as UbicacionDto;
        this.ubicacionDamnificada = this.ubicacionDto.ubicacionDamnificada;
        this.ubicacionVictimario = this.ubicacionDto.ubicacionVictimario;


        //Marco Ubicaciones en Mapa
        //Marco Victimario con su marker La longitud y latitud es de objeto Ubicacion
        markerVictimario = new Feature({
          geometry: new Point(fromLonLat([this.ubicacionVictimario.longitud, this.ubicacionVictimario.latitud]))
        });
        markerVictimario.setStyle(new Style({
          image: new Icon(({
            src: 'assets/markerVictimario.png',
            imgSize: [60, 60]
          }))
        }));

        //Marco Damnificada con su marker La longitud y latitud es de objeto Ubicacion
        markerDamnificada = new Feature({
          geometry: new Point(fromLonLat([this.ubicacionDamnificada.longitud, this.ubicacionDamnificada.latitud]))
        });
        markerDamnificada.setStyle(new Style({
          image: new Icon(({
            src: 'assets/markerDamnificada.png',
            imgSize: [60, 60]
          }))
        }));

        //Dibujo Circulo y le aplico un estilo 
        perimetro = new Feature();
        var forma = new Circle(fromLonLat([this.ubicacionDamnificada.longitud, this.ubicacionDamnificada.latitud]));
        forma.setRadius(this.comunicacion.restriccionDTO.restriccion.distancia);
        perimetro.setGeometry(forma);
        this.pintarPerimetro(perimetro);

        //Borro lo dibujado anteriormente en el mapa
        this.mapService.clearLayers();

        //Creo el vector y capa para mostrar las ubicaciones
        this.mapService.mostrarUbicaciones(markerVictimario, markerDamnificada, perimetro,this.pintarRestriccionFisica())

        //CENTRO EL MAPA EN LA UBICACION DE LA DAMNIFICADA Y AÑADO LA CAPA
        this.mapService.centrarMapa(this.ubicacionDamnificada.longitud, this.ubicacionDamnificada.latitud)

      });


  }

  pintarPerimetro(perimetro) {
    //Pinto el perimetro dependiendo si infringe o no
    var style = new Style({ fill: new Fill({}) });
    this.ubicacionService.getEstaInfringiendo(this.comunicacion.restriccionDTO.restriccion.idRestriccion, this.ubicacionDto)
      .subscribe(res => {
        var estaInfringiendo = res as boolean;
        if (estaInfringiendo)
          style.getFill().setColor([255, 0, 0, .4]);
        else
          style.getFill().setColor([0, 255, 0, .4]);

        perimetro.setStyle(style);
      });
    }

    /**
     * Pinta la restriccion fisica
     * @author Nicolás
     */
    pintarRestriccionFisica(){
      let markerRestriccionFisica: Feature;
      let perimetro: Feature;
      let markers  :Feature[] = []

      this.restriccionesFisicas.forEach(res => {

      markerRestriccionFisica = new Feature({
        geometry: new Point(fromLonLat([res.longuitud, res.latitud]))
      });

      markerRestriccionFisica.setStyle(new Style({
        image: new Icon(({
          src: 'assets/iconoRestriccionFisica.png',
          imgSize: [60, 60]
        }))
      }));


      perimetro = new Feature();
      let forma = new Circle(fromLonLat([res.longuitud, res.latitud]));
      forma.setRadius(res.distancia);
      perimetro.setGeometry(forma);
      this.pintarPerimetro(perimetro);
      markers.push(markerRestriccionFisica)
      markers.push(perimetro)
    })

      return markers;

    }


}
