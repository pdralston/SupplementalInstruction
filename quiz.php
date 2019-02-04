<?php
  header('Content-Type: application/json');
  
  function generateIds() {
    $numIds = 10;
    $lowerLimit = 1;
    $upperLimit = 17;
    $generated = array();
    for ($i = 0; $i < $numIds; $i++) {
      $temp = mt_rand($lowerLimit, $upperLimit);
      if (!in_array($temp, $generated)) {
          $generated[] = $temp;
      } else {
          $i--;
      }
  }
  return $generated;
  }
  
  function popQuiz(){ //retrieve quiz questions, return an array of the query results
    $servername = "";
    $username = "";
    $password = "";
    $dbname = "";
    $tbname = "";
    $randomIds = generateIds();
    
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
  
    // Check connection
    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }
    $sqlIds = "$randomIds[0], $randomIds[1], $randomIds[2], $randomIds[3], $randomIds[4], $randomIds[5], $randomIds[6], $randomIds[7], $randomIds[8], $randomIds[9]";
    $sql = "SELECT id, question, option1, option2, option3, option4 FROM $tbname WHERE id IN($sqlIds) ORDER BY FIELD(id, $sqlIds)";
    
    $results = $conn->query($sql);
    $rows = array();
    while($r = mysqli_fetch_assoc($results)) {
      $rows[] = $r;
    }
    $conn->close();
    return $rows;
  }
  
  function grade($args){ //check submissions for incorrect answers
    $servername = "";
    $username = "";
    $password = "";
    $dbname = "";
    $tbname = "";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
  
    // Check connection
    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT id, correct, resource FROM $tbname WHERE id IN($args[0], $args[1], $args[2], $args[3], $args[4], $args[5], $args[6], $args[7], $args[8], $args[9]) ORDER BY FIELD(id, $args[0], $args[1], $args[2], $args[3], $args[4], $args[5], $args[6], $args[7], $args[8], $args[9])";
    
    $results = $conn->query($sql);
    $rows = array();
    while($r = mysqli_fetch_assoc($results)) {
      $rows[] = $r;
    }
    $conn->close();
    return $rows; 
  }

  if( !isset($_POST['functionname']) ) { $aResult['error'] = 'No function name!'; }
  if( !isset($aResult['error']) ){  
    switch($_POST['functionname']){
      case 'popQuiz':
        $aResult['result'] = popQuiz();
        break;
      case 'grade':
        if( !isset($_POST['arguments']) ) { $aResult['error'] = 'No function arguments!'; }
        else { $aResult['result'] = grade($_POST['arguments']); }
        break;
      default:
        $aResult['error'] = 'Not found function '.$_POST['functionname'].'!';
        break;
    }
  }

  echo json_encode($aResult); 

?>