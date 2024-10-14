package com.brigada.backend.domain;

import com.brigada.backend.security.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudyGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Positive
    private Integer id;

    @Column(nullable = false)
    @NotBlank
    private String name;

    @JoinColumn(nullable = false, name = "coordinates_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Coordinates coordinates;

    @Column(nullable = false, updatable = false)
    private ZonedDateTime creationDate;

    @Column
    @Positive
    private int studentsCount;

    @Column(nullable = true)
    @Positive
    private Long expelledStudents;

    @Column
    @Positive
    private int transferredStudents;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private FormOfEducation formOfEducation;

    @Column(nullable = false)
    @Positive
    private Integer shouldBeExpelled;

    @Column(nullable = true)
    @Enumerated(EnumType.STRING)
    private Semester semesterEnum;

    @JoinColumn(nullable = true, name = "group_admin_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Person groupAdmin;

    @JoinColumn(name = "user_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private User createdBy;

    @PrePersist
    protected void onCreate() {
        creationDate = ZonedDateTime.now();
    }
}
