import prisma from '../config/database.js';

export const enrollInTraining = async (req, res) => {
  try {
    const { trainingId } = req.body;
    const employeeId = req.user.id;

    // Check if training exists
    const training = await prisma.training.findUnique({
      where: { id: trainingId },
      include: {
        _count: {
          select: { enrollments: { where: { status: 'ENROLLED' } } }
        }
      }
    });

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        employeeId_trainingId: {
          employeeId,
          trainingId
        }
      }
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === 'ENROLLED') {
        return res.status(400).json({ message: 'Already enrolled in this training' });
      }
      // If previously cancelled, re-enroll
    }

    // CRITICAL: Check seat availability
    const currentEnrollments = training._count.enrollments;
    if (currentEnrollments >= training.seatLimit) {
      return res.status(400).json({ 
        message: 'Training is full. No seats available.',
        availableSeats: 0,
        seatLimit: training.seatLimit
      });
    }

    // Create or update enrollment
    const enrollment = await prisma.enrollment.upsert({
      where: {
        employeeId_trainingId: {
          employeeId,
          trainingId
        }
      },
      update: {
        status: 'ENROLLED',
        enrolledAt: new Date()
      },
      create: {
        employeeId,
        trainingId,
        status: 'ENROLLED'
      },
      include: {
        training: {
          include: {
            trainer: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const employeeId = req.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { 
        employeeId,
        status: 'ENROLLED'
      },
      include: {
        training: {
          include: {
            trainer: {
              select: { id: true, name: true, email: true }
            },
            _count: {
              select: { enrollments: { where: { status: 'ENROLLED' } } }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    const enrollmentsWithStats = enrollments.map(enrollment => ({
      ...enrollment,
      training: {
        ...enrollment.training,
        enrolledCount: enrollment.training._count.enrollments,
        availableSeats: enrollment.training.seatLimit - enrollment.training._count.enrollments
      }
    }));

    res.json({ enrollments: enrollmentsWithStats });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ message: 'Server error while fetching enrollments' });
  }
};

export const cancelEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user.id;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.employeeId !== employeeId) {
      return res.status(403).json({ message: 'Not authorized to cancel this enrollment' });
    }

    if (enrollment.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Enrollment already cancelled' });
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    res.json({
      message: 'Enrollment cancelled successfully',
      enrollment: updatedEnrollment
    });
  } catch (error) {
    console.error('Cancel enrollment error:', error);
    res.status(500).json({ message: 'Server error while cancelling enrollment' });
  }
};

export const getTrainingEnrollments = async (req, res) => {
  try {
    const { trainingId } = req.params;
    const trainerId = req.user.id;

    // Verify trainer owns this training
    const training = await prisma.training.findUnique({
      where: { id: trainingId }
    });

    if (!training) {
      return res.status(404).json({ message: 'Training not found' });
    }

    if (training.trainerId !== trainerId) {
      return res.status(403).json({ message: 'Not authorized to view these enrollments' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { 
        trainingId,
        status: 'ENROLLED'
      },
      include: {
        employee: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    res.json({ enrollments });
  } catch (error) {
    console.error('Get training enrollments error:', error);
    res.status(500).json({ message: 'Server error while fetching enrollments' });
  }
};