import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    settings: {
        llmProvider: { type: String, default: "openai" },
        modelName: { type: String, default: "gpt-4o" },
        apiKey: { type: String, default: "" },
        // Add more preferences here
        voiceEnabled: { type: Boolean, default: false }
    }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get public profile (excluding password)
userSchema.methods.toProfile = function () {
    return {
        _id: this._id,
        username: this.username,
        settings: this.settings
    };
};

const User = mongoose.model("User", userSchema);
export default User;
