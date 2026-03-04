package com.ecommerce.backend.config;

import com.ecommerce.backend.model.*;
import com.ecommerce.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Seeding initial data...");
        seedCategoriesAndProducts();
        seedAdminUser();
        log.info("Data seeding complete. {} products loaded.", productRepository.count());
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@stridestore.com")) {
            userRepository.save(User.builder()
                    .name("Admin")
                    .email("admin@stridestore.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build());
        }
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() > 0)
            return;

        // -- Categories --
        Category running = categoryRepository.save(Category.builder()
                .name("Running").slug("running").description("Performance running footwear")
                .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80")
                .bannerUrl("https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1200&q=80")
                .build());

        Category basketball = categoryRepository.save(Category.builder()
                .name("Basketball").slug("basketball").description("Court-dominating basketball shoes")
                .imageUrl("https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600&q=80")
                .bannerUrl("https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80")
                .build());

        Category lifestyle = categoryRepository.save(Category.builder()
                .name("Lifestyle").slug("lifestyle").description("Everyday style and comfort")
                .imageUrl("https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80")
                .bannerUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80")
                .build());

        Category training = categoryRepository.save(Category.builder()
                .name("Training").slug("training").description("Gym and cross-training gear")
                .imageUrl("https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80")
                .bannerUrl("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80")
                .build());

        // -- Running Products --
        productRepository.saveAll(List.of(
                Product.builder().name("Air Phantom Pro").brand("Stride").description(
                        "Ultra-responsive cushioning for long-distance runners. Carbon fiber plate technology delivers explosive energy return.")
                        .price(new BigDecimal("179.99")).salePrice(new BigDecimal("149.99")).stock(45)
                        .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80")
                        .imageUrl2("https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80")
                        .sizes("6,7,8,9,10,11,12").colors("Black,White,Red").tags("running,marathon,cushion")
                        .featured(true).active(true).category(running).build(),
                Product.builder().name("VelocityX Elite").brand("Stride").description(
                        "Lightweight mesh upper with dynamic fit system. Zero-gravity foam midsole absorbs impact on any terrain.")
                        .price(new BigDecimal("139.99")).stock(30)
                        .imageUrl("https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80")
                        .imageUrl2("https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80")
                        .sizes("6,7,8,9,10,11").colors("Blue,Orange,Black").tags("running,trail,lightweight")
                        .featured(true).active(true).category(running).build(),
                Product.builder().name("SpeedForce Runner").brand("Stride").description(
                        "Built for speed. Aerodynamic design with precision-fit lace system and responsive foam platform.")
                        .price(new BigDecimal("119.99")).salePrice(new BigDecimal("89.99")).stock(55)
                        .imageUrl("https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80")
                        .sizes("7,8,9,10,11,12").colors("White,Neon Green").tags("running,speed,lightweight")
                        .featured(false).active(true).category(running).build(),
                Product.builder().name("TrailBlazer X9").brand("Stride").description(
                        "Conquer any terrain with grip rubber outsole and waterproof upper. Enhanced ankle support for technical trails.")
                        .price(new BigDecimal("159.99")).stock(20)
                        .imageUrl("https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80")
                        .sizes("7,8,9,10,11").colors("Grey,Orange").tags("running,trail,outdoor").featured(false)
                        .active(true).category(running).build(),

                // -- Basketball Products --
                Product.builder().name("Court King High").brand("Stride").description(
                        "Dominate the paint with superior ankle support and ZoomAir cushioning. Non-slip pivot point for explosive cuts.")
                        .price(new BigDecimal("189.99")).stock(25)
                        .imageUrl("https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=800&q=80")
                        .imageUrl2("https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80")
                        .sizes("7,8,9,10,11,12,13").colors("Black,Red,Gold").tags("basketball,court,high-top")
                        .featured(true).active(true).category(basketball).build(),
                Product.builder().name("Downtown Low").brand("Stride").description(
                        "Street-ready low-top with flexible sole for quick direction changes. Breathable knit upper keeps you cool under pressure.")
                        .price(new BigDecimal("145.99")).salePrice(new BigDecimal("119.99")).stock(35)
                        .imageUrl("https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80")
                        .sizes("7,8,9,10,11,12").colors("White,Blue,Black").tags("basketball,low-top,street")
                        .featured(false).active(true).category(basketball).build(),
                Product.builder().name("Slam Dunk Pro").brand("Stride").description(
                        "Maximum traction herringbone pattern. Ultra-responsive cushioning with lateral containment for court confidence.")
                        .price(new BigDecimal("199.99")).stock(18)
                        .imageUrl("https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80")
                        .sizes("8,9,10,11,12").colors("Black,White").tags("basketball,performance,high-top")
                        .featured(true).active(true).category(basketball).build(),

                // -- Lifestyle Products --
                Product.builder().name("Urban Classic 1").brand("Stride").description(
                        "Timeless silhouette meets modern comfort. Full-grain leather upper with padded collar for all-day wear.")
                        .price(new BigDecimal("109.99")).stock(60)
                        .imageUrl("https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80")
                        .imageUrl2("https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80")
                        .sizes("6,7,8,9,10,11,12").colors("White,Black,Cream").tags("lifestyle,casual,leather")
                        .featured(true).active(true).category(lifestyle).build(),
                Product.builder().name("RetroWave 90s").brand("Stride").description(
                        "Inspired by the golden era. Chunky midsole with archival overlays. A head-turning statement for every streetwear look.")
                        .price(new BigDecimal("125.99")).salePrice(new BigDecimal("99.99")).stock(40)
                        .imageUrl("https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80")
                        .sizes("6,7,8,9,10,11").colors("Multi,White,Black").tags("lifestyle,retro,streetwear")
                        .featured(true).active(true).category(lifestyle).build(),
                Product.builder().name("Zen Slip-On").brand("Stride").description(
                        "Effortless style. Elastic-free laceless design with memory foam insole and suede-like upper.")
                        .price(new BigDecimal("79.99")).stock(50)
                        .imageUrl("https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80")
                        .sizes("6,7,8,9,10,11").colors("Beige,Black,Navy").tags("lifestyle,slip-on,casual")
                        .featured(false).active(true).category(lifestyle).build(),

                // -- Training Products --
                Product.builder().name("PowerLift X").brand("Stride").description(
                        "Built for the weight room. Raised heel for optimal squat depth. Extra-wide toe box for natural foot splay under load.")
                        .price(new BigDecimal("149.99")).stock(30)
                        .imageUrl("https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80")
                        .sizes("7,8,9,10,11,12").colors("Black,Red").tags("training,gym,weightlifting").featured(false)
                        .active(true).category(training).build(),
                Product.builder().name("FlexCross Pro").brand("Stride").description(
                        "All-day gym warrior. 360-degree wrap-around traction, flexible forefoot for plyometric training.")
                        .price(new BigDecimal("129.99")).salePrice(new BigDecimal("109.99")).stock(45)
                        .imageUrl("https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80")
                        .sizes("6,7,8,9,10,11,12").colors("Grey,Teal,Black").tags("training,crossfit,gym")
                        .featured(true).active(true).category(training).build(),
                Product.builder().name("Agility Trainer").brand("Stride").description(
                        "Multi-directional traction pattern. Ultra-cushioned midsole with medial post for overpronation control.")
                        .price(new BigDecimal("114.99")).stock(35)
                        .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80")
                        .sizes("7,8,9,10,11").colors("White,Orange").tags("training,agility,running").featured(false)
                        .active(true).category(training).build()));
    }
}
