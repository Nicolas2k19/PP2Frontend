# VDG Frontend

Este proyecto contiene el frontend para la aplicación VDG. Proporciona instrucciones sobre cómo configurar y ejecutar el código.

## Instrucciones para ejecutar el código

1. **Instalar dependencias:** Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

    ```bash
    npm install --force
    ```

2. **Corregir auditoría de seguridad:** Después de instalar las dependencias, puedes ejecutar el siguiente comando para corregir cualquier problema de seguridad:

    ```bash
    npm audit fix --force
    ```

3. **Ejecutar la aplicación:** Para ejecutar la aplicación, ejecuta el siguiente comando:

    ```bash
    ng serve
    ```

    Esto desplegará la aplicación en el servidor local en [http://localhost:4200/](http://localhost:4200/).

## Configuraciones dentro del código

- **Cambiar la URL del backend:** Si el backend está desplegado en una ubicación diferente, asegúrate de cambiar la URL dentro del archivo `environments/environment.ts`.

## Cuentas validas

- **Cuenta de supervisor predeterminada:**
  - Correo electrónico: admin@admin.com
  - Contraseña: admin

- **Cuenta de administrador:**
  - Ejemplo: gfgrillo3@gmail.com y gustycruz85@gmail.com
  - Para acceder a estas cuentas, sigue el procedimiento de "Olvidaste tu contraseña" y se enviará una nueva contraseña al correo electrónico pp2proyectoviolenciagenero@gmail.com.

    Nota: Si el correo electrónico no funciona o estás en un entorno de desarrollo, podrás ver la nueva contraseña desde la consola del backend.

