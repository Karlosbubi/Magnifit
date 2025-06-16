# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Set the working directory in the container
WORKDIR /src

# Copy the project files and restore dependencies.
# We copy the .csproj file first to leverage Docker's layer caching.
# If only the .cs files change, the restore step won't rerun.
COPY ["WebCrawler/WebCrawler.csproj", "WebCrawler/"]
RUN dotnet restore "WebCrawler/WebCrawler.csproj"

# Copy the rest of the application code
COPY . .

# Change to the project directory for building
WORKDIR /src/WebCrawler

# Publish the application.
# --no-self-contained: Relies on the .NET runtime being present in the final image.
# -o /app/publish: Specifies the output directory for the published application.
RUN dotnet publish "WebCrawler.csproj" -c Release -o /app/publish --no-self-contained

# Stage 2: Run the application
FROM mcr.microsoft.com/dotnet/runtime:9.0 AS final

# Set the working directory for the final image
WORKDIR /app

# Copy the published output from the build stage to the final stage
COPY --from=build /app/publish .

# Define the command to run your application.
# Replace 'WebCrawler.dll' with the actual name of your compiled DLL.
ENTRYPOINT ["dotnet", "WebCrawler.dll"]