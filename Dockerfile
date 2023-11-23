# Use the official Microsoft .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine AS build
WORKDIR /app

# Copy csproj file and restore as distinct layers
COPY ["FlavorFare/FlavorFare.API/FlavorFare.API.csproj", "./FlavorFare.API/"]
RUN dotnet restore "FlavorFare.API/FlavorFare.API.csproj"

# Copy the rest of the source code
COPY ["FlavorFare/FlavorFare.API/", "./FlavorFare.API/"]
WORKDIR /app/FlavorFare.API

# Publish the application
RUN dotnet publish -c Release -o /app/publish

# Final stage/image
FROM mcr.microsoft.com/dotnet/runtime-deps:7.0-alpine-amd64
WORKDIR /app
COPY --from=build /app/publish .

# Set the entry point for the container
ENTRYPOINT ["./FlavorFare.API"]

# Uncomment to enable globalization APIs (or delete)
# ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
#     LC_ALL=en_US.UTF-8 \
#     LANG=en_US.UTF-8
# RUN apk add --no-cache icu-data-full icu-libs