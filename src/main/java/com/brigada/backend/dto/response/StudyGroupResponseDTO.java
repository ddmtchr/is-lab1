package com.brigada.backend.dto.response;

import com.brigada.backend.domain.FormOfEducation;
import com.brigada.backend.domain.Semester;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudyGroupResponseDTO {
    private Integer id;
    private String name;
    private CoordinatesResponseDTO coordinates;
    private ZonedDateTime creationDate;
    private int studentsCount;
    private Long expelledStudents;
    private int transferredStudents;
    private FormOfEducation formOfEducation;
    private Integer shouldBeExpelled;
    private Semester semesterEnum;
    private PersonResponseDTO groupAdmin;
    private Long createdBy;
    private boolean editableByAdmin;
}
