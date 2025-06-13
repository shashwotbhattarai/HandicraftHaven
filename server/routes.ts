import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertProductSchema, insertCartItemSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
	// Categories
	app.get("/api/categories", async (req, res) => {
		try {
			const categories = await storage.getCategories();
			res.json(categories);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch categories" });
		}
	});

	app.post("/api/categories", async (req, res) => {
		try {
			const categoryData = insertCategorySchema.parse(req.body);
			const category = await storage.createCategory(categoryData);
			res.status(201).json(category);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid category data", errors: error.errors });
			} else {
				res.status(500).json({ message: "Failed to create category" });
			}
		}
	});

	app.put("/api/categories/:id", async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const categoryData = insertCategorySchema.partial().parse(req.body);
			const category = await storage.updateCategory(id, categoryData);

			if (!category) {
				res.status(404).json({ message: "Category not found" });
				return;
			}

			res.json(category);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid category data", errors: error.errors });
			} else {
				res.status(500).json({ message: "Failed to update category" });
			}
		}
	});

	app.delete("/api/categories/:id", async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const deleted = await storage.deleteCategory(id);

			if (!deleted) {
				res.status(404).json({ message: "Category not found" });
				return;
			}

			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: "Failed to delete category" });
		}
	});

	// Products
	app.get("/api/products", async (req, res) => {
		try {
			const { category, search } = req.query;
			let products;

			if (search && typeof search === "string") {
				products = await storage.searchProducts(search);
			} else if (category && typeof category === "string") {
				const categoryId = parseInt(category);
				products = await storage.getProductsByCategory(categoryId);
			} else {
				products = await storage.getProducts();
			}

			res.json(products);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch products" });
		}
	});

	app.get("/api/products/:id", async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const product = await storage.getProductById(id);

			if (!product) {
				res.status(404).json({ message: "Product not found" });
				return;
			}

			res.json(product);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch product" });
		}
	});

	app.post("/api/products", async (req, res) => {
		try {
			const productData = insertProductSchema.parse(req.body);
			const product = await storage.createProduct(productData);
			console.log("Created products:", storage.getProducts());
			res.status(201).json(product);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid product data", errors: error.errors });
			} else {
				res.status(500).json({ message: "Failed to create product" });
			}
		}
	});

	app.put("/api/products/:id", async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const productData = insertProductSchema.partial().parse(req.body);
			const product = await storage.updateProduct(id, productData);

			if (!product) {
				res.status(404).json({ message: "Product not found" });
				return;
			}

			res.json(product);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid product data", errors: error.errors });
			} else {
				res.status(500).json({ message: "Failed to update product" });
			}
		}
	});

	app.delete("/api/products/:id", async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const deleted = await storage.deleteProduct(id);

			if (!deleted) {
				res.status(404).json({ message: "Product not found" });
				return;
			}

			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: "Failed to delete product" });
		}
	});

	// Cart
	app.get("/api/cart/:sessionId", async (req, res) => {
		try {
			const { sessionId } = req.params;
			const cartItems = await storage.getCartItems(sessionId);
			res.json(cartItems);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch cart items" });
		}
	});

	app.post("/api/cart", async (req, res) => {
		try {
			const cartItemData = insertCartItemSchema.parse(req.body);
			const cartItem = await storage.addToCart(cartItemData);
			res.status(201).json(cartItem);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
			} else {
				res.status(500).json({ message: "Failed to add item to cart" });
			}
		}
	});

	app.put("/api/cart/:sessionId/:productId", async (req, res) => {
		try {
			const { sessionId, productId } = req.params;
			const { quantity } = req.body;

			if (typeof quantity !== "number" || quantity < 0) {
				res.status(400).json({ message: "Invalid quantity" });
				return;
			}

			const cartItem = await storage.updateCartItem(sessionId, parseInt(productId), quantity);

			if (!cartItem && quantity > 0) {
				res.status(404).json({ message: "Cart item not found" });
				return;
			}

			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ message: "Failed to update cart item" });
		}
	});

	app.delete("/api/cart/:sessionId/:productId", async (req, res) => {
		try {
			const { sessionId, productId } = req.params;
			const deleted = await storage.removeFromCart(sessionId, parseInt(productId));

			if (!deleted) {
				res.status(404).json({ message: "Cart item not found" });
				return;
			}

			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: "Failed to remove cart item" });
		}
	});

	app.delete("/api/cart/:sessionId", async (req, res) => {
		try {
			const { sessionId } = req.params;
			await storage.clearCart(sessionId);
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: "Failed to clear cart" });
		}
	});

	// Orders
	app.get("/api/orders", async (req, res) => {
		try {
			const orders = await storage.getOrders();
			res.json(orders);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch orders" });
		}
	});

	app.get("/api/orders/:id", async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const order = await storage.getOrderById(id);

			if (!order) {
				res.status(404).json({ message: "Order not found" });
				return;
			}

			res.json(order);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch order" });
		}
	});

	app.post("/api/orders", async (req, res) => {
		try {
			const { order, items } = req.body;
			const validatedOrder = insertOrderSchema.parse(order);

			if (!items || !Array.isArray(items) || items.length === 0) {
				res.status(400).json({ message: "Order must contain items" });
				return;
			}

			const createdOrder = await storage.createOrder(validatedOrder, items);
			res.status(201).json(createdOrder);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: "Invalid order data", errors: error.errors });
			} else {
				res.status(500).json({ message: "Failed to create order" });
			}
		}
	});

	app.put("/api/orders/:id/status", async (req, res) => {
		try {
			const id = parseInt(req.params.id);
			const { status } = req.body;

			if (!status || typeof status !== "string") {
				res.status(400).json({ message: "Invalid status" });
				return;
			}

			const order = await storage.updateOrderStatus(id, status);

			if (!order) {
				res.status(404).json({ message: "Order not found" });
				return;
			}

			res.json(order);
		} catch (error) {
			res.status(500).json({ message: "Failed to update order status" });
		}
	});

	const httpServer = createServer(app);
	return httpServer;
}
