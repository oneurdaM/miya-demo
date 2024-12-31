# Kali Connect App - Frontend

Este es un proyecto de administración desarrollado con **Next.js**, que permite realizar el seguimiento en tiempo real de dispositivos, interactuar con mapas de **Google Maps** y gestionar la mensajería entre usuarios. Además, cuenta con funcionalidades para el registro de usuarios, documentos y otras funciones de administración.

| Imagen 1 | Imagen 2 |
| -------- | -------- |
| ![Captura 1](src/screenshots/captura_1.png) | ![Captura 2](src/screenshots/captura_2.png) |

### Tecnologías utilizadas:

- **Next.js**: Framework para React que permite la creación de aplicaciones web de alto rendimiento y escalabilidad.
- **React**: Biblioteca para construir interfaces de usuario interactivas.
- **Google Maps API**: Para el seguimiento y visualización de dispositivos en un mapa interactivo.
- **Tailwind CSS**: Framework de CSS para un diseño rápido y responsivo.
- **Jest**: Para pruebas unitarias y de integración.
- **TypeScript**: Para mejorar la seguridad y mantenimiento del código.
- **Axios**: Para las solicitudes HTTP.

### Características del Proyecto

- **Seguimiento en tiempo real**: Monitoreo de dispositivos en un mapa de **Google Maps** con actualizaciones en vivo de las coordenadas.
- **Interfaz de administración**: Dashboard intuitivo con gráficos interactivos usando.
- **Mensajería en tiempo real**: Los usuarios pueden enviarse mensajes entre sí.
- **Gestión de usuarios**: Registro, autenticación y seguimiento de acciones de los usuarios.
- **Gestión de alertas**: Seguimiento de incidencias.
- **Gestión de roles**: Registro de roles de trabajo.
- **Gestión de tipos de documentos**: Registro de documentos que se asignaran al rol de trabajo.
- **Gestión de rondas**: Registro y seguimiento de rondas.
- **Gestión de sectores**: Registro y gestion de sectores.
- **Documentos**: Registro y validación del manejo de documentos asociados a cada usuario.
- **Categorias y notas**: Registro y seguimiento de las categorias de notas y las mismas notas a publicar.
- **Ajustes**: Registro y seguimiento de los ajustes generales del sistema.
- **Terminos y condiciones**: Registro y seguimiento de los terminos y condiciones del sistema.

---

## Requisitos

Asegúrate de tener las siguientes herramientas instaladas:

- **Node.js** versión **>=20.0.0** (pero este proyecto está optimizado para Node 22)
- **npm** versión **>=10.8.3**

## Instalación

1. **Clonar el repositorio**:

   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-repositorio>

2. **Instalar dependencias**:

Instala todas las dependencias necesarias para el proyecto:

    npm install 

Si prefieres usar Yarn:

    yarn install

3. **Configuración de variables de entorno**

Crea un archivo .env.local en el directorio raíz del proyecto y agrega las siguientes variables de entorno (por ejemplo, la clave API de Google Maps:

    
    GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps

## Scripts de Desarrollo

Una vez instaladas las dependencias y configuradas las variables de entorno, puedes utilizar los siguientes comandos para el desarrollo y la ejecución del proyecto:

1. **Iniciar el servidor de desarrollo**

Para iniciar el servidor en modo desarrollo en el puerto 3009:

    npm run dev
    
    yarn dev

Este comando abrirá la aplicación en http://localhost:3009 para que puedas probarla en tu entorno local.

## Construcción del Proyecto
Para construir el proyecto para producción:

    npm run build

    yarn build