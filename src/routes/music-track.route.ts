import { Router } from "express";
import MusicTrackController from "../controllers/music-track.controller";

const routes = Router()

const musicTrackController = new MusicTrackController()

/**
 * @swagger
 * /music-track/new:
 *   post:
 *     summary: Create a new music track
 *     security:
 *       - BearerAuth: []
 *     description: Endpoint to create a new music track.
 *     tags:
 *       - Music Tracks
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: The JSON payload containing information about the new music track.
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/NewMusicTrackDTO'
 *     responses:
 *       200:
 *         description: Successfully created a new music track.
 */

routes.post('/new', musicTrackController.createNewMusicTrack)

/**
 * @swagger
 * /music-track/edit:
 *   put:
 *     summary: Edit an existing music track
 *     description: Endpoint to edit an existing music track.
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Music Tracks
 *     parameters:
 *       - name: track_id
 *         in: query
 *         description: The refresh token to renew the user's session.
 *         required: true
 *         schema:
 *           type: string
 *       - name: body
 *         in: body
 *         required: true
 *         description: The JSON payload containing information to edit the music track.
 *         schema:
 *           type: object
 *           $ref: '#/components/schemas/EditMusicTrackDTO'
 *     responses:
 *       200:
 *         description: Successfully edited the music track.
 */
routes.put('/edit', musicTrackController.editMusicTrack)

/**
 * @swagger
 * music-track/remove:
 *   delete:
 *     summary: Remove a music track
 *     security:
 *       - BearerAuth: []
 *     description: Endpoint to remove a music track.
 *     tags:
 *       - Music Tracks
 *     parameters:
 *       - name: track_id
 *         in: query
 *         description: The refresh token to renew the user's session.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully removed the music track
 */
routes.delete('/remove', musicTrackController.removeMusicTrack)

export default musicTrackController