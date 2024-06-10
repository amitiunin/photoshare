import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import { parser } from '@aws-lambda-powertools/parser';
import { ApiGatewayEnvelope } from '@aws-lambda-powertools/parser/envelopes';
import type { Context } from 'aws-lambda';

import { AlbumService } from '@photoshare/album-service';

import { container } from './di.js';
import { RequestSchema, type Event, type Response } from './schemas.js';

class Lambda implements LambdaInterface {
    constructor(private albumService: AlbumService) {}

    @parser({ schema: RequestSchema, envelope: ApiGatewayEnvelope })
    async handler(_event: Event, _context: Context): Promise<Response> {
        return this.albumService.getAlbums();
    }
}

export const handler = async function (event: Event, context: Context) {
    const albumService = container.resolve<AlbumService>('AlbumService');
    const lambda = new Lambda(albumService);
    return await lambda.handler(event, context);
};
