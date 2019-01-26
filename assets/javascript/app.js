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
        queryCity = city.toLowerCase(),
        apiKey = "pQgTyt588rDeOndWRv1VOdqoH9kF76HN",
        offset = 0,
        limit = showMore == true ? currentLimit + 12 : 12,
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=" + apiKey + "&keyword=" + query + "&city=" + queryCity + "&size=" + limit;
        //queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=pQgTyt588rDeOndWRv1VOdqoH9kF76HN&keyword=music&city=Orlando&size=10";

    currentLimit = lastCity != queryCity ? 0 : currentLimit,

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
        let events = results._embedded != undefined ? results._embedded.events : null,
            eventDiv = '';
        console.log(events);
        if (events != null) {
            for (var i = 0 + currentLimit; i < events.length; i++) {
                let name = events[i].name,
                    ticketUrl = events[i].url,
                    image = events[i].images[4].url,
                    date = events[i].dates.start.localDate,
                    venue = events[i]._embedded.venues[0].name,
                    address = events[i]._embedded.venues[0].address.line1 + " " + events[i]._embedded.venues[0].city.name + " " + events[i]._embedded.venues[0].state.name + " " + events[i]._embedded.venues[0].postalCode,
                    urlAddress = address.replace(' ', '%20') + '%20' + address.replace(' ', '%20'),
                    urlVenue = venue.replace(' ', '%20');

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
                                <p class="name"><strong>${name}</strong></p>
                                <span class="date">${date}</span><br>
                                <span class="venue text-muted">${venue}</span><br>
                            </div>
                            <div class="card-footer">
                                <span class="get-ticket float-left"><a href="${ticketUrl}" target="_blank" rel="noopener noreferrer">Get Tickets</a></span>
                                <p class="card-text text-right"><a class="btn btn-outline-primary btn-sm" href="locator.html?venue=${urlVenue}">Venue Spot</a></p>
                            </div>
                        </div>
                    `;
            }
            // setting current limit to the number of events displayed
            currentLimit = limit;
            lastCity = queryCity;

            sessionStorage.setItem('currentCity', lastCity);

            if (!showMore) {
                $("#events-container").empty().append(eventDiv);
            }
            else {
                $("#events-container").append(eventDiv);
            }
            $("#show-more").show();

            // sorting function init
            var options = {
    			valueNames: [ 'name', 'date', 'venue' ],
    		};
    		var eventList = new List('events-main', options);

        } else {
            console.log('not a city');
            $("#events-container").empty().append("Are you sure you entered the correct city?");
            $("#show-more").hide();
        }
    })
    .fail(function(err) {
        throw err;
    });
}

if (sessionStorage.getItem('currentCity') && sessionStorage.getItem('popupShown')) {
    displayEvents(sessionStorage.getItem('currentCity'), null, false);
}

// trigger to display the gifs
$('#searchForm').on('click', 'button' , function() {
    event.preventDefault();
    let city = ($("#cityInput").val()).toLowerCase();
    if (lastCity != city) {
        displayEvents(city, null, false);
    }
});
$('#show-more').on('click', 'button', function() {
    event.preventDefault();
    let city = $("#cityInput").val();
    if (sessionStorage.getItem('currentCity') && sessionStorage.getItem('popupShown')) {
        displayEvents(sessionStorage.getItem('currentCity'), null, true);
    }
    else {
        displayEvents(city, null, true);
    }
});
