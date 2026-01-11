<!-- REad operation in mongodb -->


### **1. `find()` Examples**

- **Find all items of type "fruit":**
  ```javascript
  db.collectionName.find({ type: "fruit" });
  ```

- **Find all items with a price greater than 20:**
  ```javascript
  db.collectionName.find({ price: { $gt: 20 } });
  ```

- **Find all items with a rating of 4:**
  ```javascript
  db.collectionName.find({ rating: 4 });
  ```

- **Find all items where the title contains the word "Strawberry":**
  ```javascript
  db.collectionName.find({ title: /Strawberry/i });
  ```

- **Find all items of type "dairy" and price less than 25:**
  ```javascript
  db.collectionName.find({ type: "dairy", price: { $lt: 25 } });
  ```

### **2. `findOne()` Examples**

- **Find a single item of type "bakery":**
  ```javascript
  db.collectionName.findOne({ type: "bakery" });
  ```

- **Find a single item with a rating of 5:**
  ```javascript
  db.collectionName.findOne({ rating: 5 });
  ```

- **Find a single item where the title is "Green smoothie":**
  ```javascript
  db.collectionName.findOne({ title: "Green smoothie" });
  ```

- **Find a single item with a price exactly equal to 14.77:**
  ```javascript
  db.collectionName.findOne({ price: 14.77 });
  ```


<!-- Comparison Operators
$eq , $ne , $gt , $gte , $it , $ite , $in , $nin
 -->
 
### 1. $eq (Equals)

The `$eq` operator selects documents where the value of a field equals the specified value.

**Example:**
```javascript
db.products.find({ "price": { $eq: 100 } })
```
This query selects documents where the "price" field is equal to 100.

### 2. $ne (Not Equals)

The `$ne` operator selects documents where the value of a field is not equal to the specified value.

**Example:**
```javascript
db.products.find({ price: { $ne: 100 } })
```
This query selects documents where the "price" field is not equal to 100.

### 3. $gt (Greater Than)

The `$gt` operator selects documents where the value of a field is greater than the specified value.

**Example:**
```javascript
db.products.find({ price: { $gt: 100 } })
```
This query selects documents where the "price" field is greater than 100.

### 4. $gte (Greater Than or Equal To)

The `$gte` operator selects documents where the value of a field is greater than or equal to the specified value.

**Example:**
```javascript
db.products.find({ price: { $gte: 100 } })
```
This query selects documents where the "price" field is greater than or equal to 100.

### 5. $lt (Less Than)

The `$lt` operator selects documents where the value of a field is less than the specified value.

**Example:**
```javascript
db.products.find({ price: { $lt: 100 } })
```
This query selects documents where the "price" field is less than 100.

### 6. $lte (Less Than or Equal To)

The `$lte` operator selects documents where the value of a field is less than or equal to the specified value.

**Example:**
```javascript
db.products.find({ price: { $lte: 100 } })
```
This query selects documents where the "price" field is less than or equal to 100.

### 7. $in (In)

The `$in` operator selects documents where the value of a field matches any value in the specified array.

**Example:**
```javascript
db.products.find({ category: { $in: ["Electronics", "Clothing"] } })
```
This query selects documents where the "category" field matches either "Electronics" or "Clothing".

### 8. $nin (Not In)

The `$nin` operator selects documents where the value of a field does not match any value in the specified array.

**Example:**
```javascript
db.products.find({ category: { $nin: ["Electronics", "Clothing"] } })
```
This query selects documents where the "category" field does not match either "Electronics" or "Clothing".

 <!-- Introduction to cursors
 cursor methods ( count , limit , skip , sort)
  -->
  
  
  ### **Introduction to Cursors in MongoDB**

When you use the `find()` method in MongoDB, it returns a **cursor**, which is a pointer to the result set of a query. The cursor allows you to iterate through the documents in the collection efficiently. MongoDB provides several cursor methods to manipulate or process the data, including `count()`, `limit()`, `skip()`, and `sort()`.

---

### **Cursor Methods with Examples**

#### **1. `count()`**
The `count()` method returns the number of documents matching the query criteria.

```javascript
// Count the number of documents of type "fruit"
const count = db.collectionName.find({ type: "fruit" }).count();
console.log("Number of fruits:", count);
```

- **Explanation**: 
  - `find()` retrieves the cursor for documents where the `type` is "fruit".
  - `count()` returns the total number of documents matching the query.

---

#### **2. `limit()`**
The `limit()` method restricts the number of documents returned by a query.

```javascript
// Find the first 3 documents of type "dairy"
const result = db.collectionName.find({ type: "dairy" }).limit(3);
result.forEach(doc => console.log(doc));
```

