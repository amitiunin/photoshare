import * as awilix from 'awilix';

import { AlbumService } from '@photoshare/album-service';
import { DynamoDb } from '@photoshare/common';

export const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.CLASSIC,
    strict: true,
});

container.register({
    AlbumService: awilix.asClass(AlbumService),
    db: awilix.asClass(DynamoDb),
});
