// Require mongoose and models
var mongoose = require("mongoose"),
Review = require("./models/review"),
Comment = require("./models/comment");

// Sample data to seed
var data = [
    {
        name: "Gary's Garden",
        image: "https://images.unsplash.com/photo-1510172951991-856a654063f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        review: "Great book on gardening! My plants have never been better!"
    },
    {
        name: "How to Coffee for Dummies",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        review: "After visiting Europe, I just had to learn to make an authentic espresso. This book taught me just that!"
    },
    {
        name: "Fall is here",
        image: "https://images.unsplash.com/photo-1490633874781-1c63cc424610?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        review: "Controversial facts on global warming, not sure if I am convinced."
    }
]
// Seed DB function...
// 1. Wipe the existing data
// 2. Insert sample data from array into mongo
// 3. Add sample comments

function seedDB() {
    Review.remove({}, (err) => {
        if (err) console.log(err);
        else{
            console.log("Removed review");
            Comment.remove({}, (err) => {
                if(err) console.log(err)
                else{
                    console.log("Removed comment");
                    // data.forEach((seed) => {
                    //     Review.create(seed, (err, review) => {
                    //         if(err) console.log(err);
                    //         else{
                    //             console.log("Added: review");
                    //             Comment.create({
                    //                 author: 'Seeder',
                    //                 text: "Great review!"
                    //             }, (err, comment) => {
                    //                 if(err) console.log(err);
                    //                 else{
                    //                     console.log("Added comment");
                    //                     review.comments.push(comment);
                    //                     review.save();
                    //                 }
                    //             })
                    //         }
                    //     })
                    // })
                }
            })
        }
    })
}

module.exports = seedDB;