# Job Board API

A production-oriented RESTful Job Board API built with **Node.js, Express.js, and PostgreSQL**.

The API allows candidates to discover jobs and submit applications, while companies can create and manage job listings, review applicants, and manage the hiring process.

The project can be used as a practical learning project for understanding professional **Express.js backend development**, including authentication, authorization, database design, API architecture, security, transactions, and automated testing.

---

## Features

### Authentication & Authorization

* User registration and login
* Secure password hashing with bcrypt
* JWT-based authentication
* Role-based authorization
* Protected routes
* Resource ownership checks
* Access control for company and candidate actions

### Job Management

* Create job listings
* View individual jobs
* Browse available jobs
* Search jobs by title and description
* Filter jobs by location
* Filter jobs by salary range
* Sort jobs
* Pagination
* Update jobs
* Delete jobs
* Company ownership protection

### Applications

Candidates can:

* Apply for jobs
* View their applications
* Track application status

Companies can:

* View applicants for their jobs
* Update application status
* Shortlist candidates
* Reject candidates
* Accept candidates

### Hiring

The API supports a hiring workflow where accepting an application creates a corresponding hiring record using a PostgreSQL transaction.

### Security

* Helmet security headers
* CORS configuration
* Rate limiting
* Request body size limits
* Input validation
* Parameterized SQL queries
* Prisma ORM for application data access
* Password hashing
* JWT authentication
* Safe error responses
* Role-based authorization
* Resource ownership verification

### Testing

The project uses Jest and Supertest for API testing.

Tests cover areas such as:

* Successful requests
* Validation failures
* Authentication failures
* Authorization failures
* Resource ownership
* Database integration
* Protected routes

---

## Tech Stack

| Technology        | Purpose                       |
| ----------------- | ----------------------------- |
| Node.js           | JavaScript runtime            |
| Express.js        | Web framework                 |
| PostgreSQL        | Relational database           |
| `pg`              | PostgreSQL driver             |
| Prisma ORM        | Schema, migrations, and database queries |
| `@prisma/adapter-pg` | PostgreSQL driver adapter for Prisma Client |
| JWT               | Authentication                |
| bcrypt            | Password hashing              |
| express-validator | Request validation            |
| Helmet            | HTTP security headers         |
| CORS              | Cross-origin resource sharing |
| Morgan            | HTTP request logging          |
| Jest              | Testing                       |
| Supertest         | HTTP API testing              |
| dotenv            | Environment configuration     |

---

## Architecture

The project follows a layered backend architecture:

```text
Client
  │
  ▼
Express Router
  │
  ▼
Middleware
  │
  ├── Authentication
  ├── Authorization
  ├── Validation
  └── Rate Limiting
  │
  ▼
Controller
  │
  ▼
Service
  │
  ▼
PostgreSQL
```

### Prisma and Database Access

The Prisma data model is defined in `prisma/schema.prisma`, with versioned SQL migrations in `prisma/migrations/`. The Prisma 7 CLI gets its schema, migrations directory, and database URL from `prisma7.config.ts`.

`src/config/db.js` creates a Prisma Client using `PrismaPg` from `@prisma/adapter-pg`. The same module creates a `pg` pool, which the hiring service uses to run its multi-step acceptance transaction. Both connections use `DATABASE_URL`.

Most services use Prisma model operations such as `findMany`, `findUnique`, `create`, `update`, and `delete`. Relations and constraints, including the unique `(userId, jobId)` application constraint, are declared in the Prisma schema and applied through migrations.

### Project Structure

```text
job_board/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── applicationController.js
│   ├── authController.js
│   ├── companyController.js
│   └── jobController.js
│
├── middleware/
│   ├── asyncHandler.js
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── authorize.js
│
├── routes/
│   ├── applicationRoutes.js
│   ├── authRoutes.js
│   ├── companyRoutes.js
│   └── jobRoutes.js
│
├── services/
│   ├── applicationService.js
│   ├── authService.js
│   ├── companyService.js
│   ├── hiringService.js
│   └── jobService.js
│
├── utils/
│   └── AppError.js
│
├── validators/
│   ├── applicationValidator.js
│   ├── authValidator.js
│   └── jobValidator.js
│
├── tests/
│   ├── helpers/
│   ├── applications.test.js
│   ├── auth.test.js
│   └── jobs.test.js
│
├── app.js
├── server.js
├── package.json
├── .env
└── .gitignore
```

---

## Database Design

The application uses PostgreSQL with the following main entities:

```text
Users
  │
  ├──────────────┐
  ▼              ▼
Companies     Applications
  │              │
  ▼              ▼
Jobs ───────── Applications
  │
  ▼
Hiring Records
```

### Main Tables

#### Users

Stores registered users and their roles.

```text
users
├── id
├── name
├── email
├── password
├── role
└── created_at
```

#### Companies

A company belongs to a user.

```text
companies
├── id
├── name
├── description
├── user_id
└── created_at
```

#### Jobs

A job belongs to a company.

```text
jobs
├── id
├── title
├── description
├── location
├── salary
├── company_id
└── created_at
```

#### Applications

Connects candidates with jobs.

```text
applications
├── id
├── user_id
├── job_id
├── status
└── applied_at
```

A unique constraint on `(user_id, job_id)` prevents a candidate from applying to the same job more than once.

