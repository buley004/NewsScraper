//Get articles
$.ajax({
  type: "GET",
  url: "api/articles"
}).then(function (data) {
  for (let i = 0; i < data.length; i++) {
    console.log(data[i].title);
    //create html elements
    var newDiv = $("<div>");
    var title = $("<h2>");
    var author = $("<p>");
    var date = $("<p>");
    var form = $("<form>").addClass("submit-btn");

    //add data to elements
    title.text(data[i].title);
    author.text(data[i].author);
    date.text(data[i].date);

    form.append($("<textarea/>", {
      rows: '5px',
      cols: '27px',
      type: 'text',
      placeholder: 'Message',
      class: 'comment-text'
    }), $("<br/>"), $("<input/>", {
      type: 'submit',
      id: data[i]._id,
      value: 'Add Comment'
    }));

    newDiv.append(title).append(author).append(date).append(form);
    $("#article-display").append(newDiv);
  }
});

//Submit comment
$(document).on('submit', '.submit-btn', function () {
  event.preventDefault();
  console.log($(this));
  console.log("testo");
  console.log($(this).children(".comment-text").val());
  
  
})