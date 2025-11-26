import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    phoneNumber: {
      type: String,
      required: true,
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
    },

    organizationName: {
      type: String,
      default: null,
    },

    organizationDescription: {
      type: String,
      default: null,
    },

    organizationType: {
      type: String,
      enum: ["NGO", "Charity", "Club", "Community", "Other"],
      default: null,
    },

    organizationLogo: {
      url: String,
      public_id: String,
    },
    organizationPhone: String,
    organizationEmail: String,
    organizationLocation: {
      address: String,
      city: String,
      state: String,
      country: String,
    },

    profilePic: {
      url: String,
      public_id: String,
    },

    skills: {
      type: [String],
      default: [],
      set: (arr) => [...new Set(arr)],
    },

    interests: {
      type: [String],
      default: [],
      set: (arr) => [...new Set(arr)],
    },

    badges: [
      {
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],

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
