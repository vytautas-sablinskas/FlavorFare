# Use the official Microsoft .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine AS build
WORKDIR /src

# Copy csproj file and restore as distinct layers
COPY ["FlavorFare/FlavorFare.API/FlavorFare.API.csproj", "FlavorFare/FlavorFare.API/"]
RUN dotnet restore "FlavorFare/FlavorFare.API/FlavorFare.API.csproj" -r linux-musl-x64 /p:PublishReadyToRun=true

# Copy the remaining source code
COPY ["FlavorFare/FlavorFare.API/", "FlavorFare/FlavorFare.API/"]
WORKDIR /src/FlavorFare/FlavorFare.API

# Publish the application
RUN dotnet publish -c Release -o /app/publish -r linux-musl-x64 --self-contained true --no-restore /p:PublishReadyToRun=true /p:PublishSingleFile=true

# Use the official Microsoft .NET runtime image for the final stage
FROM mcr.microsoft.com/dotnet/runtime-deps:7.0-alpine-amd64 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Set the entry point for the container
ENTRYPOINT ["./FlavorFare.API"]

# Uncomment the following lines to enable globalization APIs
# ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
#     LC_ALL=en_US.UTF-8 \
#     LANG=en_US.UTF-8
# RUN apk add --no-cache icu-data-full icu-libs
