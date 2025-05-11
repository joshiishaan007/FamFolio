# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven-built JAR file into the container
COPY target/FamFolio-Backend.jar app.jar

# Expose port 8080 (default for Spring Boot applications)
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
