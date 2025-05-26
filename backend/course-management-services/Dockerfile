# Stage 1: Build the application using Maven wrapper
FROM openjdk:17-jdk-slim AS build

WORKDIR /app
COPY . .

# Ensure mvnw has execution permission
RUN chmod +x mvnw

# Build the project (skip tests)
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the app from a clean Java image
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy only the built JAR from the build stage
COPY --from=build /app/target/course-management-services-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"]
