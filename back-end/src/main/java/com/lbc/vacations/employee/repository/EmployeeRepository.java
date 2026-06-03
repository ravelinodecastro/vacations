package com.lbc.vacations.employee.repository;

import com.lbc.vacations.employee.domain.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByEmail(String email);

    Optional<Employee> findBySub(String sub);

    List<Employee> findByManagerId(UUID managerId);

    boolean existsByEmail(String email);
}