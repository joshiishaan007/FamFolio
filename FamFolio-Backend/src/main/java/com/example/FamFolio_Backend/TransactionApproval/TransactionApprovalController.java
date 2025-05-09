package com.example.FamFolio_Backend.TransactionApproval;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
public class TransactionApprovalController {

    @Autowired
    private TransactionApprovalService transactionApprovalService;

    @GetMapping("/api/transaction_approval/{username}")
    @PreAuthorize("hasRole('OWNER')")
    public List<TransactionApproval> getAllTransectionsForApproval(@PathVariable String username){

        System.out.println("1");
        return transactionApprovalService.getPendingApprovals(username);

    }
}
