package com.lbc.vacations.vacation.controller;

import com.lbc.vacations.vacation.dto.CreateVacationRequest;
import com.lbc.vacations.vacation.dto.VacationResponse;
import com.lbc.vacations.vacation.services.VacationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vacations")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class VacationController {

    private final VacationService vacationService;

    /**
     * Criar pedido identificando o colaborador pelo sub do JWT.
     * Não é necessário saber o UUID do registo de employee.
     */
    @PostMapping("/my")
    @PreAuthorize("hasRole('COLLABORATOR')")
    @Operation(summary = "Create vacation request — employee auto-identified from JWT")
    public VacationResponse createMyVacation(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateVacationRequest request
    ) {
        return vacationService.createMyVacation(jwt.getSubject(), request);
    }

    /** Listar os próprios pedidos (colaborador). */
    @GetMapping("/my")
    @PreAuthorize("hasRole('COLLABORATOR')")
    @Operation(summary = "List current collaborator's vacation requests")
    public List<VacationResponse> findMyVacations(@AuthenticationPrincipal Jwt jwt) {
        return vacationService.findMyVacations(jwt.getSubject());
    }

    /** Criar pedido especificando o employee por ID (manter compatibilidade). */
    @PostMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('COLLABORATOR')")
    @Operation(summary = "Create vacation request by employee ID")
    public VacationResponse create(
            @PathVariable UUID employeeId,
            @Valid @RequestBody CreateVacationRequest request
    ) {
        return vacationService.create(employeeId, request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "List all vacation requests")
    public List<VacationResponse> findAll() {
        return vacationService.findAll();
    }

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Approve vacation request")
    public VacationResponse approve(@PathVariable UUID id) {
        return vacationService.approve(id);
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Reject vacation request")
    public VacationResponse reject(@PathVariable UUID id) {
        return vacationService.reject(id);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('COLLABORATOR')")
    @Operation(summary = "Cancel vacation request")
    public VacationResponse cancel(@PathVariable UUID id) {
        return vacationService.cancel(id);
    }
}
