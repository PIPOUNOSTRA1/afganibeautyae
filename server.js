const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const PORT = process.env.PORT || 8080;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.json': 'application/json'
};

// In-memory active session tokens for the admin dashboard
const activeSessions = new Set();

// Helper to read JSON request body
function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', err => reject(err));
  });
}

// Authentication check middleware helper
function isAuthenticated(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  return activeSessions.has(token);
}

// Intercepts base64 image data in products and saves as static files
function extractBase64Images(products) {
  const assetsDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const imageFields = ['image', 'gallery_tube', 'gallery_texture', 'gallery_formula', 'guide_step_1', 'guide_step_2', 'guide_step_3'];

  Object.keys(products).forEach(id => {
    const prod = products[id];
    imageFields.forEach(field => {
      const val = prod[field];
      if (val && typeof val === 'string' && val.startsWith('data:image/')) {
        const matches = val.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          const data = matches[2];
          const filename = `product-${id}-${field}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
          const filePath = path.join(assetsDir, filename);
          
          try {
            fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
            prod[field] = 'assets/' + filename;
            console.log(`Saved base64 image for product ${id} field ${field} to ${prod[field]}`);
          } catch (err) {
            console.error(`Failed to save base64 image:`, err);
          }
        }
      }
    });
  });
  return products;
}

// Allowed CORS origins
const ALLOWED_ORIGINS = [
  'https://pipounostra1.github.io',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:8080'
];

function getCorsOrigin(req) {
  const origin = req.headers['origin'] || '';
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  // Allow any origin for public POST /api/orders (order submission from any referrer)
  if (origin) return origin;
  return ALLOWED_ORIGINS[0];
}

const server = http.createServer(async (req, res) => {
  // Set CORS headers based on request origin
  const corsOrigin = getCorsOrigin(req);
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Override writeHead to guarantee CORS headers are always merged into any response (even 401, 404, etc.)
  const originalWriteHead = res.writeHead;
  res.writeHead = function(statusCode, headers) {
    res.setHeader('Access-Control-Allow-Origin', corsOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return originalWriteHead.call(this, statusCode, headers);
  };

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Normalize URL to prevent directory traversal
  let safeUrl = req.url.split('?')[0];
  
  // Security protection: explicitly block public directory listings and sensitive database configs
  if (safeUrl.startsWith('/db/') || safeUrl.includes('/db') || (safeUrl.endsWith('.json') && safeUrl !== '/settings.json' && safeUrl !== '/settings.js')) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // ----------------------------------------------------
  // PUBLIC & DYNAMIC SETTINGS ROUTES (Legacy Support)
  // ----------------------------------------------------
  if (safeUrl === '/api/settings') {
    if (req.method === 'GET') {
      const settingsPath = path.join(__dirname, 'settings.json');
      fs.readFile(settingsPath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({}));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
        }
      });
      return;
    } else if (req.method === 'POST') {
      const body = await readRequestBody(req);
      const settingsPath = path.join(__dirname, 'settings.json');
      fs.writeFile(settingsPath, JSON.stringify(body, null, 2), 'utf8', err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Error writing settings.json');
          return;
        }
        const jsContent = `window.STORE_SETTINGS = ${JSON.stringify(body, null, 2)};\n`;
        const jsPath = path.join(__dirname, 'settings.js');
        fs.writeFile(jsPath, jsContent, 'utf8', err2 => {
          if (err2) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Error writing settings.js');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        });
      });
      return;
    }
  }

  // ----------------------------------------------------
  // BACKEND DATABASE & ADMIN CONTROL APIs
  // ----------------------------------------------------

  // 1. ADMIN LOGIN API
  if (safeUrl === '/api/admin/login' && req.method === 'POST') {
    const body = await readRequestBody(req);
    const password = body.password || '';
    const config = db.readAdminConfig();
    const inputHash = db.hashPassword(password);
    
    if (inputHash === config.password_hash) {
      const sessionToken = crypto.randomBytes(24).toString('hex');
      activeSessions.add(sessionToken);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, token: sessionToken }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'كلمة المرور غير صحيحة' }));
    }
    return;
  }

  // 2. VERIFY BOOKMARK KEY API
  if (safeUrl === '/api/admin/verify-key' && req.method === 'POST') {
    const body = await readRequestBody(req);
    const key = body.key || '';
    const config = db.readAdminConfig();

    if (key && key === config.api_key) {
      const sessionToken = crypto.randomBytes(24).toString('hex');
      activeSessions.add(sessionToken);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, token: sessionToken }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'مفتاح الوصول غير صحيح' }));
    }
    return;
  }

  // 3. PUBLIC PRODUCTS GET API
  if (safeUrl === '/api/products' && req.method === 'GET') {
    const products = db.readProducts();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(products));
    return;
  }

  // 4. PUBLIC ORDER SUBMIT API
  if (safeUrl === '/api/orders' && req.method === 'POST') {
    const body = await readRequestBody(req);
    const orders = db.readOrders();
    
    const newOrder = {
      id: body.id || `AB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: body.name || '',
      phone: body.phone || '',
      city: body.city || '',
      address: body.address || '—',
      paymentMethod: body.paymentMethod || 'الدفع عند الاستلام (COD)',
      items: body.items || [],
      subtotal: body.subtotal || 0,
      shipping: body.shipping || 0,
      discount: body.discount || 0,
      total: body.total || 0,
      date: body.date || new Date().toISOString(),
      status: body.status || 'pending'
    };

    orders.unshift(newOrder);
    db.writeOrders(orders);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, order: newOrder }));
    return;
  }

  // 5. PROTECTED ORDERS GET API (supports /api/orders and /api/admin/orders)
  if ((safeUrl === '/api/orders' || safeUrl === '/api/admin/orders') && req.method === 'GET') {
    if (!isAuthenticated(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'غير مصرح بالوصول' }));
      return;
    }
    const orders = db.readOrders();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(orders));
    return;
  }

  // 5b. PROTECTED SINGLE ORDER GET API: GET /api/orders/:id
  if (safeUrl.startsWith('/api/orders/') && req.method === 'GET' && safeUrl !== '/api/orders/update' && safeUrl !== '/api/orders/delete') {
    if (!isAuthenticated(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'غير مصرح بالوصول' }));
      return;
    }
    const orderId = decodeURIComponent(safeUrl.replace('/api/orders/', ''));
    const orders = db.readOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(order));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'الطلب غير موجود' }));
    }
    return;
  }

  // 6. PROTECTED ORDER STATUS UPDATE API
  if (safeUrl === '/api/orders/update' && req.method === 'POST') {
    if (!isAuthenticated(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'غير مصرح بالوصول' }));
      return;
    }
    const body = await readRequestBody(req);
    const { id, status } = body;
    const orders = db.readOrders();
    const idx = orders.findIndex(o => o.id === id);

    if (idx !== -1) {
      orders[idx].status = status;
      db.writeOrders(orders);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'الطلب غير موجود' }));
    }
    return;
  }

  // 7. PROTECTED ORDER DELETE API
  if (safeUrl === '/api/orders/delete' && req.method === 'POST') {
    if (!isAuthenticated(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'غير مصرح بالوصول' }));
      return;
    }
    const body = await readRequestBody(req);
    const { id } = body;
    let orders = db.readOrders();
    
    if (orders.some(o => o.id === id)) {
      orders = orders.filter(o => o.id !== id);
      db.writeOrders(orders);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'الطلب غير موجود' }));
    }
    return;
  }

  // 8. PROTECTED PRODUCTS SAVE API
  if (safeUrl === '/api/products' && req.method === 'POST') {
    if (!isAuthenticated(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'غير مصرح بالوصول' }));
      return;
    }
    let body = await readRequestBody(req);
    // Intercept Base64 encoded images and write them as physical files to assets/
    body = extractBase64Images(body);

    db.writeProducts(body);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // 9. PROTECTED CHANGE PASSWORD API
  if (safeUrl === '/api/admin/change-password' && req.method === 'POST') {
    if (!isAuthenticated(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'غير مصرح بالوصول' }));
      return;
    }
    const body = await readRequestBody(req);
    const { oldPassword, newPassword } = body;
    const config = db.readAdminConfig();

    if (db.hashPassword(oldPassword) === config.password_hash) {
      config.password_hash = db.hashPassword(newPassword);
      db.writeAdminConfig(config);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'كلمة المرور الحالية غير صحيحة' }));
    }
    return;
  }

  // 10. PROTECTED UPLOAD LOGO API
  if (safeUrl === '/api/admin/upload-logo' && req.method === 'POST') {
    if (!isAuthenticated(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'غير مصرح بالوصول' }));
      return;
    }
    const body = await readRequestBody(req);
    const { logoData } = body;

    if (logoData && logoData.startsWith('data:image/')) {
      const matches = logoData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
        const data = matches[2];
        const filename = `custom-logo-${crypto.randomBytes(3).toString('hex')}.${ext}`;
        const assetsDir = path.join(__dirname, 'assets');
        const filePath = path.join(assetsDir, filename);

        try {
          // Write uploaded logo to assets
          fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
          // Copy it also to assets/store-avatar.png for easy caching
          fs.writeFileSync(path.join(assetsDir, 'store-avatar.png'), Buffer.from(data, 'base64'));
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, url: 'assets/' + filename }));
          return;
        } catch (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'فشل حفظ الشعار على الخادم' }));
          return;
        }
      }
    }
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'تنسيق الشعار غير صالح' }));
    return;
  }

  // 11. PROTECTED CONFIG GET API
  if (safeUrl === '/api/admin/config' && req.method === 'GET') {
    if (!isAuthenticated(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'غير مصرح بالوصول' }));
      return;
    }
    const config = db.readAdminConfig();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ api_key: config.api_key }));
    return;
  }

  // ----------------------------------------------------
  // STATIC FILES SERVER
  // ----------------------------------------------------
  let filePath = path.join(__dirname, safeUrl === '/' ? 'index.html' : safeUrl);
  
  // Prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
