export interface NoSqlDatabase {
    get<T>(tableName: string): Promise<T[]>;
}
