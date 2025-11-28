# Configuración Google Apps Script - Ferretería Web App

## Resumen
Este documento explica cómo configurar la Web App de Ferretería en Google Apps Script para integrar con Google Sheets como base de datos.

## Estructura de Google Sheets

### Hoja 1: Productos
```
| A: ID | B: Nombre | C: Categoría | D: Precio | E: Stock | F: Código | G: Descripción | H: Imagen URL
```

### Hoja 2: Contactos
```
| A: ID | B: Nombre | C: Teléfono | D: Email | E: Dirección | F: Fecha Registro
```

### Hoja 3: Pedidos
```
| A: ID Pedido | B: Cliente | C: Teléfono | D: Dirección | E: Productos | F: Total | G: Estado | H: Fecha | I: Horario Entrega
```

## Código Google Apps Script

### 1. Código Principal (Code.gs)
```javascript
// Configuración de la aplicación
const SHEET_ID = 'TU_SHEET_ID_AQUI'; // Reemplazar con el ID de tu Google Sheet
const WHATSAPP_NUMBER = '2644803769';

// Función para obtener todos los productos
function doGet(e) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Productos');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const product = {
      id: row[0],
      name: row[1],
      category: row[2],
      price: parseFloat(row[3]),
      stock: parseInt(row[4]),
      code: row[5],
      description: row[6],
      image: row[7] || 'resources/default.jpg'
    };
    products.push(product);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({products: products}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función para guardar un pedido
function saveOrder(orderData) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Pedidos');
    const productsSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Productos');
    
    // Preparar datos del pedido
    const orderRow = [
      orderData.orderId,
      orderData.customer.name,
      orderData.customer.phone,
      `${orderData.customer.address.street} ${orderData.customer.address.number}, ${orderData.customer.address.neighborhood}`,
      JSON.stringify(orderData.items),
      orderData.total,
      orderData.status,
      new Date().toLocaleString(),
      orderData.deliveryTime
    ];
    
    // Agregar fila a la hoja de pedidos
    sheet.appendRow(orderRow);
    
    // Actualizar stock de productos
    orderData.items.forEach(item => {
      const productId = item.productId;
      const quantity = item.quantity;
      
      // Buscar el producto en la hoja de productos
      const productData = productsSheet.getDataRange().getValues();
      for (let i = 1; i < productData.length; i++) {
        if (productData[i][0] === productId) {
          const currentStock = parseInt(productData[i][4]);
          const newStock = Math.max(0, currentStock - quantity);
          productsSheet.getRange(i + 1, 5).setValue(newStock); // Columna E (índice 5)
          break;
        }
      }
    });
    
    // Guardar contacto si es nuevo
    saveContact(orderData.customer);
    
    // Enviar notificación por WhatsApp
    sendWhatsAppNotification(orderData);
    
    return {success: true, orderId: orderData.orderId};
    
  } catch (error) {
    console.error('Error saving order:', error);
    return {success: false, error: error.toString()};
  }
}

// Función para guardar contacto
function saveContact(customerData) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Contactos');
  const data = sheet.getDataRange().getValues();
  
  // Verificar si el contacto ya existe
  let exists = false;
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === customerData.phone) { // Comparar por teléfono
      exists = true;
      break;
    }
  }
  
  if (!exists) {
    const contactRow = [
      Utilities.getUuid(), // Generar ID único
      customerData.name,
      customerData.phone,
      customerData.email || '',
      `${customerData.address.street} ${customerData.address.number}, ${customerData.address.neighborhood}`,
      new Date().toLocaleString()
    ];
    
    sheet.appendRow(contactRow);
  }
}

// Función para enviar notificación por WhatsApp
function sendWhatsAppNotification(orderData) {
  const message = formatWhatsAppMessage(orderData);
  const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
  
  // Aquí normalmente usarías una API de WhatsApp Business
  // Por ahora, solo registramos el mensaje
  console.log('WhatsApp message:', message);
  console.log('WhatsApp URL:', url);
  
  // Si tienes una API de WhatsApp Business, puedes hacer una llamada HTTP aquí
  // UrlFetchApp.fetch('URL_DE_TU_API_WHATSAPP', {
  //   method: 'post',
  //   contentType: 'application/json',
  //   payload: JSON.stringify({
  //     phone: WHATSAPP_NUMBER,
  //     message: message
  //   })
  // });
}

// Función para formatear mensaje de WhatsApp
function formatWhatsAppMessage(orderData) {
  let message = `🛒 *Nuevo Pedido de Ferretería*\\n\\n`;
  message += `📋 *Orden:* ${orderData.orderId}\\n`;
  message += `👤 *Cliente:* ${orderData.customer.name}\\n`;
  message += `📱 *Teléfono:* ${orderData.customer.phone}\\n`;
  message += `📍 *Dirección:* ${orderData.customer.address.street} ${orderData.customer.address.number}, ${orderData.customer.address.neighborhood}\\n`;
  message += `🕐 *Horario:* ${orderData.deliveryTime}\\n\\n`;
  
  message += `📦 *Productos:*\\n`;
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Productos');
  const products = sheet.getDataRange().getValues();
  
  orderData.items.forEach(item => {
    const product = products.find(p => p[0] === item.productId);
    if (product) {
      message += `• ${product[1]} x${item.quantity} - $${(product[3] * item.quantity).toFixed(2)}\\n`;
    }
  });
  
  message += `\\n💰 *Total:* $${orderData.total.toFixed(2)}\\n`;
  message += `📅 *Fecha:* ${new Date().toLocaleDateString()}`;
  
  return message;
}

// Función para obtener estadísticas (opcional)
function getStats() {
  const ordersSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Pedidos');
  const productsSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Productos');
  const contactsSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Contactos');
  
  const stats = {
    totalOrders: ordersSheet.getLastRow() - 1,
    totalProducts: productsSheet.getLastRow() - 1,
    totalContacts: contactsSheet.getLastRow() - 1,
    totalRevenue: 0
  };
  
  // Calcular ingresos totales
  const ordersData = ordersSheet.getDataRange().getValues();
  for (let i = 1; i < ordersData.length; i++) {
    stats.totalRevenue += parseFloat(ordersData[i][5] || 0);
  }
  
  return stats;
}
```

