### MongoDB Notes with Examples and Coding Questions

#### **Projections in MongoDB**
- **Purpose:** Control the fields returned in a query.
- To include specific fields, use a projection value of `1` for the desired fields.
- To exclude fields, use a projection value of `0`.
- **Note:** You cannot include and exclude fields simultaneously in the same query projection.

**Example:**
```javascript
db.collection.find({}, { title: 1, author: 1 });
```
Returns only the `title` and `author` fields from each document.

---

#### **Embedded Documents in MongoDB**
- Used to store nested data structures.
- Access nested fields directly by specifying their paths.

**Operators for Embedded Documents:**
1. **$all**  
   Selects documents where an array field contains all specified elements.
2. **$elemMatch**  
   Matches documents containing an array field with at least one element that matches all specified query criteria.

The key difference between **`$all`** and **`$elemMatch`** lies in how they match array elements within a document:  

### **1. `$all`**
- **Purpose:** Checks if an array contains all the specified values.
- **Behavior:** It matches documents if *each specified value* exists **anywhere** in the array (but not necessarily in the same element).
- **Example Usage:**
  ```javascript
  db.comments.find({
    "metadata.likes": { $all: [45, 78] }
  });
  ```
  **Explanation:**
  - This query finds documents where the `likes` field contains **both** `45` and `78` (in any order and in any element of the array).

---

### **2. `$elemMatch`**
- **Purpose:** Checks if **a single element** in an array satisfies **all specified conditions**.
- **Behavior:** It matches documents if there exists **one array element** that meets all conditions simultaneously.
- **Example Usage:**
  ```javascript
  db.articles.find({
    "comments": {
      $elemMatch: { user: "user5", text: "Just what I needed to understand aggregations." }
    }
  });
  ```
  **Explanation:**
  - This query finds documents where the `comments` array has **at least one object** with both `user` equal to `"user5"` **and** `text` equal to `"Just what I needed to understand aggregations."`

---

### **Comparison Summary:**

| Feature         | **`$all`**                                                      | **`$elemMatch`**                                         |
|------------------|-----------------------------------------------------------------|---------------------------------------------------------|
| **Match Scope** | Checks **multiple elements** in an array.                       | Checks conditions on **a single element** of an array.  |
| **Logical Nature** | Matches if all values are found anywhere in the array.        | Matches if one element meets all conditions at once.    |
| **Use Case**    | When you care about **individual values** existing in the array.| When you need to ensure **multiple conditions** apply within one element. |

