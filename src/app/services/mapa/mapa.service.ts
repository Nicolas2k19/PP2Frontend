import { Injectable } from '@angular/core';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root'
})

export class MapService {
  map: OlMap;
  mapSource: OlXYZ;
  capaMapa: OlTileLayer;
  vistaMapa: OlView;
  vectorUbicaciones: VectorSource;
  capaUbicaciones: VectorLayer;

  constructor() {
  }

  iniciarMapa(map: string) {
    this.mapSource = new OlXYZ({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png'
    });

    this.capaMapa = new OlTileLayer({
      source: this.mapSource
    });

    this.vistaMapa = new OlView({
      center: fromLonLat([-58.700233, -34.522249]),
      zoom: 17
    });

    this.map = new OlMap({
      target: map,
      layers: [this.capaMapa],
      view: this.vistaMapa
    });
  }

  borrarrMapa(map: string) {
    this.mapSource = null
    this.capaMapa = null
    this.vistaMapa = null
    this.map.setTarget(null); 
    this.map.dispose(); 
    this.map = null; 
  }

  clearLayers(): void {
    // Borra únicamente las capas de vectores
    if (this.vectorUbicaciones) {
      this.map.removeLayer(this.capaUbicaciones);
      this.map.removeLayer(this.vectorUbicaciones)
    }
  }

  mostrarUbicaciones(markerVictimario: Feature, markerDamnificada: Feature, perimetro: Feature, marcasAdicionales: Feature[]) {
    this.vectorUbicaciones = new VectorSource({
      features: [markerVictimario, markerDamnificada, perimetro, ...marcasAdicionales]
    });

    this.capaUbicaciones = new VectorLayer({
      source: this.vectorUbicaciones
    });

    // Añade la capa de ubicaciones al mapa
    if (this.map && this.capaUbicaciones) {
      this.map.addLayer(this.capaUbicaciones);
    }
  }

  anadirFeatures(featuresss: Feature[]) {
    this.vectorUbicaciones = new VectorSource({
      features: featuresss
    });

    this.capaUbicaciones = new VectorLayer({
      source: this.vectorUbicaciones
    });

    // Añade la capa de ubicaciones al mapa
    if (this.map && this.capaUbicaciones) {
      this.map.addLayer(this.capaUbicaciones);
    }
  }

  centrarMapa(longitude: number, latitude: number) {
    this.vistaMapa.setCenter(fromLonLat([longitude, latitude]));
  }
}
