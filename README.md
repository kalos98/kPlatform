**kPlatform** è una web application sviluppata per il corso di **Web System** (LM-32, 1° Anno). Il progetto implementa un prototipo di Social Network funzionale, focalizzato sulla gestione di utenti, post e interazioni in tempo reale.

### Backend

* **Java 17+** con **Spring Boot**
* **Spring Security**: Gestione autenticazione e autorizzazione (Login/Registration)
* **Spring Data JPA**: Persistence layer per l'interazione con il database
* **Maven**: Dependency management e build tool

### Frontend

* **Thymeleaf**: Template engine per il rendering dinamico lato server
* **HTML5 / CSS3**: Layout e styling
* **JavaScript (Vanilla)**: Gestione asincrona dei commenti e interazioni UI

### Data & Validation

* **H2/MySQL**: Database per la memorizzazione di utenti e contenuti
* **XML & XSD**: Validazione e gestione dei dati strutturati per i post

---

## 🛠️ Funzionalità Principali

* **Autenticazione Sicura**: Sistema di registrazione e login con gestione dei ruoli tramite Spring Security.
* **Gestione Post**: Creazione, visualizzazione e archiviazione di post (anche via XML).
* **Sistema di Commenti**: Interazione dinamica sotto i contenuti pubblicati.
* **Profilo Utente**: Pagina dedicata con informazioni personali e foto profilo.
* **Global Exception Handling**: Gestione centralizzata degli errori per una navigazione fluida.
