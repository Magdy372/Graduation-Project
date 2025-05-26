# (Build stage)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

#  (Run stage)
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/api-gateway-0.0.1-SNAPSHOT.jar api-gateway.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "api-gateway.jar"]
