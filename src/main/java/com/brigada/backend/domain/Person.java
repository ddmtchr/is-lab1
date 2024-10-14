package com.brigada.backend.domain;

import com.brigada.backend.security.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String name;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Color eyeColor;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Color hairColor;

    @JoinColumn(nullable = true, name = "location_id")
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Location location;

    @Column(nullable = true)
    @Positive
    private Float weight;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Country nationality;

    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User createdBy;
}
