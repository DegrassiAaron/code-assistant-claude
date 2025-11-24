---
name: "ecommerce-design"
version: "1.0.0"
description: "E-commerce optimized design for product-focused websites. Clean product displays, trust-building elements, optimized checkout flows, and conversion-focused patterns. Use for online stores, product catalogs, shopping experiences, and marketplace platforms. Do NOT use for SaaS tools, editorial content, or corporate websites."
author: "Code-Assistant-Claude"
category: "domain"

triggers:
  keywords: ["ecommerce", "shop", "store", "product", "cart", "checkout"]
  patterns: ["ecommerce.*design", "shop.*ui", "product.*page"]
  filePatterns: ["*.tsx", "*.jsx"]
  commands: ["/ecommerce-design"]

tokenCost:
  metadata: 70
  fullContent: 3200
  resources: 600

priority: "high"
autoActivate: true
---

# E-commerce Design Skill

Product-focused design optimized for online shopping and conversions.

## Design Philosophy

**Trust and Conversion**: Build confidence and drive sales
- **Product First**: Large, high-quality product images
- **Trust Signals**: Reviews, badges, secure checkout indicators
- **Clear CTAs**: Prominent add-to-cart and buy buttons
- **Simplified Flow**: Minimal friction from browse to purchase
- **Mobile Optimized**: Touch-friendly, fast-loading

## Typography

```tsx
fonts: {
  sans: "Inter"           // Clean, readable
  display: "Poppins"      // Friendly product names
}

// Product-focused scale
text-sm: 0.875rem      // Metadata, specs
text-base: 1rem        // Body text, descriptions
text-lg: 1.125rem      // Category headers
text-2xl: 1.5rem       // Product names
text-3xl: 1.875rem     // Prices
text-4xl: 2.25rem      // Hero headlines
```

## Color Palette

```tsx
colors: {
  primary: "#2563EB",      // Trust blue (CTAs)
  success: "#10B981",      // Green (in stock, success)
  warning: "#F59E0B",      // Orange (sale, limited)
  danger: "#EF4444",       // Red (out of stock, error)
  background: "#FFFFFF",   // Clean white
  surface: "#F9FAFB",      // Light gray surfaces
  text: {
    primary: "#111827",    // Dark gray
    secondary: "#6B7280",  // Medium gray
    muted: "#9CA3AF"       // Light gray
  }
}
```

## Component Examples

### Product Card

```tsx
<div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
  {/* Image */}
  <div className="relative aspect-square bg-gray-100 overflow-hidden">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />

    {/* Badges */}
    <div className="absolute top-3 left-3 flex flex-col gap-2">
      {product.isNew && (
        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
          NEW
        </span>
      )}
      {product.onSale && (
        <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">
          SALE
        </span>
      )}
    </div>

    {/* Quick actions */}
    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              aria-label="Add to wishlist">
        <HeartIcon className="w-5 h-5" />
      </button>
      <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
              aria-label="Quick view">
        <EyeIcon className="w-5 h-5" />
      </button>
    </div>
  </div>

  {/* Content */}
  <div className="p-4">
    {/* Category */}
    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
      {product.category}
    </p>

    {/* Name */}
    <h3 className="font-poppins text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
      {product.name}
    </h3>

    {/* Rating */}
    <div className="flex items-center gap-2 mb-3">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600">({product.reviews})</span>
    </div>

    {/* Price */}
    <div className="flex items-center gap-2 mb-4">
      {product.originalPrice && (
        <span className="text-gray-400 line-through text-sm">
          ${product.originalPrice}
        </span>
      )}
      <span className="text-2xl font-bold text-gray-900">
        ${product.price}
      </span>
      {product.discount && (
        <span className="text-sm font-semibold text-red-600">
          -{product.discount}%
        </span>
      )}
    </div>

    {/* Add to Cart */}
    <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg
                     hover:bg-blue-700 transition-colors">
      Add to Cart
    </button>
  </div>
</div>
```

