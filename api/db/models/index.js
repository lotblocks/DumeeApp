const mongoose = require('mongoose');

// Basic User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  avatar: { type: String },
  role: { type: String, default: 'user' },
  provider: { type: String, default: 'local' },
  providerId: { type: String },
  refreshTokens: [{ type: String }],
  plugins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plugin' }],
  isEnabled: { type: Boolean, default: true },
  subscription: {
    tier: { type: String, default: 'free' },
    usage: { type: Number, default: 0 },
    limit: { type: Number, default: 10 },
    stripeSubscriptionId: { type: String },
    stripePriceId: { type: String },
    status: { type: String, default: 'inactive' },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false }
  },
  stripeCustomerId: { type: String }
}, { timestamps: true });

// Basic Message Schema
const messageSchema = new mongoose.Schema({
  messageId: { type: String, unique: true, required: true },
  conversationId: { type: String, required: true, index: true },
  parentMessageId: { type: String },
  sender: { type: String, required: true },
  text: { type: String, required: true },
  model: { type: String },
  endpoint: { type: String },
  usage: {
    promptTokens: { type: Number },
    completionTokens: { type: Number },
    totalTokens: { type: Number }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Basic Conversation Schema
const conversationSchema = new mongoose.Schema({
  conversationId: { type: String, unique: true, required: true, index: true },
  title: { type: String, default: 'New Conversation' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  endpoint: { type: String },
  model: { type: String },
  chatGptLabel: { type: String },
  promptPrefix: { type: String },
  temperature: { type: Number },
  topP: { type: Number },
  topK: { type: Number },
  maxOutputTokens: { type: Number },
  modelLabel: { type: String },
  examples: [{ type: mongoose.Schema.Types.Mixed }],
  agentOptions: { type: mongoose.Schema.Types.Mixed },
  tools: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });

// Basic Agent Schema
const agentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  description: { type: String },
  instructions: { type: String },
  model: { type: String },
  provider: { type: String },
  tools: [{ type: mongoose.Schema.Types.Mixed }],
  tool_resources: { type: mongoose.Schema.Types.Mixed },
  metadata: { type: mongoose.Schema.Types.Mixed },
  temperature: { type: Number },
  top_p: { type: Number },
  response_format: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  avatar: { type: mongoose.Schema.Types.Mixed },
  isPublic: { type: Boolean, default: false }
}, { timestamps: true });

// Basic Key Schema for API keys
const keySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  key: { type: String, required: true },
  endpoint: { type: String, required: true }
}, { timestamps: true });

// Basic Balance Schema for user credits
const balanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  tokenCredits: { type: Number, default: 0 },
  balance: { type: Number, default: 0 }
}, { timestamps: true });

// Basic Transaction Schema for tracking usage
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // 'credit', 'debit'
  amount: { type: Number, required: true },
  description: { type: String },
  conversationId: { type: String },
  messageId: { type: String },
  rawAmount: { type: Number },
  rate: { type: Number },
  model: { type: String },
  context: { type: String }
}, { timestamps: true });

// File Schema
const fileSchema = new mongoose.Schema({
  file_id: { type: String, unique: true, required: true },
  object: { type: String, default: 'file' },
  bytes: { type: Number },
  created_at: { type: Number },
  filename: { type: String, required: true },
  purpose: { type: String, default: 'assistants' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  temp_file_id: { type: String },
  type: { type: String },
  filepath: { type: String },
  width: { type: Number },
  height: { type: Number },
  preview: { type: String },
  progress: { type: Number, default: 1 },
  source: { type: String }
}, { timestamps: true });

// Create models
const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Agent = mongoose.model('Agent', agentSchema);
const Key = mongoose.model('Key', keySchema);
const Balance = mongoose.model('Balance', balanceSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const File = mongoose.model('File', fileSchema);

module.exports = {
  User,
  Message,
  Conversation,
  Agent,
  Key,
  Balance,
  Transaction,
  File
};
