$(document).ready(function () {

  $(".button-collapse").sideNav();

  $(document).on("click", ".scrapeButton", function () {

    $.ajax({
      method: "GET",
      url: "/scrape",
    }).done(function () {
      console.log("hello");
      window.location.href = "/";
    });

  });

  $('.modal').modal();

});

// Grab the articles as a json
$.getJSON("/articles", function (data) {
  if (data.length !== 0) {

    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<div class = 'col s9'>" +
        "<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /><a href='https://www.cnn.com" + data[i].link + "'>" + "https://www.cnn.com/articles" + data[i].link + "</a></p>" + "</div>" + "<div class = 'col s3'>" + "<button class='save waves-effect waves-light btn blue' id='" + data[i]._id + "'>Save Article</button>" + "</div>");

    }
  } else {
    var noArticles = $("#articles").append("<h3>UH OH! Looks like we don't have any articles.</h3>");
  }
});

// Grab the articles as a json
$.getJSON("/saved", function (data) {
  if (data.length !== 0) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#savedArticles").append("<div class = 'col s9'>" +
        "<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /><a href='https://www.cnn.com" + data[i].link + "'>" + "https://www.cnn.com/articles" + data[i].link + "</a></p>" +
        "</div>" +
        "<div class = 'col s3'>" + "<a data-id='" + data[i]._id + "' class='note waves-effect waves-light btn modal-trigger center blue' id='" + data[i]._id + "' href='#modal" + data[i]._id + "'>Add a Note</a>" + "<br/>" + "<button class='delete waves-effect waves-light btn blue' id='" + data[i]._id + "'>Delete Article</button>" + "<div id='modal" + data[i]._id + "' class='modal'>" +
        "<div class='modal-content'>" + "<h4>Notes For Article: " + data[i].title + "<h4>" + "<div class='row'>" + "<form class='col s12'>" + "<div class='row'>" + "<div class='input-field col s12'>" + "<textarea id='title" + data[i]._id + "' name='title' class='materialize-textarea'></textarea>" + "<label for='titleInput'>Title</label>" + "</div>" + "<div class='input-field col s12'>" + "<textarea id='body" + data[i]._id + "' name='body' class='materialize-textarea'></textarea>" + "<label for='bodyInput'>Enter Note</label>" + "</div>" + "</div>" +
        "</form>" + "</div>" + "</div>" + "<div class='modal-footer'>" + "<a data-id='" + data[i]._id + "' href='#!' id='savenote' class='modal-action modal-close waves-effect waves-green btn-flat'>Save Note</a>" + "<a data-id='" + data[i]._id + "' href='#!' id='deletenote' class='modal-action modal-close waves-effect waves-green btn-flat'>Delete Note</a>" + "</div>" + "</div>");

    }
  } else {
    var noArticles = $("#savedArticles").append("<h3>UH OH! Looks like we don't have any articles.</h3>");
  }
});

$(document).on("click", ".save", function () {
  var thisId = $(this).attr("id");
  $.ajax({
    method: "POST",
    url: "/saved" + thisId
  }).done(function (data) {
    $("#modalSaved").modal("open");
    // location.reload();
  });
});

// Remove article from saved
$(document).on("click", ".delete", function () {
  var thisId = $(this).attr("id");
  $.ajax({
    method: "POST",
    url: "/delete/" + thisId,
    data: {
      _method: 'set',
      saved: false
    }
  })
    .done(function (data) {
    });
  location.reload();
});

// Add note
$(document).on("click", ".note", function () {

  var thisId = $(this).attr("id");
  console.log("id = " + thisId);

  $.ajax({
    method: "GET",
    url: "/savedArticles/" + thisId
  })
    .done(function (data) {

      // If there's a note in the article
      if (data.note) {
        console.log("Title: " + data.note.title);
        console.log("Body: " + data.note.body);
        // Place the title of the note in the title input
        $("#title" + thisId).text(data.note.title);
        // Place the body of the note in the body textarea
        $("#body" + thisId).text(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");
  console.log("Data-Id: " + thisId);
  console.log("Data: " + $("#title" + thisId).val());
  console.log("Data: " + $("#body" + thisId).val());

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/savedArticles/" + thisId,
    data: {
      title: $("#title" + thisId).val(),
      body: $("#body" + thisId).val()
    }
  })

    .done(function (data) {
      // Log the response

    });

});

// When you click the deletenote button
$(document).on("click", "#deletenote", function () {
  var thisId = $(this).attr("data-id");
  console.log("Data-Id: " + thisId);
  console.log("Data: " + $("#title" + thisId).val());
  console.log("Data: " + $("#body" + thisId).val());

  // Run a DELETE request to change the note, using what's entered in the inputs
  $.ajax({
    url: "/savedArticles/" + thisId,
    type: 'post',
    data: { _method: 'delete' }
    })
    .done(function (data) {
    });

});

// Get saved articles
$(document).on("click", ".savedArticlesButton", function () {

  $.ajax({
    method: "GET",
    url: "/saved",
    success: function (data) {
      window.location.href = "/savedArticles";
    }
  });
});
