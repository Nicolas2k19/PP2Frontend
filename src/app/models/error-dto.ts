export class ErrorDTO {

    constructor(hayError= false, mensajeError = ""){
        this.hayError= hayError;
        this.mensajeError= mensajeError;
    }

    hayError: Boolean;
    mensajeError: String;
}
