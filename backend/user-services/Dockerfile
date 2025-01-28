# Use the official OpenJDK base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jar file into the container (correct filename)
COPY target/user-services-0.0.1-SNAPSHOT.jar user-service.jar

# Expose the port for User Service
EXPOSE 8089

# Command to run the jar file
ENTRYPOINT ["java", "-jar", "user-service.jar"]
