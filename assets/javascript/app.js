let eventName,
    eventImage,
    eventDate,
    eventVenue,
    eventLocation,
    currentLimit = 0,
    lastQuery = '';

function displayEvents(city, keyword, showMore) {
    let query = keyword || "music",
        apiKey = "pQgTyt588rDeOndWRv1VOdqoH9kF76HN",
        // offset = Math.floor(Math.random() * 25),
        offset = 0,
        limit = showMore == true ? currentLimit + 12 : 12,
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + "&keyword=" + query + "&city=" + city + "&size=" + limit;
        //queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=pQgTyt588rDeOndWRv1VOdqoH9kF76HN&keyword=music&city=Orlando&size=10";

    currentLimit = lastQuery != query ? 0 : currentLimit,
    lastQuery = query;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .done(function(results) {
        console.log(results);
        let events = results._embedded.events,
            eventDiv = '';
        console.log(events);
        for (var i = 0 + currentLimit; i < events.length; i++) {
            let name = events[i].name,
                image = events[i].images[4].url,
                date = events[i].dates.start.localDate,
                venue = events[i]._embedded.venues[0].name,
                address = events[i]._embedded.venues[0].address.line1 + " " + events[i]._embedded.venues[0].city.name + " " + events[i]._embedded.venues[0].state.name + " " + events[i]._embedded.venues[0].postalCode;

                // console.log(name);
                // console.log(image);
                // console.log(date);
                // console.log(venue);
                // console.log(address);
                // console.log('---------------');

            eventDiv += `
                    <div class="card border-0">
                        <img class="card-img-top" src="${image}">
                        <div class="card-body">
                            <p class="card-text">${name}</p>
                            <p class="card-text">Venue:<br>${venue}</p>
                        </div>
                        <div class="buttonbody"> 
                        
                        <a href="locater.html" class="btn btn-sm venueButton">Venue Spot</a>
                        </div> 
                    </div>
                `;
        }

        // setting current limit to the number of events displayed
        currentLimit  = limit;

        if (!showMore) {
            $("#events-container").empty().append(eventDiv);
        }
        else {
            $("#events-container").append(eventDiv);
        }
        $("#show-more").show();
    })
    .fail(function(err) {
        throw err;
    });
}

// trigger to display the gifs
$('#searchForm').on('click', 'button' , function() {
    event.preventDefault();
    let city = $("#cityInput").val();
    displayEvents(city);
});
$('#show-more').on('click', 'button', function() {
    event.preventDefault();
    let city = $("#cityInput").val();
        city = "orlando";
    displayEvents(city, null, true);
});
