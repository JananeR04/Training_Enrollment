import prisma from '../config/database.js';

export const createTraining = async (req, res) => {
  try {
    const { title, description, seatLimit } = req.body;
    const trainerId = req.user.id;

    const training = await prisma.training.create({
      data: {
        title,
        description,
        seatLimit: parseInt(seatLimit),
        trainerId
      },
      include: {
        trainer: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      message: 'Training created successfully',
      training
    });
  } catch (error) {
    console.error('Create training error:', error);
    res.status(500).json({ message: 'Server error while creating training' });
  }
};

export const getAllTrainings = async (req, res) => {
  try {
    const trainings = await prisma.training.findMany({
      include: {
        trainer: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add available seats to each training
    const trainingsWithAvailability = trainings.map(training => ({
      ...training,
      enrolledCount: training._count.enrollments,
      availableSeats: training.seatLimit - training._count.enrollments,
      isFull: training._count.enrollments >= training.seatLimit
    }));

    res.json({ trainings: trainingsWithAvailability });
  } catch (error) {
    console.error('Get trainings error:', error);
    res.status(500).json({ message: 'Server error while fetching trainings' });
  }
};

export const getTrainingById = async (req, res) => {
  try {
    const { id } = req.params;

    const training = await prisma.training.findUnique({
      where: { id },
      include: {
        trainer: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    });

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    const trainingWithAvailability = {
      ...training,
      enrolledCount: training._count.enrollments,
      availableSeats: training.seatLimit - training._count.enrollments,
      isFull: training._count.enrollments >= training.seatLimit
    };

    res.json({ training: trainingWithAvailability });
  } catch (error) {
    console.error('Get training error:', error);
    res.status(500).json({ message: 'Server error while fetching training' });
  }
};

export const getTrainerTrainings = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const trainings = await prisma.training.findMany({
      where: { trainerId },
      include: {
        _count: {
          select: { enrollments: true }
        },
        enrollments: {
          include: {
            employee: {
              select: { id: true, name: true, email: true }
            }
          },
          where: { status: 'ENROLLED' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const trainingsWithStats = trainings.map(training => ({
      ...training,
      enrolledCount: training._count.enrollments,
      availableSeats: training.seatLimit - training._count.enrollments,
      isFull: training._count.enrollments >= training.seatLimit
    }));

    res.json({ trainings: trainingsWithStats });
  } catch (error) {
    console.error('Get trainer trainings error:', error);
    res.status(500).json({ message: 'Server error while fetching trainings' });
  }
};

export const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, seatLimit } = req.body;
    const trainerId = req.user.id;

    // Check if training exists and belongs to trainer
    const existingTraining = await prisma.training.findUnique({
      where: { id },
      include: {
        _count: {
          select: { enrollments: true }
        }
      }
    });

    if (!existingTraining) {
      return res.status(404).json({ message: 'Training not found' });
    }

    if (existingTraining.trainerId !== trainerId) {
      return res.status(403).json({ message: 'Not authorized to update this training' });
    }

    // Prevent reducing seat limit below current enrollments
    if (seatLimit && parseInt(seatLimit) < existingTraining._count.enrollments) {
      return res.status(400).json({ 
        message: `Cannot reduce seat limit below current enrollments (${existingTraining._count.enrollments})` 
      });
    }

    const updatedTraining = await prisma.training.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(seatLimit && { seatLimit: parseInt(seatLimit) })
      },
      include: {
        trainer: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    });

    res.json({
      message: 'Training updated successfully',
      training: updatedTraining
    });
  } catch (error) {
    console.error('Update training error:', error);
    res.status(500).json({ message: 'Server error while updating training' });
  }
};

export const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const trainerId = req.user.id;

    const training = await prisma.training.findUnique({
      where: { id }
    });

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    if (training.trainerId !== trainerId) {
      return res.status(403).json({ message: 'Not authorized to delete this training' });
    }

    await prisma.training.delete({
      where: { id }
    });

    res.json({ message: 'Training deleted successfully' });
  } catch (error) {
    console.error('Delete training error:', error);
    res.status(500).json({ message: 'Server error while deleting training' });
  }
};