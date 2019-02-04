//quizscrip.js
  
function populateQuestions(result) {//callback function that parses the ajax query and populates the questions
  var questionsContainer = $("<ul class=\"list-group\"></ul>");
  var index = 0;
  $.each(result, function(){
    var question = $("#question-template").clone().removeClass("hidden");
    question[0].id = this["id"];
    createQuestion(question, this, index).appendTo(questionsContainer);
    index++;   
  });
  questionsContainer.appendTo($("#quiz-block"));
}

function getQContent(callback){//ajax request to the quiz database
    $.ajax({
    type: "POST",
    url: './quiz.php',
    dataType: 'json',
    data: {functionname: 'popQuiz', arguments: null},

    success: function (obj, textstatus) {
      if( !('error' in obj) ) {
         callback(obj.result);
      } else {
        console.log(obj.error);
      }
    }
  });
}

function checkAnswers(callback, data){//ajax request to the check answers
    $.ajax({
    type: "POST",
    url: './quiz.php',
    dataType: 'json',
    data: {functionname: 'grade', arguments: data},

    success: function (obj, textstatus) {
      if( !('error' in obj) ) {
         callback(obj.result);
      } else {
        console.log(obj.error);
      }
    }
  });
}

function grade(correctAns){//TODO highlight incorrect answers and show students where they can find the info
    var answers = $('#quiz-block input:checked');
    var incorrect = 0;
    for (var i = 0; i < correctAns.length; i++){
        if(correctAns[i].correct != answers[i].value) {
            $("#" + correctAns[i].id + " > .correct").removeClass("hidden").html("<h3 class=\"resource\">" + correctAns[i].resource + "</h3>");
            incorrect++;
        }
    }
    alert("You missed " + incorrect + " questions");
}

function createQuestion(template, content, index){//create an html quiz question from template
  template.find(".quiz-text").text(content["question"]);
  var answers = template.find("label");
  for (var i = 0; i < 4; i++){
    var currAnswer = "option" + (i + 1)
    answers[i].innerHTML = '<input type="radio" name = "answerBlock' + index + '" value="'+ i + '">'+ content[currAnswer];
  }
  return template;
}

$("#quiz-submit").click(function() {
  var ansrdQs = $('#quiz-block input:checked').length;
  var questionId = $('#quiz-block .quiz-question');
  var submission = [];
  if(questionId.length == ansrdQs) {
    for (var i = 0; i < questionId.length; i++) {
      submission[i] = questionId[i].id;
    }
    checkAnswers(grade, submission);
  } else {
    alert("Answer all of the questions");
  }
});

$("#quiz-refresh").click(function() {
    $("#quiz-block").html("");
    getQContent(populateQuestions);
});

$(document).ready(function(){
  getQContent(populateQuestions);
});
