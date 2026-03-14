import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expose to network for mobile testing
    proxy: {
      '/api/ai': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: () => '/v1/messages',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // Read body to get apiKey
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
              try {
                const { prompt, apiKey } = JSON.parse(body);
                const payload = JSON.stringify({
                  model: 'claude-sonnet-4-20250514',
                  max_tokens: 1000,
                  messages: [{ role: 'user', content: prompt }]
                });
                proxyReq.setHeader('x-api-key', apiKey);
                proxyReq.setHeader('anthropic-version', '2023-06-01');
                proxyReq.setHeader('content-type', 'application/json');
                proxyReq.setHeader('content-length', Buffer.byteLength(payload));
                proxyReq.write(payload);
                proxyReq.end();
              } catch(e) {}
            });
          });
        }
      }
    }
  }
})
