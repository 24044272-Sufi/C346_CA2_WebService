# Food Waste API

A RESTful API built with Express.js for tracking and managing food waste entries. The API connects to a MySQL database (Aiven) and provides full CRUD operations for food waste data.

## Table of Contents

- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)

## Features

- ✅ Create, read, update, and delete food waste entries
- ✅ MySQL connection pooling for optimized database performance
- ✅ Environment variable configuration
- ✅ Comprehensive error handling
- ✅ JSON request/response format

## Database Schema

The API expects a table named `food_waste_entries` in the `defaultdb` database with the following structure:

```sql
CREATE TABLE food_waste_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    weight DECIMAL(10, 2) NOT NULL,
    waste_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Unique identifier (auto-increment)
- `category`: Type/category of food waste (e.g., "vegetables", "meat", "dairy")
- `weight`: Weight of the waste (in kg or lbs)
- `waste_reason`: Reason for waste (e.g., "expired", "spoiled", "over-prepared")
- `created_at`: Timestamp of entry creation (optional, not used in current API)

## API Endpoints

### 1. Get All Food Waste Entries

**Endpoint:** `GET /foodwaste`

**Description:** Retrieves all food waste entries from the database.

**Response:**
- **Status:** 200 OK
- **Body:** Array of food waste entry objects

```json
[
    {
        "id": 1,
        "category": "vegetables",
        "weight": 2.5,
        "waste_reason": "expired"
    },
    {
        "id": 2,
        "category": "meat",
        "weight": 1.2,
        "waste_reason": "spoiled"
    }
]
```

**Error Response:**
- **Status:** 500 Internal Server Error
- **Body:**
```json
{
    "message": "Server error for food_waste",
    "reason": "Aiven Database is down, please power on service"
}
```

---

### 2. Add Food Waste Entry

**Endpoint:** `POST /addfoodwaste`

**Description:** Creates a new food waste entry.

**Request Body:**
```json
{
    "category": "vegetables",
    "weight": 2.5,
    "waste_reason": "expired"
}
```

**Fields:**
- `category` (string, required): Category of food waste
- `weight` (number, required): Weight of waste
- `waste_reason` (string, required): Reason for waste

**Success Response:**
- **Status:** 201 Created
- **Body:**
```json
{
    "message": "Food waste entry for vegetables added successfully"
}
```

**Error Response:**
- **Status:** 500 Internal Server Error
- **Body:**
```json
{
    "message": "Server error - could not add food waste entry for vegetables",
    "reason": "Aiven Database is down, please power on service"
}
```

---

### 3. Update Food Waste Entry

**Endpoint:** `PUT /updatefoodwaste/:id`

**Description:** Updates an existing food waste entry by ID.

**URL Parameters:**
- `id` (integer): The ID of the food waste entry to update

**Request Body:**
```json
{
    "category": "fruits",
    "weight": 3.0,
    "waste_reason": "over-ripe"
}
```

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
    "message": "Food waste entry for fruits updated successfully"
}
```

**Not Found Response:**
- **Status:** 404 Not Found
- **Body:**
```json
{
    "message": "Food waste entry with id 5 not found"
}
```

**Error Response:**
- **Status:** 500 Internal Server Error
- **Body:**
```json
{
    "message": "Server error - could not update food waste entry with id 5",
    "reason": "Aiven Database is down, please power on service"
}
```

---

### 4. Delete Food Waste Entry

**Endpoint:** `DELETE /deletefoodwaste/:id`

**Description:** Deletes a food waste entry by ID.

**URL Parameters:**
- `id` (integer): The ID of the food waste entry to delete

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
    "message": "Food waste entry with id 3 deleted successfully"
}
```

**Not Found Response:**
- **Status:** 404 Not Found
- **Body:**
```json
{
    "message": "Food waste entry with id 3 not found"
}
```

**Error Response:**
- **Status:** 500 Internal Server Error
- **Body:**
```json
{
    "message": "Server error - could not delete food waste entry with id 3",
    "reason": "Aiven Database is down, please power on service"
}
```

## Error Handling

The API implements consistent error handling across all endpoints:

- **500 Internal Server Error**: Database connection issues or query failures
- **404 Not Found**: Resource not found (for UPDATE and DELETE operations)
- **201 Created**: Successful resource creation
- **200 OK**: Successful retrieval, update, or deletion

All error responses include a descriptive `message` and `reason` field for debugging.

## Dependencies

- **express** (^4.x): Web framework for Node.js
- **mysql2** (^3.x): MySQL client with promise support
- **dotenv** (^16.x): Environment variable loader

## Connection Pooling

The API uses MySQL connection pooling with the following configuration:

- **Connection Limit**: 100 concurrent connections
- **Queue Limit**: Unlimited (0)
- **Wait for Connections**: Enabled

This ensures optimal database performance and resource management.
