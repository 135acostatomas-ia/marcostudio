# Marco Studio

Sitio web institucional de Marco Studio — agencia digital boutique argentina.

Multi-página, HTML/CSS/JS vanilla, mobile-first.

## Estructura

```
marco-studio/
├── index.html               → Home
├── css/
│   ├── style.css           → Sistema de diseño (tokens, header, footer)
│   ├── home.css            → Estilos de Home
│   └── pages.css           → Estilos de páginas internas
├── js/
│   └── main.js             → Menu mobile, scroll reveal, FAQ accordion, form
├── images/                 → Acá van todas las imágenes (vacío por ahora)
└── pages/
    ├── marketing.html      → Marketing Digital
    ├── ecommerce.html      → E-commerce
    ├── desarrollo.html     → Desarrollo Web
    ├── produccion.html     → Producción de Contenido
    └── contacto.html       → Contacto
```

## Stack

- HTML5 semántico
- CSS3 con custom properties (variables) y `clamp()` para tipografía fluida
- JavaScript vanilla (sin frameworks ni dependencias)
- Tipografías: **Fraunces** (display serif) + **Geist** (body sans) + **Geist Mono** (mono) — vía Google Fonts
- Iconografía: SVG inline (no usa Font Awesome ni similares)

## Paleta

```css
--color-bg:        #FAF8F5  /* Blanco hueso */
--color-bg-alt:    #F2EFE9  /* Beige claro */
--color-ink:       #1A1A1A  /* Negro principal */
--color-accent:    #E85D2F  /* Naranja Marco */
--color-dark:      #161513  /* Dark para secciones inversas */
```

## Antes de subir a producción

Reemplazá en TODOS los archivos:

1. **WhatsApp**: cambiar `541100000000` por el número real (sin el `+`, sin espacios)
2. **Email**: cambiar `hola@marcostudio.com.ar` por el email real
3. **Redes sociales**: cambiar los `href="#"` de Instagram/LinkedIn/TikTok por las URLs reales
4. **Imágenes**: reemplazar los placeholders (los `<div class="placeholder">`) por imágenes reales en `/images/`
5. **Formulario de contacto**: integrar con Formspree, Brevo, EmailJS o similar (ver `js/main.js`)
6. **Dominio**: cuando tengas `marcostudio.com.ar`, actualizar meta tags y OG tags

## Cómo correr localmente

Necesitás un servidor local (no funciona con `file://` por algunos paths):

```bash
# Opción 1: con Python
cd marco-studio
python3 -m http.server 8000
# Abrí http://localhost:8000

# Opción 2: con Node (si tenés instalado)
npx serve

# Opción 3: en VS Code
# Instalá la extensión "Live Server" y clic derecho en index.html → "Open with Live Server"
```

## Cómo subir a GitHub

```bash
cd marco-studio
git init
git add .
git commit -m "Initial commit: Marco Studio website"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/marco-studio.git
git push -u origin main
```

## Cómo desplegar gratis

- **Netlify**: arrastrá la carpeta a netlify.com/drop — listo en 30 segundos
- **Vercel**: conectá el repo de GitHub en vercel.com
- **GitHub Pages**: Settings → Pages → Source: main branch (gratis con dominio `usuario.github.io/marco-studio`)

## Próximos pasos sugeridos

1. Validar contenido y pulir copys
2. Sumar imágenes/videos reales del equipo y trabajos
3. Integrar formulario real con Formspree o similar
4. Sumar Google Analytics 4 + Meta Pixel
5. Configurar dominio propio (marcostudio.com.ar)
6. Sumar página de Blog/Casos cuando tengan más contenido
7. SEO técnico: sitemap.xml + robots.txt + structured data

---

© 2026 Marco Studio
