// Ferretería Web App - Main JavaScript
class FerreteriaApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('ferreteria_cart')) || [];
        this.products = this.getProducts();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.initParticles();
        this.initAnimations();
        this.bindEvents();
    }

    getProducts() {
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
            },
            {
                id: 'drill-003',
                name: 'Taladro Eléctrico 12V',
                category: 'electricos',
                price: 3499.99,
                stock: 12,
                image: 'resources/drill.jpg',
                description: 'Taladro inalámbrico con batería de litio y 2 velocidades',
                code: 'TLD-003'
            },
            {
                id: 'screws-004',
                name: 'Tornillos Mixtos 200pz',
                category: 'tornillos',
                price: 399.99,
                stock: 50,
                image: 'resources/screws.jpg',
                description: 'Caja surtida de tornillos y tuercas de diferentes tamaños',
                code: 'TRN-004'
            },
            {
                id: 'paint-005',
                name: 'Pintura Acrílica Blanca 5L',
                category: 'pinturas',
                price: 1899.99,
                stock: 15,
                image: 'resources/paint.jpg',
                description: 'Pintura premium para interiores y exteriores, acabado mate',
                code: 'PNT-005'
            },
            {
                id: 'tape-006',
                name: 'Cinta Métrica 5m',
                category: 'herramientas',
                price: 299.99,
                stock: 30,
                image: 'resources/tape.jpg',
                description: 'Cinta métrica autoblocante con carcasa resistente',
                code: 'CMT-006'
            },
            {
                id: 'wrench-007',
                name: 'Llave Inglesa 12"',
                category: 'herramientas',
                price: 699.99,
                stock: 22,
                image: 'resources/wrench.jpg',
                description: 'Llave ajustable de acero cromado con mecanismo preciso',
                code: 'LLV-007'
            },
            {
                id: 'gloves-008',
                name: 'Guantes de Seguridad',
                category: 'seguridad',
                price: 249.99,
                stock: 40,
                image: 'resources/gloves.jpg',
                description: 'Guantes resistentes a cortes y químicos, talla única',
                code: 'GNT-008'
            },
            {
                id: 'helmet-009',
                name: 'Casco de Seguridad Blanco',
                category: 'seguridad',
                price: 549.99,
                stock: 28,
                image: 'resources/helmet.jpg',
                description: 'Casco industrial con suspensión interna y ventilación',
                code: 'CSC-009'
            },
            {
                id: 'saw-010',
                name: 'Sierra de Metal 24"',
                category: 'herramientas',
                price: 1199.99,
                stock: 16,
                image: 'resources/saw.jpg',
                description: 'Sierra de arco con hoja de acero rápido y mango ergonómico',
                code: 'SRA-010'
            },
            {
                id: 'toolbox-011',
                name: 'Caja de Herramientas 3 Niveles',
                category: 'herramientas',
                price: 2499.99,
                stock: 10,
                image: 'resources/toolbox.jpg',
                description: 'Organizador portátil con múltiples compartimentos y asa metálica',
                code: 'CH-011'
            },
            {
                id: 'pipes-012',
                name: 'Tubo de Cobre 1/2" 3m',
                category: 'plomeria',
                price: 799.99,
                stock: 20,
                image: 'resources/pipes.jpg',
                description: 'Tubo de cobre tipo L para instalaciones hidráulicas',
                code: 'TBC-012'
            },
            {
                id: 'switch-013',
                name: 'Interruptor Doble 15A',
                category: 'electricos',
                price: 189.99,
                stock: 35,
                image: 'resources/switch.jpg',
                description: 'Interruptor bipolar para instalación residencial',
                code: 'INT-013'
            },
            {
                id: 'wood-014',
                name: 'Tabla de Pino 2x4 3m',
                category: 'madera',
                price: 599.99,
                stock: 25,
                image: 'resources/wood.jpg',
                description: 'Madera de pino tratada para construcción en seco',
                code: 'TBL-014'
            },
            {
                id: 'chain-015',
                name: 'Cadena de Acero 5mm 10m',
                category: 'cadenas',
                price: 1499.99,
                stock: 14,
                image: 'resources/chain.jpg',
                description: 'Cadena galvanizada resistente a la corrosión',
                code: 'CDN-015'
            },
            {
                id: 'light-016',
                name: 'Luz de Trabajo LED 50W',
                category: 'electricos',
                price: 899.99,
                stock: 19,
                image: 'resources/light.jpg',
                description: 'Luz portátil con base magnética y batería recargable',
                code: 'LTR-016'
            }
        ];
    }

    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return false;

        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
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
        const item = this.cart.find(item => item.productId === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
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
            message += `• ${product.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        message += `\n💰 *Total:* $${orderData.total.toFixed(2)}\n`;
        message += `📅 *Fecha:* ${new Date().toLocaleDateString()}`;
        
        return message;
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