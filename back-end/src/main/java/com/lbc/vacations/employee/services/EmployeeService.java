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

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    /**
     * Encontra o registo do utilizador pelo Keycloak subject (sub).
     * Se não existir, cria automaticamente usando os dados do JWT.
     * Chamado no login para garantir que todos os utilizadores têm registo.
     */
    public EmployeeResponse findOrCreate(String sub, String name, String email) {

        // 1. Já existe registo com este sub
        return employeeRepository.findBySub(sub)
                .map(employeeMapper::toResponse)
                .orElseGet(() -> {
                    // 2. Existe registo com o mesmo email mas sem sub → ligar ao utilizador
                    if (employeeRepository.existsByEmail(email)) {
                        Employee existing = employeeRepository.findByEmail(email)
                                .orElseThrow(() -> new NotFoundException("Employee not found"));
                        existing.setSub(sub);
                        return employeeMapper.toResponse(employeeRepository.save(existing));
                    }
                    // 3. Não existe — criar novo registo
                    Employee employee = Employee.builder()
                            .sub(sub)
                            .name(name)
                            .email(email)
                            .build();
                    return employeeMapper.toResponse(employeeRepository.save(employee));
                });
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(UUID id) {
        return employeeMapper.toResponse(findEmployeeEntity(id));
    }

    @Transactional(readOnly = true)
    public Page<EmployeeResponse> findAll(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(employeeMapper::toResponse);
    }

    public EmployeeResponse update(UUID id, EmployeeRequest request) {

        Employee employee = findEmployeeEntity(id);

        validateEmailUpdate(employee, request.email());

        employee.setName(request.name());
        employee.setEmail(request.email());
        employee.setSub(request.sub());

        if (request.managerId() != null) {
            Employee manager = findEmployeeEntity(request.managerId());
            if (manager.getId().equals(employee.getId())) {
                throw new BusinessException("Employee cannot be their own manager");
            }
            employee.setManager(manager);
        } else {
            employee.setManager(null);
        }

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    public void delete(UUID id) {
        employeeRepository.delete(findEmployeeEntity(id));
    }

    // ─── Internos ─────────────────────────────────────────────────────────────

    private Employee findEmployeeEntity(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Employee not found: " + id));
    }

    private void validateEmailNotExists(String email) {
        if (employeeRepository.existsByEmail(email)) {
            throw new BusinessException("Email already exists");
        }
    }

    private void validateEmailUpdate(Employee employee, String newEmail) {
        if (!employee.getEmail().equalsIgnoreCase(newEmail)
                && employeeRepository.existsByEmail(newEmail)) {
            throw new BusinessException("Email already exists");
        }
    }
}
