# Introduction to Prisma Client (Prisma ORM v7) (/docs/orm/v7/prisma-client/setup-and-configuration/introduction)

> For the complete Prisma documentation index, see [llms.txt](https://www.prisma.io/docs/llms.txt). A markdown version of any docs page is available by appending `.md` to its URL.

Learn how to set up and configure Prisma Client in your project

Location: ORM > v7 > Prisma Client > Setup and Configuration > Introduction to Prisma Client

Prisma Client is an auto-generated and type-safe query builder that's *tailored&#x2A; to your data. To get started with Prisma Client, follow the &#x2A;*
## Prerequisites [#prerequisites]

In order to set up Prisma Client, you need a Prisma Config and a [Prisma schema file](https://www.prisma.io/docs/orm/v7/prisma-schema/overview):

  

#### Prisma Config

```ts title="prisma.config.ts" 
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

#### Prisma Schema

```prisma title="schema.prisma" 
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
}
```

## Installation [#installation]

[Install the Prisma CLI](https://www.prisma.io/docs/orm/v7/reference/prisma-cli-reference), the Prisma Client library, and the [driver adapter](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/database-drivers) for your database:

  

#### PostgreSQL

  

  <CodeBlockTab value="bun">
    ```bash
    bun add prisma@prev --dev
    bun add @prisma/client@7 @prisma/adapter-pg pg
    ```

#### pnpm

```bash
pnpm add prisma@prev --save-dev
pnpm add @prisma/client@7 @prisma/adapter-pg pg
````

#### npm

```bash
npm install prisma@prev --save-dev
npm install @prisma/client@7 @prisma/adapter-pg pg
```
    
  </CodeBlockTab>

#### MySQL / MariaDB

  

  <CodeBlockTab value="bun">
    ```bash
    bun add prisma@prev --dev
    bun add @prisma/client@7 @prisma/adapter-mariadb mariadb
    ```

#### pnpm

```bash
pnpm add prisma@prev --save-dev
pnpm add @prisma/client@7 @prisma/adapter-mariadb mariadb
```


#### npm

```bash
npm install prisma@prev --save-dev
npm install @prisma/client@7 @prisma/adapter-mariadb mariadb
```
    
  </CodeBlockTab>

#### SQLite

  

  <CodeBlockTab value="bun">
    ```bash
    bun add prisma@prev --dev
    bun add @prisma/client@7 @prisma/adapter-better-sqlite3 better-sqlite3
    ```

#### pnpm

```bash
pnpm add prisma@prev --save-dev
pnpm add @prisma/client@7 @prisma/adapter-better-sqlite3 better-sqlite3
```

#### npm

```bash
npm install prisma@prev --save-dev
npm install @prisma/client@7 @prisma/adapter-better-sqlite3 better-sqlite3
```
    
  </CodeBlockTab>

> [!NOTE]
> Prisma 7 requires a [driver adapter](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/database-drivers) to connect to your database. Make sure your `package.json` includes `"type": "module"` for ESM support. See the [upgrade guide](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7) for details.

## Generate the Client API [#generate-the-client-api]

Prisma Client is based on the models in Prisma Schema. To provide the correct types, you need generate the client code:

  
#### pnpm

```bash
pnpm prisma generate
```

#### npm

```bash
npx prisma generate
```

This will create a `generated` directory based on where you set the `output` to in the Prisma Schema. Any time your import Prisma Client, it will need to come from this generated client API.

## Importing Prisma Client [#importing-prisma-client]

With the client generated, import it along with your [driver adapter](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/database-drivers) and create a new instance:

  

#### PostgreSQL

```ts
import { PrismaClient } from "./path/to/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
```

#### MySQL / MariaDB

```ts
import { PrismaClient } from "./path/to/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: "localhost",
  user: "root",
  database: "mydb",
});

export const prisma = new PrismaClient({ adapter });
```

#### SQLite

```ts
import { PrismaClient } from "./path/to/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: "file:./dev.db",
});

export const prisma = new PrismaClient({ adapter });
```

#### PostgreSQL (Edge)

```ts
import { PrismaClient } from "./path/to/generated/prisma/edge";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

const adapter = new PrismaPostgresAdapter({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });
```

> [!WARNING]
> `PrismaClient` requires a driver adapter in Prisma 7. Calling `new PrismaClient()` without an `adapter` will result in an error.

Find out what [driver adapter](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/database-drivers) is needed for your database.

Your application should generally only create **one instance** of `PrismaClient`. How to achieve this depends on whether you are using Prisma ORM in a [long-running application](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/databases-connections#prismaclient-in-long-running-applications) or in a [serverless environment](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/databases-connections#prismaclient-in-serverless-environments).

Creating multiple instances of `PrismaClient` will create multiple connection pools and can hit the connection limit for your database. Too many connections may start to **slow down your database** and eventually lead to errors such as:

```bash
Error in connector: Error querying the database: db error: FATAL: sorry, too many clients already
   at PrismaClientFetcher.request
```

## Use Prisma Client to send queries to your database [#use-prisma-client-to-send-queries-to-your-database]

Once you have instantiated `PrismaClient`, you can start sending queries in your code:

```ts
// run inside `async` function
const newUser = await prisma.user.create({
  data: {
    name: "Alice",
    email: "alice@prisma.io",
  },
});

const users = await prisma.user.findMany();
```

## Evolving your application [#evolving-your-application]

Whenever you make changes to your database that are reflected in the Prisma schema, you need to manually re-generate Prisma Client to update the generated code in your output directory:


#### pnpm

```bash
pnpm prisma generate
```

#### npm

```bash
npx prisma generate
```


# Getting started with Prisma Migrate (Prisma ORM v7) (/docs/orm/v7/prisma-migrate/getting-started)


## Adding to a new project [#adding-to-a-new-project]

To use Prisma Migrate, add some models to your `schema.prisma`:

```prisma title="schema.prisma"
datasource db {
  provider = "postgresql"
}

model User { // [!code ++]
  id    Int    @id @default(autoincrement()) // [!code ++]
  name  String // [!code ++]
  posts Post[] // [!code ++]
}

model Post { // [!code ++]
  id        Int     @id @default(autoincrement()) // [!code ++]
  title     String // [!code ++]
  published Boolean @default(true) // [!code ++]
  authorId  Int // [!code ++]
  author    User    @relation(fields: [authorId], references: [id]) // [!code ++]
} // [!code ++]
```

### Create an initial migration [#create-an-initial-migration]

Create an initial migration using the `prisma migrate` command:

  

#### npm

```bash
npx prisma migrate dev --name init
```

This will generate a migration with the appropriate commands for your database.

```sql no-copy title="migration.sql"
CREATE TABLE "User" (
  "id" SERIAL,
  "name" TEXT NOT NULL,
  PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Post" (
  "id" SERIAL,
  "title" TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT true,
  "authorId" INTEGER NOT NULL,
  PRIMARY KEY ("id")
);
-- AddForeignKey
ALTER TABLE
  "Post"
ADD
  FOREIGN KEY("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

Your Prisma schema is now in sync with your database schema and you have initialized a migration history:


### Additional migrations [#additional-migrations]

Suppose you add a field to your model:

```prisma title="schema.prisma"
model User {
  id       Int    @id @default(autoincrement())
  jobTitle String // [!code ++]
  name     String
  posts    Post[]
}
```

You can run `prisma migrate` again to update your migrations


#### npm

```bash
npx prisma migrate dev --name added_job_title
```

Your Prisma schema is once again in sync with your database schema, and your migration history contains two migrations:


### Introspect to create or update your Prisma schema [#introspect-to-create-or-update-your-prisma-schema]

Make sure your Prisma schema is in sync with your database schema. This should already be true if you are using a previous version of Prisma Migrate.


#### npm

```bash
npx prisma db pull
```

### Create a baseline migration [#create-a-baseline-migration]

Create a baseline migration that creates an initial history of the database before using Prisma migrate. This migrations contains the data that must be maintained, which means the database cannot be reset. This tells Prisma migrate to assume that one or more migrations have **already been applied**. This prevents generated migrations from failing when they try to create tables and fields that already exist.

To create a baseline migration:

* If you already have a `prisma/migrations` folder, delete, move, rename, or archive this folder.
* Create a new `prisma/migrations` directory.
* Then create another new directory with your preferred name. What's important is to use a prefix of `0_` so that Prisma migrate applies migrations in a [lexicographic order](https://en.wikipedia.org/wiki/Lexicographic_order). You can use a different value such as the current timestamp.
* Generate a migration and save it to a file using `prisma migrate diff`:


#### npm

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql
```

* Review the generated migration.

### Apply the initial migrations [#apply-the-initial-migrations]

To apply your initial migration(s):

* Run the following command against your database:


```bash
npx prisma migrate resolve --applied 0_init
```

* Review the database schema to ensure the migration leads to the desired end-state (for example, by comparing the schema to the production database).

The new migration history and the database schema should now be in sync with your Prisma schema.

### Commit the migration history and Prisma schema [#commit-the-migration-history-and-prisma-schema]

Commit the following to source control:

* The entire migration history folder
* The `schema.prisma` file


# Select fields (Prisma ORM v7) (/docs/orm/v7/prisma-client/queries/select-fields)

> For the complete Prisma documentation index, see [llms.txt](https://www.prisma.io/docs/llms.txt). A markdown version of any docs page is available by appending `.md` to its URL.

Learn how to return only the fields and relations you need with select and include in Prisma Client.

Location: ORM > v7 > Prisma Client > Queries > Select fields

By default, Prisma Client returns all scalar fields for a model and no relations. Use `select` and `include` to make the result smaller, clearer, and more intentional.

## Return the default fields [#return-the-default-fields]

If you do not pass `select`, `include`, or `omit`, Prisma Client returns all scalar fields for the model and excludes relations from the result.

## Select specific fields [#select-specific-fields]

Use `select` when you only need a few scalar fields:

```ts
const user = await prisma.user.findFirst({
  select: {
    email: true,
    name: true,
  },
});
```

## Return nested objects by selecting relation fields [#return-nested-objects-by-selecting-relation-fields]

Use `include` when you want related records alongside the main result:

```ts
const user = await prisma.user.findFirst({
  include: {
    posts: true,
  },
});
```

## Nest selections [#nest-selections]

You can combine both patterns to keep relation payloads focused:

```ts
const user = await prisma.user.findFirst({
  select: {
    email: true,
    posts: {
      select: {
        title: true,
        published: true,
      },
    },
  },
});
```

## Omit fields instead of selecting everything manually [#omit-fields-instead-of-selecting-everything-manually]

If you mostly want the default result but need to exclude a few fields, see [Excluding fields](https://www.prisma.io/docs/orm/v7/prisma-client/queries/excluding-fields).

## Related pages [#related-pages]

* [Relation queries](https://www.prisma.io/docs/orm/v7/prisma-client/queries/relation-queries)
* [Filtering and sorting](https://www.prisma.io/docs/orm/v7/prisma-client/queries/filtering-and-sorting)
* [Prisma Client API reference](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#select)

## Related pages

- [`Aggregation, grouping, and summarizing`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/aggregation-grouping-summarizing): Use Prisma Client to aggregate, group by, count, and select distinct.
- [`CRUD`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/crud): Learn how to perform create, read, update, and delete operations
- [`Excluding fields`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/excluding-fields): Learn how to exclude fields from Prisma Client results with the omit option.
- [`Filtering and sorting`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/filtering-and-sorting): Learn how to filter Prisma Client queries with where and sort results with orderBy.
- [`Full-text search`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/full-text-search): Learn how to search text fields with Prisma Client using your database's native full-text search support.


# Relation queries (Prisma ORM v7) (/docs/orm/v7/prisma-client/queries/relation-queries)

> For the complete Prisma documentation index, see [llms.txt](https://www.prisma.io/docs/llms.txt). A markdown version of any docs page is available by appending `.md` to its URL.

Prisma Client provides convenient queries for working with relations, such as a fluent API, nested writes (transactions), nested reads and relation filters

Location: ORM > v7 > Prisma Client > Queries > Relation queries

A key feature of Prisma Client is the ability to query [relations](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/relations) between two or more models. Relation queries include:

* [Nested reads](#nested-reads) (sometimes referred to as *eager loading*) via [`select`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#select) and [`include`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#include)
* [Nested writes](#nested-writes) with [transactional](https://www.prisma.io/docs/orm/v7/prisma-client/queries/transactions) guarantees
* [Filtering on related records](#relation-filters)

Prisma Client also has a [fluent API for traversing relations](#fluent-api).

## Nested reads [#nested-reads]

Nested reads allow you to read related data from multiple tables in your database - such as a user and that user's posts. You can:

* Use [`include`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#include) to include related records, such as a user's posts or profile, in the query response.
* Use a nested [`select`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#select) to include specific fields from a related record. You can also nest `select` inside an `include`.

### Relation load strategies (Preview) [#relation-load-strategies-preview]

You can decide on a per-query-level *how* you want Prisma Client to execute a relation query (i.e. what *load strategy* should be applied) via the `relationLoadStrategy` option for PostgreSQL databases.

Because the `relationLoadStrategy` option is currently in Preview, you need to enable it via the `relationJoins` preview feature flag in your Prisma schema file:

```prisma title="schema.prisma" showLineNumbers
generator client {
  provider        = "prisma-client"
  output          = "./generated"
  previewFeatures = ["relationJoins"]
}
```

After adding this flag, you need to run `prisma generate` again to re-generate Prisma Client. The `relationJoins` feature is currently available on PostgreSQL, CockroachDB and MySQL.

Prisma Client supports two load strategies for relations:

* `join` (default): Uses a database-level `LATERAL JOIN` (PostgreSQL) or correlated subqueries (MySQL) and fetches all data with a single query to the database.
* `query`: Sends multiple queries to the database (one per table) and joins them on the application level.

Another important difference between these two options is that the `join` strategy uses JSON aggregation on the database level. That means that it creates the JSON structures returned by Prisma Client already in the database which saves computation resources on the application level.

#### Examples [#examples]

You can use the `relationLoadStrategy` option on the top-level in any query that supports `include` or `select`.

Here is an example with `include`:

```ts
const users = await prisma.user.findMany({
  relationLoadStrategy: "join", // or 'query'
  include: {
    posts: true,
  },
});
```

And here is another example with `select`:

```ts
const users = await prisma.user.findMany({
  relationLoadStrategy: "join", // or 'query'
  select: {
    posts: true,
  },
});
```

#### When to use each load strategy [#when-to-use-each-load-strategy]

* The `join` strategy (default) will be more effective in most scenarios. On PostgreSQL, it uses a combination of `LATERAL JOINs` and JSON aggregation to reduce redundancy in result sets and delegate the work of transforming the query results into the expected JSON structures on the database server. On MySQL, it uses correlated subqueries to fetch the results with a single query.
* There may be edge cases where `query` could be more performant depending on the characteristics of the dataset and query. We recommend that you profile your database queries to identify these situations.
* Use `query` if you want to save resources on the database server and do heavy-lifting of merging and transforming data in the application server which might be easier to scale.

### Include a relation [#include-a-relation]

The following example returns a single user and that user's posts:

```ts
const user = await prisma.user.findFirst({
  include: {
    posts: true,
  },
});
```

```json
{
  id: 19,
  name: null,
  email: 'emma@prisma.io',
  profileViews: 0,
  role: 'USER',
  coinflips: [],
  posts: [
    {
      id: 20,
      title: 'My first post',
      published: true,
      authorId: 19,
      comments: null,
      views: 0,
      likes: 0
    },
    {
      id: 21,
      title: 'How to make cookies',
      published: true,
      authorId: 19,
      comments: null,
      views: 0,
      likes: 0
    }
  ]
}
```

### Include all fields for a specific relation [#include-all-fields-for-a-specific-relation]

The following example returns a post and its author:

```ts
const post = await prisma.post.findFirst({
  include: {
    author: true,
  },
});
```

```json
{
  id: 17,
  title: 'How to make cookies',
  published: true,
  authorId: 16,
  comments: null,
  views: 0,
  likes: 0,
  author: {
    id: 16,
    name: null,
    email: 'orla@prisma.io',
    profileViews: 0,
    role: 'USER',
    coinflips: [],
  },
}
```

### Include deeply nested relations [#include-deeply-nested-relations]

You can nest `include` options to include relations of relations. The following example returns a user's posts, and each post's categories:

```ts
const user = await prisma.user.findFirst({
  include: {
    posts: {
      include: {
        categories: true,
      },
    },
  },
});
```

```json
{
    "id": 40,
    "name": "Yvette",
    "email": "yvette@prisma.io",
    "profileViews": 0,
    "role": "USER",
    "coinflips": [],
    "testing": [],
    "city": null,
    "country": "Sweden",
    "posts": [
        {
            "id": 66,
            "title": "How to make an omelette",
            "published": true,
            "authorId": 40,
            "comments": null,
            "views": 0,
            "likes": 0,
            "categories": [
                {
                    "id": 3,
                    "name": "Easy cooking"
                }
            ]
        },
        {
            "id": 67,
            "title": "How to eat an omelette",
            "published": true,
            "authorId": 40,
            "comments": null,
            "views": 0,
            "likes": 0,
            "categories": []
        }
    ]
}
```

### Select specific fields of included relations [#select-specific-fields-of-included-relations]

You can use a nested `select` to choose a subset of fields of relations to return. For example, the following query returns the user's `name` and the `title` of each related post:

```ts
const user = await prisma.user.findFirst({
  select: {
    name: true,
    posts: {
      select: {
        title: true,
      },
    },
  },
});
```

```json
{
  name: "Elsa",
  posts: [ { title: 'My first post' }, { title: 'How to make cookies' } ]
}
```

You can also nest a `select` inside an `include` - the following example returns *all* `User` fields and the `title` field of each post:

```ts
const user = await prisma.user.findFirst({
  include: {
    posts: {
      select: {
        title: true,
      },
    },
  },
});
```

```json
{
  "id": 1,
  "name": null,
  "email": "martina@prisma.io",
  "profileViews": 0,
  "role": "USER",
  "coinflips": [],
  "posts": [
    { "title": "How to grow salad" },
    { "title": "How to ride a horse" }
  ]
}
```

Note that you **cannot** use `select` and `include` *on the same level*. This means that if you choose to `include` a user's post and `select` each post's title, you cannot `select` only the users' `email`:

```ts
// The following query returns an exception
const user = await prisma.user.findFirst({
  select: { // This won't work! // [!code --]
    email:  true
  }
  include: { // This won't work! // [!code --]
    posts: {
      select: {
        title: true
      }
    }
  },
})
```

```text no-copy
Invalid `prisma.user.findUnique()` invocation:

{
  where: {
    id: 19
  },
  select: {
  ~~~~~~
    email: true
  },
  include: {
  ~~~~~~~
    posts: {
      select: {
        title: true
      }
    }
  }
}

Please either use `include` or `select`, but not both at the same time.
```

Instead, use nested `select` options:

```ts
const user = await prisma.user.findFirst({
  select: {
    // This will work!
    email: true,
    posts: {
      select: {
        title: true,
      },
    },
  },
});
```

## Relation count [#relation-count]

In [3.0.1](https://github.com/prisma/orm/releases/3.0.1) and later, you can [`include` or `select` a count of relations](https://www.prisma.io/docs/orm/v7/prisma-client/queries/aggregation-grouping-summarizing#count-relations) alongside fields - for example, a user's post count.

```ts
const relationCount = await prisma.user.findMany({
  include: {
    _count: {
      select: { posts: true },
    },
  },
});
```

```text no-copy
{ id: 1, _count: { posts: 3 } },
{ id: 2, _count: { posts: 2 } },
{ id: 3, _count: { posts: 2 } },
{ id: 4, _count: { posts: 0 } },
{ id: 5, _count: { posts: 0 } }
```

## Filter a list of relations [#filter-a-list-of-relations]

When you use `select` or `include` to return a subset of the related data, you can **filter and sort the list of relations** inside the `select` or `include`.

For example, the following query returns list of titles of the unpublished posts associated with the user:

```ts
const result = await prisma.user.findFirst({
  select: {
    posts: {
      where: {
        published: false,
      },
      orderBy: {
        title: "asc",
      },
      select: {
        title: true,
      },
    },
  },
});
```

You can also write the same query using `include` as follows:

```ts
const result = await prisma.user.findFirst({
  include: {
    posts: {
      where: {
        published: false,
      },
      orderBy: {
        title: "asc",
      },
    },
  },
});
```

## Nested writes [#nested-writes]

A nested write allows you to write **relational data** to your database in **a single transaction**.

Nested writes:

* Provide **transactional guarantees** for creating, updating or deleting data across multiple tables in a single Prisma Client query. If any part of the query fails (for example, creating a user succeeds but creating posts fails), Prisma Client rolls back all changes.
* Support any level of nesting supported by the data model.
* Are available for [relation fields](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/relations#relation-fields) when using the model's create or update query. The following section shows the nested write options that are available per query.

### Create a related record [#create-a-related-record]

You can create a record and one or more related records at the same time. The following query creates a `User` record and two related `Post` records:

```ts
const result = await prisma.user.create({
  data: {
    email: "elsa@prisma.io",
    name: "Elsa Prisma",
    posts: {
      // [!code highlight]
      create: [{ title: "How to make an omelette" }, { title: "How to eat an omelette" }], // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true, // Include all posts in the returned object
  },
});
```

```json
{
  id: 29,
  name: 'Elsa',
  email: 'elsa@prisma.io',
  profileViews: 0,
  role: 'USER',
  coinflips: [],
  posts: [
    {
      id: 22,
      title: 'How to make an omelette',
      published: true,
      authorId: 29,
      comments: null,
      views: 0,
      likes: 0
    },
    {
      id: 23,
      title: 'How to eat an omelette',
      published: true,
      authorId: 29,
      comments: null,
      views: 0,
      likes: 0
    }
  ]
}
```

### Create a single record and multiple related records [#create-a-single-record-and-multiple-related-records]

There are two ways to create or update a single record and multiple related records - for example, a user with multiple posts:

* Use a nested [`create`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#create) query
* Use a nested [`createMany`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#nested-createmany-options) query

In most cases, a nested `create` will be preferable unless the [`skipDuplicates` query option](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#nested-createmany-options) is required. Here's a quick table describing the differences between the two options:

| Feature                               | `create` | `createMany` | Notes                                                                                                                                                                                           |
| :------------------------------------ | :------- | :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supports nesting additional relations | ✔        | ✘ \*         | For example, you can create a user, several posts, and several comments per post in one query.<br />\* You can manually set a foreign key in a has-one relation - for example: `{ authorId: 9}` |
| Supports 1-n relations                | ✔        | ✔            | For example, you can create a user and multiple posts (one user has many posts)                                                                                                                 |
| Supports m-n relations                | ✔        | ✘            | For example, you can create a post and several categories (one post can have many categories, and one category can have many posts)                                                             |
| Supports skipping duplicate records   | ✘        | ✔            | Use `skipDuplicates` query option.                                                                                                                                                              |

#### Using nested `create` [#using-nested-create]

The following query uses nested [`create`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#create) to create:

* One user
* Two posts
* One post category

The example also uses a nested `include` to include all posts and post categories in the returned data.

```ts
const result = await prisma.user.create({
  data: {
    email: "yvette@prisma.io",
    name: "Yvette",
    posts: {
      // [!code highlight]
      create: [
        // [!code highlight]
        {
          // [!code highlight]
          title: "How to make an omelette", // [!code highlight]
          categories: {
            // [!code highlight]
            create: {
              // [!code highlight]
              name: "Easy cooking", // [!code highlight]
            }, // [!code highlight]
          }, // [!code highlight]
        }, // [!code highlight]
        { title: "How to eat an omelette" }, // [!code highlight]
      ], // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    // Include posts
    posts: {
      include: {
        categories: true, // Include post categories
      },
    },
  },
});
```

```json
{
    "id": 40,
    "name": "Yvette",
    "email": "yvette@prisma.io",
    "profileViews": 0,
    "role": "USER",
    "coinflips": [],
    "testing": [],
    "city": null,
    "country": "Sweden",
    "posts": [
        {
            "id": 66,
            "title": "How to make an omelette",
            "published": true,
            "authorId": 40,
            "comments": null,
            "views": 0,
            "likes": 0,
            "categories": [
                {
                    "id": 3,
                    "name": "Easy cooking"
                }
            ]
        },
        {
            "id": 67,
            "title": "How to eat an omelette",
            "published": true,
            "authorId": 40,
            "comments": null,
            "views": 0,
            "likes": 0,
            "categories": []
        }
    ]
}
```

Here's a visual representation of how a nested create operation can write to several tables in the database as once:

![Diagram showing how a nested create operation writes to multiple database tables (User, Post, Category) in a single transaction.](https://www.prisma.io/img/orm/nested-create.png)

#### Using nested `createMany` [#using-nested-createmany]

The following query uses a nested [`createMany`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#createmany) to create:

* One user
* Two posts

The example also uses a nested `include` to include all posts in the returned data.

```ts
const result = await prisma.user.create({
  data: {
    email: "saanvi@prisma.io",
    posts: {
      // [!code highlight]
      createMany: {
        // [!code highlight]
        data: [{ title: "My first post" }, { title: "My second post" }], // [!code highlight]
      }, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

```json
{
    "id": 43,
    "name": null,
    "email": "saanvi@prisma.io",
    "profileViews": 0,
    "role": "USER",
    "coinflips": [],
    "testing": [],
    "city": null,
    "country": "India",
    "posts": [
        {
            "id": 70,
            "title": "My first post",
            "published": true,
            "authorId": 43,
            "comments": null,
            "views": 0,
            "likes": 0
        },
        {
            "id": 71,
            "title": "My second post",
            "published": true,
            "authorId": 43,
            "comments": null,
            "views": 0,
            "likes": 0
        }
    ]
}
```

Note that it is **not possible** to nest an additional `create` or `createMany` inside the highlighted query, which means that you cannot create a user, posts, and post categories at the same time.

As a workaround, you can send a query to create the records that will be connected first, and then create the actual records. For example:

```ts
const categories = await prisma.category.createManyAndReturn({
  data: [{ name: "Fun" }, { name: "Technology" }, { name: "Sports" }],
  select: {
    id: true,
  },
});

const posts = await prisma.post.createManyAndReturn({
  data: [
    {
      title: "Funniest moments in 2024",
      categoryId: categories.find((category) => category.name === "Fun")!.id,
    },
    {
      title: "Linux or macOS — what's better?",
      categoryId: categories.find((category) => category.name === "Technology")!.id,
    },
    {
      title: "Who will win the next soccer championship?",
      categoryId: categories.find((category) => category.name === "Sports")!.id,
    },
  ],
});
```

If you want to create *all* records in a single database query, consider using a [`$transaction`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/transactions#the-transaction-api) or [type-safe, raw SQL](https://www.prisma.io/docs/orm/v7/prisma-client/using-raw-sql/typedsql).

### Create multiple records and multiple related records [#create-multiple-records-and-multiple-related-records]

You cannot access relations in a `createMany()` or `createManyAndReturn()` query, which means that you cannot create multiple users and multiple posts in a single nested write. The following is **not** possible:

```ts
const createMany = await prisma.user.createMany({
  data: [
    {
      name: "Yewande",
      email: "yewande@prisma.io",
      posts: {
        // [!code --]
        // Not possible to create posts! // [!code --]
      }, // [!code --]
    },
    {
      name: "Noor",
      email: "noor@prisma.io",
      posts: {
        // [!code --]
        // Not possible to create posts! // [!code --]
      }, // [!code --]
    },
  ],
});
```

### Connect multiple records [#connect-multiple-records]

The following query creates ([`create`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#create) ) a new `User` record and connects that record ([`connect`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#connect) ) to three existing posts:

```ts
const result = await prisma.user.create({
  data: {
    email: "vlad@prisma.io",
    posts: {
      // [!code highlight]
      connect: [{ id: 8 }, { id: 9 }, { id: 10 }], // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true, // Include all posts in the returned object
  },
});
```

```json
{
  id: 27,
  name: null,
  email: 'vlad@prisma.io',
  profileViews: 0,
  role: 'USER',
  coinflips: [],
  posts: [
    {
      id: 10,
      title: 'An existing post',
      published: true,
      authorId: 27,
      comments: {},
      views: 0,
      likes: 0
    }
  ]
}
```

> [!NOTE]
> Note
> 
> Prisma Client throws an exception if any of the post records cannot be found: `connect: [{ id: 8 }, { id: 9 }, { id: 10 }]`

### Connect a single record [#connect-a-single-record]

You can [`connect`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#connect) an existing record to a new or existing user. The following query connects an existing post (`id: 11`) to an existing user (`id: 9`)

```ts
const result = await prisma.user.update({
  where: {
    id: 9,
  },
  data: {
    posts: {
      // [!code highlight]
      connect: {
        // [!code highlight]
        id: 11, // [!code highlight]
      }, // [!code highlight]
    },
  },
  include: {
    posts: true,
  },
});
```

### Connect *or* create a record [#connect-or-create-a-record]

If a related record may or may not already exist, use [`connectOrCreate`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#connectorcreate) to connect the related record:

* Connect a `User` with the email address `viola@prisma.io` *or*
* Create a new `User` with the email address `viola@prisma.io` if the user does not already exist

```ts
const result = await prisma.post.create({
  data: {
    title: "How to make croissants",
    author: {
      // [!code highlight]
      connectOrCreate: {
        // [!code highlight]
        where: {
          // [!code highlight]
          email: "viola@prisma.io", // [!code highlight]
        }, // [!code highlight]
        create: {
          // [!code highlight]
          email: "viola@prisma.io", // [!code highlight]
          name: "Viola", // [!code highlight]
        }, // [!code highlight]
      }, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    author: true,
  },
});
```

```json
{
  id: 26,
  title: 'How to make croissants',
  published: true,
  authorId: 43,
  views: 0,
  likes: 0,
  author: {
    id: 43,
    name: 'Viola',
    email: 'viola@prisma.io',
    profileViews: 0,
    role: 'USER',
    coinflips: []
  }
}
```

### Disconnect a related record [#disconnect-a-related-record]

To `disconnect` one out of a list of records (for example, a specific blog post) provide the ID or unique identifier of the record(s) to disconnect:

```ts
const result = await prisma.user.update({
  where: {
    id: 16,
  },
  data: {
    posts: {
      // [!code highlight]
      disconnect: [{ id: 12 }, { id: 19 }], // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

```json
{
  id: 16,
  name: null,
  email: 'orla@prisma.io',
  profileViews: 0,
  role: 'USER',
  coinflips: [],
  posts: []
}
```

To `disconnect` *one* record (for example, a post's author), use `disconnect: true`:

```ts
const result = await prisma.post.update({
  where: {
    id: 23,
  },
  data: {
    author: {
      // [!code highlight]
      disconnect: true, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    author: true,
  },
});
```

```json
{
  id: 23,
  title: 'How to eat an omelette',
  published: true,
  authorId: null,
  comments: null,
  views: 0,
  likes: 0,
  author: null
}
```

### Disconnect all related records [#disconnect-all-related-records]

To [`disconnect`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#disconnect) *all* related records in a one-to-many relation (a user has many posts), `set` the relation to an empty list as shown:

```ts
const result = await prisma.user.update({
  where: {
    id: 16,
  },
  data: {
    posts: {
      // [!code highlight]
      set: [], // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

```json
{
  id: 16,
  name: null,
  email: 'orla@prisma.io',
  profileViews: 0,
  role: 'USER',
  coinflips: [],
  posts: []
}
```

### Delete all related records [#delete-all-related-records]

Delete all related `Post` records:

```ts
const result = await prisma.user.update({
  where: {
    id: 11,
  },
  data: {
    posts: {
      // [!code highlight]
      deleteMany: {}, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

### Delete specific related records [#delete-specific-related-records]

Update a user by deleting all unpublished posts:

```ts
const result = await prisma.user.update({
  where: {
    id: 11,
  },
  data: {
    posts: {
      // [!code highlight]
      deleteMany: {
        // [!code highlight]
        published: false, // [!code highlight]
      }, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

Update a user by deleting specific posts:

```ts
const result = await prisma.user.update({
  where: {
    id: 6,
  },
  data: {
    posts: {
      // [!code highlight]
      deleteMany: [{ id: 7 }], // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

### Update all related records (or filter) [#update-all-related-records-or-filter]

You can use a nested `updateMany` to update *all* related records for a particular user. The following query unpublishes all posts for a specific user:

```ts
const result = await prisma.user.update({
  where: {
    id: 6,
  },
  data: {
    posts: {
      // [!code highlight]
      updateMany: {
        // [!code highlight]
        where: {
          // [!code highlight]
          published: true, // [!code highlight]
        }, // [!code highlight]
        data: {
          // [!code highlight]
          published: false, // [!code highlight]
        }, // [!code highlight]
      }, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

### Update a specific related record [#update-a-specific-related-record]

```ts
const result = await prisma.user.update({
  where: {
    id: 6,
  },
  data: {
    posts: {
      // [!code highlight]
      update: {
        // [!code highlight]
        where: {
          // [!code highlight]
          id: 9, // [!code highlight]
        }, // [!code highlight]
        data: {
          // [!code highlight]
          title: "My updated title", // [!code highlight]
        }, // [!code highlight]
      }, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

### Update *or* create a related record [#update-or-create-a-related-record]

The following query uses a nested `upsert` to update `"bob@prisma.io"` if that user exists, or create the user if they do not exist:

```ts
const result = await prisma.post.update({
  where: {
    id: 6,
  },
  data: {
    author: {
      // [!code highlight]
      upsert: {
        // [!code highlight]
        create: {
          // [!code highlight]
          email: "bob@prisma.io", // [!code highlight]
          name: "Bob the New User", // [!code highlight]
        }, // [!code highlight]
        update: {
          // [!code highlight]
          email: "bob@prisma.io", // [!code highlight]
          name: "Bob the existing user", // [!code highlight]
        }, // [!code highlight]
      }, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    author: true,
  },
});
```

### Add new related records to an existing record [#add-new-related-records-to-an-existing-record]

You can nest `create` or `createMany` inside an `update` to add new related records to an existing record. The following query adds two posts to a user with an `id` of 9:

```ts
const result = await prisma.user.update({
  where: {
    id: 9,
  },
  data: {
    posts: {
      // [!code highlight]
      createMany: {
        // [!code highlight]
        data: [{ title: "My first post" }, { title: "My second post" }], // [!code highlight]
      }, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

## Relation filters [#relation-filters]

### Filter on "-to-many" relations [#filter-on--to-many-relations]

Prisma Client provides the [`some`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#some), [`every`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#every), and [`none`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#none) options to filter records by the properties of related records on the "-to-many" side of the relation. For example, filtering users based on properties of their posts.

For example:

| Requirement                                                                       | Query option to use                 |
| --------------------------------------------------------------------------------- | ----------------------------------- |
| "I want a list of every `User` that has *at least one* unpublished `Post` record" | `some` posts are unpublished        |
| "I want a list of every `User` that has *no* unpublished `Post` records"          | `none` of the posts are unpublished |
| "I want a list of every `User` that has *only* unpublished `Post` records"        | `every` post is unpublished         |

For example, the following query returns `User` that meet the following criteria:

* No posts with more than 100 views
* All posts have less than, or equal to 50 likes

```ts
const users = await prisma.user.findMany({
  where: {
    posts: {
      // [!code highlight]
      none: {
        // [!code highlight]
        views: {
          // [!code highlight]
          gt: 100, // [!code highlight]
        }, // [!code highlight]
      }, // [!code highlight]
      every: {
        // [!code highlight]
        likes: {
          // [!code highlight]
          lte: 50, // [!code highlight]
        }, // [!code highlight]
      }, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

### Filter on "-to-one" relations [#filter-on--to-one-relations]

Prisma Client provides the [`is`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#is) and [`isNot`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#isnot) options to filter records by the properties of related records on the "-to-one" side of the relation. For example, filtering posts based on properties of their author.

For example, the following query returns `Post` records that meet the following criteria:

* Author's name is not Bob
* Author is older than 40

```ts
const users = await prisma.post.findMany({
  where: {
    author: {
      // [!code highlight]
      isNot: {
        // [!code highlight]
        name: "Bob", // [!code highlight]
      }, // [!code highlight]
      is: {
        // [!code highlight]
        age: {
          // [!code highlight]
          gt: 40, // [!code highlight]
        }, // [!code highlight]
      }, // [!code highlight]
    }, // [!code highlight]
  }, // [!code highlight]
  include: {
    author: true,
  },
});
```

### Filter on absence of "-to-many" records [#filter-on-absence-of--to-many-records]

For example, the following query uses `none` to return all users that have zero posts:

```ts
const usersWithZeroPosts = await prisma.user.findMany({
  where: {
    posts: {
      // [!code highlight]
      none: {}, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

### Filter on absence of "-to-one" relations [#filter-on-absence-of--to-one-relations]

The following query returns all posts that don't have an author relation:

```js
const postsWithNoAuthor = await prisma.post.findMany({
  where: {
    author: null, // or author: { } // [!code highlight]
  },
  include: {
    author: true,
  },
});
```

### Filter on presence of related records [#filter-on-presence-of-related-records]

The following query returns all users with at least one post:

```ts
const usersWithSomePosts = await prisma.user.findMany({
  where: {
    posts: {
      // [!code highlight]
      some: {}, // [!code highlight]
    }, // [!code highlight]
  },
  include: {
    posts: true,
  },
});
```

## Fluent API [#fluent-api]

The fluent API lets you *fluently* traverse the [relations](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/relations) of your models via function calls. Note that the *last* function call determines the return type of the entire query (the respective type annotations are added in the code snippets below to make that explicit).

This query returns all `Post` records by a specific `User`:

```ts
const postsByUser: Post[] = await prisma.user
  .findUnique({ where: { email: "alice@prisma.io" } })
  .posts();
```

This is equivalent to the following `findMany` query:

```ts
const postsByUser = await prisma.post.findMany({
  where: {
    author: {
      email: "alice@prisma.io",
    },
  },
});
```

The main difference between the queries is that the fluent API call is translated into two separate database queries while the other one only generates a single query (see this [GitHub issue](https://github.com/prisma/orm/issues/1984))

This request returns all categories by a specific post:

```ts
const categoriesOfPost: Category[] = await prisma.post
  .findUnique({ where: { id: 1 } })
  .categories();
```

Note that you can chain as many queries as you like. In this example, the chaining starts at `Profile` and goes over `User` to `Post`:

```ts
const posts: Post[] = await prisma.profile
  .findUnique({ where: { id: 1 } })
  .user()
  .posts();
```

The only requirement for chaining is that the previous function call must return only a *single object* (e.g. as returned by a `findUnique` query or a "to-one relation" like `profile.user()`).

The following query is **not possible** because `findMany` does not return a single object but a *list*:

```ts
// This query is illegal
const posts = await prisma.user.findMany().posts();
```

## Related pages

- [`Aggregation, grouping, and summarizing`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/aggregation-grouping-summarizing): Use Prisma Client to aggregate, group by, count, and select distinct.
- [`CRUD`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/crud): Learn how to perform create, read, update, and delete operations
- [`Excluding fields`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/excluding-fields): Learn how to exclude fields from Prisma Client results with the omit option.
- [`Filtering and sorting`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/filtering-and-sorting): Learn how to filter Prisma Client queries with where and sort results with orderBy.
- [`Full-text search`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/full-text-search): Learn how to search text fields with Prisma Client using your database's native full-text search support.


# Filtering and sorting (Prisma ORM v7) (/docs/orm/v7/prisma-client/queries/filtering-and-sorting)

> For the complete Prisma documentation index, see [llms.txt](https://www.prisma.io/docs/llms.txt). A markdown version of any docs page is available by appending `.md` to its URL.

Learn how to filter Prisma Client queries with where and sort results with orderBy.

Location: ORM > v7 > Prisma Client > Queries > Filtering and sorting

Prisma Client lets you narrow results with `where` and order them with `orderBy`.

## Filtering with where [#filtering-with-where]

Use `where` to match records by field values:

```ts
const users = await prisma.user.findMany({
  where: {
    email: {
      endsWith: "prisma.io",
    },
  },
});
```

## Combining operators [#combining-operators]

You can compose filters with operators such as `OR`, `AND`, and `NOT`:

```ts
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: { endsWith: "gmail.com" } },
      { email: { endsWith: "company.com" } },
    ],
    NOT: {
      email: {
        endsWith: "admin.company.com",
      },
    },
  },
});
```

## Filter on related records [#filter-on-related-records]

Relation filters let you match records based on related data:

```ts
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true,
      },
    },
  },
});
```

For more relation-specific patterns, see [Relation queries](https://www.prisma.io/docs/orm/v7/prisma-client/queries/relation-queries).

## Sort results with orderBy [#sort-results-with-orderby]

Use `orderBy` to control result ordering:

```ts
const posts = await prisma.post.findMany({
  orderBy: {
    title: "asc",
  },
});
```

You can also combine filtering and sorting:

```ts
const posts = await prisma.post.findMany({
  where: {
    published: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});
```

## Case-insensitive filtering [#case-insensitive-filtering]

Case sensitivity depends on your database provider and collation settings. For PostgreSQL, Prisma Client also supports specific case-insensitive filter modes on supported operators. See the [Prisma Client API reference](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#mode) for details.

## Sort by relation [#sort-by-relation]

You can sort by properties on related records when the query shape supports it. For example, you might order posts by their author's name or users by related aggregates.

## Sort by relevance (PostgreSQL and MySQL) [#sort-by-relevance-postgresql-and-mysql]

On supported databases, Prisma Client can sort search results by relevance using `_relevance`. This is especially useful when combined with [full-text search](https://www.prisma.io/docs/orm/v7/prisma-client/queries/full-text-search).

## Sort with null records first or last [#sort-with-null-records-first-or-last]

Prisma Client supports explicit null ordering on supported databases so you can keep incomplete values grouped at the beginning or end of a result set.

## Related pages [#related-pages]

* [Pagination](https://www.prisma.io/docs/orm/v7/prisma-client/queries/pagination)
* [Select fields](https://www.prisma.io/docs/orm/v7/prisma-client/queries/select-fields)
* [Prisma Client API reference](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#filter-conditions-and-operators)

## Related pages

- [`Aggregation, grouping, and summarizing`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/aggregation-grouping-summarizing): Use Prisma Client to aggregate, group by, count, and select distinct.
- [`CRUD`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/crud): Learn how to perform create, read, update, and delete operations
- [`Excluding fields`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/excluding-fields): Learn how to exclude fields from Prisma Client results with the omit option.
- [`Full-text search`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/full-text-search): Learn how to search text fields with Prisma Client using your database's native full-text search support.
- [`Pagination`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/pagination): Learn how to paginate Prisma Client query results with offset pagination and cursor-based pagination.

# Pagination (Prisma ORM v7) (/docs/orm/v7/prisma-client/queries/pagination)

> For the complete Prisma documentation index, see [llms.txt](https://www.prisma.io/docs/llms.txt). A markdown version of any docs page is available by appending `.md` to its URL.

Learn how to paginate Prisma Client query results with offset pagination and cursor-based pagination.

Location: ORM > v7 > Prisma Client > Queries > Pagination

Prisma Client supports both offset pagination and cursor-based pagination.

## Offset pagination [#offset-pagination]

Use `skip` and `take` when you need page numbers or shallow navigation through a result set:

```ts
const posts = await prisma.post.findMany({
  skip: 20,
  take: 10,
});
```

Offset pagination is straightforward, but it becomes more expensive as the offset grows.

## Cursor-based pagination [#cursor-based-pagination]

Use `cursor` and `take` when you want stable, scalable pagination for feeds, timelines, or large datasets:

```ts
const firstPage = await prisma.post.findMany({
  take: 10,
  orderBy: {
    id: "asc",
  },
});

const lastPost = firstPage[firstPage.length - 1];

const nextPage = lastPost
  ? await prisma.post.findMany({
      take: 10,
      skip: 1,
      cursor: {
        id: lastPost.id,
      },
      orderBy: {
        id: "asc",
      },
    })
  : [];
```

## Which approach to choose [#which-approach-to-choose]

* Use offset pagination when users need to jump directly to a numbered page.
* Use cursor-based pagination when you care more about performance and consistency as the dataset grows.

## Related pages [#related-pages]

* [Filtering and sorting](https://www.prisma.io/docs/orm/v7/prisma-client/queries/filtering-and-sorting)
* [Query Insights](https://www.prisma.io/docs/query-insights)
* [Prisma Client API reference](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference)

## Related pages

- [`Aggregation, grouping, and summarizing`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/aggregation-grouping-summarizing): Use Prisma Client to aggregate, group by, count, and select distinct.
- [`CRUD`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/crud): Learn how to perform create, read, update, and delete operations
- [`Excluding fields`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/excluding-fields): Learn how to exclude fields from Prisma Client results with the omit option.
- [`Filtering and sorting`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/filtering-and-sorting): Learn how to filter Prisma Client queries with where and sort results with orderBy.
- [`Full-text search`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/full-text-search): Learn how to search text fields with Prisma Client using your database's native full-text search support.

# Aggregation, grouping, and summarizing (Prisma ORM v7) (/docs/orm/v7/prisma-client/queries/aggregation-grouping-summarizing)

> For the complete Prisma documentation index, see [llms.txt](https://www.prisma.io/docs/llms.txt). A markdown version of any docs page is available by appending `.md` to its URL.

Use Prisma Client to aggregate, group by, count, and select distinct.

Location: ORM > v7 > Prisma Client > Queries > Aggregation, grouping, and summarizing

Prisma Client allows you to count records, aggregate number fields, and select distinct field values.

## Aggregate [#aggregate]

Prisma Client allows you to [`aggregate`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#aggregate) on the **number** fields (such as `Int` and `Float`) of a model. The following query returns the average age of all users:

```ts
const aggregations = await prisma.user.aggregate({
  _avg: { age: true },
});

console.log('Average age:' + aggregations._avg.age);
```

You can combine aggregation with filtering and ordering. For example, the following query returns the average age of users:

* Ordered by `age` ascending
* Where `email` contains `prisma.io`
* Limited to the 10 users

```ts
const aggregations = await prisma.user.aggregate({
  _avg: { age: true },
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
  orderBy: { age: 'asc' },
  take: 10,
});

console.log('Average age:' + aggregations._avg.age);
```

### Aggregate values are nullable [#aggregate-values-are-nullable]

Aggregations on **nullable fields** can return a `number` or `null`. This excludes `count`, which always returns 0 if no records are found.

Consider the following query, where `age` is nullable in the schema:

```ts
const aggregations = await prisma.user.aggregate({
  _avg: { age: true },
  _count: { age: true },
});
```

```json
{
  "_avg": { "age": null },
  "_count": { "age": 9 }
}
```

The query returns `{ _avg: { age: null } }` in either of the following scenarios:

* There are no users
* The value of every user's `age` field is `null`

This allows you to differentiate between the true aggregate value (which could be zero) and no data.

## Group by [#group-by]

Prisma Client's [`groupBy()`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#groupby) allows you to **group records** by one or more field values - such as `country`, or `country` and `city` and **perform aggregations** on each group, such as finding the average age of people living in a particular city.

The following example groups all users by the `country` field and returns the total number of profile views for each country:

```ts
const groupUsers = await prisma.user.groupBy({
  by: ['country'],
  _sum: { profileViews: true },
});
```

```json
[
  { country: 'Germany', _sum: { profileViews: 126 } },
  { country: 'Sweden', _sum: { profileViews: 0 } },
];
```

If you have a single element in the `by` option, you can use the following shorthand syntax to express your query:

```ts
const groupUsers = await prisma.user.groupBy({
  by: 'country',
});
```

### `groupBy()` and filtering [#groupby-and-filtering]

`groupBy()` supports two levels of filtering: `where` and `having`.

#### Filter records with `where` [#filter-records-with-where]

Use `where` to filter all records **before grouping**. The following example groups users by country and sums profile views, but only includes users where the email address contains `prisma.io`:

```ts
const groupUsers = await prisma.user.groupBy({
  by: ['country'],
  where: {
    // [!code highlight]
    email: {
      // [!code highlight]
      contains: 'prisma.io', // [!code highlight]
    }, // [!code highlight]
  }, // [!code highlight]
  _sum: {
    profileViews: true,
  },
});
```

#### Filter groups with `having` [#filter-groups-with-having]

Use `having` to filter **entire groups** by an aggregate value such as the sum or average of a field, not individual records - for example, only return groups where the *average* `profileViews` is greater than 100:

```ts
const groupUsers = await prisma.user.groupBy({
  by: ['country'],
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
  _sum: { profileViews: true, },
  having: {
    // [!code highlight]
    profileViews: {
      // [!code highlight]
      _avg: {
        // [!code highlight]
        gt: 100, // [!code highlight]
      }, // [!code highlight]
    }, // [!code highlight]
  }, // [!code highlight]
});
```

##### Use case for `having` [#use-case-for-having]

The primary use case for `having` is to filter on aggregations. We recommend that you use `where` to reduce the size of your data set as far as possible *before* grouping, because doing so ✔ reduces the number of records the database has to return and ✔ makes use of indices.

For example, the following query groups all users that are *not* from Sweden or Ghana:

```ts
const fd = await prisma.user.groupBy({
  by: ['country'],
  where: {
    country: {
      // [!code highlight]
      notIn: ['Sweden', 'Ghana'], // [!code highlight]
    }, // [!code highlight]
  },
  _sum: {
    profileViews: true,
  },
  having: {
    profileViews: {
      _min: {
        gte: 10,
      },
    },
  },
});
```

The following query technically achieves the same result, but excludes users from Ghana *after* grouping. This does not confer any benefit and is not recommended practice.

```ts
const groupUsers = await prisma.user.groupBy({
  by: ['country'],
  where: {
    country: {
      // [!code highlight]
      not: 'Sweden', // [!code highlight]
    }, // [!code highlight]
  },
  _sum: {
    profileViews: true,
  },
  having: {
    country: {
      // [!code highlight]
      not: 'Ghana', // [!code highlight]
    }, // [!code highlight]
    profileViews: {
      _min: {
        gte: 10,
      },
    },
  },
});
```

> **Note**: Within `having`, you can only filter on aggregate values *or* fields available in `by`.

### `groupBy()` and ordering [#groupby-and-ordering]

The following constraints apply when you combine `groupBy()` and `orderBy`:

* You can `orderBy` fields that are present in `by`
* You can `orderBy` aggregate (Preview in 2.21.0 and later)
* If you use `skip` and/or `take` with `groupBy()`, you must also include `orderBy` in the query

#### Order by aggregate group [#order-by-aggregate-group]

You can **order by aggregate group**. The following example sorts each `city` group by the number of users in that group (largest group first):

```ts
const groupBy = await prisma.user.groupBy({
  by: ['city'],
  _count: {
    city: true,
  },
  orderBy: {
    _count: {
      city: 'desc',
    },
  },
});
```

```json
[
  { city: 'Berlin', count: { city: 3 } },
  { city: 'Paris', count: { city: 2 } },
  { city: 'Amsterdam', count: { city: 1 } },
];
```

#### Order by field [#order-by-field]

The following query orders groups by country, skips the first two groups, and returns the 3rd and 4th group:

```ts
const groupBy = await prisma.user.groupBy({
  by: ['country'],
  _sum: {
    profileViews: true,
  },
  orderBy: {
    country: 'desc',
  },
  skip: 2,
  take: 2,
});
```

### `groupBy()` FAQ [#groupby-faq]

#### Can I use `select` with `groupBy()`? [#can-i-use-select-with-groupby]

You cannot use `select` with `groupBy()`. However, all fields included in `by` are automatically returned.

#### What is the difference between using `where` and `having` with `groupBy()`? [#what-is-the-difference-between-using-where-and-having-with-groupby]

`where` filters all records before grouping, and `having` filters entire groups and supports filtering on an aggregate field value, such as the average or sum of a particular field in that group.

#### What is the difference between `groupBy()` and `distinct`? [#what-is-the-difference-between-groupby-and-distinct]

Both `distinct` and `groupBy()` group records by one or more unique field values. `groupBy()` allows you to aggregate data within each group - for example, return the average number of views on posts from Denmark - whereas distinct does not.

## Count [#count]

### Count records [#count-records]

Use [`count()`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#count) to count the number of records or non-`null` field values. The following example query counts all users:

```ts
const userCount = await prisma.user.count();
```

### Count relations [#count-relations]

To return a count of relations (for example, a user's post count), use the `_count` parameter with a nested `select` as shown:

```ts
const usersWithCount = await prisma.user.findMany({
  include: {
    _count: {
      select: { posts: true },
    },
  },
});
```

```json
{ id: 1, _count: { posts: 3 } },
{ id: 2, _count: { posts: 2 } },
{ id: 3, _count: { posts: 2 } },
{ id: 4, _count: { posts: 0 } },
{ id: 5, _count: { posts: 0 } }
```

The `_count` parameter:

* Can be used inside a top-level `include` *or* `select`
* Can be used with any query that returns records (including `delete`, `update`, and `findFirst`)
* Can return [multiple relation counts](#return-multiple-relation-counts)
* Can [filter relation counts](#filter-the-relation-count) (from version 4.3.0)

#### Return a relations count with `include` [#return-a-relations-count-with-include]

The following query includes each user's post count in the results:

```ts
const usersWithCount = await prisma.user.findMany({
  include: {
    _count: {
      select: { posts: true },
    },
  },
});
```

```json
{ id: 1, _count: { posts: 3 } },
{ id: 2, _count: { posts: 2 } },
{ id: 3, _count: { posts: 2 } },
{ id: 4, _count: { posts: 0 } },
{ id: 5, _count: { posts: 0 } }
```

#### Return a relations count with `select` [#return-a-relations-count-with-select]

The following query uses `select` to return each user's post count *and no other fields*:

```ts
const usersWithCount = await prisma.user.findMany({
  select: {
    _count: {
      select: { posts: true },
    },
  },
});
```

```json
{
  _count: {
    posts: 3;
  }
}
```

#### Return multiple relation counts [#return-multiple-relation-counts]

The following query returns a count of each user's `posts` and `recipes` and no other fields:

```ts
const usersWithCount = await prisma.user.findMany({
  select: {
    _count: {
      select: {
        posts: true,
        recipes: true,
      },
    },
  },
});
```

```json
{
  "_count": {
    "posts": 3,
    "recipes": 9
  }
}
```

#### Filter the relation count [#filter-the-relation-count]

Use `where` to filter the fields returned by the `_count` output type. You can do this on [scalar fields](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/models#scalar-fields) and [relation fields](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/models#relation-fields).

For example, the following query returns all user posts with the title "Hello!":

```ts
// Count all user posts with the title "Hello!"
await prisma.user.findMany({
  select: {
    _count: {
      select: {
        posts: { where: { title: 'Hello!' } },
      },
    },
  },
});
```

The following query finds all user posts with comments from an author named "Alice":

```ts
// Count all user posts that have comments
// whose author is named "Alice"
await prisma.user.findMany({
  select: {
    _count: {
      select: {
        posts: {
          where: { comments: { some: { author: { is: { name: 'Alice' } } } } },
        },
      },
    },
  },
});
```

### Count non-`null` field values [#count-non-null-field-values]

In [2.15.0](https://github.com/prisma/orm/releases/2.15.0) and later, you can count all records as well as all instances of non-`null` field values. The following query returns a count of:

* All `User` records (`_all`)
* All non-`null` `name` values (not distinct values, just values that are not `null`)

```ts
const userCount = await prisma.user.count({
  select: {
    _all: true, // Count all records
    name: true, // Count all non-null field values
  },
});
```

```json
{ "_all": 30, "name": 10 }
```

### Filtered count [#filtered-count]

`count` supports filtering. The following example query counts all users with more than 100 profile views:

```ts
const userCount = await prisma.user.count({
  where: {
    profileViews: {
      gte: 100,
    },
  },
});
```

The following example query counts a particular user's posts:

```ts
const postCount = await prisma.post.count({
  where: {
    authorId: 29,
  },
});
```

## Select distinct [#select-distinct]

Prisma Client allows you to filter duplicate rows from a Prisma Query response to a [`findMany`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#findmany) query using [`distinct`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#distinct) . `distinct` is often used in combination with [`select`](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#select) to identify certain unique combinations of values in the rows of your table.

The following example returns all fields for all `User` records with distinct `name` field values:

```ts
const result = await prisma.user.findMany({
  where: {},
  distinct: ['name'],
});
```

The following example returns distinct `role` field values (for example, `ADMIN` and `USER`):

```ts
const distinctRoles = await prisma.user.findMany({
  distinct: ['role'],
  select: {
    role: true,
  },
});
```

```json
[
  { role: 'USER', },
  { role: 'ADMIN', },
];
```

### `distinct` under the hood [#distinct-under-the-hood]

Prisma Client's `distinct` option does not use SQL `SELECT DISTINCT`. Instead, `distinct` uses:

* A `SELECT` query
* In-memory post-processing to select distinct

It was designed in this way in order to &#x2A;*support `select` and `include`** as part of `distinct` queries.

The following example selects distinct on `gameId` and `playerId`, ordered by `score`, in order to return **each player's highest score per game**. The query uses `include` and `select` to include additional data:

* Select `score` (field on `Play`)
* Select related player name (relation between `Play` and `User`)
* Select related game name (relation between `Play` and `Game`)

**Expand for sample schema**

```prisma title="schema.prisma"
model User {
  id   Int     @id @default(autoincrement())
  name String?
  play Play[]
}

model Game {
  id   Int     @id @default(autoincrement())
  name String?
  play Play[]
}

model Play {
  id       Int   @id @default(autoincrement())
  score    Int?  @default(0)
  playerId Int?
  player   User? @relation(fields: [playerId], references: [id])
  gameId   Int?
  game     Game? @relation(fields: [gameId], references: [id])
}
```

```ts
const distinctScores = await prisma.play.findMany({
  distinct: ['playerId', 'gameId'],
  orderBy: {
    score: 'desc',
  },
  select: {
    score: true,
    game: {
      select: {
        name: true,
      },
    },
    player: {
      select: {
        name: true,
      },
    },
  },
});
```

```json
[
  {
    "score": 900,
    "game": { "name": "Pacman" },
    "player": { "name": "Bert Bobberton" }
  },
  {
    "score": 400,
    "game": { "name": "Pacman" },
    "player": { "name": "Nellie Bobberton" }
  }
]
```

Without `select` and `distinct`, the query would return:

```json
[
  {
    "gameId": 2,
    "playerId": 5
  },
  {
    "gameId": 2,
    "playerId": 10
  }
]
```

## Related pages

- [`CRUD`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/crud): Learn how to perform create, read, update, and delete operations
- [`Excluding fields`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/excluding-fields): Learn how to exclude fields from Prisma Client results with the omit option.
- [`Filtering and sorting`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/filtering-and-sorting): Learn how to filter Prisma Client queries with where and sort results with orderBy.
- [`Full-text search`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/full-text-search): Learn how to search text fields with Prisma Client using your database's native full-text search support.
- [`Pagination`](https://www.prisma.io/docs/orm/v7/prisma-client/queries/pagination): Learn how to paginate Prisma Client query results with offset pagination and cursor-based pagination.