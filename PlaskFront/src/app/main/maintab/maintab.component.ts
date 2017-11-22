//Import Basic Modules
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../user/user';
import { Question } from '../../question/question';
import { Answer } from '../../answer/answer';

import { UserService } from '../../user/user.service';
import { LocationService } from '../../location/location.service'; 
import { QuestionService } from '../../question/question.service'; 
import { AnswerService } from '../../answer/answer.service';

@Component({
    selector: 'maintab',
    templateUrl: './maintab.component.html',
    styleUrls: [ './maintab.component.css']
})
export class MainTabComponent implements OnInit{

    constructor(
        private router: Router,
        private userService: UserService,
        private locationService: LocationService,
        private questionService: QuestionService,
        private answerService: AnswerService,
    ){ }

    user: User = new User();
    questionList: [Question, boolean,Answer[]][];
    answer:string = "";
    temp_questionList:Question[] = [];

    ngOnInit(){
        this.userService.getUser().then(User => {this.user = User});
        this.getQuestionList();
/*        var q1:Question = {id:0, content:"when does the CU in 301 closes?", author:"kongdaesaeng",
            locations:"Korea/Seoul/Gwanak", services:"convenient store"}; 
        var q2: Question = {id:1, content:"when does the CU in 302 opens?", author:"kongdaesaeng",
            locations:"Korea/Seoul/Gwanak", services:"convenient store"}; 
        var a1: Answer = {author:"resident", content:"there is no convenient store in 302"};
        this.questionList = [[q1,true,[]], [q2,true,[a1]]];*/
    }

    getQuestionList():void {
        this.questionService.getRecentQuestion().then(questions =>{
            this.temp_questionList = questions;
            this.getAnswerList();
        })
    }
    getAnswerList():void{
        console.log(this.temp_questionList);
        this.questionList = [];
        for(let q of this.temp_questionList){
            var temp_answerList = [];
            this.answerService.getAnswer(q.id).then(answers =>{
                if(answers != null)
                    temp_answerList = answers;
                this.questionList.push([q, true, temp_answerList]);
                console.log(temp_answerList);
            })
        }
    };
    expand(question):void {
        if(question[1]==true)
            question[1] = false;
        else
            question[1] = true;
    }
    answerClick(id):void{
        if(this.answer=="")
            alert("Please type answer!");
        else{
            this.answerService.postAnswer(this.answer, id).then(Status=>{
                if(Status != 204) {alert("Question could not be sent, please try again");}
            });
            alert("Answer successfully posted!");
            this.answer = "";
            this.getQuestionList();
        }
    }
}
