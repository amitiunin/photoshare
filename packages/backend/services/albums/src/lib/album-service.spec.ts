import { should, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fc from 'fast-check';
import { getArbitrary } from 'fast-check-io-ts';
import { instance, mock, reset, verify, when } from 'ts-mockito';

import type { NoSqlDatabase } from '@photoshare/common';

import { AlbumService } from './album-service.js';
import { AlbumType } from './types.js';

use(chaiAsPromised);

should();

describe('Album Service', () => {
    let service: AlbumService;
    let dbMock: NoSqlDatabase;
    let db: NoSqlDatabase;

    beforeEach(() => {
        dbMock = mock<NoSqlDatabase>();
        db = instance(dbMock);
        service = new AlbumService(db);
    });

    const tableName = 'albums';

    it('should convert db response to Album list', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.array(getArbitrary(AlbumType)),
                async (data) => {
                    reset(dbMock);
                    when(dbMock.get(tableName)).thenResolve(data);

                    await service
                        .getAlbums()
                        .should.eventually.be.deep.equal(data);
                    verify(dbMock.get(tableName)).once();
                },
            ),
        );
    });

    const option = <T>(arb: fc.Arbitrary<T>) =>
        fc.option(arb, { nil: undefined });

    it('should discard the albums if incorrect values are provided', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.array(
                    fc.record({
                        id: option(fc.uuid()),
                        title: option(fc.string()),
                        description: option(fc.string()),
                        thumbnails: fc.array(
                            fc.record({
                                photo_id: option(fc.uuid()),
                                url: option(fc.webUrl()),
                            }),
                        ),
                    }),
                ),
                async (data) => {
                    reset(dbMock);
                    when(dbMock.get(tableName)).thenResolve(data);

                    const expected = data.filter((item) => AlbumType.is(item));
                    await service
                        .getAlbums()
                        .should.eventually.deep.equal(expected);
                },
            ),
        );
    });

    it('should promote DB errors', async () => {
        const error = new Error('DB error');
        when(dbMock.get(tableName)).thenReject(error);

        await service.getAlbums().should.be.rejectedWith(error);
        verify(dbMock.get(tableName)).once();
    });
});
