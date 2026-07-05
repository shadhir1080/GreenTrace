package com.greentrace.config;

import com.greentrace.entity.EmissionFactor;
import com.greentrace.entity.Organization;
import com.greentrace.entity.SystemUser;
import com.greentrace.enums.UserRole;
import com.greentrace.repository.EmissionFactorRepository;
import com.greentrace.repository.OrganizationRepository;
import com.greentrace.repository.SystemUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final EmissionFactorRepository emissionFactorRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(SystemUserRepository userRepository,
                      OrganizationRepository organizationRepository,
                      EmissionFactorRepository emissionFactorRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.emissionFactorRepository = emissionFactorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedOrganizations();
        seedSystemAdmin();
        seedEmissionFactors();
        seedAuditorUsers();
    }

    private void seedOrganizations() {
        if (organizationRepository.count() == 0) {
            Organization org1 = new Organization();
            org1.setName("GreenCorp Manufacturing");
            org1.setIndustry("Manufacturing");
            org1.setCountry("India");
            organizationRepository.save(org1);

            Organization org2 = new Organization();
            org2.setName("EcoTech Solutions");
            org2.setIndustry("Information Technology");
            org2.setCountry("India");
            organizationRepository.save(org2);

            Organization org3 = new Organization();
            org3.setName("BlueSky Airlines");
            org3.setIndustry("Aviation");
            org3.setCountry("United States");
            organizationRepository.save(org3);

            Organization org4 = new Organization();
            org4.setName("ClearWater Industries");
            org4.setIndustry("Chemical");
            org4.setCountry("United Kingdom");
            organizationRepository.save(org4);

            System.out.println("Default corporate organizations seeded successfully.");
        }
    }

    private void seedSystemAdmin() {
        if (!userRepository.existsByEmail("admin@greentrace.com")) {
            SystemUser admin = new SystemUser();
            admin.setName("System Admin");
            admin.setEmail("admin@greentrace.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ROLE_SYSTEM_GOVERNOR);
            userRepository.save(admin);
            System.out.println("Default admin created: admin@greentrace.com / admin123");
        }
    }

    private void seedEmissionFactors() {
        if (emissionFactorRepository.count() == 0) {
            createFactor("Electricity Consumption", "Grid electricity usage", 0.82, "kWh");
            createFactor("Natural Gas", "Natural gas combustion", 2.04, "cubic meter");
            createFactor("Diesel Fuel", "Diesel combustion for transport", 2.68, "liter");
            createFactor("Petrol/Gasoline", "Petrol combustion for transport", 2.31, "liter");
            createFactor("Air Travel (short haul)", "Flights under 3700km", 0.255, "passenger-km");
            createFactor("Air Travel (long haul)", "Flights over 3700km", 0.195, "passenger-km");
            createFactor("Coal Combustion", "Coal burned for energy", 2.42, "kg");
            createFactor("LPG", "Liquefied petroleum gas usage", 1.51, "liter");
            createFactor("Waste to Landfill", "General waste sent to landfill", 0.58, "kg");
            createFactor("Water Consumption", "Municipal water supply usage", 0.00034, "liter");
            System.out.println("Default emission factor library seeded successfully.");
        }
    }

    private void createFactor(String activityType, String desc, double rate, String unit) {
        EmissionFactor ef = new EmissionFactor();
        ef.setActivityType(activityType);
        ef.setDescription(desc);
        ef.setKgCo2PerUnit(rate);
        ef.setUnit(unit);
        emissionFactorRepository.save(ef);
    }

    private void seedAuditorUsers() {
        List<Organization> orgs = organizationRepository.findAll();
        if (orgs.isEmpty()) return;

        Organization greenCorp = orgs.stream().filter(o -> o.getName().contains("GreenCorp")).findFirst().orElse(orgs.get(0));
        Organization ecoTech = orgs.stream().filter(o -> o.getName().contains("EcoTech")).findFirst().orElse(orgs.get(0));
        Organization blueSky = orgs.stream().filter(o -> o.getName().contains("BlueSky")).findFirst().orElse(orgs.get(0));
        Organization clearWater = orgs.stream().filter(o -> o.getName().contains("ClearWater")).findFirst().orElse(orgs.get(0));

        createAuditor("Ravi Kumar", "ravi@greencorp.com", greenCorp);
        createAuditor("Priya Sharma", "priya@ecotech.com", ecoTech);
        createAuditor("James Wilson", "james@bluesky.com", blueSky);
        createAuditor("Sarah Connor", "sarah@clearwater.com", clearWater);
    }

    private void createAuditor(String name, String email, Organization org) {
        if (!userRepository.existsByEmail(email)) {
            SystemUser auditor = new SystemUser();
            auditor.setName(name);
            auditor.setEmail(email);
            auditor.setPassword(passwordEncoder.encode("password123"));
            auditor.setRole(UserRole.ROLE_ENVIRONMENTAL_AUDITOR);
            auditor.setOrganization(org);
            userRepository.save(auditor);
            System.out.println("Auditor user seeded: " + email + " / password123 (" + org.getName() + ")");
        }
    }
}
