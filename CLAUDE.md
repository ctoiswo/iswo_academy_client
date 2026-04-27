# ISWO Academy Client — Contexto para Claude

## Qué es este proyecto

SPA en React 19 + Vite que sirve de frontend para la plataforma ISWO Academy.
URL producción: `https://www.iswoacademy.com`

## Infraestructura de producción

```
Browser → Vercel (CDN + hosting) → SPA estática
                ↓ llamadas API
        Cloudflare → AWS EC2 (Dokku) → Rails API
```

### Hosting
- **Plataforma:** Vercel
- Deploy automático en cada push a `main`
- No hay servidor propio — Vercel sirve los assets estáticos del build

### Variables de entorno (Vercel)
- `VITE_API_URL` o similar → apunta a `https://core.iswoacademy.com`

### Build
```bash
npm run build   # genera dist/
```

## Backend relacionado

Proyecto separado en `/home/lenovo/Documentos/sig_iswo/iswo-academy/iswo_academy_core`
URL producción: `https://core.iswoacademy.com` (desplegado en AWS EC2 + Dokku)

## Stack técnico

- React 19
- Vite
- TanStack Router
- TanStack Query
- react-hook-form + Zod
- Shadcn UI (con modificaciones RTL — no actualizar con CLI sin revisar)
- Sonner (toasts)
- i18next (internacionalización)

## Notas importantes

- Los componentes Shadcn están **modificados** para RTL y la plataforma. Usar `npx shadcn add` solo para componentes nuevos sin customización previa.
- Archivos subidos (imagen/video en cursos) van al backend vía `multipart/form-data` → el backend los sube a GCS.
- Límites de archivo validados en frontend: imagen ≤ 10MB, video ≤ 40MB.
