#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80:44392
EXPOSE 443:44392
ENV ASPNETCORE_URLS=https://*:44392 

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["TodoApp.API/TodoApp.API.csproj", "TodoApp.API/"]
RUN dotnet restore "TodoApp.API/TodoApp.API.csproj"
COPY . .
WORKDIR "/src/TodoApp.API"
RUN dotnet build "TodoApp.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TodoApp.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TodoApp.API.dll"]