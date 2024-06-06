import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

import type { NoSqlDatabase } from './nosql.js';

export class DynamoDb implements NoSqlDatabase {
    async get<T>(tableName: string): Promise<T[]> {
        const dynamodb = new DynamoDBClient();
        const ddb = DynamoDBDocumentClient.from(dynamodb);
        const query = await ddb.send(new ScanCommand({ TableName: tableName }));
        return query.Items as T[];
    }
}
