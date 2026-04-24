# 🎬 Compass FullStack 2026 - Movies API (Sprint 2 | Technical Challenge)

[English](#english) | [Português](#português)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

<a name="english">

## 📌 Project Overview

This project is a RESTful API developed for the Sprint 2 Technical Challenge of the Compass FullStack Scholarship Program. The API manages a movie collection and its directors, ensuring data integrity through a relational database and implementing business rules, validations, and containerization.

## 🚀 Features

- **Movie Management**: Create, read, update, and delete movies.
- **Director Management**: Manage directors and retrieve their specific filmography.
- **Data Validation**: Custom middleware to ensure all input data meets the required standards (e.g., character limits, valid release years).
- **Relational Integrity**: Strict `One-To-Many` relationship preventing the deletion of a director who has linked movies.
- **Filtering**: Search movies by `title`, `genre`, or `releaseYear` via Query Params.
- **Dockerized Environment**: Fully containerized application and database using Docker Compose.

## 🛠️ Technologies

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest

---

## ⚙️ How to Run the Project

### Prerequisites

Make sure you have [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

### 1. Clone the repository

    git clone https://github.com/brunnofdev/CompassFullStack2026---Movies-API.git

### 2. Environment Setup

Copy the example environment file and configure it (the default values in the example are ready for Docker):

    cp .env.example .env

### 3. Start the Application

Run the following command to build the image, start the database, run the migrations automatically, and start the API:
\`\`\`bash
docker-compose up --build -d
\`\`\`
The server will be running at `http://localhost:3000`.

_(To stop the application, run: `docker-compose down`)_

---

## 🧪 Testing with Postman

I have included a **Postman Collection** in the root directory to simplify the evaluation process.

1. Locate the file `Compass - Desafio 1.postman_collection.json` in the docs folder.
2. Open Postman and click on **Import**.
3. Drag and drop the file into Postman.
4. All requests (POST, GET, PUT, DELETE) are pre-configured and ready to test.

---

## 📡 API Endpoints

### Movies

| HTTP Method | Endpoint      | Action                                                                                       |
| :---------- | :------------ | :------------------------------------------------------------------------------------------- |
| **POST**    | `/movies`     | Creates a new movie                                                                          |
| **GET**     | `/movies`     | Retrieves all movies (Supports filtering via query params: `?title=X&genre=Y&releaseYear=Z`) |
| **GET**     | `/movies/:id` | Retrieves a specific movie by ID                                                             |
| **PUT**     | `/movies/:id` | Fully updates a movie by ID                                                                  |
| **DELETE**  | `/movies/:id` | Deletes a movie by ID                                                                        |

### Directors

| HTTP Method | Endpoint                | Action                                                  |
| :---------- | :---------------------- | :------------------------------------------------------ |
| **POST**    | `/directors`            | Creates a new director                                  |
| **GET**     | `/directors`            | Retrieves all directors                                 |
| **GET**     | `/directors/:id`        | Retrieves a specific director by ID                     |
| **GET**     | `/directors/:id/movies` | Retrieves all movies directed by a specific director    |
| **PUT**     | `/directors/:id`        | Updates a director's name                               |
| **DELETE**  | `/directors/:id`        | Deletes a director (Blocked if they have linked movies) |

---

## 🧠 Final Reflections

"Developing this project has been a rewarding journey. Mastering TypeScript while building a RESTful API kept the process engaging and fresh. It’s interesting how, even with defined requirements, choosing the right architectural patterns and libraries still sparks a lot of careful thought. Despite that initial indecision, I found that momentum builds with every commit until the final product takes shape. I’m eager for more opportunities like this and looking forward to collaborating with my teammates on future projects."

_Developed as part of the Compass.UOL FullStack Journey._

</a>

<br>
<br>

---

<a name="português">

## 📌 Visão Geral do Projeto

Este projeto é uma API RESTful desenvolvida para o Desafio Técnico da Sprint 2 do Programa de Bolsas Compass FullStack. A API gerencia uma coleção de filmes e seus diretores, garantindo a integridade dos dados por meio de um banco de dados relacional e implementando regras de negócio, validações e conteinerização.

## 🚀 Funcionalidades

- **Gerenciamento de Filmes**: Criar, ler, atualizar e excluir filmes.

- **Gerenciamento de Diretores**: Gerenciar diretores e recuperar sua filmografia específica.

- **Validação de Dados**: Middleware personalizado para garantir que todos os dados de entrada atendam aos padrões exigidos (ex: limites de caracteres, anos de lançamento válidos).

- **Integridade Relacional**: Relacionamento estrito One-To-Many que impede a exclusão de um diretor que possua filmes vinculados.

- **Filtragem**: Busca de filmes por title, genre ou releaseYear via Query Params.

- **Ambiente Dockerizado**: Aplicação e banco de dados totalmente conteinerizados utilizando Docker Compose.

## 🛠️ Technologies

- **Ambiente**: Node.js
- **Linguagem**: TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Banco de Dados**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Testes**: Jest

---

## ⚙️ Como executar o projeto

### Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

### 1. Clonar o repositório

    git clone https://github.com/brunnofdev/CompassFullStack2026---Movies-API.git

### 2. Configuração do Ambiente

Copie o arquivo de exemplo de ambiente e configure-o (os valores padrão no exemplo já estão prontos para o Docker):

    cp .env.example .env

### 3. Iniciar a Aplicação

Execute o seguinte comando para construir a imagem, iniciar o banco de dados, rodar as migrations automaticamente e iniciar a API:
Bash

    docker-compose up --build -d

O servidor estará rodando em http://localhost:3000.

_(Para parar a aplicação, execute: docker-compose down)_

---

### 🧪 Testando com Postman

Incluí uma **coleção do Postman** no diretório raiz para simplificar o processo de avaliação.

1.Localize o arquivo **Compass - Desafio 1.postman_collection.json** na pasta docs.

2.Abra o Postman e clique em Import.

3.Arraste e solte o arquivo no Postman.

4.Todas as requisições (POST, GET, PUT, DELETE) estão pré-configuradas e prontas para testar.

---

## 📡 API Endpoints

### Movies

| Método HTTP | Endpoint      | Ação                                                                                           |
| :---------- | :------------ | :--------------------------------------------------------------------------------------------- |
| **POST**    | `/movies`     | Cria um novo filme                                                                             |
| **GET**     | `/movies`     | Retorna todos os filmes (Suporta filtragem via query params: `?title=X&genre=Y&releaseYear=Z`) |
| **GET**     | `/movies/:id` | Retorna um filme específico por ID                                                             |
| **PUT**     | `/movies/:id` | Atualiza completamente um filme por ID                                                         |
| **DELETE**  | `/movies/:id` | Deleta um filme por ID                                                                         |

### Directors

| Método HTTP | Endpoint                | Ação                                                       |
| :---------- | :---------------------- | :--------------------------------------------------------- |
| **POST**    | `/directors`            | Cria um novo diretor                                       |
| **GET**     | `/directors`            | Retorna todos os diretores                                 |
| **GET**     | `/directors/:id`        | Retorna um diretor específico por ID                       |
| **GET**     | `/directors/:id/movies` | Retorna todos os filmes de um diretor em específico por ID |
| **PUT**     | `/directors/:id`        | Atualiza o nome de um diretor por ID                       |
| **DELETE**  | `/directors/:id`        | Deleta um diretor (Bloqueado se o diretor possuir filmes)  |

---

## 🧠 Considerações Finais

"Desenvolver este projeto foi uma experiência fascinante. Aprender TypeScript 'na prática' enquanto construía uma API RESTful trouxe um novo fôlego ao meu processo criativo. É curioso como, mesmo com requisitos claros, a escolha da arquitetura e das bibliotecas ideais ainda exige uma boa dose de reflexão. No entanto, o ritmo de desenvolvimento se intensifica a cada commit, e ver o software finalizado é extremamente recompensador. Estou ansioso por novos desafios e pela oportunidade de colaborar com meus colegas em projetos futuros."

_Desenvolvido como parte da Jornada FullStack Compass.UOL._

</a>
