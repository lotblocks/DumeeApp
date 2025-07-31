import { Schema } from 'mongoose';
import type { IAgentSubscription } from '~/types';

const agentSubscriptionSchema = new Schema<IAgentSubscription>(
  {
    id: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
      index: true,
    },
    stripeSubscriptionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'unpaid', 'trialing'],
      default: 'active',
      index: true,
    },
    plan: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    canceledAt: Date,
    cancelReason: String,
    renewalCount: {
      type: Number,
      default: 0,
    },
    isTrialing: {
      type: Boolean,
      default: false,
    },
    trialEndsAt: Date,
    paymentFailures: {
      type: Number,
      default: 0,
    },
    lastPaymentDate: Date,
    nextBillingDate: Date,
  },
  {
    timestamps: true,
  },
);

// Compound indexes for efficient queries
agentSubscriptionSchema.index({ userId: 1, status: 1 });
agentSubscriptionSchema.index({ agentId: 1, status: 1 });
agentSubscriptionSchema.index({ nextBillingDate: 1, status: 1 });
agentSubscriptionSchema.index({ stripeSubscriptionId: 1 });

export default agentSubscriptionSchema;

