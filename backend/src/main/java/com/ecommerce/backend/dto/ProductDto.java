package com.ecommerce.backend.dto;

import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;

@Data
@Builder
public class ProductDto {
    private Long id;
    private String name;
    private String brand;
    private String description;
    private BigDecimal price;
    private BigDecimal salePrice;
    private Integer stock;
    private String imageUrl;
    private String imageUrl2;
    private String imageUrl3;
    private String sizes;
    private String colors;
    private String tags;
    private boolean featured;
    private boolean active;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private boolean onSale;

    public boolean isOnSale() {
        return salePrice != null && salePrice.compareTo(BigDecimal.ZERO) > 0 && salePrice.compareTo(price) < 0;
    }
}
