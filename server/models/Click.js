import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema(
  {
    url: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    userAgent: {
      type: String,
      default: 'Unknown',
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1',
    },
    referrer: {
      type: String,
      default: 'Direct',
    },
    device: {
      type: String,
      default: 'Desktop',
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    operatingSystem: {
      type: String,
      default: 'Unknown',
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering clicks by URL and timestamp range
clickSchema.index({ url: 1, timestamp: -1 });

const Click = mongoose.model('Click', clickSchema);
export default Click;
