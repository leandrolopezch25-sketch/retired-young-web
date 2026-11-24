# Retired Young — inicio para Netlify + GitHub

Incluye landing page responsive, panel `/admin`, funciones Netlify y conexión a un repositorio privado de contenido mediante GitHub Contents API.

## Arquitectura
- Este repositorio contiene el sitio y `netlify/functions`.
- Crea un segundo repositorio GitHub **privado** para el contenido.
- En ese repositorio privado coloca `site-data/site.json` (puedes copiar el archivo incluido) y crea `site-media/`.
- Las funciones leen/escriben el JSON y los archivos de imagen usando el token del servidor. No se exponen secretos al navegador.

## Preparación
1. Crea dos repositorios: uno para el sitio (público o privado) y otro privado para contenido.
2. Sube todos los archivos de esta carpeta al repositorio del sitio.
3. En el repositorio privado, crea `site-data/site.json` copiando el JSON incluido y crea la carpeta `site-media` (puedes añadir un `.gitkeep`).
4. Crea un GitHub Personal Access Token con acceso de lectura y escritura **solo** al repositorio privado de contenido (Contents: Read and write).
5. En Netlify, importa el repositorio del sitio. Build command: vacío; Publish directory: `.`.
6. En Netlify > Site configuration > Environment variables, configura:
   - `GITHUB_PRIVATE_REPO`: `propietario/nombre-repo-privado`
   - `GITHUB_PRIVATE_TOKEN`: token anterior
   - `ADMIN_PASSWORD`: contraseña larga y única para `/admin`
   - `SESSION_SECRET`: cadena aleatoria de al menos 32 caracteres, diferente de la contraseña
7. Redeploya el sitio. Abre `https://tu-dominio.netlify.app/admin`.

## Desarrollo local
Requiere Node.js 20+ y Netlify CLI. Copia `.env.example` a `.env` y completa variables reales. Ejecuta `npm test` y `netlify dev`.

## Importante antes de publicar
- El formulario de contacto es solo visual: no envía ni almacena datos. Falta elegir y conectar el CRM externo.
- Sustituye imágenes de muestra, historias, testimonios y tutorial por materiales reales autorizados.
- La limitación de intentos de login usa memoria de la instancia de Function; no es un limitador distribuido entre todas las instancias. Para un sitio público con exposición alta, añade rate limiting/WAF en Netlify.
- La ruta de imagen sirve el contenido desde el repositorio privado a través de una Function. Para galerías grandes conviene migrar a almacenamiento/CDN.
- El panel tiene confirmación de eliminación y valida tipo real de imagen por firma binaria y tamaño máximo 2 MB.
- Las cookies de sesión son HttpOnly, Secure y SameSite=Strict; usa HTTPS (Netlify lo proporciona).
- Configura y prueba el token con permisos mínimos. Nunca subas `.env` ni secretos a GitHub.
- Revisa términos, riesgos y divulgaciones legales de trading antes de hacer pública la página.

## Estructura
`index.html`, `assets/`, `admin/`, `netlify/functions/`, `site-data/site.json`, `netlify.toml`, `tests/`.

## Pruebas
`npm test` ejecuta pruebas básicas de validación y rutas de medios. No reemplaza una prueba de integración en Netlify con un repositorio de prueba.

## Versión 2
Copia site-data/site.json al repositorio privado si es nuevo. Si ya existe, conserva su contenido; el panel incorpora los campos nuevos al guardar. Consulta GOOGLE-FORMS.md. No se ha desplegado en Netlify. Antes de producción revisa límites de intentos de login y privacidad. Las fotos y testimonios reales deben añadirse desde el panel.
