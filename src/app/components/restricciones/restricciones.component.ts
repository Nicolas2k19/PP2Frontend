import { Component, OnInit } from '@angular/core';
import { RestriccionService } from '../../services/restricciones/restriccion.service';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style, Fill } from 'ol/style';
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
import RestriccionMultipleDTO from 'src/app/models/RestriccionMultiple/RestriccionMultipleDTO';
import AlertaService from 'src/app/services/alertas/alertaService';

@Component({
  selector: 'app-restricciones',
  templateUrl: './restricciones.component.html',
  styleUrls: ['./restricciones.component.css'],
  providers: [RestriccionService]
})

export class RestriccionesComponent implements OnInit {

  //UBICACIONES UTILIZADAS PARA MOSTRAR EN EL MAPA
  restriccionesFisicas: RestriccionFisica[]
  restriccionesMultiples: RestriccionMultipleDTO[]
  restriccionesFiltradas: RestriccionMultipleDTO[]
  ubicacionVictimario: Ubicacion;
  ubicacionDamnificada: Ubicacion;
  ubicacionDto: UbicacionDto;
  intervalo;
  restriccionPintada: RestriccionDTO;
  indiceDeRestriccionSeleccionada:number = 0;

  featuresRestriccion: Feature[]
  featuresRestriccionFisica: Feature[]
  featuresRestriccionMultiple: Feature[];
  featuresPerimetroRestriccionFisica: Feature[];
  featuresPerimetroRestriccionMultiple: Feature[];

  ubicaciones: Ubicacion[][]


  constructor(public restriccionService: RestriccionService, private comunicacion: ComunicacionService,
    private ubicacionService: UbicacionService, private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService, private mapService: MapService,
    private alertaService: AlertaService){}

  ngOnInit() {
    this.inicializarMapa()
  }

  /**
   * Inicializa todo lo necesario para lograr que el mapa funcione
   * @author Nicolás
   */
  inicializarMapa() {
    this.spinnerService.show();
    this.mapService.iniciarMapa('map');
    this.getUsuarioByEmail(localStorage.getItem("emailUsuario")).add(res => {
      this.getRestricciones(localStorage.getItem("emailUsuario")).add(res => {
        this.getRestriccionesMultiples().add(res => {
          if (this.restriccionService.restricciones != undefined && this.restriccionService.restricciones.length > 0) {
            this.getRestriccionesFisicas(this.restriccionService.restricciones[this.indiceDeRestriccionSeleccionada].restriccion.idRestriccion).add(res => {
              this.seleccionarRestriccion(this.restriccionService.restricciones[this.indiceDeRestriccionSeleccionada], null);
              this.getUbicacion().subscribe(resUbicacion => {
                this.dibujarRestriccionPerimetral(resUbicacion as UbicacionDto)
                this.mostrarRestriccionMultiple()
                this.pintarRestriccionFisica()
                this.centrar()
                this.spinnerService.hide()
              })
            })
          }
          this.spinnerService.hide()
        });
      });
    })
  }

  dibujarRestriccionPerimetral(ubicacion: UbicacionDto) {    
    this.crearElementosRestriccionPerimetral(ubicacion).add(res => {
      this.dibujarMapa(this.featuresRestriccion)
    });
  }


  /**
   * Trae las restricciones físicas disponibles
   * @author Nicolás
   */
  getRestriccionesFisicas(id: number) {
    return this.restriccionService.getRestriccionesFisicasPorId(id)
      .subscribe(res => {
        this.restriccionesFisicas = res as RestriccionFisica[]
      })
  }

  /**
     * Trae las restricciones multiples disponibles
     * @author Nicolás
     */
  getRestriccionesMultiples() {
    return this.restriccionService.getRestriccionesMultiplesDTO().subscribe(res => {
      this.restriccionesMultiples = res as RestriccionMultipleDTO[];
      this.restriccionesFiltradas = this.restriccionesMultiples;
    })

  }

  getRestricciones(email: string) {
    return this.restriccionService.getRestriccionesAdministrativo(email)
      .subscribe(res => {
        this.restriccionService.restricciones = res as RestriccionDTO[];
      })
  }

