# Build stage: Compile and package the app
FROM maven:3.8-openjdk-17-slim AS build

WORKDIR /app
COPY . .

# Build the JAR file
RUN mvn clean package -DskipTests

# Final stage: Use lighter image just to run the JAR
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the exact JAR name from the build stage
COPY --from=build /app/target/eureka-server-0.0.1-SNAPSHOT.jar eureka-server.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "eureka-server.jar"]
