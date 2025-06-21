import {
        Category,
        InsertCategory,
        Product,
        InsertProduct,
        ProductWithCategory,
        Order,
        InsertOrder,
        OrderWithItems,
        OrderItem,
        InsertOrderItem,
        CartItem,
        InsertCartItem,
        CartItemWithProduct,
        HeroImage,
        InsertHeroImage,
        MakerStory,
        InsertMakerStory,
} from "@shared/schema";

export interface IStorage {
        // Categories
        getCategories(): Promise<Category[]>;
        getCategoryById(id: number): Promise<Category | undefined>;
        createCategory(category: InsertCategory): Promise<Category>;
        updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
        deleteCategory(id: number): Promise<boolean>;

        // Products
        getProducts(): Promise<ProductWithCategory[]>;
        getProductById(id: number): Promise<ProductWithCategory | undefined>;
        getProductsByCategory(categoryId: number): Promise<ProductWithCategory[]>;
        createProduct(product: InsertProduct): Promise<Product>;
        updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
        deleteProduct(id: number): Promise<boolean>;
        searchProducts(query: string): Promise<ProductWithCategory[]>;

        // Cart
        getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
        addToCart(item: InsertCartItem): Promise<CartItem>;
        updateCartItem(sessionId: string, productId: number, quantity: number): Promise<CartItem | undefined>;
        removeFromCart(sessionId: string, productId: number): Promise<boolean>;
        clearCart(sessionId: string): Promise<boolean>;

        // Orders
        getOrders(): Promise<Order[]>;
        getOrderById(id: number): Promise<OrderWithItems | undefined>;
        createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
        updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

        // Hero Images
        getHeroImages(): Promise<HeroImage[]>;
        getHeroImageById(id: number): Promise<HeroImage | undefined>;
        createHeroImage(heroImage: InsertHeroImage): Promise<HeroImage>;
        updateHeroImage(id: number, heroImage: Partial<InsertHeroImage>): Promise<HeroImage | undefined>;
        deleteHeroImage(id: number): Promise<boolean>;
        updateHeroImageOrder(id: number, order: number): Promise<HeroImage | undefined>;

