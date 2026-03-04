package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.CartDto;
import com.ecommerce.backend.exception.BadRequestException;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.model.*;
import com.ecommerce.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartDto.CartResponse getCart(String email) {
        User user = findUser(email);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createCartForUser(user));
        return buildCartResponse(cart);
    }

    @Transactional
    public CartDto.CartResponse addToCart(String email, CartDto.AddToCartRequest request) {
        User user = findUser(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + product.getStock());
        }

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> createCartForUser(user));

        // Check if item already in cart with same size/color
        cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(request.getProductId())
                        && matches(i.getSelectedSize(), request.getSelectedSize())
                        && matches(i.getSelectedColor(), request.getSelectedColor()))
                .findFirst()
                .ifPresentOrElse(
                        item -> item.setQuantity(item.getQuantity() + request.getQuantity()),
                        () -> cart.getItems().add(CartItem.builder()
                                .cart(cart)
                                .product(product)
                                .quantity(request.getQuantity())
                                .selectedSize(request.getSelectedSize())
                                .selectedColor(request.getSelectedColor())
                                .build()));

        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartDto.CartResponse updateCartItem(String email, Long itemId, CartDto.UpdateCartItemRequest request) {
        User user = findUser(email);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (request.getQuantity() <= 0) {
            cart.getItems().remove(item);
        } else {
            item.setQuantity(request.getQuantity());
        }

        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartDto.CartResponse removeFromCart(String email, Long itemId) {
        User user = findUser(email);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cartRepository.save(cart);
        return buildCartResponse(cart);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Cart createCartForUser(User user) {
        Cart cart = Cart.builder().user(user).build();
        return cartRepository.save(cart);
    }

    private CartDto.CartResponse buildCartResponse(Cart cart) {
        List<CartDto.CartItemResponse> items = cart.getItems().stream()
                .map(this::toItemResponse)
                .toList();

        BigDecimal subtotal = items.stream()
                .map(i -> {
                    BigDecimal unitPrice = i.getSalePrice() != null && i.getSalePrice().compareTo(BigDecimal.ZERO) > 0
                            ? i.getSalePrice()
                            : i.getPrice();
                    return unitPrice.multiply(BigDecimal.valueOf(i.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDto.CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .subtotal(subtotal)
                .totalItems(items.stream().mapToInt(CartDto.CartItemResponse::getQuantity).sum())
                .build();
    }

    private CartDto.CartItemResponse toItemResponse(CartItem item) {
        Product p = item.getProduct();
        return CartDto.CartItemResponse.builder()
                .cartItemId(item.getId())
                .productId(p.getId())
                .productName(p.getName())
                .productBrand(p.getBrand())
                .productImage(p.getImageUrl())
                .price(p.getPrice())
                .salePrice(p.getSalePrice())
                .quantity(item.getQuantity())
                .selectedSize(item.getSelectedSize())
                .selectedColor(item.getSelectedColor())
                .stock(p.getStock())
                .build();
    }

    private boolean matches(String a, String b) {
        if (a == null && b == null)
            return true;
        if (a == null || b == null)
            return false;
        return a.equals(b);
    }
}
