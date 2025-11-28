# Estructura Web App Ferretería

## Archivos del Proyecto

### HTML Pages
1. **index.html** - Página principal con catálogo
2. **cart.html** - Carrito de compras
3. **checkout.html** - Formulario de pedido
4. **confirmation.html** - Confirmación de pedido

### JavaScript
1. **main.js** - Lógica principal y utilidades
2. **products.js** - Gestión de catálogo
3. **cart.js** - Manejo del carrito
4. **checkout.js** - Proceso de pedido
5. **whatsapp.js** - Integración WhatsApp

### Recursos
1. **resources/** - Carpeta de imágenes
   - Productos (15 imágenes diferentes)
   - Iconos y logos
   - Fondos y texturas

## Estructura de Datos

### Productos (products.js)
```javascript
{
  id: "unique_id",
  name: "Nombre del producto",
  category: "herramientas|tornillos|pinturas|electricos",
  price: 999.99,
  stock: 50,
  image: "resources/producto1.jpg",
  description: "Descripción detallada",
  code: "COD123"
}
```

### Carrito (cart.js)
```javascript
{
  items: [
    {
      productId: "id_producto",
      quantity: 2,
      price: 999.99
    }
  ],
  total: 1999.98,
  timestamp: "2025-11-24T10:30:00Z"
}
```

### Pedido (checkout.js)
```javascript
{
  orderId: "ORD123456",
  customer: {
    name: "Juan Pérez",
    phone: "2644803769",
    email: "juan@email.com",
    address: {
      street: "Calle Principal 123",
      neighborhood: "Centro",
      references: "Frente a la plaza"
    }
  },
  deliveryTime: "tarde",
  items: [...],
  total: 1999.98,
  status: "pendiente",
  createdAt: "2025-11-24T10:30:00Z"
}
```

## Flujo de Navegación

### Ruta Principal
1. **index.html** → Explorar productos → Agregar al carrito
2. **cart.html** → Revisar carrito → Proceder al checkout
3. **checkout.html** → Completar formulario → Confirmar pedido
4. **confirmation.html** → Ver confirmación → WhatsApp notificación

### Navegación Interna
- Header con logo, búsqueda y carrito
- Menú de categorías
- Breadcrumbs en páginas internas
- Footer con información de contacto

## Componentes Principales

### Header
- Logo de la ferretería
- Barra de búsqueda
- Icono del carrito con contador
- Menú de navegación

### Main Content
- Hero section con productos destacados
- Grid de productos con filtros
- Formularios de pedido
- Mensajes de confirmación

### Footer
- Información de contacto
- Horarios de atención
- Políticas de envío
- Redes sociales

## Funcionalidades por Página

### Index.html
- Catálogo completo de productos
- Búsqueda y filtros
- Carrito persistente
- Animaciones de entrada

### Cart.html
- Lista de productos agregados
- Modificación de cantidades
- Cálculo de totales
- Botón de checkout

### Checkout.html
- Formulario multi-paso
- Validación en tiempo real
- Selección de horario
- Resumen del pedido

### Confirmation.html
- Mensaje de éxito
- Detalles del pedido
- Número de seguimiento
- Botón de WhatsApp