# App-Ceci

App móvil/PWA en Next.js para registrar y calificar alfajores con Supabase.

## Stack
- Next.js (pages router)
- TailwindCSS
- Supabase (Database + Storage)
- next-pwa para service worker y manifest

## Requisitos
1. Node.js 18+
2. Crear `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://wygsrnmffypsbjbtjdn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_nBXT6-mF6qrSP008AafBXw_ML2DjzdF
```

> No usar la `service_role` key en frontend.

## SQL Supabase

```sql
create extension if not exists "uuid-ossp";

create table if not exists alfajores (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  brand text,
  image_path text,
  rating integer,
  review text,
  tasted_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);
```

## Storage Supabase
- Bucket: `alfajores`
- Público para lectura.
- Para MVP sin login, habilitar políticas de inserción acordes a tu proyecto.

Ejemplo de políticas (ajustar según seguridad necesaria):

```sql
-- lectura pública de archivos
create policy "Public read alfajores"
on storage.objects for select
to public
using (bucket_id = 'alfajores');

-- subida pública (MVP)
create policy "Public upload alfajores"
on storage.objects for insert
to public
with check (bucket_id = 'alfajores');
```

## Scripts
```bash
npm install
npm run dev
npm run build
npm start
```

## Deploy en Vercel
1. Importar repo en Vercel.
2. Configurar variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy.

4. (Opcional debug PWA) `NEXT_PUBLIC_DISABLE_PWA=true` para desactivar el service worker temporalmente y validar issues de red.

## Estructura

```txt
/pages
  index.js
  new.js
  /alfajores/[id].js
  /edit/[id].js
/components
  AlfajorCard.js
  AlfajorForm.js
  StarRating.js
/lib
  supabaseClient.js
  alfajoresApi.js
/public
  manifest.json
  /icons
/styles
  globals.css
```


## Debug de PWA / Service Worker

Si necesitás aislar errores de fetch (ej. Supabase) y validar comportamiento sin service worker:

1. En Vercel, agregá la variable de entorno `NEXT_PUBLIC_DISABLE_PWA` con valor `true`.
2. Redeploy del proyecto.
3. Verificá que el SW ya no se registre y repetí la prueba.

Para volver al comportamiento normal de PWA, quitá la variable (o seteala en `false`) y redeploy.
