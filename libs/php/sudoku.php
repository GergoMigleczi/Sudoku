<?php
    $res = createSudoku();
    $puzzle = makePuzzle($res["board"], $_REQUEST["level"]);

    echo json_encode(["board"=> $res["board"], "puzzle"=>$puzzle, "level"=>ucwords($_REQUEST["level"])]);
    /*
    $board = $res["board"];
    for($i =0; $i < 9; $i++){
        $line = "";
        for($j=0; $j < 9; $j++){
            if(isset($board[$i][$j])){
                $line .= $board[$i][$j] ." ";
            }else{
                $line .=  0 ." ";
            }
            if(($j+1)%3 === 0){
                $line .= "| ";
            }
        }
        echo $line."\r\n";
    }
    echo "\r\n";
    echo "\r\n";
    for($i =0; $i < 9; $i++){
        $line = "";
        for($j=0; $j < 9; $j++){
            if(isset($puzzle[$i][$j])){
                $line .= $puzzle[$i][$j] ." ";
            }else{
                $line .=  0 ." ";
            }
            if(($j+1)%3 === 0){
                $line .= "| ";
            }
        }
        echo $line."\r\n";
    }

    $pencil = $res["pencil"];
    for($i =0; $i < 9; $i++){
        $line = "";
        for($j=0; $j < 9; $j++){
            $cell = "";
            for($k=0;$k<9;$k++){
                if(isset($pencil[$i][$j][$k])){
                    $cell .=  $pencil[$i][$j][$k];
                }else{
                    $cell .=  0;
                }
            }
            $line .= $cell." ";
        }
        echo $line."|\r\n";
    }
*/


function createSudoku(){
    $board = [];

    $pencil = [];  //each cell in pencil is an array, to mark the numbers which cannot fit in that cell
    for($i =0; $i < 9; $i++){
        for($j=0; $j < 9; $j++){
            $pencil[$i][$j] = [];
        }
    }

    $numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]; //possible numbers
    shuffle($numbers);

    $board[4][4] = $numbers[0]; //placing the frst number
    $pencil = markOnPencil($board[4][4], $pencil, 4, 4, $board);
    
    for($a=0; $a<80; $a++){
        $theLeastPossibleFits = 0;
        $row = 0;
        $col = 0;
        for($i =0; $i < 9; $i++){
            for($j=0; $j < 9; $j++){
                if(count($pencil[$i][$j]) > $theLeastPossibleFits){
                    $row = $i;
                    $col = $j;
                    $theLeastPossibleFits = count($pencil[$i][$j]);
                }
            }
        }
        shuffle($numbers); 
        for($num=0; $num < 9; $num++){
            if(!in_array($numbers[$num], $pencil[$row][$col])){
                $board[$row][$col] = $numbers[$num];
                $pencil = markOnPencil($numbers[$num], $pencil, $row, $col, $board);
                break;
            }
        }
    }

    if($theLeastPossibleFits === 9){ //retry in case of an imposibble sudoku 
        return createSudoku();
    }else{
        return ["board"=> $board, "pencil"=> $pencil];
    }
}

function markOnPencil($number, $pencil, $i, $j, $board){
    for($x=0; $x < 9; $x++){
        if(!in_array($number, $pencil[$i][$x]) && !isset($board[$i][$x])){
            array_push($pencil[$i][$x], $number); // marking at every column in $i row
        }
        if(!in_array($number, $pencil[$x][$j]) && !isset($board[$x][$j])){
            array_push($pencil[$x][$j], $number); // marking at every row in $j column
        }
    }

    $startColBox = $j - $j % 3; //the starting column of the box where $j is
    $startRowBox = $i - $i % 3; //the starting row of the box where $i is

    for($a =$startRowBox; $a < $startRowBox+3; $a++){
        for($b= $startColBox; $b < $startColBox+3; $b++){
            if(!in_array($number, $pencil[$a][$b])  && !isset($board[$a][$b])){
                array_push($pencil[$a][$b], $number); // marking at every cell in the box where [$i][$j] is
            }
        }
    }
    $pencil[$i][$j] = [];
    return $pencil;
}

function makePuzzle($board, $level){
    $toRemove = 42;
    if($level === "medium"){
        $toRemove = 45;
    }else if($level === "hard"){
        $toRemove = 51;
    }else if($level === "expert"){
        $toRemove = 60;
    }

    $removed = 0;
    while($removed < $toRemove){
        $i = rand(0,8);
        $j = rand(0,8);
        if($board[$i][$j] !== 0){
            $board[$i][$j] = 0;
            $removed +=1;
        }
    }
    return $board;
}
?>
