package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.ProductDto;
import com.ecommerce.backend.exception.ResourceNotFoundException;
import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public ProductDto getProductById(Long id) {
        return productRepository.findById(id)
                .filter(Product::isActive)
                .map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Page<ProductDto> getProducts(String search, Long categoryId,
            BigDecimal minPrice, BigDecimal maxPrice,
            Pageable pageable) {
        return productRepository.findWithFilters(search, categoryId, minPrice, maxPrice, pageable)
                .map(this::toDto);
    }

    public Page<ProductDto> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable)
                .map(this::toDto);
    }

    public ProductDto toDto(Product p) {
        return ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .brand(p.getBrand())
                .description(p.getDescription())
                .price(p.getPrice())
                .salePrice(p.getSalePrice())
                .stock(p.getStock())
                .imageUrl(p.getImageUrl())
                .imageUrl2(p.getImageUrl2())
                .imageUrl3(p.getImageUrl3())
                .sizes(p.getSizes())
                .colors(p.getColors())
                .tags(p.getTags())
                .featured(p.isFeatured())
                .active(p.isActive())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .categorySlug(p.getCategory().getSlug())
                .build();
    }
}
