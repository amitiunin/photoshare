import * as awilix from 'awilix';
import type { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { expect } from 'chai';
import fc from 'fast-check';
import { getArbitrary } from 'fast-check-io-ts';
import { instance, mock, reset, verify, when } from 'ts-mockito';

import { AlbumService, AlbumType, type Album } from '@photoshare/album-service';

import { container } from './di.js';
import { handler } from './handler.js';

function createContext(): Context {
    return {
        awsRequestId: '',
        callbackWaitsForEmptyEventLoop: false,
        functionName: '',
        functionVersion: '',
        invokedFunctionArn: '',
        logGroupName: '',
        logStreamName: '',
        memoryLimitInMB: '',
        done<T>(_error?: Error, _result?: T): void {
            return;
        },
        fail(_error: Error | string): void {
            return;
        },
        getRemainingTimeInMillis(): number {
            return 0;
        },
        succeed<T1, T2>(_message: T1, _object?: T2): void {
            return;
        },
    };
}

function createEvent<T extends object>(body: T): APIGatewayProxyEvent {
    return {
        body: JSON.stringify(body),
        headers: {},
        httpMethod: 'GET',
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path: '',
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {
            accountId: 'string',
            apiId: 'string',
            authorizer: null,
            protocol: 'string',
            httpMethod: 'GET',
            identity: {
                accessKey: null,
                accountId: null,
                apiKey: null,
                apiKeyId: null,
                caller: null,
                clientCert: null,
                cognitoAuthenticationProvider: null,
                cognitoAuthenticationType: null,
                cognitoIdentityId: null,
                cognitoIdentityPoolId: null,
                principalOrgId: null,
                sourceIp: '127.0.0.1',
                user: null,
                userAgent: null,
                userArn: null,
            },
            path: 'string',
            stage: 'string',
            requestId: 'string',
            requestTime: '',
            requestTimeEpoch: 0,
            resourceId: 'string',
            resourcePath: 'string',
        },
        resource: '',
        stageVariables: null,
    } as APIGatewayProxyEvent;
}

describe('Album Lambda Handler', () => {
    context('getAlbums', () => {
        it('should return a list of albums returned by the service', async () => {
            const serviceMock: AlbumService = mock(AlbumService);
            const mockInstance = instance(serviceMock);
            container.register({ AlbumService: awilix.asValue(mockInstance) });
            await fc.assert(
                fc.asyncProperty(
                    fc.array(getArbitrary(AlbumType)),
                    async (albums: Album[]) => {
                        reset(serviceMock);
                        when(serviceMock.getAlbums()).thenResolve(albums);
                        const result = await handler(
                            createEvent({}),
                            createContext(),
                        );
                        expect(result).to.deep.equal(albums);
                        verify(serviceMock.getAlbums()).once();
                    },
                ),
            );
        });
    });
});
