import { Persona } from "src/app/models/persona";



export default class UbicacionEntrenamiento{

    constructor(dia = "", latitud = 0,longitud = 0, fecha = new Date(), idPersona = new Persona()){

    }
     dia: string
     latitud: Number
     longitud: Number;
     fecha : Date
	 idPersona : Persona
}



/*@Column
	String dia;
	@Id
	@Column
	private int idDato;
	@Column
	private BigDecimal latitud;
	@Column
	private BigDecimal longitud;
	@Column
	private Timestamp fecha;
*/