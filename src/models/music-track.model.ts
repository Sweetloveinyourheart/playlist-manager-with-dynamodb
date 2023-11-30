import dynamoose, { Schema } from 'dynamoose'
import { Artist, ArtistSchema } from './artist.model'
import { Item } from 'dynamoose/dist/Item'

export class MusicTrack extends Item {
    track_id!: string
    track_title!: string
    artist!: Artist
    genre!: PlaylistGenre
    release_date!: Date
    duration?: number
    url?: string
}

enum PlaylistGenre {
    Pop = "pop",
    Rock = "rock",
    Rap = "rap",
    Ballad = "ballad"
}

export const MusicTrackSchema = new Schema({
    track_id: {
        type: String,
        hashKey: true
    },
    track_title: {
        type: String,
        required: true
    },
    artist: {
        type: Set,
        schema: [ArtistSchema],
        required: true
    },
    genre: {
        type: String,
        enum: Object.values(PlaylistGenre),
        required: true
    },
    release_date: {
        type: Date,
        required: true
    }, 
    duration: {
        type: Number
    },
    url: {
        type: String
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
}) 

const MusicTrackModel = dynamoose.model<MusicTrack>('music-track', MusicTrackSchema)
export default MusicTrackModel
