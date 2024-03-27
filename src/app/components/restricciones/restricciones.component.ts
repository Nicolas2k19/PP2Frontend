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

@Component({
  selector: 'app-restricciones',
  templateUrl: './restricciones.component.html',
  styleUrls: ['./restricciones.component.css'],
  providers: [RestriccionService]
})
export class RestriccionesComponent implements OnInit {

  //VARIABLES PARA EL MAPA
  map: OlMap;
  mapSource: OlXYZ;
  capaMapa: OlTileLayer;
  vistaMapa: OlView;
  vectorUbicaciones: VectorSource;
  capaUbicaciones: VectorLayer;

  //UBICACIONES UTILIZADAS PARA MOSTRAR EN EL MAPA
  ubicacionVictimario: Ubicacion;
  ubicacionDamnificada: Ubicacion;
  ubicacionDto: UbicacionDto;
  intervalo;

  constructor(public restriccionService: RestriccionService, private comunicacion: ComunicacionService,
    private ubicacionService: UbicacionService, private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.getRestricciones(localStorage.getItem("emailUsuario"));
    this.getUsuarioByEmail(localStorage.getItem("emailUsuario"));
    this.iniciarMapa();
    console.log(this.comunicacion.administrativo.email);
  }

  getRestricciones(email: string) {
    this.spinnerService.show();
    this.restriccionService.getRestriccionesAdministrativo(email)
      .subscribe(res => {
        this.spinnerService.hide();
        this.restriccionService.restricciones = res as RestriccionDTO[];
        console.log(res);
      })
  }

  seleccionarRestriccion(restriccion: RestriccionDTO) {
    this.comunicacion.enviarRestriccion(restriccion);
    this.mostrarRestriccion();
    let thisjr = this;
    //CADA 15 SEGUNDOS ACTUALIZO EL MAPA
    clearInterval(this.intervalo);
    this.intervalo = setInterval(function () {
      thisjr.mostrarRestriccion();
    }, 15000);
  }

  getUsuarioByEmail(mail: string){
    this.usuarioService.getUsuarioByEmail(mail)
    .subscribe(res => {
      this.comunicacion.enviarUsuario(res as Usuario);
    })
  }

  iniciarMapa() {
    //Fuente del mapa,
    this.mapSource = new OlXYZ({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png'
    });

    //Capa para mostrar el mapa
    this.capaMapa = new OlTileLayer({
      source: this.mapSource
    });

    //Centro el mapa en la UNGS O en cualquier lado
    this.vistaMapa = new OlView({
      center: fromLonLat([-58.700233, -34.522249]),
      zoom: 17
    });

    //Creo el mapa con las capas y la vista
    this.map = new OlMap({
      target: 'map',
      layers: [this.capaMapa],
      view: this.vistaMapa
    });
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
        var layers = this.map.getLayers().getArray();
        for (var i = layers.length - 1; i >= 1; --i) {
          var layer = layers[i];
          this.map.removeLayer(layer);
        }

        //Creo el vector y capa para mostrar las ubicaciones
        this.vectorUbicaciones = new VectorSource({
          features: [markerVictimario, markerDamnificada, perimetro]
        });
        this.capaUbicaciones = new VectorLayer({
          source: this.vectorUbicaciones
        });

        //CENTRO EL MAPA EN LA UBICACION DE LA DAMNIFICADA Y AÑADO LA CAPA
        this.vistaMapa.setCenter(fromLonLat([this.ubicacionDamnificada.longitud, this.ubicacionDamnificada.latitud]));
        this.map.addLayer(this.capaUbicaciones);
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
}
