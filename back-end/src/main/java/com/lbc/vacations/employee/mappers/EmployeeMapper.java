package com.lbc.vacations.employee.mappers;

import com.lbc.vacations.employee.domain.Employee;
import com.lbc.vacations.employee.dto.EmployeeRequest;
import com.lbc.vacations.employee.dto.EmployeeResponse;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public Employee toEntity(EmployeeRequest request) {

        Employee employee = new Employee();

        employee.setName(request.name());
        employee.setEmail(request.email());
        employee.setSub(request.sub());

        return employee;
    }

    public EmployeeResponse toResponse(Employee employee) {

        return new EmployeeResponse(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                employee.getManager() != null
                        ? employee.getManager().getId()
                        : null,
                employee.getManager() != null
                        ? employee.getManager().getName()
                        : null
        );
    }
}