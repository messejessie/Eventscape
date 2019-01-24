let eventName
    eventImage,
    eventDate,
    eventVenue,
    eventLocation;

$(function() {
    $.ajax('https://app.ticketmaster.com/discovery/v2/events.json?apikey=pQgTyt588rDeOndWRv1VOdqoH9kF76HN&city=Orlando')
    .then(function success(response) {
        //console.log(response);
        let events = response._embedded.events;
        console.log(events);

    }, function fail(data, status) {
            console.log('Request failed.  Returned status of', status);
        }
    );
});

function displayEvents(query, showMore) {
    let hero = query,
        api_key = "2waeg1EgKzge3SHpASXilZ93joi92FC2",
        // offset = Math.floor(Math.random() * 25),
        offset = 0,
        limit = showMore == true ? currentLimit + 10 : 10,
        queryURL = "https://api.giphy.com/v1/gifs/search?q=" + hero + "&api_key=" + api_key + "&offset=" + offset + "&limit=" + limit;

        currentLimit = lastQuery != query ? 0 : currentLimit,

    lastQuery = query;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .done(function(results) {
        let data = results.data;
        let gifDiv = '';
        console.log(data);
        for (var i = 0 + currentLimit; i < data.length; i++) {
            let { id, title, rating, embed_url, images: {fixed_width_still, fixed_width} } = data[i];
            gifDiv += `
                    <div class="card border-0">
                        <img class="card-img-top gif" src="${fixed_width_still.url}" data-paused="${fixed_width_still.url}"  data-play="${fixed_width.url}" data-state="paused">
                        <div class="card-body">
                `;
            if (liked.indexOf(id) > -1) {
                gifDiv += `<a href="#" class="fave-icon liked float-right" data-id="${id}"></a>`;
            }
            else {
                gifDiv += `<a href="#" class="fave-icon float-right" data-id="${id}"></a>`;
            }
            gifDiv += `
                            <p class="card-text">Rating: <span class="rating-value">${rating}</span></p>
                            <p class="card-text">Title:<br>${title}</p>
                            <p class="card-text">Embed URL:<br><a class="embed-url" href="${embed_url}" target="_blank">${embed_url}</a></p>
                        </div>
                    </div>
                `;
        }

        // setting current limit to the number of gifs displayed
        currentLimit  = limit;

        if (!showMore) {
            $("#gifs-container").empty().append(gifDiv);
        }
        else {
            $("#gifs-container").append(gifDiv);
        }
        $("#show-more").show();
        $("#show-more button").attr('data-name', lastQuery);
    })
    .fail(function(err) {
        throw err;
    });
}

// trigger to display the gifs
$('#buttons-container').on('click', 'button', function() {
    event.preventDefault();
    let query = $(this).attr("data-name");
    $("#buttons-container button").removeAttr("disabled");
    $(this).attr("disabled", "disabled");
    displayEvents(query);
});
$('#show-more').on('click', 'button', function() {
    event.preventDefault();
    let query = $(this).attr("data-name");
    displayEvents(query, true);
});
