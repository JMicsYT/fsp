const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teams');

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.post('/', teamController.createTeam);
router.put('/:id', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

router.get('/:id/members', teamController.getTeamMembers);
router.post('/:id/members', teamController.addTeamMember);
router.delete('/:id/members', teamController.removeTeamMember);

module.exports = router;