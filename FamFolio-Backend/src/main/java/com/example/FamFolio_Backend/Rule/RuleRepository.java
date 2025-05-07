package com.example.FamFolio_Backend.Rule;

import com.example.FamFolio_Backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuleRepository extends JpaRepository<Rule, Long> {

    @Query("SELECT r FROM Rule r WHERE r.owner.id = :ownerId AND r.isActive = true")
    List<Rule> findByOwnerIdAndIsActiveTrue(@Param("ownerId") Long ownerId);

    List<Rule> findByOwnerAndMemberAndIsActiveTrue(User owner, User member);

    @Query("SELECT r FROM Rule r WHERE r.owner.id = :ownerId AND (r.member.id IS NULL OR r.member.id = :memberId) AND r.isActive = true")
    List<Rule> findActiveRulesForMember(@Param("ownerId") Long ownerId, @Param("memberId") Long memberId);

    @Query("SELECT r FROM Rule r WHERE r.ruleType = :ruleType AND r.owner.id = :ownerId AND (r.member.id IS NULL OR r.member.id = :memberId) AND r.isActive = true")
    List<Rule> findActiveRulesByTypeForMember(@Param("ruleType") String ruleType, @Param("ownerId") Long ownerId, @Param("memberId") Long memberId);
}