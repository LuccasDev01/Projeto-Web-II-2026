import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Situation } from "./entity/Situations";
import { User } from "./entity/Users";
import { ProductCategory } from "./entity/ProductCategories";
import { ProductSituation } from "./entity/ProductSituations";
import { Product } from "./entity/Products";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [Situation, User, ProductCategory, ProductSituation, Product],
    subscribers: [],
    migrations: [__dirname + "/migration/*.js"],
});