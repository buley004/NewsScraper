//Get articles
$.ajax({
  type: "GET",
  url: "api/articles"
}).then(function (data) {
  for (let i = 0; i < data.length; i++) {
    //create html elements
    var newDiv = $("<div>").addClass("article-box");
    var title = $("<h2>");
    var link = $("<a>");
    var author = $("<p>");
    var date = $("<p>");
    var form = $("<form>").addClass("submit-btn").attr("id", data[i]._id);

    //add data to elements
    link.text(data[i].title).attr("href", data[i].url).attr("target", "_blank");
    title.append(link);
    author.text(data[i].author);
    date.text(data[i].date);

    form.append($("<textarea/>", {
      rows: '4px',
      cols: '40px',
      type: 'text',
      class: 'comment-text'
    }), $("<br/>"), $("<input/>", {
      type: 'submit',
      value: 'Add Comment'
    }), $("<button>").text("View Comments").attr("data-id", data[i]._id).addClass("view-btn"));

    newDiv.append(title).append(author).append(date).append(form);
    $("#article-display").append(newDiv);
  }
});

//Submit comment
$(document).on('submit', '.submit-btn', function () {
  event.preventDefault();
  let comment = $(this).children(".comment-text").val();

  //data to send in post request
  var data = {
    comment: $(this).children(".comment-text").val(),
    id: $(this).attr("id")
  }

  //post comment if not blank
  if (comment.trim() !== "") {  
    $.post("/api/comments", data, function (res) {
      alert("Comment Posted! Click on 'View Comments' to see all comments from this article!");
    });
  }
  //clear text box
  $(this).children(".comment-text").val("");
});

//View comments
$(document).on("click", ".view-btn", function () {
  //clear other comments
  $("#comment-display").empty();
  
  //get comments from this article and render them on the page
  $.get("/api/comments/" + $(this).attr("data-id"), function (data) {
    for (let i = 0; i < data[0].comments.length; i++) {
      let comment = data[0].comments[i].comment;
      let commentDiv = $("<div>").attr("id", data[0].comments[i]._id).addClass("comment-box");
      let commentText = $("<p>").text(comment);
      let deleteBtn = $("<button>").text("Delete Comment").attr("data-id", data[0].comments[i]._id).addClass("delete-btn");
      $(commentDiv).append(commentText).append(deleteBtn);
      $("#comment-display").append(commentDiv);
    }
    if(data[0].comments.length > 0) {
      $("html, body").animate({ scrollTop: ($('#comment-display').offset().top) }, "slow");
    } else {
      alert("No comments found, share your thoughts!");
    }
  });
});

//Delete comment
$(document).on("click", ".delete-btn", function(){
 
  //delete from DB
  $.get("/api/delete/" + $(this).attr("data-id"), function(response){
    console.log("success");
  });

  //delete div
  $("#" + $(this).attr("data-id")).remove();
})