import mongoose, { type Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import {
  NAME_REQUIRED,
  NAME_MAX_LENGTH,
  EMAIL_REQUIRED,
  EMAIL_INVALID,
  PASSWORD_REQUIRED,
  PASSWORD_MIN_LENGTH
} from "../constants/messages";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  favorites: number[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, NAME_REQUIRED],
      trim: true,
      maxlength: [50, NAME_MAX_LENGTH],
    },
    email: {
      type: String,
      required: [true, EMAIL_REQUIRED],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, EMAIL_INVALID],
    },
    password: {
      type: String,
      required: [true, PASSWORD_REQUIRED],
      minlength: [6, PASSWORD_MIN_LENGTH],
      select: false,
    },
    favorites: {
      type: [Number],
      default: [],
      select: true
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);