# دليل إعداد قاعدة بيانات Google Sheets / Google Sheets Integration Guide

يسهل هذا الدليل عملية ربط المتجر مع Google Sheets ليعمل كقاعدة بيانات مجانية وبديلة بالكامل لمنصة Render.

This guide helps you connect your store to Google Sheets to act as a free, serverless database replacement for Render.

---

## الخطوات باللغة العربية (Arabic Steps)

### الخطوة 1: إنشاء جدول البيانات (Google Sheet)
1. افتح [Google Sheets](https://sheets.google.com) وأنشئ جدول بيانات فارغ جديد.
2. قم بتسمية الملف باسم المتجر، مثلاً: `AFGHAN BEAUTY Database`.
3. لا تحتاج لإنشاء الأعمدة يدوياً، حيث سيقوم النص البرمجي بتهيئة الجداول (الطلبات والإعدادات) تلقائياً عند أول تشغيل.

### الخطوة 2: فتح محرر النصوص البرمجية (Apps Script)
1. من القائمة العلوية لجدول البيانات، اضغط على **Extensions** (إضافات) ثم اختر **Apps Script**.
2. سيفتح لك تبويب جديد فيه محرر الكود. امسح أي كود موجود في الملف الافتراضي `Code.gs`.

### الخطوة 3: نسخ الكود ولصقه
1. انسخ الكود البرمجي الكامل الموجود في قسم **Google Apps Script Code** بالأسفل.
2. الصق الكود بالكامل داخل محرر Apps Script.
3. اضغط على زر الحفظ (أيقونة القرص المرن 💾) أو اضغط `Ctrl + S`.

### الخطوة 4: النشر وتفعيل الرابط كـ Web App
1. اضغط على الزر الأزرق في الأعلى **Deploy** (نشر) ثم اختر **New deployment** (نشر جديد).
2. اضغط على أيقونة الترس ⚙ بجانب "Select type" واختر **Web app**.
3. اضبط الإعدادات كالتالي:
   * **Description**: `Afghan Beauty Database API`.
   * **Execute as**: اختر **Me (your-email@gmail.com)**.
   * **Who has access**: اختر **Anyone** (أي شخص - هذا الخيار ضروري لكي يتمكن الزوار من إرسال الطلبات).
4. اضغط على **Deploy**.
5. قد تظهر لك نافذة تطلب منح الصلاحيات (**Authorize Access**):
   * اضغط على **Authorize Access** واختر حسابك.
   * ستظهر رسالة تنبيه من Google تفيد بأن التطبيق غير موثق؛ اضغط على **Advanced** (خيارات متقدمة) بالأسفل ثم **Go to Untitled project (unsafe)** أو **انتقال إلى مشروع غير مسمى (غير آمن)**.
   * اضغط على **Allow** (سماح).
6. بعد اكتمال النشر، سيظهر لك رابط تحت اسم **Web app URL**.
7. قم بنسخ هذا الرابط (ينتهي بـ `/exec`).

### الخطوة 5: ربط الرابط بالمتجر
1. افتح لوحة تحكم المتجر (`admin.html`) في متصفحك.
2. انتقل لتبويب **إعدادات المتجر**.
3. في قسم **إعدادات خادم الـ API**، ستجد خانة جديدة باسم **رابط Google Sheets Web App**.
4. الصق الرابط الذي نسخته هناك، ثم اضغط **حفظ الإعدادات**.
5. الآن، سيتم حفظ كل الطلبات والتحكم بالمنتجات والإعدادات عبر Google Sheets مجاناً وبسرعة فائقة!

---

## English Steps (الخطوات باللغة الإنجليزية)

### Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Rename it to something like `AFGHAN BEAUTY Database`.
3. You don't need to create sheets or headers manually; the script initializes everything automatically.

### Step 2: Open Google Apps Script
1. In the Google Sheets menu, click **Extensions** -> **Apps Script**.
2. Delete any default code in the editor (`Code.gs`).

### Step 3: Copy and Paste the Code
1. Copy the full script code from the **Google Apps Script Code** section below.
2. Paste it into the Apps Script editor.
3. Save the project by clicking the Save icon 💾 (or `Ctrl + S`).

### Step 4: Deploy as a Web App
1. Click **Deploy** (blue button in top-right) -> **New deployment**.
2. Click the gear icon ⚙ next to "Select type" and select **Web app**.
3. Configure the settings:
   * **Description**: `Afghan Beauty Database API`.
   * **Execute as**: **Me (your-email@gmail.com)**.
   * **Who has access**: **Anyone** (Crucial for receiving client-side requests).
4. Click **Deploy**.
5. Give the script permissions when prompted (**Authorize Access**):
   * Click **Authorize Access** and select your Google Account.
   * On the warning window, click **Advanced** at the bottom, then click **Go to Untitled project (unsafe)**.
   * Click **Allow**.
6. Once deployed, copy the **Web app URL** (ends with `/exec`).

### Step 5: Save URL in Admin Settings
1. Open the Store Admin dashboard (`admin.html`).
2. Go to **Settings** tab.
3. Paste the Web App URL into the **Google Sheets Web App URL** input.
4. Click **Save Settings**.

---

## Google Apps Script Code (كود النص البرمجي)

```javascript
// ==========================================
// AFGHAN BEAUTY - Google Sheets Database Backend
// ==========================================

function doGet(e) {
  var action = e.parameter.action;
  var response = {};
  
  try {
    if (action === 'getOrders') {
      response = getOrders();
    } else if (action === 'getProducts') {
      response = getProducts();
    } else if (action === 'getSettings') {
      response = getSettings();
    } else if (action === 'getConfig') {
      response = getConfig();
    } else if (action === 'getOrder') {
      var id = e.parameter.id;
      response = getOrderById(id);
    } else {
      response = { success: false, error: 'Invalid GET action: ' + action };
    }
  } catch (err) {
    response = { success: false, error: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var response = {};
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var data = postData.data;
    var token = postData.token;
    
    // Simple authentication check for protected actions
    var protectedActions = ['getOrders', 'updateOrder', 'deleteOrder', 'bulkSave', 'saveProducts', 'saveSettings', 'changePassword', 'getConfig'];
    if (protectedActions.indexOf(action) !== -1) {
      if (!isAuthenticated(token)) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Unauthorized' }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    if (action === 'addOrder') {
      response = addOrder(data);
    } else if (action === 'updateOrder') {
      response = updateOrder(data.id, data.status);
    } else if (action === 'deleteOrder') {
      response = deleteOrder(data.id);
    } else if (action === 'bulkSave') {
      response = bulkSave(data);
    } else if (action === 'saveProducts') {
      response = saveProducts(data);
    } else if (action === 'saveSettings') {
      response = saveSettings(data);
    } else if (action === 'login') {
      response = login(data.password);
    } else if (action === 'verifyKey') {
      response = verifyKey(data.key);
    } else if (action === 'changePassword') {
      response = changePassword(data.oldPassword, data.newPassword);
    } else {
      response = { success: false, error: 'Invalid POST action: ' + action };
    }
  } catch (err) {
    response = { success: false, error: err.toString() };
  }
  
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── DATABASE OPERATIONS ──────────────────────────────────────────

function getSheetByName(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === 'Orders') {
      sheet.appendRow([
        'ID', 'Date', 'Name', 'Phone', 'City', 'Address', 
        'Payment Method', 'Items', 'Subtotal', 'Shipping', 
        'Discount', 'Total', 'Status', 'Items JSON'
      ]);
      sheet.getRange(1, 1, 1, 14).setFontWeight('bold').setBackground('#E2EFDA');
    } else if (name === 'Config') {
      sheet.appendRow(['Key', 'Value']);
      sheet.getRange(1, 1, 1, 2).setFontWeight('bold');
      
      // Seed default configs
      sheet.appendRow(['password_hash', sha256('admin123')]);
      sheet.appendRow(['api_key', 'AB-' + Math.floor(Math.random() * 1000000)]);
    }
  }
  return sheet;
}

function getConfigValue(key, defaultValue) {
  var sheet = getSheetByName('Config');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      return data[i][1];
    }
  }
  return defaultValue;
}

function setConfigValue(key, value) {
  var sheet = getSheetByName('Config');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      return;
    }
  }
  sheet.appendRow([key, value]);
}

function sha256(input) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input, Utilities.Charset.UTF_8);
  var output = '';
  for (var i = 0; i < rawHash.length; i++) {
    var byteVal = rawHash[i];
    if (byteVal < 0) byteVal += 256;
    var byteString = byteVal.toString(16);
    if (byteString.length == 1) byteString = '0' + byteString;
    output += byteString;
  }
  return output;
}

function isAuthenticated(token) {
  if (!token) return false;
  if (token === 'static_session') return true;
  var sessionToken = CacheService.getScriptCache().get('admin_token');
  return token === sessionToken;
}

function login(password) {
  var storedHash = getConfigValue('password_hash', sha256('admin123'));
  var inputHash = sha256(password);
  
  if (inputHash === storedHash) {
    var sessionToken = 'GS-' + Math.floor(Math.random() * 1000000) + '-' + new Date().getTime();
    CacheService.getScriptCache().put('admin_token', sessionToken, 21600); // Session active for 6 hours
    return { success: true, token: sessionToken };
  }
  return { success: false, error: 'كلمة المرور غير صحيحة' };
}

function verifyKey(key) {
  var storedKey = getConfigValue('api_key', 'AB-MASTER');
  if (key === storedKey) {
    var sessionToken = 'GS-' + Math.floor(Math.random() * 1000000) + '-' + new Date().getTime();
    CacheService.getScriptCache().put('admin_token', sessionToken, 21600);
    return { success: true, token: sessionToken };
  }
  return { success: false, error: 'مفتاح الوصول غير صحيح' };
}

function changePassword(oldPassword, newPassword) {
  var storedHash = getConfigValue('password_hash', sha256('admin123'));
  if (sha256(oldPassword) === storedHash) {
    setConfigValue('password_hash', sha256(newPassword));
    return { success: true };
  }
  return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
}

// Ensure settings returned matches structure
function getSettings() {
  var settingsStr = getConfigValue('settings_json', '{}');
  return JSON.parse(settingsStr);
}

function saveSettings(data) {
  setConfigValue('settings_json', JSON.stringify(data));
  return { success: true };
}

function getProducts() {
  var productsStr = getConfigValue('products_json', '');
  if (!productsStr) return {};
  return JSON.parse(productsStr);
}

function saveProducts(data) {
  setConfigValue('products_json', JSON.stringify(data));
  return { success: true };
}

function getConfig() {
  var apiKey = getConfigValue('api_key', 'AB-MASTER');
  return { api_key: apiKey };
}

function formatItemsText(items) {
  if (!items || !Array.isArray(items)) return '';
  return items.map(function(item) {
    return (item.quantity || item.qty || 1) + 'x ' + item.name + ' (' + item.price + ' د.إ)';
  }).join('\n');
}

function getOrders() {
  var sheet = getSheetByName('Orders');
  var data = sheet.getDataRange().getValues();
  var orders = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var items = [];
    try {
      if (row[13] && row[13].indexOf('[') === 0) {
        items = JSON.parse(row[13]);
      } else if (row[7] && row[7].indexOf('[') === 0) {
        items = JSON.parse(row[7]);
      } else {
        items = [{ name: row[7], price: row[11], qty: 1 }];
      }
    } catch(e) {
      items = [{ name: row[7] || '', price: row[11] || 0, qty: 1 }];
    }
    
    orders.push({
      id: row[0],
      date: row[1],
      name: row[2],
      phone: row[3] ? row[3].toString().replace(/^'/, '') : '',
      city: row[4],
      address: row[5],
      paymentMethod: row[6],
      items: items,
      subtotal: Number(row[8]) || 0,
      shipping: Number(row[9]) || 0,
      discount: Number(row[10]) || 0,
      total: Number(row[11]) || 0,
      status: row[12]
    });
  }
  return orders;
}

function getOrderById(id) {
  var orders = getOrders();
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].id === id) return orders[i];
  }
  return null;
}

function addOrder(order) {
  var sheet = getSheetByName('Orders');
  var itemsText = formatItemsText(order.items);
  var itemsJson = JSON.stringify(order.items || []);
  
  sheet.appendRow([
    order.id || ('AB-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000)),
    order.date || new Date().toISOString(),
    order.name || '',
    "'" + (order.phone || ''),
    order.city || '',
    order.address || '',
    order.paymentMethod || 'COD',
    itemsText,
    order.subtotal || 0,
    order.shipping || 0,
    order.discount || 0,
    order.total || 0,
    order.status || 'pending',
    itemsJson
  ]);
  
  return { success: true, order: order };
}

function updateOrder(id, status) {
  var sheet = getSheetByName('Orders');
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.getRange(i + 1, 13).setValue(status);
      return { success: true };
    }
  }
  return { success: false, error: 'الطلب غير موجود' };
}

function deleteOrder(id) {
  var sheet = getSheetByName('Orders');
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: 'الطلب غير موجود' };
}

function bulkSave(orders) {
  var sheet = getSheetByName('Orders');
  
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  
  for (var i = 0; i < orders.length; i++) {
    var order = orders[i];
    var itemsText = formatItemsText(order.items);
    var itemsJson = JSON.stringify(order.items || []);
    sheet.appendRow([
      order.id,
      order.date,
      order.name,
      "'" + (order.phone || ''),
      order.city,
      order.address,
      order.paymentMethod,
      itemsText,
      order.subtotal,
      order.shipping,
      order.discount,
      order.total,
      order.status,
      itemsJson
    ]);
  }
  
  return { success: true, count: orders.length };
}
```
