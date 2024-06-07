import * as t from 'io-ts';

export const ThumbnailType = t.type({
    photo_id: t.string,
    url: t.string,
});
export type Thumbnail = t.TypeOf<typeof ThumbnailType>;

export const AlbumType = t.intersection([
    t.type({
        id: t.string,
        title: t.string,
        thumbnails: t.array(ThumbnailType),
    }),
    t.partial({
        description: t.string,
    }),
]);
export type Album = t.TypeOf<typeof AlbumType>;
