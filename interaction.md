# Interacción Web App Ferretería

## Flujo de Usuario Principal

### 1. Exploración de Productos
- **Catálogo principal**: Grid de productos con imagen, nombre, precio y botón "Agregar"
- **Búsqueda**: Barra de búsqueda con autocompletado y filtros por categoría
- **Filtros**: Por tipo (herramientas, tornillos, pinturas, etc.), precio y disponibilidad
- **Ordenamiento**: Por precio, nombre y popularidad

### 2. Gestión del Carrito
- **Agregar productos**: Click en botón agrega al carrito con animación visual
- **Carrito persistente**: Icono en header muestra cantidad y total
- **Modificar cantidades**: +/- en cada producto del carrito
- **Eliminar productos**: Botón X con confirmación
- **Total dinámico**: Calcula automáticamente con impuestos

### 3. Proceso de Pedido
- **Paso 1**: Datos personales (nombre, teléfono, email)
- **Paso 2**: Dirección de entrega (calle, número, barrio, referencias)
- **Paso 3**: Horario de entrega (mañana 9-12, tarde 14-18, noche 19-21)
- **Paso 4**: Revisión y confirmación del pedido

### 4. Confirmación y Notificación
- **Modal de confirmación**: Muestra resumen del pedido
- **WhatsApp**: Mensaje automático al número 2644803769
- **Email**: Confirmación por correo (opcional)
- **Tracking**: Número de pedido para seguimiento

## Componentes Interactivos

### 1. Sistema de Búsqueda Avanzada
- Input con sugerencias en tiempo real
- Filtros desplegables por categoría
- Búsqueda por código de producto
- Historial de búsquedas recientes

### 2. Carrito Inteligente
- Persistencia en localStorage
- Sincronización entre pestañas
- Cálculo de envío según zona
- Descuentos por cantidad

### 3. Formulario Multi-paso
- Validación en cada paso
- Guardado de progreso
- Prevención de pérdida de datos
- Mensajes de error claros

### 4. Sistema de Notificaciones
- Toast notifications para acciones
- Confirmaciones modales
- Estados de carga
- Mensajes de éxito/error

## Estados y Comportamientos

### Estados del Producto
- Disponible: Verde, puede agregarse al carrito
- Poco stock: Amarillo, mensaje de urgencia
- Agotado: Rojo, opción de notificar cuando vuelva

### Estados del Carrito
- Vacío: Mensaje animado "Tu carrito está vacío"
- Con productos: Muestra lista con totales
- Procesando: Indicador de carga al enviar pedido

### Estados del Formulario
- Normal: Campos habilitados
- Validando: Indicadores de carga
- Error: Bordes rojos con mensajes
- Éxito: Check verde y continuar

## Funcionalidades Adicionales

### Favoritos
- Corazón en productos para guardar
- Lista de deseos separada
- Comparación de productos

### Historial
- Productos vistos recientemente
- Pedidos anteriores
- Re-ordenar pedidos pasados

### Ayuda
- Chat de soporte (simulado)
- Preguntas frecuentes
- Guía de compra