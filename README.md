# ShareReads

Quickly create and share lists of books with anyone 

🚀 https://sharereads.xyz/

Built using Cloudflare Pages, Cloudflare KV, and MongoDB 

![Kapture 2024-12-20 at 16 17 22](https://github.com/user-attachments/assets/e0faef8f-2323-4e06-8c7a-3f5093bc4b5d)

## Development

Run the dev server:

```sh
npm run dev
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
