package com.ecommerce.backend.dto;

import com.ecommerce.backend.model.Order;
import lombok.Data;
import lombok.Builder;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Data
    @Builder
    public static class OrderResponse {
        private Long orderId;
        private String status;
        private BigDecimal totalAmount;
        private LocalDateTime createdAt;
        private String shippingName;
        private String shippingAddress;
        private String shippingCity;
        private String shippingState;
        private String shippingZip;
        private List<OrderItemResponse> items;
    }

    @Data
    @Builder
    public static class OrderItemResponse {
        private Long productId;
        private String productName;
        private String productImage;
        private Integer quantity;
        private BigDecimal price;
        private String selectedSize;
        private String selectedColor;
    }

    @Data
    public static class PlaceOrderRequest {
        @NotBlank(message = "Name is required")
        private String shippingName;
        @NotBlank(message = "Address is required")
        private String shippingAddress;
        @NotBlank(message = "City is required")
        private String shippingCity;
        @NotBlank(message = "State is required")
        private String shippingState;
        @NotBlank(message = "ZIP is required")
        private String shippingZip;
        private String shippingPhone;
    }
}
