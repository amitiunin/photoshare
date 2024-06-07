import type { NoSqlDatabase } from '@photoshare/common';

import { AlbumType, type Album } from './types.js';

export class AlbumService {
    constructor(private db: NoSqlDatabase) {}

    async getAlbums(): Promise<Album[]> {
        return this.db
            .get<Album>('albums')
            .then((data) => data.filter(AlbumType.is));
    }
}
