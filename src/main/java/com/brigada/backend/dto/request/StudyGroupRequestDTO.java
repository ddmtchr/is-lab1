package com.brigada.backend.dto.request;

import com.brigada.backend.domain.FormOfEducation;
import com.brigada.backend.domain.Semester;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudyGroupRequestDTO {
    @NotBlank
    private String name;
    private CoordinatesRequestDTO coordinates;
    @Positive
    private int studentsCount;
    @Positive
    private Long expelledStudents;
    @Positive
    private int transferredStudents;
    private FormOfEducation formOfEducation;
    @Positive
    private Integer shouldBeExpelled;
    private Semester semesterEnum;
    private PersonRequestDTO groupAdmin;
    private boolean editableByAdmin;
}
