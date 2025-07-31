import { Schema } from 'mongoose';
import type { IAgent } from '~/types';

const agentSchema = new Schema<IAgent>(
  {
    id: {
      type: String,
      index: true,
      unique: true,
      required: true,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    instructions: {
      type: String,
    },
    avatar: {
      type: Schema.Types.Mixed,
      default: undefined,
    },
    provider: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    model_parameters: {
      type: Object,
    },
    artifacts: {
      type: String,
    },
    access_level: {
      type: Number,
    },
    recursion_limit: {
      type: Number,
    },
    tools: {
      type: [String],
      default: undefined,
    },
    tool_kwargs: {
      type: [{ type: Schema.Types.Mixed }],
    },
    actions: {
      type: [String],
      default: undefined,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      default: undefined,
    },
    hide_sequential_outputs: {
      type: Boolean,
    },
    end_after_tools: {
      type: Boolean,
    },
    agent_ids: {
      type: [String],
    },
    isCollaborative: {
      type: Boolean,
      default: undefined,
    },
    conversation_starters: {
      type: [String],
      default: [],
    },
    tool_resources: {
      type: Schema.Types.Mixed,
      default: {},
    },
    projectIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Project',
      index: true,
    },
    versions: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    
    // Dumee Marketplace Fields
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    marketplaceCategory: {
      type: String,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    price: {
      type: {
        type: String,
        enum: ['free', 'premium', 'subscription'],
        default: 'free',
      },
      amount: Number,
      currency: {
        type: String,
        default: 'USD',
      },
      subscriptionPlan: {
        type: String,
        enum: ['monthly', 'yearly'],
      },
    },
    popularity: {
      downloads: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
      favorites: {
        type: Number,
        default: 0,
      },
      usageCount: {
        type: Number,
        default: 0,
      },
    },
    marketplace: {
      shortDescription: String,
      longDescription: String,
      screenshots: [String],
      demoConversation: [String],
      usageExamples: [String],
      supportEmail: String,
      website: String,
      changelog: [{
        version: String,
        changes: String,
        date: {
          type: Date,
          default: Date.now,
        },
      }],
    },
    revenue: {
      totalEarnings: {
        type: Number,
        default: 0,
      },
      monthlyEarnings: {
        type: Number,
        default: 0,
      },
      subscriptionCount: {
        type: Number,
        default: 0,
      },
      conversionRate: {
        type: Number,
        default: 0,
      },
    },
    moderation: {
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'flagged'],
        default: 'pending',
        index: true,
      },
      reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      reviewedAt: Date,
      rejectionReason: String,
      flags: [{
        type: String,
        reportedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        reason: String,
        date: {
          type: Date,
          default: Date.now,
        },
      }],
    },
  },
  {
    timestamps: true,
  },
);

export default agentSchema;

