//import { log } from "util";

//Get articles
$.ajax({
  type: "GET",
  url: "api/articles"
}).then(function (data) {
  for (let i = 0; i < data.length; i++) {
    //create html elements
    var newDiv = $("<div>");
    var title = $("<h2>");
    var author = $("<p>");
    var date = $("<p>");
    var form = $("<form>").addClass("submit-btn").attr("id", data[i]._id);

    //add data to elements
    title.text(data[i].title);
    author.text(data[i].author);
    date.text(data[i].date);

    form.append($("<textarea/>", {
      rows: '5px',
      cols: '27px',
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
  console.log("hello");
  console.log($(this).children(".comment-text").val());
  let comment = $(this).children(".comment-text").val();

 

  //data to send in post request
  var data = {
    comment: $(this).children(".comment-text").val(),
    id: $(this).attr("id")
  }
  console.log(data);

  //post comment
  if (comment.trim() !== "") {  
    $.post("/api/comments", data, function (res) {
      alert("Comment Posted!");
      console.log("posted");
    });
  }

  $(this).children(".comment-text").val("");
});

//View comments
$(document).on("click", ".view-btn", function () {
  //clear other comments
  $("#comment-display").empty();
  
  console.log($(this).attr("data-id"));
  $.get("/api/comments/" + $(this).attr("data-id"), function (data) {
    console.log(data);
    for (let i = 0; i < data[0].comments.length; i++) {
      let comment = data[0].comments[i].comment;
      let commentDiv = $("<div>").attr("id", data[0].comments[i]._id);
      let commentText = $("<p>").text(comment);
      let deleteBtn = $("<button>").text("Delete Comment").attr("data-id", data[0].comments[i]._id).addClass("delete-btn");
      $(commentDiv).append(commentText).append(deleteBtn);
      $("#comment-display").append(commentDiv)
      console.log(comment);
    }
  });
});

//Delete comment
$(document).on("click", ".delete-btn", function(){
  console.log($(this).attr("data-id"));

  //delete from DB
  $.get("/api/delete/" + $(this).attr("data-id"), function(response){
    console.log("success");
  });

  //delete div
  $("#" + $(this).attr("data-id")).remove();
})