### 2. Configuración del Despliegue

1. **Abrir Google Apps Script:**
   - Ve a [script.google.com](https://script.google.com)
   - Crea un nuevo proyecto
   - Copia el código anterior

2. **Crear Google Sheet:**
   - Crea una nueva hoja de cálculo de Google
   - Crea las tres hojas: "Productos", "Contactos", "Pedidos"
   - Agrega los encabezados según la estructura indicada

3. **Configurar ID de la hoja:**
   - Copia el ID de tu Google Sheet (está en la URL)
   - Reemplaza `TU_SHEET_ID_AQUI` en el código

4. **Desplegar la aplicación:**
   - Haz clic en "Deploy" > "New deployment"
   - Tipo: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Haz clic en "Deploy" y copia la URL

5. **Permisos:**
   - La primera vez que ejecutes el script, Google pedirá permisos
   - Acepta todos los permisos necesarios

## Integración con la Web App

### 1. Actualizar main.js
Agrega estas funciones al archivo main.js:

```javascript
// Función para obtener productos desde Google Apps Script
async function loadProductsFromSheet() {
    try {
        const response = await fetch('URL_DE_TU_GOOGLE_APPS_SCRIPT');
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error loading products from sheet:', error);
        return this.getProducts(); // Fallback a productos locales
    }
}

// Función para guardar pedido en Google Sheets
async function saveOrderToSheet(orderData) {
    try {
        const response = await fetch('URL_DE_TU_GOOGLE_APPS_SCRIPT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                function: 'saveOrder',
                parameters: [orderData]
            })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error saving order to sheet:', error);
        return {success: false, error: error.message};
    }
}
```

### 2. Modificar el proceso de checkout
En checkout.html, modifica la función `submitOrder()`:

```javascript
async function submitOrder() {
    const orderData = {
        orderId: 'ORD' + Date.now().toString().slice(-6),
        customer: {
            name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: {
                street: document.getElementById('street').value,
                number: document.getElementById('number').value,
                neighborhood: document.getElementById('neighborhood').value,
                city: document.getElementById('city').value,
                references: document.getElementById('references').value
            }
        },
        deliveryTime: selectedDeliveryTime,
        items: window.ferreteriaApp.cart,
        total: window.ferreteriaApp.getCartTotal(),
        status: 'pendiente',
        createdAt: new Date().toISOString()
    };
    
    // Guardar en Google Sheets
    const result = await saveOrderToSheet(orderData);
    
    if (result.success) {
        // Enviar WhatsApp
        window.ferreteriaApp.sendWhatsAppOrder(orderData);
        
        // Limpiar carrito
        localStorage.removeItem('ferreteria_cart');
        localStorage.setItem('last_order', JSON.stringify(orderData));
        
        // Redirigir a confirmación
        window.location.href = 'confirmation.html';
    } else {
        alert('Error al procesar el pedido: ' + result.error);
    }
}
```

## Configuración de WhatsApp Business API (Opcional)

Para integración completa con WhatsApp:

1. **Regístrate en WhatsApp Business API**
2. **Obtén credenciales de acceso**
3. **Modifica la función sendWhatsAppNotification:**

```javascript
function sendWhatsAppNotification(orderData) {
  const message = formatWhatsAppMessage(orderData);
  
  // Usando WhatsApp Business API
  const apiUrl = 'https://graph.facebook.com/v13.0/YOUR_PHONE_NUMBER_ID/messages';
  const accessToken = 'YOUR_ACCESS_TOKEN';
  
  const payload = {
    messaging_product: 'whatsapp',
    to: WHATSAPP_NUMBER,
    type: 'text',
    text: {
      body: message
    }
  };
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(apiUrl, options);
  } catch (error) {
    console.error('WhatsApp API error:', error);
  }
}
```

## Mantenimiento y Monitoreo

### 1. Verificación de Stock
Agrega esta función para verificar stock antes de procesar pedidos:

```javascript
function checkStockAvailability(items) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Productos');
  const products = sheet.getDataRange().getValues();
  const unavailable = [];
  
  items.forEach(item => {
    const product = products.find(p => p[0] === item.productId);
    if (product && product[4] < item.quantity) {
      unavailable.push({
        productId: item.productId,
        productName: product[1],
        available: product[4],
        requested: item.quantity
      });
    }
  });
  
  return unavailable;
}
```

### 2. Reportes Automatizados
```javascript
function sendDailyReport() {
  const stats = getStats();
  const message = `📊 Reporte Diario Ferretería\\n\\n` +
    `📦 Pedidos: ${stats.totalOrders}\\n` +
    `🏷️ Productos: ${stats.totalProducts}\\n` +
    `👥 Clientes: ${stats.totalContacts}\\n` +
    `💰 Ingresos: $${stats.totalRevenue.toFixed(2)}`;
  
  // Enviar por WhatsApp o email
}
```

## Seguridad y Mejores Prácticas

1. **Validación de Datos:** Siempre valida los datos de entrada
2. **Rate Limiting:** Implementa límites para evitar spam
3. **Logs:** Mantén registros de todas las transacciones
4. **Backup:** Haz copias de seguridad regularmente
5. **Permisos:** Revisa y actualiza permisos regularmente

## Solución de Problemas

### Error: "No tiene permisos"
- Verifica que el script tenga acceso a la hoja de cálculo
- Asegúrate de que la hoja sea pública o que el script tenga permisos

### Error: "Límite de tiempo excedido"
- Optimiza las consultas a la hoja
- Considera usar cache para datos frecuentes

### Error: "URL no válida"
- Verifica que la URL de despliegue sea correcta
- Asegúrate de que el despliegue esté activo

## Soporte

Para soporte técnico:
- 📧 Email: soporte@ferreteria.com
- 📱 WhatsApp: 2644803769
- 🌐 Web: www.ferreteria.com/soporte