- **Explanation**:
  - `find()` retrieves the cursor for documents where the `type` is "dairy".
  - `limit(3)` ensures that only the first 3 matching documents are returned.

---

#### **3. `skip()`**
The `skip()` method skips a specified number of documents before returning the result set.

```javascript
// Skip the first 2 documents and fetch the next 3
const result = db.collectionName.find({ type: "bakery" }).skip(2).limit(3);
result.forEach(doc => console.log(doc));
```

- **Explanation**:
  - `find()` retrieves all documents of `type: "bakery"`.
  - `skip(2)` skips the first two matching documents.
  - `limit(3)` ensures that only the next 3 documents are returned.

---

#### **4. `sort()`**
The `sort()` method sorts the documents in ascending (`1`) or descending (`-1`) order based on the specified field(s).

```javascript
// Sort documents of type "fruit" by price in ascending order
const result = db.collectionName.find({ type: "fruit" }).sort({ price: 1 });
result.forEach(doc => console.log(doc));
```

- **Explanation**:
  - `find()` retrieves documents of `type: "fruit"`.
  - `sort({ price: 1 })` sorts the documents in ascending order by the `price` field.

---

### **Combining Cursor Methods**

You can chain these methods to achieve more complex results.

```javascript
// Fetch 5 fruits sorted by rating in descending order, skipping the first 2
const result = db.collectionName
  .find({ type: "fruit" })
  .sort({ rating: -1 })
  .skip(2)
  .limit(5);

result.forEach(doc => console.log(doc));
```

- **Explanation**:
  - `find({ type: "fruit" })` filters only documents of `type: "fruit"`.
  - `sort({ rating: -1 })` sorts the documents by `rating` in descending order.
  - `skip(2)` skips the first two results.
  - `limit(5)` limits the result set to the next 5 documents.

---

### **Summary**
- **`count()`**: Returns the number of documents matching a query.
- **`limit(n)`**: Restricts the number of documents returned.
- **`skip(n)`**: Skips the first `n` documents.
- **`sort({ field: order })`**: Sorts documents by a field in ascending (`1`) or descending (`-1`) order.

  <!-- logical operators
  $and , $or , $not , $nor
   -->
   ### **Logical Operators in MongoDB**

Logical operators in MongoDB (`$and`, `$or`, `${not}`, and `$nor`) are used to combine multiple query expressions. These operators provide flexibility in filtering documents based on complex conditions.

---

### **1. `$and`**
The `$and` operator matches documents that satisfy all specified conditions.

#### **Example:**
Find documents where `category` is `"electronics"` **and** `price` is greater than 1000.

```javascript
db.collectionName.find({
  $and: [
    { category: "electronics" },
    { price: { $gt: 1000 } }
  ]
});
```

- **Explanation**:
  - `{ category: "electronics" }`: Filters documents with `category` equal to `"electronics"`.
  - `{ price: { $gt: 1000 } }`: Filters documents where `price` is greater than 1000.
  - `$and`: Ensures both conditions are true for the document to match.

---

### **2. `$or`**
The `$or` operator matches documents that satisfy at least one of the specified conditions.

#### **Example:**
Find documents where `category` is `"furniture"` **or** `price` is less than 500.

```javascript
db.collectionName.find({
  $or: [
    { category: "furniture" },
    { price: { $lt: 500 } }
  ]
});
```

- **Explanation**:
  - `$or`: Matches documents that fulfill either condition:
    - `category` is `"furniture"`.
    - `price` is less than 500.

---

### **3. `$not`**
The `$not` operator negates the result of a query expression. It matches documents that **do not** satisfy the condition.

#### **Example:**
Find documents where `price` is **not greater than** 1000.

```javascript
db.collectionName.find({
  price: { $not: { $gt: 1000 } }
});
```

- **Explanation**:
  - `{ $not: { $gt: 1000 } }`: Matches documents where `price` is not greater than 1000, which means `price` is less than or equal to 1000.

---

### **4. `$nor`**
The `$nor` operator matches documents that **do not satisfy any** of the specified conditions.

#### **Example:**
Find documents where `category` is neither `"books"` **nor** `price` is greater than 200.

```javascript
db.collectionName.find({
  $nor: [
    { category: "books" },
    { price: { $gt: 200 } }
  ]
});
```

- **Explanation**:
  - `$nor`: Matches documents that fail all specified conditions:
    - `category` is not `"books"`.
    - `price` is not greater than 200.

---

### **Combining Logical Operators**

Logical operators can be nested or combined for complex queries.

