# Stage 1: Build the project
FROM openjdk:17-jdk-slim AS build

WORKDIR /app
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run only the built JAR
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/user-services-0.0.1-SNAPSHOT.jar user-service.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "user-service.jar"]