        // Maker Stories
        getMakerStories(): Promise<MakerStory[]>;
        getMakerStoryById(id: number): Promise<MakerStory | undefined>;
        createMakerStory(story: InsertMakerStory): Promise<MakerStory>;
        updateMakerStory(id: number, story: Partial<InsertMakerStory>): Promise<MakerStory | undefined>;
        deleteMakerStory(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
        private categories: Map<number, Category>;
        private products: Map<number, Product>;
        private orders: Map<number, Order>;
        private orderItems: Map<number, OrderItem>;
        private cartItems: Map<string, CartItem[]>;
        private heroImages: Map<number, HeroImage>;
        private makerStories: Map<number, MakerStory>;
        private currentCategoryId: number;
        private currentProductId: number;
        private currentOrderId: number;
        private currentOrderItemId: number;
        private currentCartItemId: number;
        private currentHeroImageId: number;
        private currentMakerStoryId: number;

        constructor() {
                this.categories = new Map();
                this.products = new Map();
                this.orders = new Map();
                this.orderItems = new Map();
                this.cartItems = new Map();
                this.heroImages = new Map();
                this.makerStories = new Map();
                this.currentCategoryId = 1;
                this.currentProductId = 1;
                this.currentOrderId = 1;
                this.currentOrderItemId = 1;
                this.currentCartItemId = 1;
                this.currentHeroImageId = 1;
                this.currentMakerStoryId = 1;

                this.initializeData();
                this.initializeMakerStories();
        }

        private initializeData() {
                // Initialize categories
                const categories: Category[] = [
                        { id: 1, name: "Knitting & Yarn", description: "Handknitted items, yarns, and knitting supplies", isActive: true },
                        { id: 2, name: "Pottery & Ceramics", description: "Handmade ceramic items, pottery, and clay crafts", isActive: true },
                        { id: 3, name: "Textiles", description: "Woven fabrics, blankets, and textile crafts", isActive: true },
                        { id: 4, name: "Woodwork", description: "Handcrafted wooden items and furniture", isActive: true },
                        { id: 5, name: "Handmade Jewelry", description: "Unique jewelry pieces crafted by artisans", isActive: true },
                ];

                categories.forEach((category) => {
                        this.categories.set(category.id, category);
                });
                this.currentCategoryId = 6;

                // Initialize products
                const products: Product[] = [
                        {
                                id: 1,
                                name: "Handknitted Wool Sweater",
                                description:
                                        "Cozy wool sweater perfect for cold weather, made with premium yarn. Each sweater takes our skilled artisans 3-4 days to complete, ensuring the highest quality and attention to detail.",
                                price: "89.99",
                                categoryId: 1,
                                stock: 12,
                                imageUrl: "https://images.unsplash.com/photo-1583743089695-4b3b0b32ac6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                                images: [
                                        "https://images.unsplash.com/photo-1583743089695-4b3b0b32ac6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                                        "https://images.unsplash.com/photo-1445404590072-547608db1015?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                                ],
                                isActive: true,
                                sku: "HWS001",
                        },
                        {
                                id: 2,
                                name: "Ceramic Bowl Set",
                                description: "Beautiful handcrafted ceramic bowls with natural earth-tone glazing. Set of 4 bowls perfect for serving and home decoration.",
                                price: "65.00",
                                categoryId: 2,
                                stock: 8,
                                imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                                images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
                                isActive: true,
                                sku: "CBS002",
                        },
                        {
                                id: 3,
                                name: "Handwoven Throw Blanket",
                                description: "Luxurious handwoven blanket with traditional patterns and soft texture. Made from natural fibers using ancient weaving techniques.",
                                price: "125.00",
                                categoryId: 3,
                                stock: 5,
                                imageUrl: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                                images: ["https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
                                isActive: true,
                                sku: "HTB003",
                        },
                        {
                                id: 4,
                                name: "Artisan Cutting Board",
                                description: "Premium hardwood cutting board with beautiful natural grain patterns. Sustainably sourced and finished with food-safe oil.",
                                price: "45.00",
                                categoryId: 4,
                                stock: 15,
                                imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                                images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
                                isActive: true,
                                sku: "ACB004",
                        },
                        {
                                id: 5,
                                name: "Handcrafted Silver Set",
                                description:
                                        "Elegant handmade jewelry set with natural gemstones and sterling silver. Each piece is unique and comes with a certificate of authenticity.",
                                price: "195.00",
                                categoryId: 5,
                                stock: 3,
                                imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                                images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
                                isActive: true,
                                sku: "HSS005",
                        },
                        {
                                id: 6,
                                name: "Hand-Dyed Yarn Set",
                                description: "Premium wool yarn hand-dyed in beautiful natural colors. Perfect for your next knitting project with vibrant, long-lasting colors.",
                                price: "32.00",
                                categoryId: 1,
                                stock: 25,
                                imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                                images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
                                isActive: true,
                                sku: "HDY006",
                        },
                        {
                                id: 7,
                                name: "Ceramic Vase Collection",
                                description: "Unique handthrown ceramic vases with artistic glazing techniques. Each vase is one-of-a-kind and perfect for home decoration.",
                                price: "78.00",
                                categoryId: 2,
                                stock: 6,
                                imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                                images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
                                isActive: true,
                                sku: "CVC007",
                        },
                        {
                                id: 8,
                                name: "Woven Storage Baskets",
                                description:
                                        "Beautiful handwoven baskets perfect for home organization and decor. Made from sustainable natural materials using traditional techniques.",
                                price: "52.00",
                                categoryId: 3,
                                stock: 10,
                                imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
                                images: ["https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"],
                                isActive: true,
                                sku: "WSB008",
                        },
                ];

                products.forEach((product) => {
                        this.products.set(product.id, product);
                });
                this.currentProductId = 9;

                // Initialize hero images
                const heroImages: HeroImage[] = [
                        {
                                id: 1,
                                title: "Handcrafted with Love",
                                description: "Discover unique artisan pieces made with traditional techniques and modern style",
                                imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
                                order: 1,
                                isActive: true,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                        },
                        {
                                id: 2,
                                title: "Artisan Pottery Collection",
                                description: "Beautiful ceramic pieces crafted by skilled artisans using time-honored methods",
                                imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
                                order: 2,
                                isActive: true,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                        },
                        {
                                id: 3,
                                title: "Premium Yarn & Textiles",
                                description: "Hand-dyed yarns and woven textiles perfect for your creative projects",
                                imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600",
                                order: 3,
                                isActive: true,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                        },
                ];

                heroImages.forEach((heroImage) => {
                        this.heroImages.set(heroImage.id, heroImage);
                });
                this.currentHeroImageId = 4;
        }

        // Categories
        async getCategories(): Promise<Category[]> {
                return Array.from(this.categories.values()).filter((cat) => cat.isActive);
        }

        async getCategoryById(id: number): Promise<Category | undefined> {
                return this.categories.get(id);
        }

        async createCategory(category: InsertCategory): Promise<Category> {
                const id = this.currentCategoryId++;
                const newCategory: Category = {
                        id,
                        name: category.name,
                        description: category.description ?? null,
                        isActive: category.isActive ?? true,
                };
                this.categories.set(id, newCategory);
                return newCategory;
        }

        async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
                const existing = this.categories.get(id);
                if (!existing) return undefined;

                const updated: Category = { ...existing, ...category };
                this.categories.set(id, updated);
                return updated;
        }

        async deleteCategory(id: number): Promise<boolean> {
                return this.categories.delete(id);
        }

        // Products
        async getProducts(): Promise<ProductWithCategory[]> {
                const products = Array.from(this.products.values()).filter((p) => p.isActive);
                return products.map((product) => ({
                        ...product,
                        category: this.categories.get(product.categoryId)!,
                }));
        }

        async getProductById(id: number): Promise<ProductWithCategory | undefined> {
                const product = this.products.get(id);
                if (!product) return undefined;

                const category = this.categories.get(product.categoryId);
                if (!category) return undefined;

                return { ...product, category };
        }

        async getProductsByCategory(categoryId: number): Promise<ProductWithCategory[]> {
                const products = Array.from(this.products.values()).filter((p) => p.categoryId === categoryId && p.isActive);

                return products.map((product) => ({
                        ...product,
                        category: this.categories.get(product.categoryId)!,
                }));
        }

        async createProduct(product: InsertProduct): Promise<Product> {
                const id = this.currentProductId++;
                const newProduct: Product = {
                        id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        categoryId: product.categoryId,
                        stock: product.stock ?? 0,
                        imageUrl: product.imageUrl,
                        images: product.images ?? null,
                        isActive: product.isActive ?? true,
                        sku: product.sku,
                };
                this.products.set(id, newProduct);
                return newProduct;
        }

        async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
                const existing = this.products.get(id);
                if (!existing) return undefined;

                const updated: Product = { ...existing, ...product };
                this.products.set(id, updated);
                return updated;
        }

