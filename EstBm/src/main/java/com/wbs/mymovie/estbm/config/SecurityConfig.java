//package com.wbs.mymovie.estbm.config;
//
//import io.jsonwebtoken.io.Decoders;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Lazy;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.ProviderManager;
//import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
//import org.springframework.security.oauth2.jwt.JwtDecoder;
//import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
//import org.springframework.security.web.AuthenticationEntryPoint;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import com.wbs.mymovie.estbm.util.JwtRequestFilter;
//
//import javax.crypto.SecretKey;
//import javax.crypto.spec.SecretKeySpec;
//import java.util.Arrays;
//import java.util.List;
//
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity(prePostEnabled = true)
//public class SecurityConfig {
//
//    @Value("${jwt.secret}")
//    private String jwtSecretKey;
//
//    @Autowired
//    @Lazy
//    private JwtRequestFilter jwtRequestFilter;
//
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                // 1) CORS et CSRF
//                .cors(Customizer.withDefaults())
//                .csrf(csrf -> csrf.disable())
//                // 2) Sessions STATLESS (JWT)
//                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                // 3) Autorisations
//                // Mettre à jour les autorisations
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(HttpMethod.POST, "/stages/auth/**").permitAll()
//                        .requestMatchers("/stages/admin/**").hasRole("ADMIN")
//                        .requestMatchers("/stages/encadrants/**").hasRole("ENCADRANT")
//                        .requestMatchers("/stages/etudiants/**").hasRole("ETUDIANT")
//                        .requestMatchers("/stages/documents/**").authenticated() // Simplifié
//                        .requestMatchers("/stages/stages/demande").hasRole("ETUDIANT")
//                        .requestMatchers("/stages/stages/etudiant").hasRole("ETUDIANT")
//                        .requestMatchers("/stages/stages/**").authenticated() // Autoriser tous les stages pour tous les rôles authentifiés
//                        .requestMatchers("/stages/admin/**").hasAuthority("ADMIN")
//                        .requestMatchers("/stages/encadrants/**").hasAuthority("ENCADRANT")
//                        .requestMatchers("/stages/etudiants/**").hasAuthority("ETUDIANT")
//                        .requestMatchers(HttpMethod.POST, "/stages/auth/refresh").permitAll()
//                        .anyRequest().authenticated()
//                )
//                // 4) gestion des erreurs (401)
//                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthEntryPoint()))
//                // 5) ajout du filtre JWT avant UsernamePasswordAuthenticationFilter
//                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//    @Bean
//    public AuthenticationEntryPoint jwtAuthEntryPoint() {
//        return (request, response, ex) ->
//                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(UserDetailsService userDetailsService,
//                                                       PasswordEncoder passwordEncoder) {
//        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
//        provider.setUserDetailsService(userDetailsService);
//        provider.setPasswordEncoder(passwordEncoder);
//        return new ProviderManager(provider);
//    }
//
//    @Bean
//    public JwtDecoder jwtDecoder() {
//        byte[] secretBytes = Decoders.BASE64.decode(jwtSecretKey);
//        // passe ici à HmacSHA256
//        SecretKey key = new SecretKeySpec(secretBytes, "HmacSHA256");
//        return NimbusJwtDecoder.withSecretKey(key)
//                .macAlgorithm(MacAlgorithm.HS256)
//                .build();
//    }
//
//
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    // Delete WebConfig.java and use only this in SecurityConfig
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
//        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
//        config.setExposedHeaders(Arrays.asList("Authorization")); // Ajout important
//        config.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }
//
//
//}

// src/main/java/com/wbs/mymovie/estbm/config/SecurityConfig.java
package com.wbs.mymovie.estbm.config;

import io.jsonwebtoken.io.Decoders;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.wbs.mymovie.estbm.util.JwtRequestFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String jwtSecretKey;

    @Autowired @Lazy
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1) Auth public
                        .requestMatchers(HttpMethod.POST, "/stages/auth/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/stages/auth/refresh").permitAll()

                        // 2) ADMIN only
                        .requestMatchers("/stages/admin/**").hasRole("ADMIN")

                        // 3) ENCADRANT / ETUDIANT
                        .requestMatchers("/stages/encadrants/**").hasRole("ENCADRANT")
                        .requestMatchers("/stages/rapports/**").hasAnyRole("ENCADRANT", "ETUDIANT")
                        .requestMatchers("/stages/etudiants/**").hasRole("ETUDIANT")



                        .requestMatchers(HttpMethod.GET, "/stages/encadrants/me/**").hasRole("ENCADRANT")
                        .requestMatchers(HttpMethod.POST, "/stages/encadrants/**").hasRole("ENCADRANT")
                        .requestMatchers(HttpMethod.PUT, "/stages/encadrants/**").hasRole("ENCADRANT")

                        // 4) Toutes les autres routes auth required
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthEntryPoint()))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint jwtAuthEntryPoint() {
        return (req, res, ex) ->
                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
    }

    @Bean
    public AuthenticationManager authenticationManager(UserDetailsService uds,
                                                       PasswordEncoder pe) {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(uds);
        p.setPasswordEncoder(pe);
        return new ProviderManager(p);
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecretKey);
        SecretKey key = new SecretKeySpec(keyBytes, "HmacSHA256");
        return NimbusJwtDecoder.withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(Arrays.asList("http://localhost:4200","http://localhost:3000"));
        c.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS"));
        c.setAllowedHeaders(Arrays.asList("Authorization","Content-Type"));
//        c.setExposedHeaders(Arrays.asList("Authorization"));
//        c.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
//        src.registerCorsConfiguration("/**", c);
//        return src;

        c.setExposedHeaders(Arrays.asList("Authorization", "Location"));

        c.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", c);
        return src;
    }


    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:4200")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .maxAge(3600);
            }
        };
    }
}
