# GraphQL Federated Services Monorepo

## Setup

1. **Install Dependencies**:
   Run the following command to install all dependencies for the entire monorepo:
   ```bash
   npm install
   ```
1. **Star Servers**:
   Run the following command to start the GQL server and services
   ```bash
   npm start
   ```

## Issue We Are Trying to Solve

In a federated GraphQL setup, the `Material` service owns the `Material` entity, while the `Zone` service owns the zones and associates materials with different zones. When trying to extend the stock information in the `Stock Service`, it becomes challenging to resolve both `materialId` and `zoneId` accurately in the `Stock Service`. The core issue is that, during federation, we need a way to pass both identifiers (`materialId` and `zoneId`) to ensure correct stock data is returned for a material in a specific zone.

## Overview

This repository contains multiple GraphQL microservices that work together in a federated architecture using Apollo Federation. The services include:

- **Material Service**: Provides information about materials, such as material name and ID.
- **Zone Service**: Manages zones and associates materials with different zones.
- **Stock Service**: Keeps track of the stock levels for materials within specific zones.
- **Supergraph Gateway**: Serves as the entry point for combining the different subgraphs (services) into a unified GraphQL API.

## Services in the Monorepo

### 1. Material Service

- **Port**: 4001
- **Description**: Provides basic information about materials, including their ID and name.
- **Key GraphQL Types**:
  - `Material`: Represents a material with `id` and `name`.
    **Resolver Context**:
    The `Material` service provides material information based on its ID. However, to accurately resolve a material's stock within a specific zone, additional information (`zoneId`) must be passed when querying related data in other services.
  ```javascript
  const resolvers = {
    Query: {
      materials: () => materials,
    },
    Material: {
      __resolveReference(material) {
        return materials.find((m) => m.id === material.id)
      },
    },
  }
  ```

### 2. Zone Service

- **Port**: 4002
- **Description**: Manages zones and links materials to zones.
- **Key GraphQL Types**:
  - `Zone`: Represents a zone with `id`, `name`, and a list of `materials`.

### 3. Stock Service

- **Port**: 4003
- **Description**: Provides stock levels for materials within specific zones.
- **Key GraphQL Types**:
  - `Stock`: Represents stock information for a `materialId` within a `zoneId`.

### 4. Supergraph Gateway

- **Port**: 4000
- **Description**: Combines the services into a unified supergraph, allowing clients to query data from multiple services seamlessly.

## How to Use This Repository

### Prerequisites

- **Node.js** (v14 or later recommended)
- **npm** (v7 or later) or **Yarn**

### Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Krister-Johansson/graphql-federated-services-monorepo
   cd graphql-federated-services-monorepo
   ```

2. **Install Dependencies**:

   - Use **npm** to install all dependencies for all services:

   ```bash
   npm install
   ```

3. **Run the Project**:

   - To run all services simultaneously, use **concurrently**:

   ```bash
   npm start
   ```

### Example Queries

- **Query to Get Zone Materials**:

  ```graphql
  query Zones {
    zones {
      id
      name
      materials {
        id
        name
        stocks {
          amount
        }
      }
    }
  }
  ```

- This query will return materials along with their stock levels for the specified `zoneId`.

## Conclusion

This monorepo structure makes it easier to develop, manage, and share federated GraphQL services. The key challenge of getting `zoneId` to the `Material` resolver is addressed by modifying the schema and resolver to explicitly pass and use `zoneId` during resolution, ensuring that correct data is returned for each material in its respective zone.