### Product Page Hero

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-8 py-12">
  {/* Images */}
  <div className="space-y-4">
    {/* Main image */}
    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
      <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
    </div>

    {/* Thumbnails */}
    <div className="grid grid-cols-4 gap-4">
      {product.images.map((img, i) => (
        <button
          key={i}
          onClick={() => setSelectedImage(img)}
          className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors
                     ${selectedImage === img ? 'border-blue-600' : 'border-gray-200'}`}
        >
          <img src={img} alt="" className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  </div>

  {/* Info */}
  <div>
    {/* Breadcrumb */}
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
      <a href="/" className="hover:text-gray-900">Home</a>
      <ChevronRightIcon className="w-4 h-4" />
      <a href={`/category/${product.category}`} className="hover:text-gray-900">
        {product.category}
      </a>
      <ChevronRightIcon className="w-4 h-4" />
      <span className="text-gray-900">{product.name}</span>
    </nav>

    {/* Name */}
    <h1 className="font-poppins text-4xl font-bold text-gray-900 mb-4">
      {product.name}
    </h1>

    {/* Rating & Reviews */}
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
          ))}
        </div>
        <span className="font-semibold">{product.rating}</span>
      </div>
      <button className="text-blue-600 hover:underline">
        {product.reviewCount} Reviews
      </button>
    </div>

    {/* Price */}
    <div className="mb-6">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-4xl font-bold text-gray-900">${product.price}</span>
        {product.originalPrice && (
          <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
        )}
        {product.discount && (
          <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
            Save {product.discount}%
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">Tax included. Shipping calculated at checkout.</p>
    </div>

    {/* Stock */}
    <div className="flex items-center gap-2 mb-6">
      <CheckCircleIcon className="w-5 h-5 text-green-600" />
      <span className="font-semibold text-green-600">In Stock - Ships in 24h</span>
    </div>

    {/* Variant selector */}
    {product.variants && (
      <div className="mb-6">
        <label className="block font-semibold mb-3">Select Size</label>
        <div className="flex gap-3">
          {product.variants.map(variant => (
            <button
              key={variant.id}
              className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors
                         ${selectedVariant === variant.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-gray-400'}`}
              onClick={() => setSelectedVariant(variant.id)}
            >
              {variant.name}
            </button>
          ))}
        </div>
      </div>
    )}

    {/* Quantity */}
    <div className="mb-6">
      <label className="block font-semibold mb-3">Quantity</label>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}>
          <MinusIcon className="w-5 h-5 mx-auto" />
        </button>
        <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
        <button className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setQuantity(quantity + 1)}>
          <PlusIcon className="w-5 h-5 mx-auto" />
        </button>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-4 mb-8">
      <button className="flex-1 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl
                       hover:bg-blue-700 transition-colors">
        Add to Cart
      </button>
      <button className="py-4 px-6 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              aria-label="Add to wishlist">
        <HeartIcon className="w-6 h-6" />
      </button>
    </div>

    {/* Trust badges */}
    <div className="flex items-center gap-6 py-6 border-y border-gray-200">
      <div className="flex items-center gap-2">
        <TruckIcon className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium">Free Shipping</span>
      </div>
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium">Secure Payment</span>
      </div>
      <div className="flex items-center gap-2">
        <RefreshIcon className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium">Easy Returns</span>
      </div>
    </div>
  </div>
</div>
```

### Cart Summary

```tsx
<div className="bg-gray-50 rounded-xl p-6">
  <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

  {/* Items */}
  <div className="space-y-4 mb-6">
    {cart.items.map(item => (
      <div key={item.id} className="flex gap-4">
        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
        <div className="flex-1">
          <h4 className="font-semibold">{item.name}</h4>
          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
        </div>
        <span className="font-bold">${item.price * item.quantity}</span>
      </div>
    ))}
  </div>

  {/* Totals */}
  <div className="space-y-2 mb-6 pb-6 border-b border-gray-200">
    <div className="flex justify-between">
      <span className="text-gray-600">Subtotal</span>
      <span className="font-semibold">${subtotal}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Shipping</span>
      <span className="font-semibold text-green-600">Free</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Tax</span>
      <span className="font-semibold">${tax}</span>
    </div>
  </div>

  <div className="flex justify-between text-xl font-bold mb-6">
    <span>Total</span>
    <span>${total}</span>
  </div>

  <button className="w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-xl
                   hover:bg-blue-700 transition-colors mb-4">
    Proceed to Checkout
  </button>

  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
    <LockIcon className="w-4 h-4" />
    <span>Secure Checkout</span>
  </div>
</div>
```

## Trust Elements

### Security Badges

```tsx
<div className="flex items-center justify-center gap-8 py-8 border-y border-gray-200">
  <img src="/badges/ssl-secure.svg" alt="SSL Secure" className="h-10" />
  <img src="/badges/payment-methods.svg" alt="Accepted Payments" className="h-10" />
  <img src="/badges/money-back.svg" alt="Money Back Guarantee" className="h-10" />
</div>
```

### Reviews Section

```tsx
<div className="space-y-6">
  {reviews.map(review => (
    <div key={review.id} className="p-6 bg-white rounded-xl border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full" />
          <div>
            <h4 className="font-semibold">{review.name}</h4>
            <p className="text-sm text-gray-600">{review.date}</p>
          </div>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
          ))}
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
  ))}
</div>
```

## When to Use

✅ **Use ecommerce design for:**
- Online stores
- Product catalogs
- Marketplace platforms
- Fashion/apparel sites
- Electronics stores
- Subscription boxes

❌ **Do NOT use for:**
- SaaS products
- Editorial/blog content
- Corporate websites
- Portfolio sites
- Gaming interfaces

## Resources

- **Inspiration:** Shopify, Amazon, Nike.com, Apple Store
- **Font:** Inter + Poppins (Google Fonts)
- **Icons:** Lucide React
