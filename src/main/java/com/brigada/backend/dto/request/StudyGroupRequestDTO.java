package com.brigada.backend.dto.request;

import com.brigada.backend.domain.Coordinates;
import com.brigada.backend.domain.FormOfEducation;
import com.brigada.backend.domain.Person;
import com.brigada.backend.domain.Semester;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudyGroupRequestDTO {
    private String name;
    private CoordinatesRequestDTO coordinates;
    private int studentsCount;
    private Long expelledStudents;
    private int transferredStudents;
    private FormOfEducation formOfEducation;
    private Integer shouldBeExpelled;
    private Semester semesterEnum;
    private PersonRequestDTO groupAdmin;
}
