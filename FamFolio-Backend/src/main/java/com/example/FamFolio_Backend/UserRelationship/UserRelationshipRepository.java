package com.example.FamFolio_Backend.UserRelationship;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.FamFolio_Backend.user.User;

@Repository
public interface UserRelationshipRepository extends JpaRepository<UserRelationship, Long> {
    
    List<UserRelationship> findByOwner(User owner);
    
    List<UserRelationship> findByMember(User member);
    
    Optional<UserRelationship> findByOwnerAndMember(User owner, User member);
    
    boolean existsByOwnerAndMember(User owner, User member);

    boolean existsByOwner_IdAndMember_Id(Long ownerId, Long memberId);

    @Query("SELECT ur.owner FROM UserRelationship ur WHERE ur.member.id = :memberId")
    User findOwnerByMemberId(@Param("memberId") Long memberId);
}