#### **Example:**
Find documents where:
- `category` is `"clothing"` **or** `price` is greater than 1000, **and**
- The `rating` is at least 4.

```javascript
db.collectionName.find({
  $and: [
    {
      $or: [
        { category: "clothing" },
        { price: { $gt: 1000 } }
      ]
    },
    { rating: { $gte: 4 } }
  ]
});
```

- **Explanation**:
  - `$or`: Matches documents with `category` as `"clothing"` or `price` greater than 1000.
  - `$and`: Ensures that the above condition is true **and** the `rating` is at least 4.

---

### **Summary of Logical Operators**
| **Operator** | **Description**                                                                                     |
|--------------|-----------------------------------------------------------------------------------------------------|
| `$and`       | Matches documents that satisfy **all** specified conditions.                                        |
| `$or`        | Matches documents that satisfy **at least one** of the specified conditions.                        |
| `$not`       | Matches documents that **do not** satisfy the condition.                                            |
| `$nor`       | Matches documents that **do not satisfy any** of the specified conditions.                          |

### **Complex Expressions in MongoDB: `$expr`, `$exists`, and `$type`**

---

### **1. `$expr`**
The `$expr` operator allows the use of aggregation expressions within the query language. It enables comparisons and calculations between fields in a single document.

#### **Example:**
Find documents where the `price` field is greater than the `cost` field.

```javascript
db.collectionName.find({
  $expr: { $gt: ["$price", "$cost"] }
});
```
db.monthlyBudget.insertMany( [
   { _id : 1, category : "food", budget : 400, spent : 450 },
   { _id : 2, category : "drinks", budget : 100, spent : 150 },
   { _id : 3, category : "clothes", budget : 100, spent : 50 },
   { _id : 4, category : "misc", budget : 500, spent : 300 },
   { _id : 5, category : "travel", budget : 200, spent : 650 }
] )
- **Explanation**:
  - `$gt`: Checks if the first argument (`price`) is greater than the second argument (`cost`).
  - `$expr`: Allows the use of aggregation operators like `$gt`, `$lt`, `$add`, `$subtract`, etc., in queries.

---

### **2. `$exists`**
The `$exists` operator matches documents where the specified field exists or does not exist.

#### **Example 1:**
Find documents where the `description` field exists.

```javascript
db.collectionName.find({
  description: { $exists: true }
});
```

#### **Example 2:**
Find documents where the `discount` field does not exist.

```javascript
db.collectionName.find({
  discount: { $exists: false }
});
```

- **Explanation**:
  - `$exists: true`: Matches documents where the field exists (even if its value is `null`).
  - `$exists: false`: Matches documents where the field does not exist.

---

### **3. `$type`**
The `$type` operator matches documents where the specified field is of a specified BSON data type.

#### **Example 1:**
Find documents where the `age` field is a number.

```javascript
db.collectionName.find({
  age: { $type: "number" }
});
```

#### **Example 2:**
Find documents where the `tags` field is an array.

```javascript
db.collectionName.find({
  tags: { $type: "array" }
});
```

- **Explanation**:
  - `$type`: Matches fields based on their BSON data type.

---

### **List of BSON Types with Their Numbers**

| **BSON Type**        | **Alias**           | **Number** |
|-----------------------|---------------------|------------|
| Double                | `"double"`         | 1          |
| String                | `"string"`         | 2          |
| Object                | `"object"`         | 3          |
| Array                 | `"array"`          | 4          |
| Binary Data           | `"binData"`        | 5          |
| Undefined (deprecated)| `"undefined"`      | 6          |
| ObjectId              | `"objectId"`       | 7          |
| Boolean               | `"bool"`           | 8          |
| Date                  | `"date"`           | 9          |
| Null                  | `"null"`           | 10         |
| Regular Expression    | `"regex"`          | 11         |
| JavaScript            | `"javascript"`     | 13         |
| Symbol (deprecated)   | `"symbol"`         | 14         |
| JavaScript (with scope)| `"javascriptWithScope"` | 15    |
| 32-bit Integer        | `"int"`            | 16         |
| Timestamp             | `"timestamp"`      | 17         |
| 64-bit Integer        | `"long"`           | 18         |
| Decimal128            | `"decimal"`        | 19         |
| Min Key               | `"minKey"`         | -1         |
| Max Key               | `"maxKey"`         | 127        |

---

### **Combining `$exists` and `$type`**
You can combine these operators for precise queries.

#### **Example:**
Find documents where the `age` field exists and is of type `number`.

```javascript
db.collectionName.find({
  age: { $exists: true, $type: "number" }
});
```