const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkOutSchema = new Schema({
    day: {
        type: Date,
        default: Date.now
    },
    exercises: [{
        type: { type: String },
        name: { type: String },
        duration: { type: Number },
        weight: { type: Number },
        reps: { type: Number },
        sets: { type: Number },
        distance: { type: Number }
    }]
},
{
    toJSON: {
      
      virtuals: true
    }
}
);


WorkOutSchema.virtual("totalDuration").get(function () {
    
    return this.exercises.reduce((total, exercise) => {
      return total + exercise.duration;
    }, 0);
});

WorkOutSchema.virtual("totalPounds").get(function () {
   
    return this.exercises.reduce((total, exercise) => {
      return total + exercise.weight;
    }, 0);
});

const Workout = mongoose.model("Workout", WorkOutSchema);

module.exports = Workout;