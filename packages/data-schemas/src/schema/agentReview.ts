import { Schema } from 'mongoose';
import type { IAgentReview } from '~/types';

const agentReviewSchema = new Schema<IAgentReview>(
  {
    id: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    userName: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: String,
    review: String,
    helpful: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    response: {
      text: String,
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes for efficient queries
agentReviewSchema.index({ agentId: 1, rating: -1 });
agentReviewSchema.index({ userId: 1, agentId: 1 }, { unique: true }); // One review per user per agent
agentReviewSchema.index({ createdAt: -1 });

export default agentReviewSchema;

