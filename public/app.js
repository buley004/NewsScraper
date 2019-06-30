//Get articles
$.ajax({
  type: "GET",
  url: "api/articles"
}).then(function (data) {
  console.log(data);

});