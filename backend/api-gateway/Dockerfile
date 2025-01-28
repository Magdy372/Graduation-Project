# Use the official OpenJDK base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jar file into the container
COPY target/api-gateway-0.0.1-SNAPSHOT.jar api-gateway.jar

# Expose the port on which the API Gateway will run
EXPOSE 8084

# Command to run the jar file
ENTRYPOINT ["java", "-jar", "api-gateway.jar"]
