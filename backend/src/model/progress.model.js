import mongoose,{Schema} from "mongoose";

const progressSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    question:{
        type: Schema.Types.ObjectId,
        ref:"Question"
    },
    isDone:{
        type: Boolean,
        default:false
    },
    solvedAt:{
        type: Date,
        default:Date.now
    },
    topic:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Progress = mongoose.model("Progress", progressSchema);