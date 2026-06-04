package com.lbc.vacations.employee.controllers;

import com.lbc.vacations.employee.dto.EmployeeRequest;
import com.lbc.vacations.employee.dto.EmployeeResponse;
import com.lbc.vacations.employee.services.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    /**
     * Auto-registo: qualquer utilizador autenticado pode chamar este endpoint.
     * Devolve o registo existente ou cria um novo a partir dos claims do JWT.
     * Chamado pelo frontend no login para garantir que o utilizador tem registo.
     */
    @PostMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Find or create current user's employee record from JWT claims")
    public EmployeeResponse findOrCreateMe(@AuthenticationPrincipal Jwt jwt) {
        return employeeService.findOrCreate(
                jwt.getSubject(),
                jwt.getClaimAsString("name"),
                jwt.getClaimAsString("email")
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create employee (admin only)")
    public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
        return employeeService.create(request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Find employee by id")
    public EmployeeResponse findById(@PathVariable UUID id) {
        return employeeService.findById(id);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List employees")
    public Page<EmployeeResponse> findAll(Pageable pageable) {
        return employeeService.findAll(pageable);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update employee")
    public EmployeeResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody EmployeeRequest request
    ) {
        return employeeService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete employee")
    public void delete(@PathVariable UUID id) {
        employeeService.delete(id);
    }
}