  seleccionarRestriccion(restriccion: RestriccionDTO, fila) {
    this.mapService.borrarrMapa('map')
    this.mapService.iniciarMapa('map')
    this.featuresRestriccion = []
    this.restriccionPintada = restriccion;
    this.comunicacion.enviarRestriccion(this.restriccionPintada);
    this.desmarcarCeldas();
    this.actualizarMapa()

    if (fila == null) {
      document.querySelectorAll("tr")[1].style.backgroundColor = "#b780ff"
    }
    else {
      fila.style.backgroundColor = "#b780ff"
      fila.style.color = "white";
      this.indiceDeRestriccionSeleccionada = fila.rowIndex - 1;
      this.centrar()
    }
    let thisjr = this;
    //CADA 15 SEGUNDOS ACTUALIZO EL MAPA
    clearInterval(this.intervalo);
    this.intervalo = setInterval(function () {
      thisjr.actualizarMapa()
    }, 10000);
  }


  /**
   * Realiza las llamadas correspondientes para actualizar el mapa
   * @author Nicolás
   */
  actualizarMapa() {
    this.mapService.clearLayers()
    this.spinnerService.show()
    this.getUbicacion().subscribe(resUbicacion=> {   
      this.dibujarRestriccionPerimetral(resUbicacion as UbicacionDto)
      this.mostrarRestriccionMultiple()
      this.pintarRestriccionFisica()
      this.spinnerService.hide()
    })
  }

  desmarcarCeldas() {
    document.querySelectorAll("tr").forEach(fila => {
      fila.style.backgroundColor = "inherit"
      fila.style.color = "white";
    })
  }

  getUsuarioByEmail(mail: string) {
    return this.usuarioService.getUsuarioByEmail(mail)
      .subscribe(res => {
        this.comunicacion.enviarUsuario(res as Usuario);
      })
  }

  getUbicacion() {
    return this.ubicacionService.getUbicacionesRestriccion(this.comunicacion.restriccionDTO.restriccion.idRestriccion)
  }

  crearElementosRestriccionPerimetral(ubicacionDto: UbicacionDto) {
    let markerVictimario: Feature;
    let markerDamnificada: Feature;
    let perimetro: Feature;
    this.ubicacionDto = ubicacionDto;
    this.ubicacionDamnificada = this.ubicacionDto.ubicacionDamnificada;
    this.ubicacionVictimario = this.ubicacionDto.ubicacionVictimario;
    markerVictimario = this.marcarEnMapaLaRestriccion(this.ubicacionVictimario.longitud,
      this.ubicacionVictimario.latitud,
      'assets/markerVictimario.png')
    markerDamnificada = this.marcarEnMapaLaRestriccion(this.ubicacionDamnificada.longitud,
      this.ubicacionDamnificada.latitud,
      'assets/markerDamnificada.png')
    return this.getInfringe(this.comunicacion.restriccionDTO.restriccion.distancia, this.ubicacionDto)
      .subscribe(res => {
        perimetro = this.crearPerimetro(this.ubicacionDamnificada.longitud, this.ubicacionDamnificada.latitud, this.comunicacion.restriccionDTO.restriccion.distancia)
        let infringe: boolean = res as boolean
        if (infringe) {
          this.alertaService.alertarPolicia(this.ubicacionDamnificada.latitud, this.ubicacionDamnificada.longitud,
            this.comunicacion.restriccionDTO.restriccion.idRestriccion).subscribe();
        }

        let perimetroDibujado = this.dibujarPerimetro(perimetro, infringe)
        let markersObtenidos = [markerDamnificada, markerVictimario, perimetroDibujado]
        this.featuresRestriccion = markersObtenidos
      })
  }

