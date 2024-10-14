package com.brigada.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestEntityResponseDTO {
    private Long id;
    private String name;
    private Long creatorId;
}
