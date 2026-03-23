import { pgTable , text , boolean , varchar} from "drizzle-orm/pg-core";

export const user = pgTable("user" , {
    id:text("id").primaryKey(),
    name:text("name").notNull()
})