var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/* GET home page. */
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create_project', async (req, res) => {
  try {
    const { title } = req.query;

    const project = await prisma.project.create({
      data: {
        title
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create_time', async (req, res) => {
  try {
    const { title, start_time, end_time, project_id } = req.query;

    const project = await prisma.time.create({
      data: {
        title,
        start_time,
        end_time,
        created_at: new Date(),
        project_id:parseInt(project_id)
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    console.log(new Date());
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/time', async (req, res) => {
  try {
    const { id } = req.query;

    const time = await prisma.time.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!time) {
      return res.status(404).json({ error: 'time not found' });
    }

    res.status(200).json(time.project_id);
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(time.project_id),
      },
    });
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;