        async deleteProduct(id: number): Promise<boolean> {
                return this.products.delete(id);
        }

        async searchProducts(query: string): Promise<ProductWithCategory[]> {
                const lowercaseQuery = query.toLowerCase();
                const products = Array.from(this.products.values()).filter(
                        (p) => p.isActive && (p.name.toLowerCase().includes(lowercaseQuery) || p.description.toLowerCase().includes(lowercaseQuery))
                );

                return products.map((product) => ({
                        ...product,
                        category: this.categories.get(product.categoryId)!,
                }));
        }

        async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
                const items = this.cartItems.get(sessionId) || [];
                return items
                        .map((item) => {
                                const product = this.products.get(item.productId);
                                if (!product) return null;
                                const category = this.categories.get(product.categoryId);
                                if (!category) return null;
                                return {
                                        ...item,
                                        product: {
                                                ...product,
                                                category,
                                        },
                                };
                        })
                        .filter(Boolean) as CartItemWithProduct[];
        }

        async addToCart(item: InsertCartItem): Promise<CartItem> {
                const id = this.currentCartItemId++;
                const newItem: CartItem = { ...item, id };

                const sessionItems = this.cartItems.get(item.sessionId) || [];
                const existingIndex = sessionItems.findIndex((i) => i.productId === item.productId);

                if (existingIndex >= 0) {
                        sessionItems[existingIndex].quantity += item.quantity;
                } else {
                        sessionItems.push(newItem);
                }

                this.cartItems.set(item.sessionId, sessionItems);
                return newItem;
        }

        async updateCartItem(sessionId: string, productId: number, quantity: number): Promise<CartItem | undefined> {
                const sessionItems = this.cartItems.get(sessionId) || [];
                const itemIndex = sessionItems.findIndex((i) => i.productId === productId);

                if (itemIndex === -1) return undefined;

                if (quantity <= 0) {
                        sessionItems.splice(itemIndex, 1);
                } else {
                        sessionItems[itemIndex].quantity = quantity;
                }

                this.cartItems.set(sessionId, sessionItems);
                return sessionItems[itemIndex];
        }

        async removeFromCart(sessionId: string, productId: number): Promise<boolean> {
                const sessionItems = this.cartItems.get(sessionId) || [];
                const itemIndex = sessionItems.findIndex((i) => i.productId === productId);

                if (itemIndex === -1) return false;

                sessionItems.splice(itemIndex, 1);
                this.cartItems.set(sessionId, sessionItems);
                return true;
        }

        async clearCart(sessionId: string): Promise<boolean> {
                this.cartItems.delete(sessionId);
                return true;
        }

        // Orders
        async getOrders(): Promise<Order[]> {
                return Array.from(this.orders.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        async getOrderById(id: number): Promise<OrderWithItems | undefined> {
                const order = this.orders.get(id);
                if (!order) return undefined;

                const items = Array.from(this.orderItems.values())
                        .filter((item) => item.orderId === id)
                        .map((item) => ({
                                ...item,
                                product: this.products.get(item.productId)!,
                        }));

                return { ...order, items };
        }

        async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
                const id = this.currentOrderId++;
                const newOrder: Order = {
                        id,
                        customerName: order.customerName,
                        customerEmail: order.customerEmail,
                        total: order.total,
                        status: order.status ?? "pending",
                        createdAt: new Date(),
                };
                this.orders.set(id, newOrder);

                items.forEach((item) => {
                        const itemId = this.currentOrderItemId++;
                        const orderItem: OrderItem = { ...item, id: itemId, orderId: id };
                        this.orderItems.set(itemId, orderItem);
                });

                return newOrder;
        }

        async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
                const order = this.orders.get(id);
                if (!order) return undefined;

                const updated: Order = { ...order, status };
                this.orders.set(id, updated);
                return updated;
        }

        // Hero Images
        async getHeroImages(): Promise<HeroImage[]> {
                return Array.from(this.heroImages.values())
                        .filter((image) => image.isActive)
                        .sort((a, b) => a.order - b.order);
        }

        async getHeroImageById(id: number): Promise<HeroImage | undefined> {
                return this.heroImages.get(id);
        }

        async createHeroImage(heroImage: InsertHeroImage): Promise<HeroImage> {
                const id = this.currentHeroImageId++;
                const newHeroImage: HeroImage = {
                        id,
                        title: heroImage.title,
                        description: heroImage.description || null,
                        imageUrl: heroImage.imageUrl,
                        order: heroImage.order || 0,
                        isActive: heroImage.isActive ?? true,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                };
                this.heroImages.set(id, newHeroImage);
                return newHeroImage;
        }

        async updateHeroImage(id: number, heroImage: Partial<InsertHeroImage>): Promise<HeroImage | undefined> {
                const existing = this.heroImages.get(id);
                if (!existing) return undefined;

                const updated: HeroImage = {
                        ...existing,
                        ...heroImage,
                        updatedAt: new Date(),
                };
                this.heroImages.set(id, updated);
                return updated;
        }

        async deleteHeroImage(id: number): Promise<boolean> {
                return this.heroImages.delete(id);
        }

        async updateHeroImageOrder(id: number, order: number): Promise<HeroImage | undefined> {
                const existing = this.heroImages.get(id);
                if (!existing) return undefined;

                const updated: HeroImage = {
                        ...existing,
                        order,
                        updatedAt: new Date(),
                };
                this.heroImages.set(id, updated);
                return updated;
        }

        // Maker Stories
        async getMakerStories(): Promise<MakerStory[]> {
                return Array.from(this.makerStories.values())
                        .filter(story => story.isActive)
                        .sort((a, b) => a.order - b.order);
        }

        async getMakerStoryById(id: number): Promise<MakerStory | undefined> {
                return this.makerStories.get(id);
        }

        async createMakerStory(story: InsertMakerStory): Promise<MakerStory> {
                const newStory: MakerStory = {
                        id: this.currentMakerStoryId++,
                        ...story,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                };
                this.makerStories.set(newStory.id, newStory);
                return newStory;
        }

        async updateMakerStory(id: number, story: Partial<InsertMakerStory>): Promise<MakerStory | undefined> {
                const existing = this.makerStories.get(id);
                if (!existing) return undefined;

                const updated: MakerStory = {
                        ...existing,
                        ...story,
                        updatedAt: new Date(),
                };
                this.makerStories.set(id, updated);
                return updated;
        }

        async deleteMakerStory(id: number): Promise<boolean> {
                return this.makerStories.delete(id);
        }

        private initializeMakerStories() {
                const sampleStories: MakerStory[] = [
                        {
                                id: 1,
                                makerName: "Kamala Devi",
                                age: 32,
                                location: "Bhaktapur, Nepal",
                                story: "Kamala started pottery at age 16, learning from her grandmother. After marriage, she struggled to balance work and family until she joined our cooperative. Now she creates beautiful ceramic pieces while working from home, allowing her to care for her two young children. Her intricate designs blend traditional Newari patterns with modern aesthetics.",
                                imageUrl: "https://images.unsplash.com/photo-1594736797933-d0b22da3609b?w=400&h=300&fit=crop",
                                occupation: "Potter and Homemaker",
                                familyInfo: "Mother of two children, ages 6 and 9. Lives with extended family.",
                                craftsSpecialty: "Traditional Newari Pottery",
                                yearsOfExperience: 16,
                                impactStatement: "This work has given me independence and the ability to contribute to my family while preserving our cultural heritage.",
                                isActive: true,
                                order: 1,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                        },
                        {
                                id: 2,
                                makerName: "Sunita Thapa",
                                age: 28,
                                location: "Pokhara, Nepal",
                                story: "After her husband's accident left him unable to work, Sunita needed to support her family. She learned traditional dhaka weaving from local artisans and now creates beautiful scarves and bags. Her work provides steady income and has helped her children continue their education.",
                                imageUrl: "https://images.unsplash.com/photo-1609114122627-7de7f6b9e8b9?w=400&h=300&fit=crop",
                                occupation: "Weaver",
                                familyInfo: "Mother of three, primary breadwinner after husband's injury.",
                                craftsSpecialty: "Traditional Dhaka Weaving",
                                yearsOfExperience: 5,
                                impactStatement: "Through weaving, I've not only supported my family but also kept our traditional patterns alive for the next generation.",
                                isActive: true,
                                order: 2,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                        },
                        {
                                id: 3,
                                makerName: "Maya Sherpa",
                                age: 45,
                                location: "Solukhumbu, Nepal",
                                story: "Maya learned knitting from her mother in the mountains of Solukhumbu. Living in a remote area with limited opportunities, she joined our network to sell her warm woolen products globally. Her yak wool sweaters and traditional patterns are now cherished by customers worldwide.",
                                imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=300&fit=crop",
                                occupation: "Knitter and Yak Herder",
                                familyInfo: "Grandmother of five, teaches traditional knitting to local women.",
                                craftsSpecialty: "Yak Wool Knitting",
                                yearsOfExperience: 30,
                                impactStatement: "My knitting has connected our remote mountain community to the world, bringing both income and pride in our traditions.",
                                isActive: true,
                                order: 3,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                        }
                ];

                sampleStories.forEach((story) => {
                        this.makerStories.set(story.id, story);
                });
                this.currentMakerStoryId = 4;
        }
}

export const storage = new MemStorage();
