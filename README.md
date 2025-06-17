# Abgabe_Suchmachine

Run

```bash
docker compose up
```

Rebuild and Run

```bash
docker compose up --build
```

Run Dev

```bash
docker compose -f db-docker-compose.yml up
cd WebCrawler/WebCrawler
dotnet run
cd ../../crawler_interface
pnpm dev
```


## TODO Liste

### Schrit 1 Kurt

- [x] URLs aus der Datenbank Checken
- [x] Links in URLs finden zum Weiter-Crawlen
- [x] Weiter Crawlen

### Schrit 1 Jayden

- [x] Basic Frontend ausfestzen
- [x] UI um manuell URLs der DB hinzu zu fügen

### Schrit 2 Kurt

- [x] Website Content beim tokenizen

### Schrit 2 Jayden

- [x] UI Suchmaske  
- [x] Suchergebnisse aus DB hohlen und ggf. ranken

### Schrit 3 Kurt

- [x] Fullstack Frontend
- [x] Dockerize Everything
- [x] Switch Tokenizing
