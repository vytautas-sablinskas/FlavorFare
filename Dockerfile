# Use the official Microsoft .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine AS build
WORKDIR /src

# Copy csproj file and restore as distinct layers
# Adjust the path according to the location where you run docker build
COPY ["FlavorFare/FlavorFare.API/FlavorFare.API.csproj", "./"]
RUN dotnet restore -r linux-musl-x64 /p:PublishReadyToRun=true

# Copy the rest of the source code
COPY ["FlavorFare/FlavorFare.API/", "./"]
RUN dotnet publish -c Release -o /app -r linux-musl-x64 --self-contained true --no-restore /p:PublishReadyToRun=true /p:PublishSingleFile=true

# Final stage/image
FROM mcr.microsoft.com/dotnet/runtime-deps:7.0-alpine-amd64
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["./FlavorFare.API"]

# Uncomment to enable globalization APIs (or delete)
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    LC_ALL=en_US.UTF-8 \
    LANG=en_US.UTF-8
RUN apk add --no-cache icu-data-full icu-libs
