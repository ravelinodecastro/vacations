package com.lbc.vacations.vacation.services;

import com.lbc.vacations.employee.domain.Employee;
import com.lbc.vacations.employee.repository.EmployeeRepository;
import com.lbc.vacations.exceptions.BusinessException;
import com.lbc.vacations.exceptions.NotFoundException;
import com.lbc.vacations.vacation.domain.VacationRequest;
import com.lbc.vacations.vacation.domain.VacationStatus;
import com.lbc.vacations.vacation.dto.CreateVacationRequest;
import com.lbc.vacations.vacation.dto.VacationResponse;
import com.lbc.vacations.vacation.repository.VacationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VacationService {

    private final VacationRepository vacationRepository;
    private final EmployeeRepository employeeRepository;

    public VacationResponse create(UUID employeeId, CreateVacationRequest request) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new NotFoundException("Employee not found"));

        if (request.endDate().isBefore(request.startDate())) {
            throw new BusinessException("End date cannot be before start date");
        }

        validateNoOverlap(request.startDate(), request.endDate());

        VacationRequest vacation = VacationRequest.builder()
                .employee(employee)
                .startDate(request.startDate())
                .endDate(request.endDate())
                .status(VacationStatus.PENDING)
                .build();

        VacationRequest saved = vacationRepository.save(vacation);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<VacationResponse> findAll() {
        return vacationRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public VacationResponse approve(UUID vacationId) {
        return updateStatus(vacationId, VacationStatus.APPROVED);
    }

    public VacationResponse reject(UUID vacationId) {
        return updateStatus(vacationId, VacationStatus.REJECTED);
    }

    public VacationResponse cancel(UUID vacationId) {
        return updateStatus(vacationId, VacationStatus.CANCELLED);
    }

    private VacationResponse updateStatus(UUID vacationId, VacationStatus status) {

        VacationRequest vacation = vacationRepository.findById(vacationId)
                .orElseThrow(() -> new NotFoundException("Vacation not found"));

        if (status == VacationStatus.APPROVED) {
            validateNoOverlap(vacation.getStartDate(), vacation.getEndDate());
        }

        vacation.setStatus(status);
        return toResponse(vacationRepository.save(vacation));
    }

    private void validateNoOverlap(java.time.LocalDate start, java.time.LocalDate end) {

        List<VacationRequest> overlapping = vacationRepository
                .findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        VacationStatus.APPROVED,
                        end,
                        start
                );

        if (!overlapping.isEmpty()) {
            throw new BusinessException("Overlapping vacation exists");
        }
    }

    private VacationResponse toResponse(VacationRequest vacation) {

        return new VacationResponse(
                vacation.getId(),
                vacation.getEmployee().getId(),
                vacation.getEmployee().getName(),
                vacation.getStartDate(),
                vacation.getEndDate(),
                vacation.getStatus()
        );
    }
}