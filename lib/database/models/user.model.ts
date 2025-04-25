import { Schema, model, models, Document } from 'mongoose'

export interface IUser extends Document {
  _id: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
  clerkId: string
}

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
    })

const User = models.User || model('User', UserSchema)

export default User
