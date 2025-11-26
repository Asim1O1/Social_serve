import bcrypt from "bcrypt";
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    public_id: String,
  },
  { _id: false }
);

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: String,
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      set: (v) => v.toLowerCase(),
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true,
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[+]?[0-9\s()-]{7,20}$/, "Invalid phone format"],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    role: {
      type: String,
      enum: ["ADMIN", "VOLUNTEER"],
      default: "VOLUNTEER",
      index: true,
    },

    profilePic: imageSchema,

    skills: {
      type: [String],
      default: [],
      set: (arr) => [...new Set(arr)],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "Cannot have more than 20 skills",
      },
    },

    interests: {
      type: [String],
      default: [],
      set: (arr) => [...new Set(arr)],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "Cannot have more than 20 interests",
      },
    },

    badges: {
      type: [badgeSchema],
      default: [],
      validate: {
        validator: (arr) => new Set(arr.map((b) => b.name)).size === arr.length,
        message: "Duplicate badges not allowed",
      },
    },

    verificationToken: { type: String, select: false },
    verificationExpire: { type: Date, select: false },

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },

    lastLogin: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ firstName: "text", lastName: "text", email: "text" });

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
