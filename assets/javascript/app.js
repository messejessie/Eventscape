let eventName,
    eventImage,
    eventDate,
    eventVenue,
    eventLocation,
    currentLimit = 0,
    lastCity = '';

function displayEvents(city, keyword, showMore) {
    console.log('currentLimit: ' + currentLimit);
    let query = keyword || "music",
        queryCity = city,
        apiKey = "pQgTyt588rDeOndWRv1VOdqoH9kF76HN",
        offset = 0,
        limit = showMore == true ? currentLimit + 12 : 12,
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + "&keyword=" + query + "&city=" + queryCity + "&size=" + limit;
        //queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=pQgTyt588rDeOndWRv1VOdqoH9kF76HN&keyword=music&city=Orlando&size=10";

    currentLimit = lastCity != queryCity ? 0 : currentLimit,
    lastCity = queryCity;

    console.log('limit: ' + limit);
    console.log('currentLimit: ' + currentLimit);
    console.log('queryCity: ', queryCity);
    console.log('lastCity: ', lastCity);

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
                address = events[i]._embedded.venues[0].address.line1 + " " + events[i]._embedded.venues[0].city.name + " " + events[i]._embedded.venues[0].state.name + " " + events[i]._embedded.venues[0].postalCode,
                urlAddress = address.replace(' ', '%20');

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
                    </div>
                `;
        }

        // setting current limit to the number of events displayed
        currentLimit = limit;

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
    if (lastCity != city) {
        displayEvents(city, null, false);
    }
});
$('#show-more').on('click', 'button', function() {
    event.preventDefault();
    let city = $("#cityInput").val();
    displayEvents(city, null, true);
});
