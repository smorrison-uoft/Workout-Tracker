const express = require("express");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost/polar-mesa-22041',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  );
  

app.get("/api/workouts(/range)?", (req, res) => {
    db.Workout.find({})
    .then((workouts) => {
        return res.json(workouts);
    })
    .catch(err => {
        res.json(err);
    });
});

app.get("/api/workouts/:id", (req, res) => {
    db.Workout.findById({
        _id: mongojs.ObjectId(req.params.id)
    })
    .then((workout) => {
        return res.json(workout);
    })
    .catch(err => {
        res.json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => {
    const { type, name, duration } = req.body;
    const { id } = req.params;
    switch (type) {
        case 'cardio':
            const { distance } = req.body;
            db.Workout.update(
                {
                    _id: mongojs.ObjectId(id)
                }, {
                    day: Date.now(),
                    $push: {
                        exercises: [{
                            type,
                            name,
                            duration,
                            distance,
                            weight: 0
                        }]
                    }
                }
            ).then(workout => {
                res.json(workout);
            })
            .catch(err => {
                res.json(err);
            });
        break;
        case 'resistance':
            const { weight, reps, sets } = req.body;
            db.Workout.update(
                {
                    _id: mongojs.ObjectId(id)
                }, {
                    day: Date.now(),
                    $push: {
                        exercises: [{
                            type,
                            name,
                            duration,
                            weight,
                            reps, 
                            sets
                        }]
                    }
                }
            ).then(workout => {
                res.json(workout);
            })
            .catch(err => {
                res.json(err);
            });  
        break;  
    }
});

app.delete("/api/delete/:id", (req, res) => {
    const { id } = req.params;
    db.Workout.remove(
        {
            _id: mongojs.ObjectID(id)
        }
    ).then(workout => {
        res.json(workout);
    })
    .catch(err => {
        res.json(err);
    });  
});

app.delete("/api/deleteAll", (req, res) => {
    db.Workout.remove({})
    .then(workout => {
        res.json(workout);
    })
    .catch(err => {
        res.json(err);
    });  
})

app.post("/api/workouts", (req, res) => {
    db.Workout.create({
        day: Date.now()
    })
    .then(workout => {
        res.json(workout);
    })
    .catch(err => {
        res.json(err);
    });
});  

app.get('/exercise?', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/stats.html"));
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});