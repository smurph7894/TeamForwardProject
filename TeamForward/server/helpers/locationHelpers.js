const fetch = require("node-fetch");
const User = require("../models/User");
const log = require("../helpers/logging");

//connect to API and with zipcode and get coordinates
const getLocationHelper = async(address) => {
    try {
        const url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_KEY}&query=${address}`;
        const response = await fetch(url);
        //TODO handle non 200 responses (200 means ok)
        const responseJson = await response.json();
        log(responseJson);
        return responseJson.data;
    } catch (expection) {
        console.log("something went wrong with getLocationHelper function", expection);
    }

};

//filter through users based on interests, activities, and distance from user based on coordinates
const getUsersWithinRadius = async (coordinates, radius, interests, activities, userId) => {
    try{
        // separate interests into array
        //look for commas to break into list
        let splitInterests = interests?.split(",") || [];
        let interestQuery = [];
        for(let interest of splitInterests){
            const queryInterestObject = {};
            queryInterestObject[`interests.${interest}`] = true;
            /* creates object like this
            {
                "interests.sports": true
            }
            */
            interestQuery.push(queryInterestObject);
        }

        // separate activities into array
        let splitActivities = activities?.split(",") || [];
        let activityQuery = [];
        for(let activity of splitActivities){
            const queryActivityObject = {};
            queryActivityObject[`activities.${activity}`] = true;
            activityQuery.push(queryActivityObject);
        }

        // list of users that match the criteria of search from feed page
        let findQuery = {
            // $and ensures all conditions met inside array, $ne used to ensures that the user is not the logged in user
            $and: [
                { _id: { $ne: userId}}
            ]
        };

        //check users has coordinates and are within set radius of user, if so push to findQuery
        if(coordinates.length === 2 && radius){
            findQuery.$and.push({
                location: {
                    // $geoWithin used to find users within a certain radius, $centerSphere sets the center point at the coordinates given and then radius is divided by 3963.2 to convert to miles from that point outwards
                    $geoWithin: { $centerSphere: [ [coordinates[0], coordinates[1] ], radius/3963.2 ] } // 3963.2 is the radius of the earth in miles
                }
            });
        }
        //$or used to find if user interest matches at least one of logged in user's interests then pushed to findQuery
        if (interests){
            findQuery.$and.push({ $or: interestQuery });
        } 
        //$or used to find if user activity matches at least one of logged in user's activities then pushed to findQuery
        if (activities){
            findQuery.$and.push({ $or: activityQuery });
        } 

        // actual search of users that match the criteria using the findQuery list of user objects
        let results = await User.find(
            findQuery
        );

        return results;
    } catch (expection) {
        console.log("Something went wrong with getUserWithRadius function", expection);
    }  
};

module.exports = {
    getLocationHelper,
    getUsersWithinRadius
};

