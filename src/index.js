import './style.scss'; 

$.getJSON({
  url: "https://api.github.com/repos/thomasdavis/backbonetutorials/contributors",
  success: function(data) {

      let htmlStr = "<tbody>";

      for (let i=0; i < data.length; i++) {
          htmlStr += ("<tr>" +
          "<td><img src='" + data[i].avatar_url + "'></img></td>" +
          "<td>" + data[i].id + "</td>" +
          "<td>" + data[i].login + "</td>" +
          "<td>" + data[i].url + "</td>" +
          "<td>" + data[i].contributions + "</td>" +
          "</tr>");

      }

      htmlStr += "</tbody>"

      $("table").append(htmlStr);
  },
  fail: function() {
      alert("Something went wrong!");
  }
});

//
