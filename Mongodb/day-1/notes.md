## **What is MongoDB?**
MongoDB is a NoSQL (Not Only SQL) database that is used to store large amounts of unstructured data. It uses a flexible, schema-less format, allowing for faster and more scalable applications. MongoDB is document-oriented and stores data in a format called **BSON** (Binary JSON).

---

## **More About MongoDB**
MongoDB is designed to handle large volumes of data with high performance and flexibility. Some of its key features include:
- **Schema-less design**: Documents in a collection do not have to follow a strict schema, allowing for more flexibility.
- **Horizontal scaling**: MongoDB can scale out by distributing data across many machines.
- **Replication**: Data can be replicated across multiple servers for high availability.
- **Indexing**: MongoDB supports indexing to improve query performance.

---

## **Difference Between SQL and MongoDB**

| Feature                | SQL (Relational)                      | MongoDB (NoSQL)                           |
|------------------------|---------------------------------------|-------------------------------------------|
| **Data Storage**        | Tables (Rows and Columns)             | Collections (Documents)                   |
| **Schema**              | Fixed Schema                          | Dynamic Schema                           |
| **Scaling**             | Vertical Scaling                      | Horizontal Scaling                       |
| **Data Integrity**      | Strong consistency and ACID properties | Eventual consistency                     |
| **Queries**             | SQL Queries                           | JavaScript-based queries (BSON format)    |
| **Transactions**        | Supported                             | Limited (Mature in recent versions)      |
| **Relationships**       | Supports Foreign Keys & Joins         | No built-in joins (Uses embedded documents or references) |
| **Data Type**           | Fixed (Int, Char, Date, etc.)         | Flexible (String, Number, Array, etc.)    |

---

## **MongoDB Terminologies**
### **1. Database**
A MongoDB database holds collections of documents. It is similar to a database in SQL systems.

### **2. Collection**
A collection is a group of MongoDB documents, similar to a table in SQL databases. Collections do not require a predefined schema, so documents within the collection can have different structures.

### **3. Document**
A document is a set of key-value pairs, similar to a row in a table. It is stored in BSON format, a binary form of JSON. It can include arrays, nested documents, and different data types.

### **4. Field**
A field is a key-value pair within a document. Each document in a collection can have different fields.

Example:
```javascript
{
   "_id": ObjectId("60b8d795f3b1b8283454d6fa"),
   "name": "John Doe",
   "age": 30,
   "address": {
     "street": "123 Main St",
     "city": "New York"
   }
}
```

---

## **How MongoDB Works**
MongoDB stores data in a binary format called **BSON** (Binary JSON). When a document is inserted into MongoDB, it is converted to BSON, allowing for faster and more efficient data retrieval. MongoDB uses **indexes** to speed up queries, and its **replication** mechanism helps keep the data available even in case of server failure.

---

## **JSON vs BSON**
- **JSON (JavaScript Object Notation)** is a lightweight data format for storing and exchanging data, usually in text format. It supports strings, numbers, booleans, arrays, and objects.
  
- **BSON (Binary JSON)** is a binary-encoded format for JSON-like data. It extends JSON to support additional data types, like `ObjectId`, and allows for faster encoding and decoding.

**Example of BSON Data**:
```json
{
  "_id": ObjectId("5fbb84d83b2e0d3f4b45044d"),
  "name": "Alice",
  "age": 25,
  "active": true
}
```

---

## **Installing MongoDB**

### **1. Community Version**
- **Download**: Go to the [MongoDB download center](https://www.mongodb.com/try/download/community) and choose the version appropriate for your OS (Windows, macOS, or Linux).
- **Installation**: Follow the installation steps for your operating system. 

### **2. MongoDB Shell (mongosh)**
MongoDB Shell (`mongosh`) provides an interactive interface to MongoDB. You can download it from the [MongoDB shell page](https://www.mongodb.com/try/download/shell) or use it via the MongoDB Atlas UI.

### **3. GUI: MongoDB Atlas**
MongoDB Atlas is a fully-managed cloud service that hosts MongoDB. It provides a web-based GUI for database management, and you can sign up [here](https://www.mongodb.com/cloud/atlas).

---

## **Managing Databases in MongoDB**

### **Creating and Deleting Databases**
```javascript
// Create or switch to a database
use myDatabase;

// Delete a database
db.dropDatabase();
```

### **Creating and Deleting Collections**
```javascript
// Create a collection
db.createCollection("myCollection");

// Drop a collection
db.myCollection.drop();
```

---

## **Inserting Documents in MongoDB**
To insert documents into a collection:

### **Single Document Insert**
```javascript
db.myCollection.insertOne({
   "name": "John",
   "age": 30
});
```

### **Multiple Document Insert**
```javascript
db.myCollection.insertMany([
   { "name": "Alice", "age": 25 },
   { "name": "Bob", "age": 35 }
]);
```

### **Ordered vs Unordered Inserts** assignemnt
- **Ordered Inserts**: MongoDB will stop inserting documents if one fails.
- **Unordered Inserts**: MongoDB will continue inserting even if one document fails.
```javascript
db.myCollection.insertMany([
   { "name": "Charlie", "age": 40 },
   { "name": "David", "age": "invalid_age" } // This will cause a failure in ordered insert
], { ordered: false });
```

### **Case Sensitivity**
MongoDB queries are case-sensitive by default. For example, "John" and "john" are considered different values.
```javascript
db.myCollection.find({ "name": "John" });
```

---

## **The `find` Keyword**
The `find` method is used to query MongoDB collections. It returns a cursor, which can be iterated over.

### **Basic Find**
```javascript
db.myCollection.find({ "name": "John" });
```

### **Find with Projection**
```javascript
db.myCollection.find({ "name": "John" }, { "age": 1 });
```