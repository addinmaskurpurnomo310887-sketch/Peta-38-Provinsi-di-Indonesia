import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function mapUploadPlugin(): Plugin {
  return {
    name: 'map-upload-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload-map', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data.image) {
              const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              const publicDir = path.resolve(__dirname, 'public');
              if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
              }
              fs.writeFileSync(path.join(publicDir, 'peta-indonesia.webp'), buffer);
              fs.writeFileSync(
                path.join(publicDir, 'Peta IndonesiaBantu follow dan reshare jika bermanfaat. Silahkan yang mau komen aja yaa.. #guru.webp'),
                buffer
              );
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, url: '/peta-indonesia.webp' }));
              return;
            }
          } catch (e) {
            console.error('Failed to parse uploaded image:', e);
          }
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid payload' }));
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), mapUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
