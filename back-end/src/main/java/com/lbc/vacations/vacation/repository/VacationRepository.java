package com.lbc.vacations.vacation.repository;

import com.lbc.vacations.vacation.domain.VacationRequest;
import com.lbc.vacations.vacation.domain.VacationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface VacationRepository extends JpaRepository<VacationRequest, UUID> {

    List<VacationRequest> findByEmployeeId(UUID employeeId);

    List<VacationRequest> findByStatus(VacationStatus status);

    List<VacationRequest> findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            VacationStatus status,
            LocalDate endDate,
            LocalDate startDate
    );

    List<VacationRequest> findByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            UUID employeeId,
            VacationStatus status,
            LocalDate endDate,
            LocalDate startDate
    );
}
