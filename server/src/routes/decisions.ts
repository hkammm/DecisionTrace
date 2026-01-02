import { Router, Response } from 'express';
import { Decision } from '../models/Decision.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// Helper to transform MongoDB document to frontend format
const transformDecision = (doc: any) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    id: obj._id || obj.id,
    _id: undefined
  };
};

// Get all decisions for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const decisions = await Decision.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(decisions.map(transformDecision));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get single decision
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const decision = await Decision.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    res.json(transformDecision(decision));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create decision
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, context, options, assumptions, confidenceLevel, targetDecisionDate } = req.body;

    if (!title || !targetDecisionDate || !options || options.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const decision = await Decision.create({
      userId: req.user._id,
      title,
      description,
      context,
      options,
      assumptions,
      confidenceLevel,
      targetDecisionDate
    });

    res.status(201).json(transformDecision(decision));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update decision
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const decision = await Decision.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    res.json(transformDecision(decision));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Add review to decision
router.post('/:id/review', async (req: AuthRequest, res: Response) => {
  try {
    const { outcome, whatWentWrong, lessonsLearned } = req.body;
    console.log('Adding review for decision:', req.params.id, 'User:', req.user?._id);

    const decision = await Decision.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        review: {
          outcome,
          whatWentWrong,
          lessonsLearned,
          reviewedAt: new Date().toISOString()
        }
      },
      { new: true }
    );

    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    res.json(transformDecision(decision));
  } catch (error: any) {
    console.error('Review endpoint error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete decision
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const decision = await Decision.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!decision) {
      return res.status(404).json({ message: 'Decision not found' });
    }

    res.json({ message: 'Decision deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