#### Hiring Records

Records successful hiring decisions.

```text
hiring_records
├── id
├── application_id
└── hired_at
```

---

## Application Status Flow

Applications can move through different stages:

```text
pending
   │
   ▼
reviewing
   │
   ▼
shortlisted
   │
   ├──────────────► rejected
   │
   ▼
accepted
   │
   ▼
Hiring Record
```

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| POST   | `/auth/register` | Register a user |
| POST   | `/auth/login`    | Login           |

### Jobs

| Method | Endpoint                 | Description      |
| ------ | ------------------------ | ---------------- |
| GET    | `/jobs`                  | List/search jobs |
| GET    | `/jobs/:id`              | Get a job        |
| POST   | `/jobs`                  | Create a job     |
| PATCH  | `/jobs/:id`              | Update a job     |
| DELETE | `/jobs/:id`              | Delete a job     |
| POST   | `/jobs/:id/apply`        | Apply for a job  |
| GET    | `/jobs/:id/applications` | View applicants  |

### Applications

| Method | Endpoint                   | Description               |
| ------ | -------------------------- | ------------------------- |
| GET    | `/applications/me`         | View own applications     |
| PATCH  | `/applications/:id/status` | Update application status |
| PATCH  | `/applications/:id/accept` | Accept an application     |

---

## Authentication

Protected endpoints use JWT Bearer authentication.

Include the token in the request header:

```http
Authorization: Bearer <your-jwt-token>
```

The authentication middleware verifies the token and attaches the authenticated user to:

```js
req.user
```

Example:

```js
req.user.id
req.user.role
```

The authenticated user's identity is then used for authorization and resource ownership checks.

---

## Example Request

### Create a Job

```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "title": "Backend Developer",
  "description": "Build and maintain REST APIs using Node.js and Express.",
  "location": "Nairobi",
  "salary": 80000
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Backend Developer",
    "description": "Build and maintain REST APIs using Node.js and Express.",
    "location": "Nairobi",
    "salary": 80000
  }
}
```

---

## Job Search

Jobs can be searched and filtered using query parameters.

Example:

```http
GET /jobs?search=backend&location=Nairobi&minSalary=50000&maxSalary=150000
```

Pagination:

```http
GET /jobs?page=1&limit=10
```

Sorting can also be applied using supported sort options.

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd job_board
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment file

Create a `.env` file:

```env
PORT=3000

DATABASE_URL="postgresql://postgres:your_password@localhost:5432/job_board?schema=public"

JWT_SECRET=your_jwt_secret
```

Never commit `.env` to Git.

### 4. Create the PostgreSQL database

Create a PostgreSQL database:

```sql
CREATE DATABASE job_board;
```

Apply the checked-in migrations and generate Prisma Client:

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

### 5. Start the server

Development:

```bash
npm run dev
```

Production-style:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

---

## Testing

The project uses Jest and Supertest.

Run:

```bash
npm test
```

Tests cover:

* API responses
* Authentication
* Authorization
* Validation
* Protected routes
* Resource ownership
* Database integration

The project uses a separate test database to prevent tests from modifying development data.

Example:

```text
Development
    ↓
job_board

Testing
    ↓
job_board_test
```

---

## Security Principles

This project follows several important backend security practices.

### Passwords

Passwords are never stored as plaintext.

```text
Password
   ↓
bcrypt
   ↓
Password hash
   ↓
PostgreSQL
```

### Database Queries

Most database operations use Prisma Client. The hiring acceptance service uses parameterized `pg` queries inside a transaction:

```js
client.query('UPDATE "Application" SET status = $1 WHERE id = $2', [status, applicationId]);
```

User input is not concatenated into SQL statements.

### Authorization

Authentication alone does not grant access to every resource.

For example:

```text
Authenticated
      ↓
Correct role
      ↓
Owns resource
      ↓
Access granted
```

### Error Handling

Errors are handled through centralized Express error middleware rather than exposing internal implementation details to clients.

---

## Learning Objectives

This project was built to develop practical knowledge of:

* Express.js
* REST API development
* HTTP
* Middleware
* MVC/layered architecture
* PostgreSQL
* Prisma ORM and schema migrations
* PostgreSQL and parameterized SQL
* Authentication
* Authorization
* JWT
* Password hashing
* API validation
* Database transactions
* Error handling
* API security
* Automated testing
* Integration testing
* Backend architecture

---

## Future Improvements

Planned improvements include:

* [ ] Refresh token authentication
* [ ] API versioning
* [ ] Swagger/OpenAPI documentation
* [ ] File/CV uploads
* [ ] Redis caching
* [ ] Background jobs
* [ ] Email notifications
* [ ] Real-time notifications with WebSockets
* [ ] TypeScript migration
* [ ] Dockerization
* [ ] CI/CD
* [ ] Production deployment
* [ ] Advanced monitoring and logging

---

## Project Status

🚧 **In active development**

The project is being developed incrementally as a practical backend engineering project, with new Express.js concepts being implemented and tested as the system evolves.

---

## Author

**Gilbert Baraza**

Computer Science Student
Kibabii University

GitHub: `https://github.com/Gilbert-Baraza`
Portfolio: `https://gilbert-baraza-portfolio.vercel.app`

---

## License

This project is currently intended for educational and portfolio purposes.
