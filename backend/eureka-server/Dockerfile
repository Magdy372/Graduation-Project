# Build stage
FROM maven:3.8-openjdk-17-slim AS build

WORKDIR /app
COPY . .


# Final image
FROM openjdk:17-jdk-slim

WORKDIR /app
COPY --from=build /app/target/eureka-server-0.0.1-SNAPSHOT.jar eureka-server.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "eureka-server.jar"]
