package com.example.FamFolio_Backend.TransactionApproval;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.FamFolio_Backend.user.User;

@Repository
public interface TransactionApprovalRepository extends JpaRepository<TransactionApproval, Long> {

    List<TransactionApproval> findByStatusOrderByCreatedAtDesc(String status);

    List<TransactionApproval> findByRequestedByAndStatus(User requestedBy, String status);

    List<TransactionApproval> findByApprovedByAndStatus(User approvedBy, String status);
}
