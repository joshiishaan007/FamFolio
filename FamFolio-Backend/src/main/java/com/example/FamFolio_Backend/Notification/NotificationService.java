package com.example.FamFolio_Backend.Notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.FamFolio_Backend.TransactionApproval.TransactionApproval;
import com.example.FamFolio_Backend.user.User;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender emailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // Optional: You can inject the repository if you need to save notifications
     @Autowired
     private NotificationRepository notificationRepository;

    public void sendApprovalRequestNotification(User owner, TransactionApproval approval, String title, String message) {
        // Create a notification entity
        Notification notification = new Notification();
        notification.setUser(owner);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType("APPROVAL_REQUEST");
        notification.setReferenceId(approval.getId().toString());
        notification.setRead(false);

        // Save notification to database
         notificationRepository.save(notification);

        // Send email notification to owner
        sendEmailNotification(owner.getEmail(), title, message);
    }

    public void sendApprovalResultNotification(User requester, TransactionApproval approval, String title, String message) {
        // Create a notification entity
        Notification notification = new Notification();
        notification.setUser(requester);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType("APPROVAL_RESULT");
        notification.setReferenceId(approval.getId().toString());
        notification.setRead(false);

        // Save notification to database
         notificationRepository.save(notification);

        // Send email notification to requester
        sendEmailNotification(requester.getEmail(), title, message);
    }

    @Async
    public void sendEmailNotification(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);

            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendNotification(User owner, String s) {
        sendEmailNotification(owner.getEmail(), "just to notify", s);
    }
}