package com.lbc.vacations.configs;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.core.convert.converter.Converter;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
public class JwtConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private static final String ROLE_PREFIX = "ROLE_";
    private static final String REALM_ACCESS = "realm_access";
    private static final String ROLES = "roles";

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {

        Collection<SimpleGrantedAuthority> authorities =
                extractRealmRoles(jwt);

        return new JwtAuthenticationToken(
                jwt,
                authorities,
                jwt.getClaimAsString("preferred_username")
        );
    }

    private Collection<SimpleGrantedAuthority> extractRealmRoles(Jwt jwt) {

        Map<String, Object> realmAccess =
                jwt.getClaimAsMap(REALM_ACCESS);

        if (realmAccess == null) {
            return Collections.emptyList();
        }

        Object rolesObject = realmAccess.get(ROLES);

        if (!(rolesObject instanceof List<?> roles)) {
            return Collections.emptyList();
        }

        return roles.stream()
                .filter(String.class::isInstance)
                .map(String.class::cast)
                .map(String::toUpperCase)
                .map(role -> ROLE_PREFIX + role)
                .map(SimpleGrantedAuthority::new)
                .toList();
    }
}