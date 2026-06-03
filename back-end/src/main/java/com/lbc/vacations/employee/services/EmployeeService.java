package com.lbc.vacations.employee.services;

import com.lbc.vacations.employee.domain.Employee;
import com.lbc.vacations.employee.dto.EmployeeRequest;
import com.lbc.vacations.employee.dto.EmployeeResponse;
import com.lbc.vacations.employee.mappers.EmployeeMapper;
import com.lbc.vacations.employee.repository.EmployeeRepository;
import com.lbc.vacations.exceptions.BusinessException;
import com.lbc.vacations.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    public EmployeeResponse create(EmployeeRequest request) {

        validateEmailNotExists(request.email());

        Employee employee = employeeMapper.toEntity(request);

        if (request.managerId() != null) {

            Employee manager = findEmployeeEntity(request.managerId());

            employee.setManager(manager);
        }

        Employee savedEmployee = employeeRepository.save(employee);

        return employeeMapper.toResponse(savedEmployee);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(UUID id) {

        Employee employee = findEmployeeEntity(id);

        return employeeMapper.toResponse(employee);
    }

    @Transactional(readOnly = true)
    public Page<EmployeeResponse> findAll(Pageable pageable) {

        return employeeRepository.findAll(pageable)
                .map(employeeMapper::toResponse);
    }

    public EmployeeResponse update(
            UUID id,
            EmployeeRequest request
    ) {

        Employee employee = findEmployeeEntity(id);

        validateEmailUpdate(employee, request.email());

        employee.setName(request.name());
        employee.setEmail(request.email());
        employee.setSub(request.sub());

        if (request.managerId() != null) {

            Employee manager = findEmployeeEntity(request.managerId());

            if (manager.getId().equals(employee.getId())) {
                throw new BusinessException(
                        "Employee cannot be their own manager"
                );
            }

            employee.setManager(manager);

        } else {
            employee.setManager(null);
        }

        Employee updatedEmployee =
                employeeRepository.save(employee);

        return employeeMapper.toResponse(updatedEmployee);
    }

    public void delete(UUID id) {

        Employee employee = findEmployeeEntity(id);

        employeeRepository.delete(employee);
    }

    private Employee findEmployeeEntity(UUID id) {

        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException(
                                "Employee not found: " + id
                        )
                );
    }

    private void validateEmailNotExists(String email) {

        if (employeeRepository.existsByEmail(email)) {

            throw new BusinessException(
                    "Email already exists"
            );
        }
    }

    private void validateEmailUpdate(
            Employee employee,
            String newEmail
    ) {

        if (employee.getEmail().equalsIgnoreCase(newEmail)) {
            return;
        }

        if (employeeRepository.existsByEmail(newEmail)) {

            throw new BusinessException(
                    "Email already exists"
            );
        }
    }
}
