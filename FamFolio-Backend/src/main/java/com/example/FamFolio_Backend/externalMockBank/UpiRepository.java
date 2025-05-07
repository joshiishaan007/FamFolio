package com.example.FamFolio_Backend.externalMockBank;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UpiRepository extends JpaRepository<Upi,String> {

    boolean existsByNameAndPassword(String name, String password);
}
