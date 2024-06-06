import { ResourceNotFoundException } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    ScanCommand,
    type DynamoDBDocumentClientResolvedConfig,
    type ServiceInputTypes,
    type ServiceOutputTypes,
} from '@aws-sdk/lib-dynamodb';
import { AwsStub, mockClient } from 'aws-sdk-client-mock';
import { should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fc from 'fast-check';

import { DynamoDb } from './dynamodb.js';

use(chaiAsPromised);
should();

describe('DynamoDB connector', () => {
    let dynamoDbClient: AwsStub<
        ServiceInputTypes,
        ServiceOutputTypes,
        DynamoDBDocumentClientResolvedConfig
    >;
    const db = new DynamoDb();
    beforeEach(() => {
        dynamoDbClient = mockClient(DynamoDBDocumentClient);
    });

    describe('#get', () => {
        it('should call the `scan` command', async () => {
            const tableName = 'table';
            await fc.assert(
                fc.asyncProperty(fc.array(fc.object()), async (data) => {
                    dynamoDbClient
                        .on(ScanCommand, { TableName: tableName })
                        .resolves({ Items: data });
                    await db
                        .get(tableName)
                        .should.eventually.be.deep.equal(data);
                }),
            );
        });

        it('should raise an error if the table does not exist', async () => {
            const resourceNotFoundException = new ResourceNotFoundException({
                message: '',
                $metadata: {},
            });
            dynamoDbClient.on(ScanCommand).rejects(resourceNotFoundException);
            await db
                .get('table')
                .should.eventually.be.rejectedWith(resourceNotFoundException);
        });
    });
});
