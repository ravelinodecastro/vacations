package com.lbc.vacations.vacation.dto;

import com.lbc.vacations.vacation.domain.VacationStatus;

import java.time.LocalDate;
import java.util.UUID;

public record VacationResponse(

        UUID id,
        UUID employeeId,
        String employeeName,
        LocalDate startDate,
        LocalDate endDate,
        VacationStatus status
) {
}
