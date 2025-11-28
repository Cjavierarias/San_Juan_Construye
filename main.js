// Ferretería Web App - Main JavaScript
class FerreteriaApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('ferreteria_cart')) || [];
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProductsFromSheet();
        this.updateCartUI();
        this.initParticles();
        this.initAnimations();
        this.bindEvents();
    }

    async loadProductsFromSheet() {
        try {
            console.log('🔄 Cargando productos desde Google Sheet...');
            
            const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbw5JtLIQU5j-fj8fNO3iNfOQ3RO3pqmZMP2qFZ1RwpWl_4ZcyLIsNYQf_AgWEGx3I38/exec';
            
            const response = await fetch(WEBAPP_URL);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.products && Array.isArray(data.products)) {
                this.products = data.products;
                console.log(`✅ ${this.products.length} productos cargados desde Sheet`);
                
                // Generar la cuadrícula de productos después de cargarlos
                this.generateProductsGrid();
            } else {
                console.error('❌ Formato de respuesta inválido:', data);
                this.products = this.getDefaultProducts();
            }
            
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            // Fallback a productos por defecto
            this.products = this.getDefaultProducts();
            console.log('🔄 Usando productos por defecto');
        }
    }

    getDefaultProducts() {
        return [
            {
                id: 'hammer-001',
                name: 'Martillo de Carpintero',
                category: 'herramientas',
                price: 899.99,
                stock: 25,
                image: 'resources/hammer.jpg',
                description: 'Martillo profesional con cabeza de acero forjado y mango ergonómico',
                code: 'MRT-001'
            },
            {
                id: 'screwdriver-002',
                name: 'Juego de Destornilladores',
                category: 'herramientas',
                price: 1299.99,
                stock: 18,
                image: 'resources/screwdriver.jpg',
                description: 'Set de 6 destornilladores de precisión con puntas intercambiables',
                code: 'DST-002'
            }
        ];
    }

    generateProductsGrid() {
        const productsGrid = document.querySelector('.product-grid');
        if (!productsGrid) return;

        console.log('🔄 Generando cuadrícula de productos...');

        productsGrid.innerHTML = this.products.map(product => {
            const stockClass = product.stock > 20 ? 'stock-high' : 
                             product.stock > 10 ? 'stock-medium' : 'stock-low';
            const stockText = product.stock > 20 ? 'Disponible' : 
                            product.stock > 10 ? 'Poco stock' : 'Agotado';
            
            // Usar imagen por defecto si no hay URL
            const imageUrl = product.image || 'resources/placeholder.jpg';
            
            return `
                <div class="product-card p-6" data-category="${product.category}">
                    <img src="${imageUrl}" alt="${product.name}" class="product-image mb-4" 
                         onerror="this.src='resources/placeholder.jpg'">
                    <div class="mb-2">
                        <span class="stock-indicator ${stockClass}">${stockText}</span>
                    </div>
                    <h3 class="product-name font-bold text-lg mb-2 text-gray-800 font-inter">${product.name}</h3>
                    <p class="product-description text-gray-600 text-sm mb-3">${product.description}</p>
                    <div class="flex items-center justify-between mb-3">
                        <span class="text-xs text-gray-500">Código: ${product.code}</span>
                        <span class="text-xs text-gray-500">Stock: ${product.stock}</span>
                    </div>
                    <div class="price-tag mb-4">$${product.price.toFixed(2)}</div>
                    <button 
                        class="btn-primary w-full" 
                        onclick="addToCart('${product.id}')"
                        ${product.stock === 0 ? 'disabled' : ''}
                    >
                        ${product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                    </button>
                </div>
            `;
        }).join('');

        // Re-inicializar animaciones después de generar el grid
        this.initProductAnimations();
    }

    initProductAnimations() {
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.product-card',
                translateY: [50, 0],
                opacity: [0, 1],
                delay: anime.stagger(100),
                duration: 800,
                easing: 'easeOutExpo'
            });
        }
    }

    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            this.showToast('Producto no encontrado', 'error');
            return false;
        }

        // Verificar stock
        if (product.stock < quantity) {
            this.showToast(`Stock insuficiente. Solo quedan ${product.stock} unidades`, 'error');
            return false;
        }

        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            // Verificar que no exceda el stock total
            if (existingItem.quantity + quantity > product.stock) {
                this.showToast(`No puedes agregar más. Stock máximo: ${product.stock}`, 'error');
                return false;
            }
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                productId: productId,
                quantity: quantity,
                price: product.price
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showToast(`${product.name} agregado al carrito`, 'success');
        this.animateAddToCart();
        return true;
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity) {
        const product = this.products.find(p => p.id === productId);
        const item = this.cart.find(item => item.productId === productId);
        
        if (item && product) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else if (quantity > product.stock) {
                this.showToast(`No puedes agregar más. Stock máximo: ${product.stock}`, 'error');
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => {
            const product = this.products.find(p => p.id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }

    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('ferreteria_cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartCount) {
            const count = this.getCartItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
        }
        
        if (cartTotal) {
            cartTotal.textContent = `$${this.getCartTotal().toFixed(2)}`;
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    animateAddToCart() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('bounce');
            setTimeout(() => {
                cartIcon.classList.remove('bounce');
            }, 600);
        }
    }

    initParticles() {
        if (typeof p5 !== 'undefined' && document.getElementById('particles-canvas')) {
            new p5((p) => {
                let particles = [];
                
                p.setup = () => {
                    const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
                    canvas.parent('particles-canvas');
                    
                    for (let i = 0; i < 50; i++) {
                        particles.push({
                            x: p.random(p.width),
                            y: p.random(p.height),
                            vx: p.random(-1, 1),
                            vy: p.random(-1, 1),
                            size: p.random(2, 6),
                            opacity: p.random(0.1, 0.3)
                        });
                    }
                };
                
                p.draw = () => {
                    p.clear();
                    
                    particles.forEach(particle => {
                        p.fill(255, 107, 53, particle.opacity * 255);
                        p.noStroke();
                        p.circle(particle.x, particle.y, particle.size);
                        
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        
                        if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                        if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                    });
                };
                
                p.windowResized = () => {
                    p.resizeCanvas(window.innerWidth, window.innerHeight);
                };
            });
        }
    }

    initAnimations() {
        // Las animaciones de productos ahora se manejan en generateProductsGrid
    }

    bindEvents() {
        // Búsqueda en tiempo real
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        }

        // Filtros por categoría
        document.querySelectorAll('.category-filter').forEach(button => {
            button.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            });
        });

        // Cerrar toasts
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('toast-close')) {
                const toast = e.target.closest('.toast');
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }
        });
    }

    filterProducts(searchTerm) {
        const products = document.querySelectorAll('.product-card');
        const term = searchTerm.toLowerCase();
        
        products.forEach(product => {
            const name = product.querySelector('.product-name').textContent.toLowerCase();
            const description = product.querySelector('.product-description').textContent.toLowerCase();
            
            if (name.includes(term) || description.includes(term)) {
                product.style.display = 'block';
                product.classList.remove('hidden');
            } else {
                product.style.display = 'none';
                product.classList.add('hidden');
            }
        });
    }

    filterByCategory(category) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const productCategory = product.dataset.category;
            
            if (category === 'all' || productCategory === category) {
                product.style.display = 'block';
                product.classList.remove('hidden');
            } else {
                product.style.display = 'none';
                product.classList.add('hidden');
            }
        });
    }

    // WhatsApp integration
    sendWhatsAppOrder(orderData) {
        const phoneNumber = '2644803769';
        const message = this.formatOrderMessage(orderData);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    }

    formatOrderMessage(orderData) {
        let message = `🛒 *Nuevo Pedido de Ferretería*\n\n`;
        message += `📋 *Orden:* ${orderData.orderId}\n`;
        message += `👤 *Cliente:* ${orderData.customer.name}\n`;
        message += `📱 *Teléfono:* ${orderData.customer.phone}\n`;
        message += `📍 *Dirección:* ${orderData.customer.address.street}, ${orderData.customer.address.neighborhood}\n`;
        message += `🕐 *Horario:* ${orderData.deliveryTime}\n\n`;
        
        message += `📦 *Productos:*\n`;
        orderData.items.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                message += `• ${product.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
            } else {
                message += `• Producto no encontrado x${item.quantity}\n`;
            }
        });
        
        message += `\n💰 *Total:* $${orderData.total.toFixed(2)}\n`;
        message += `📅 *Fecha:* ${new Date().toLocaleDateString()}`;
        
        return message;
    }

    // Función para recargar productos (útil para actualizar stock)
    async refreshProducts() {
        await this.loadProductsFromSheet();
        this.updateCartUI();
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.ferreteriaApp = new FerreteriaApp();
});

// Funciones globales para los botones
function addToCart(productId) {
    window.ferreteriaApp.addToCart(productId);
}

function removeFromCart(productId) {
    window.ferreteriaApp.removeFromCart(productId);
}

function updateQuantity(productId, quantity) {
    window.ferreteriaApp.updateQuantity(productId, parseInt(quantity));
}

// Función global para recargar productos
function refreshProducts() {
    if (window.ferreteriaApp) {
        window.ferreteriaApp.refreshProducts();
    }
}
