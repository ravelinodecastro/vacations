package com.lbc.vacations.employee.dto;

import java.util.UUID;

public record EmployeeResponse(

        UUID id,

        String name,

        String email,

        UUID managerId,

        String managerName
) {
}