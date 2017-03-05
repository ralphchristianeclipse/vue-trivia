<template>
    <div @keyup.delete="checkAnswer(false)" @keyup.enter="checkAnswer(true)">
    <md-layout md-column style="height: 100vh;">
        <md-toolbar>
            <div class="md-toolbar-container">
                <div class="md-title" style="color: #4FC08D; font-weight:bold;font-variant: small-caps;">
                    <span style="color: white">K</span>eypad <span style="color: white">T</span>rivia
                </div>
                <span style="flex: 1"></span>
                <div class="md-title">
                    Score: {{currentScore}}
                </div>
            </div>
        </md-toolbar>

        <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutLeft" mode="out-in">
            <template v-if="currentTrivia">
            <div :key="currentTriviaNo" style="padding: 1rem;" @keyup.delete="checkAnswer(false)" @keyup.enter="checkAnswer(true)">
                            <md-button 
                            @click.native="currentTrivia.answer = ''"
                            style="float: right;" v-if="currentTrivia.answer && currentTrivia.correct == null" 
                            class="md-icon-button md-raised md-primary">
                                    <md-icon>undo</md-icon>
                            </md-button>
                           <div class="md-title">
                                Trivia #{{currentTriviaNo + 1}}
                            </div>
                            <div class="md-subhead">
                                {{currentTrivia.category}}
                            </div>
                            <div class="md-caption" align="center">
                                {{currentTrivia.difficulty.toUpperCase()}}
                            </div>
                            <md-progress style="background-color: #4FC08D" 
                            :md-progress="currentTrivia.difficulty == 'easy' ? 33 : currentTrivia.difficulty == 'medium' ? 66 : 100" ></md-progress>
                            <div class="md-caption" align="center">
                                {{currentTrivia.difficulty == 'easy' ? 1 : currentTrivia.difficulty == 'medium' ? 2 : 3}} points
                            </div>
                    <div class="md-body-2" style="padding: 1rem;" v-html="currentTrivia.question">
                        
                    </div>
                    <div v-if="'correct' in currentTrivia">
                        <md-list>
                            <md-subheader>Your Answer: {{currentTrivia.answer}}</md-subheader>
                            <md-list-item v-for="answer in currentTrivia.incorrect_answers" :key="answer">
                                <div class="md-list-text-container">
                                    {{answer}}
                                </div>
                                <md-icon :class="[answer == currentTrivia.correct_answer ? 'md-primary' : 'md-warn']">{{answer == currentTrivia.correct_answer ? 'done' : 'close'}}</md-icon>
                            </md-list-item>
                        </md-list>
                    </div>
                    <div v-else>
                        <div v-for="(incorrect_answer,index) in currentTrivia.incorrect_answers" :key="index">
                            <md-radio v-model="currentTrivia.answer" :id="index + 'choice'" :name="currentTrivia.question" :md-value="incorrect_answer">
                                <span v-html="incorrect_answer"></span>
                            </md-radio>
                        </div>
                    </div>
            </div>

        </template>

<template v-else>
            <md-spinner style="margin: auto;" :md-size="150" md-indeterminate></md-spinner>
        </template>
</transition>

<md-layout style="align-items:flex-end;justify-content: space-between; padding: 1rem;">
    <md-button class="md-raised md-icon-button" style="background-color: #4FC08D" @click.native="checkAnswer(false)" :disabled="currentTriviaNo == 0">
        <md-icon>arrow_back</md-icon>
    </md-button>

    <md-button class="md-raised md-primary md-icon-button" @click.native="checkAnswer(true)">
        <md-icon>arrow_forward</md-icon>
    </md-button>
</md-layout>
<div class="md-subhead">{{currentTriviaNo+1}} / {{trivias.length}} ({{parseInt(((currentTriviaNo+1)/trivias.length) * 100)}}%)</div>
<md-progress :md-progress="parseInt(((currentTriviaNo+1)/trivias.length) * 100)" style="background-color: #4FC08D"></md-progress>
</md-layout>
<div style="padding: 1rem;">

<md-input-container>
    <label>Search Trivia</label>
    <md-input v-model="search"></md-input>
</md-input-container>
<transition-group enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutLeft" move-class="trivia-move" class="md-list md-triple-line">
    <md-list-item v-for="trivia in searchedTrivias" @click.native="setCurrentTrivia(trivia.index)" :key="trivia.index">
        <div class="md-list-text-container">
            <span :style="{color: trivia.answer == trivia.correct_answer ? '#4FC08D' : '#F44336'}">Trivia #{{trivia.index + 1}} </span>
            <span v-html="trivia.question"></span>
            <span style="font-variant: small-caps">{{trivia.difficulty}}
                <template v-if="trivia.score != 0">
                    ({{trivia.score}})
                </template>
            </span>
        </div>
        <md-icon v-if="currentTriviaNo == trivia.index">arrow_back</md-icon>
    </md-list-item>
</transition-group>
</div>
</div>
</template>

<script>
    Array.prototype.shuffle = function() {
        let a = this;
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
        return a;
    }
    Array.prototype.chunk = function(groupsize) {
        var sets = [],
            chunks, i = 0;
        chunks = this.length / groupsize;

        while (i < chunks) {
            sets[i] = this.splice(0, groupsize);
            i++;
        }

        return sets;
    };
    export default {
        name: "trivias",
        data() {
            return {
                trivias: [],
                currentTriviaNo: 0,
                search: ''
            }
        },
        computed: {
            currentScore() {
                return this.trivias.reduce((score, trivia) => {
                    if(score < 0) return score = 0;
                    return score += trivia.score;
                }, 0)
            },
            searchedTrivias() {
                let list = this.trivias;
                if(list.length && this.search) {
                    list = list.filter(item => {
                        item.question.startsWith(this.search) || item.index == this.search;
                    })
                }
                return list;
            },
            currentTrivia() {
                let trivia = this.trivias[this.currentTriviaNo];
                let amount = this.currentTriviaNo - this.trivias.length;
                if(!trivia) {
                axios.get(`https://opentdb.com/api.php?amount=${amount || 1}`)
                    .then(res => {
                        this.trivias = [...this.trivias, ...res.data.results.map((result, index) => {
                            result.incorrect_answers.push(result.correct_answer);
                            result.incorrect_answers = result.incorrect_answers.shuffle();
                            result.answer = '';
                            result.score = 0;
                            return result;
                        })]
                        this.trivias.forEach((res, index) => {
                            if ('index' in res) return;
                            res.index = index
                        })
                    });
                    trivia = this.trivias[this.currentTriviaNo];
                }
                return trivia;
            },
        },
        methods: {
            setCurrentTrivia(index) {
                document.body.scrollTop = 0;
                this.currentTriviaNo = index;  
            },
            checkAnswer(increment) {
                    if (this.currentTrivia && this.currentTrivia.answer && this.currentTrivia.score == 0) {
                        this.currentTrivia.correct = this.currentTrivia.answer.toLowerCase() == this.currentTrivia.correct_answer.toLowerCase();
                        let val = this.currentTrivia.difficulty == 'easy' ?
                            1 : this.currentTrivia.difficulty == 'medium' ?
                            2 : 3;
                        this.currentTrivia.score = this.currentTrivia.correct ? val : -val;
                    }
                if (increment) {
                    this.currentTriviaNo++
                }
                else {
                    this.currentTriviaNo--;
                }
                document.body.scrollTop = 0;
            }
        },
    }
</script>

<style>
    .transition-move {
        transition: all 0.5s;
    }
    body {
        overflow-x: hidden;
    }
</style>