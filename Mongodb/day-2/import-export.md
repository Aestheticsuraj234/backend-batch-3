
### Steps to Import JSON Data into MongoDB:

#### 1. Save JSON Data to a File:
   First, save your JSON data into a file. For example, let's name it `products.json`.

#### 2. Access MongoDB Shell:
   Open your terminal or command prompt and make sure MongoDB is running.

#### 3. Use `mongoimport` Command:
   The `mongoimport` command-line utility is used to import data into MongoDB.

#### 4. Specify Database and Collection:
   Use `-d` to specify the database name and `-c` to specify the collection name where you want to import the data.

#### 5. Import JSON File:
   Provide the JSON file name that contains the data to be imported.

#### 6. Handle Array of Objects (Optional):
   If your JSON file contains an array of objects, use the `--jsonArray` flag.

### Example Command:

```sh
mongoimport --db video --collection comments --file day-3\video.json --jsonArray
```.

- `--db shop`: Specifies the database name as "shop".
- `--collection products`: Specifies the collection name as "products".
- `--file products.json`: Specifies the input file as "products.json".

### Handling Array of Objects:

If your JSON file contains an array of objects, you should use the `--jsonArray` flag. This is necessary to inform `mongoimport` that the input file contains an array.

```sh
mongoimport --db shop --collection products --file products.json --jsonArray
```

### Note on File Size Limitation:

- `mongoimport` has a limitation on the size of the JSON file it can import. It's limited to imports of 16 MB or smaller.
- If your JSON file exceeds this limit, consider splitting it into smaller files or using alternative methods for importing large datasets.


Exporting data from MongoDB to a JSON file can be achieved using the `mongoexport` command-line tool. Below are the steps along with explanations and examples:

### Steps to Export Data from MongoDB to JSON:

#### 1. Access MongoDB Shell:
   Ensure MongoDB is running and access the terminal or command prompt.

#### 2. Use `mongoexport` Command:
   `mongoexport` is used for exporting data from MongoDB.

#### 3. Specify Database and Collection:
   Use `-d` to specify the database name and `-c` to specify the collection name from which you want to export the data.

#### 4. Export to JSON File:
   Use the `--out` flag followed by the output file name to specify where the exported data should be saved. The output format will be JSON by default.

### Example Command:

```sh
mongoexport --db shop --collection products --out exported_products.json
```

- `--db shop`: Specifies the database name as "shop".
- `--collection products`: Specifies the collection name as "products".
- `--out exported_products.json`: Specifies the output file name as "exported_products.json".

### Note on Data Format:

By default, `mongoexport` exports data in JSON format. If you want to export in another format like CSV or TSV, you can use the `--type` flag followed by the desired format.

### Example with CSV Format:

```sh
mongoexport --db shop --collection products --type=csv --out exported_products.csv
```

This command exports the data from the "products" collection in the "shop" database to a CSV file named "exported_products.csv".

### Conclusion:

Using `mongoexport`, you can easily export data from MongoDB collections into JSON or other formats for further analysis or sharing. Make sure to specify the database, collection, and output file appropriately in the command.