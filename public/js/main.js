
var output;
document.querySelectorAll('.userInput input').forEach((a) => a.addEventListener('keydown', function(e) {
  if(e.key==="Enter")
  {
    var values = {
      loc: document.querySelector('input[name="search"]').value,
      name: document.querySelector('input[name="search2"]').value
    }
    var request = new XMLHttpRequest();

    // var loc =
    // check request and use the data
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        // everything is good, the response is received
        if (request.status === 200) {
          output = JSON.parse(request.responseText);
          console.log(output);
        } else {
        // still not ready
          alert('There was a problem with the request');
        }
      }
    }

    request.open('GET', 'https://medihealth.herokuapp.com/doctorList', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('x-value', values);
    request.send();
  }

}));
