

## 🔷 Why Use Embedded Documents in MongoDB?

In real-world applications, we often need to store **related data together**. MongoDB allows you to do this using **embedded documents** (nested objects or arrays of objects) inside a single document.

### 🔑 Benefits:

1. **Data locality** — All related data lives together → Faster reads
2. **Atomic operations** — Easily update nested fields in one go
3. **Less joins** — No need to fetch from multiple collections
4. **Real-world modeling** — Perfect for blog posts, users with addresses, orders with items, etc.

### 🧠 Real-World Example:

```js
{
  title: "Mastering MongoDB",
  author: "Sarah Adams",
  content: "...",
  metadata: {
    likes: [85, 90, 95],
    views: 1200
  },
  comments: [
    { user: "user1", text: "Great article!" },
    { user: "user2", text: "Helped me a lot." }
  ]
}
```

---

## 💡 Operators to Query Embedded Docs

### 1. `$all`

→ Used to check if **an array** contains **all** specified elements

### 2. `$elemMatch`

→ Used to **match multiple conditions on a single array element** (like `AND` inside one object)

---

## ✅ MongoDB Examples with Embedded Documents

---

### **1. Find documents with a comment from `"user1"`**

```js
db.blogs.find({
  "comments.user": "user1"
});
```

📘 *Matches any document where at least one comment was made by `user1`.*

---

### **2. Use `$elemMatch` to find a comment by `"user3"` containing `"async"`**

```js
db.blogs.find({
  comments: {
    $elemMatch: {
      user: "user3",
      text: { $regex: "async", $options: "i" }
    }
  }
});
```

🧠 *Ensures that both conditions (`user` and `text`) are matched in the same comment object.*

---

### **3. Find documents where `metadata.likes` contains both 85 and 95**

```js
db.blogs.find({
  "metadata.likes": { $all: [85, 95] }
});
```

💥 *Checks if all values in the `$all` array are present inside `likes` array.*

---

### **4. Fetch posts with views over 2000**

```js
db.blogs.find({
  "metadata.views": { $gt: 2000 }
});
```

📈 *Simple query to access a nested numeric field.*

---

### **5. Only return title and usernames from comments**

```js
db.blogs.find(
  {},
  { title: 1, "comments.user": 1, _id: 0 }
);
```

📤 *Projection to selectively return only needed fields.*

---

### **6. Find posts that have comments from both `user2` and `user4`**

```js
db.blogs.find({
  "comments.user": { $all: ["user2", "user4"] }
});
```

🎯 *Checks if `comments.user` array contains both values (even across multiple comment objects).*

---

### **7. Count blog posts with views ≥ 3000**

```js
db.blogs.count({
  "metadata.views": { $gte: 3000 }
});
```

📊 *Get how many posts went “viral.”*

---

### **8. Find posts written by `"Sarah Adams"` with at least one comment by `"user17"`**

```js
db.blogs.find({
  author: "Sarah Adams",
  "comments.user": "user17"
});
```

👩‍💻 *Combines top-level and nested conditions.*

---

### **9. Show title and views only for highly viewed posts**

```js
db.blogs.find(
  { "metadata.views": { $gt: 2500 } },
  { title: 1, "metadata.views": 1, _id: 0 }
);
```

🔎 *Projection along with filtering nested values.*

---

### **10. Use regex to find blog content mentioning `"MongoDB"`**

```js
db.blogs.find({
  content: { $regex: "MongoDB", $options: "i" }
});
```

