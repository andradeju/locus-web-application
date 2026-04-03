package com.locus.webApplication.repository;

import com.locus.webApplication.model.Address;
import com.locus.webApplication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AddressRepository extends JpaRepository<Address, UUID> {

    List<Address> findByUserId(UUID userId);

    Optional<Address> findByUserIdAndIsPrincipalTrue(UUID userId);
}
