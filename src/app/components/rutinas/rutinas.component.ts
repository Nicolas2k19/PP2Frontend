import { Component, OnInit } from '@angular/core';
import { UbicacionService } from 'src/app/services/ubicaciones/ubicacion.service';
import { Ubicacion } from 'src/app/models/ubicacion';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
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
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Persona } from 'src/app/models/persona';
import { UbicacionDto } from 'src/app/models/ubicacion-dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rutinas',
  templateUrl: './rutinas.component.html',
  styleUrls: ['./rutinas.component.css']
})
export class RutinasComponent implements OnInit {

  //VARIABLES PARA LOS PICKER 
  dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  diaSeleccionado = "Lunes";

  //VARIABLES DE LOGICA
  ubicacionPromedio: Ubicacion;
  victimarioSeleccionado: String;
  seleccioneRestriccion = false;
  ubicacionesRestriccion: UbicacionDto;

  //VARIABLES PARA EL MAPA
  map: OlMap;
  mapSource: OlXYZ;
  capaMapa;
  vistaMapa: OlView;
  vectorUbicaciones: VectorSource;
  capaUbicaciones;


  constructor(private ubicacionService: UbicacionService, private comunicacion: ComunicacionService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.iniciarMapa();
    if (this.comunicacion.restriccionDTO != null) {
      var victimario = this.comunicacion.restriccionDTO.victimario;
      this.victimarioSeleccionado = victimario.apellido + ", " + victimario.nombre;
      this.seleccioneRestriccion = true;
    }
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

  mostrarRutina() {
    this.ubicacionService.getUbicacionesRestriccion(this.comunicacion.restriccionDTO.restriccion.idRestriccion)
      .subscribe(res => {
        this.ubicacionesRestriccion = res as UbicacionDto;;
        this.ubicacionService.getUbicacionPromedioRutina(this.comunicacion.restriccionDTO.victimario.idPersona, 
          this.dias.indexOf(this.diaSeleccionado) + 1, this.time.hour, this.time.minute)
        .subscribe(res => {
            this.ubicacionPromedio = res as Ubicacion;
            //Si no hay ubicación promedio NULL
            if(this.ubicacionPromedio==null){
              this.toastr.error("No hay ubicación rutinaria para los datos seleccionados");
              return;
            }

            var markerVictimario: Feature;
            var perimetro: Feature;

            //Marco Victimario con su marker La longitud y latitud es de objeto Ubicacion
            markerVictimario = new Feature({
              geometry: new Point(fromLonLat([this.ubicacionesRestriccion.ubicacionVictimario.longitud,
              this.ubicacionesRestriccion.ubicacionVictimario.latitud]))
            });
            markerVictimario.setStyle(new Style({
              image: new Icon(({
                src: 'assets/markerVictimario.png',
               // imgSize: [60, 60]
              }))
            }));

            //Dibujo Perimetro de ubicacionRutinaria con el estilo
            perimetro = new Feature();
            var forma = new Circle(fromLonLat([this.ubicacionPromedio.longitud, this.ubicacionPromedio.latitud]));
            forma.setRadius(200);
            perimetro.setGeometry(forma);
            perimetro.setStyle(new Style({
              fill: new Fill({
                color: ([10, 20, 255, .6])
              })
            }));

            //Borro lo dibujado anteriormente en el mapa
            var layers = this.map.getLayers().getArray();
            for (var i = layers.length - 1; i >= 1; --i) {
              var layer = layers[i];
              this.map.removeLayer(layer);
            }

            //Creo el vector y capa para mostrar Area rutinaria y la ubicacion
            this.vectorUbicaciones = new VectorSource({
              features: [markerVictimario, perimetro]
            });
            this.capaUbicaciones = new VectorLayer({
              source: this.vectorUbicaciones
            });

            //CENTRO EL MAPA EN LA UBICACION VICTIMARIO Y AÑADO LA CAPA
            this.vistaMapa.setCenter(fromLonLat([this.ubicacionesRestriccion.ubicacionVictimario.longitud,
            this.ubicacionesRestriccion.ubicacionVictimario.latitud]));
            this.map.addLayer(this.capaUbicaciones);
          });
      });
  }

}
