package com.ecommerce.backend.dto;

import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CartDto {

    @Data
    @Builder
    public static class CartResponse {
        private Long cartId;
        private List<CartItemResponse> items;
        private BigDecimal subtotal;
        private int totalItems;
    }

    @Data
    @Builder
    public static class CartItemResponse {
        private Long cartItemId;
        private Long productId;
        private String productName;
        private String productBrand;
        private String productImage;
        private BigDecimal price;
        private BigDecimal salePrice;
        private Integer quantity;
        private String selectedSize;
        private String selectedColor;
        private Integer stock;
    }

    @Data
    public static class AddToCartRequest {
        private Long productId;
        private Integer quantity;
        private String selectedSize;
        private String selectedColor;
    }

    @Data
    public static class UpdateCartItemRequest {
        private Integer quantity;
    }
}