  crearPerimetro(log: number, lat: number, distancia: number) {
    let perimetro = new Feature();
    var forma = new Circle(fromLonLat([log, lat]));
    forma.setRadius(distancia);
    perimetro.setGeometry(forma);
    return perimetro;
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
  pintarRestriccionFisica() {
    if(this.restriccionesFisicas != undefined){ 
      this.restriccionesFisicas.forEach(res => {
        this.getInfringe(res.distancia
          , new UbicacionDto(new Ubicacion(0, res.latitud, res.longuitud, "", 0),
            this.ubicacionVictimario))
          .subscribe(respuesta => {
            let features: Feature[] = this.marcarPerimetro(res.longuitud,
              res.latitud,
              res.distancia,
              'assets/iconoRestriccionFisica.png'
              , respuesta as boolean);
            this.mapService.anadirFeatures(features);
          })
      })
    }

  }

  mostrarRestriccionMultiple(): Feature[] {
    this.filtrarPorIdRestriccionesMultiples(this.restriccionPintada.restriccion.idRestriccion);
    let markers: Feature[] = [];

    this.restriccionesFiltradas.map(res => {
      let resMul: RestriccionMultipleDTO = res as RestriccionMultipleDTO
      this.ubicacionService.getUbicacionPorIdPersona(resMul.restriccionMultiple.idPersona).subscribe(res => {
        let ubicacion: Ubicacion = res as Ubicacion

        this.getInfringe(resMul.restriccionMultiple.distancia
          , new UbicacionDto(new Ubicacion(0, ubicacion.latitud, ubicacion.longitud, "", 0)
            , this.ubicacionVictimario))
          .subscribe(res => {
            let features = this.marcarPerimetro(ubicacion.longitud,
              ubicacion.latitud,
              resMul.restriccionMultiple.distancia,
              'assets/restriccionMultiple.png',
              res as boolean)
            this.mapService.anadirFeatures(features);
          })
      })
    })
    return (markers);
  }

  filtrarPorIdRestriccionesMultiples(id: number) {
    this.restriccionesFiltradas = this.restriccionesMultiples.filter(res => {
      return res.restriccionMultiple.idRestriccion == id;
    })
  }

  /**
   * Dibuja el mapa
   * @author Nicolás 
   */
  dibujarMapa(features: Feature[]) {
    //Borro lo dibujado anteriormente en el mapa
    this.mapService.clearLayers();
    //Creo el vector y capa para mostrar las ubicaciones
    this.mapService.anadirFeatures(features)
  }



  /**
   * 
   * Marca en el mapa la restriccion  
   * @author Nicolás
   *  
   * @returns Feature
   */
  marcarEnMapaLaRestriccion(log: number, lat: number, asset: string) {
    let marker: Feature;
    marker = new Feature({
      geometry: new Point(fromLonLat([log, lat]))
    });
    marker.setStyle(new Style({
      image: new Icon(({
        src: asset,
        imgSize: [60, 60]
      }))
    }));
    return marker;
  }


  /**
   * 
   * Marca en el mapa el perimetro de una restriccion
   * @author Nicolás
   *  
   * @returns Feature
   */
  marcarPerimetro(log: number, lat: number, distancia: number, asset: string, infringe: boolean) {
    let perimetro: Feature = new Feature();
    let forma = new Circle(fromLonLat([log, lat]));
    forma.setRadius(distancia);
    perimetro.setGeometry(forma);
    this.dibujarPerimetro(perimetro, infringe);
    let marker = this.marcarEnMapaLaRestriccion(log, lat, asset)
    return [perimetro, marker];
  }

  /**
   * 
   * Obtiene si la distancia asignada a la perimetral de la victima esta siendo violada
   * @param ubicacionVictima 
   * @returns 
   */
  getInfringe(distancia: number, ubicacionVictima: UbicacionDto) {
    return this.ubicacionService.getEstaInfringiendoPasandoDistancia(distancia, ubicacionVictima)
  }

  /**
   * 
   * Dibuja el perimetro en un mapa, dependiendo del estado de la perimetral se pintara en verde o en rojo.
   * @author Nicolás
   *  
   * @returns Feature
   */
  dibujarPerimetro(perimetro: Feature, estaInfringiendo: boolean) {
    //Pinto el perimetro dependiendo si infringe o no
    let style = new Style({ fill: new Fill({}) });

    if (estaInfringiendo)
      style.getFill().setColor([255, 0, 0, .4]);
    else
      style.getFill().setColor([0, 255, 0, .4]);

    perimetro.setStyle(style);
    return perimetro;
  }

  /**
   * Centra el mapa en la victima
   * @author Nicolás
   */
  centrar() {
    this.getUbicacion().subscribe(resUbicacion=> {
      this.mapService.centrarMapa(this.ubicacionDamnificada.longitud, this.ubicacionDamnificada.latitud)
    })
  }

}
