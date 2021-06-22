/*Preliminaries*/

// Range(n) = [0, 1, 2, 3, ..., n-1]
function Range(n) {
    if(n==1) {
        return [0];
    } else {
        return Range(n-1).concat([n-1]);
    }
}

// Random permutation of 0, 1, 2,...,n-1
function RandomPerm(n) {
    let u = Range(n);
    let v = [];
    let t = 0;
    while (u.length != 0) {
         t = u.pop();
        if (Math.random() < 0.5) {
            v.push(t);
        } else {
            v.unshift(t);
        }
    }
    return v;
}

/*Knoledge base*/
let question = [//questions
/*Sleep*/
"I will ask about the quality of your sleep.",
/*Love and sex*/
"I will ask about your sex and romantic life.",
/*Deep breathing and daily exercises*/
"I will ask about deep breathing and daily exercises.",
/*Water and chewing*/
"I will ask about water and chewing.",
/*Fruits,unrefined products,food combination,vitamin D and sun exposure and no meat and no dairy*/
"I will ask about fruits, unrefined products, food combination, vitamin D and sun exposure.",
/*Power foods*/
"I will ask about power foods.",
/*Play, intrinsic motivation, positive psychology and will*/
"I will ask about play, intrinsic motivation, positive psychology and will."
];

let multiway = [//state graphs
    // [source, target, label]
    [ [0,1,true], [0,2,false], [1,3,false] ],//Sleep
    [ [0,3,false], [0,1,true], [1,4,false], [1,2,true], [2,5,false], [0,6,false], [0,6,true], [6,8,false], [6,7,true], [7,9,false] ],//Love and sex
    [ [0,1,false], [0,2,false],[0,2,true], [2,3,false]],//Deep breathing and daily exercises
    [ [0,1,false], [0,2,true],  [0,2,false], [2,4,true], [2,3,false], [4,5,false]],//Water and chewing
    [ [0,3,false], [0,1,false],[0,1,true], [1,4,false], [1,2,false], [1,2,true], [2,5,false], [2,6,false],[2,6,true], [6,7,false]],//Fruits,unrefined products,food combination,vitamin D and sun exposure and no meat and no dairy
    [ [0,1,false] ],//Power foods
    [ [0,4,false], [0,1,false],[0,1,true], [1,5,false], [1,2,false], [1,2,true], [2,6,false], [2,3,false],[2,3,true], [3,7,false]]//Play, intrinsic motivation, positive psychology and will
];

let vString = [//questions in nodes
[/*Sleep*/
"Do you sleep at least 7 hours per night?",//0
"Is your sleep quality good?",//1
"It would be better if you slept at least 7 hours per night.",//2
"Take a hot shower and relax before bed. Cut down on caffeine."//3
],

[/*Love and sex*/
"Are you in a relationship?",//0
"Is your relationship going well",//1
"Do you think of your lover when you are resting after hard work?",//2
"You should find someone to love in a relationship.",//3
"You must end your relationship and find someone else to love.",//4
"It would be helpful to think of your lover when resting after hard work. For example, see sexy pictures or pictures of happy times together.",//5
"Do you have sex at least one day per week?",//6
"Is the quality of your sexual performance good?",//7
"You must have at least one sexual relationship per week.",//8
"You need to read books on sexuality and do sexual exercises to improve the quality of your sexual performance."//9
],

[/*Deep breathing and daily exercises*/
"Do you exercise every morning?",//0
"Get 5 to 10 minutes of exercise every morning. Breath deeply.",//1
"Do you take a deep breath during your moments of rest after hard work?",//2
"Do about 2-3 minutes of deep breathing during your moments of rest after hard work."//3
],

[/*Water and chewing*/
"Do you drink at least 2 litres of water per day?",//0
"You must drink at least 2 litres of water a day.",//1
"Do you drink water during meals?",//2
"You must not drink water during meals.",//3
"Do you consume juice from a can, coke, beer, or sugar?",//4
"You must not consume juice from a can, coke, beer, or sugar."//5
],

[/*Fruits,unrefined products,food combination,vitamin D and sun exposure and no meat and no dairy*/
"Do you eat fruits on an empty stomach every day?",//0
"Do you eat cereals and unrefined products every day?",//1
"Do you sometimes eat food combinations? For example, a combination of acid and alkaline foot.",//2
"Every day, you must eat fruits on an empty stomach.",//3
"Every day, you must eat cereals and unrefined products.",//4
"You must avoid food combinations. In particular, the combination of acid and alkaline foot.",//5
"Is your skin exposed to sunlight every day?",//6
"Every day, your skin must be exposed to sunlight."//7
],

[/*Power foods*/
"Do you eat power foods regularly? For example, onion, garlic, lemon, kiwis, almonds, nuts, dry fruits.",//0
"You must eat power foods such as onion, garlic, lemon, kiwis, almonds, nuts, dry fruits."//1
],

[/*Play, intrinsic motivation, positive psychology and will*/
"Do you play games often enough?",//0
"Are you motivated in life?",//1
"Do you think you will be successful in your projects?",//2
"Do you have willpower?",//3
"It would help if you played games relatively frequently.",//4
"You can develop intrinsic motivation by focusing on an easy goal and pursuing it. Look for the positive feedback.",//5
"Try an optimistic mindset.",//6
"Visualize the wonderful events that will happen in your life if you invest effort in developing your project."//7
]

]


/*Global variables*/
let username="";
let subject=0;
let conclusion=[];

/*Inference engine*/

function VertexOutComponentIndex(G/*graph as an adjacency list*/,v/*node*/) {
    let T = [];
    for (var j = 0; j < G.length; j++) {
        if (G[j][0] == v) {
            T.push( j );
        }
    }
    return T;
}


function MedeaExplore(v/*vertex being explored*/) {
    let S = VertexOutComponentIndex(multiway[subject], v);
    if (S.length == 0) {
        return [vString[subject][v]];
    } else {
        let R = [];

        let b = confirm( "Press \"OK\" the answer is positive or press \"Cancel\" is the answer is negative:\n" + vString[subject][v] );

        for (var i = 0; i < S.length; i++) {
            if ( b == multiway[subject][S[i]][2] )  {
                R.push(MedeaExplore( multiway[subject][S[i]][1] ));
            }
        }
        return R;
    }
}


function MedeaStart2() {
/*Asking questions*/
    let MedeaSubjects = RandomPerm(7);//Array of questions to ask
    while (MedeaSubjects.length != 0) {
        subject=MedeaSubjects.pop();
        alert(username + ", " + question[subject]);
        conclusion.push( MedeaExplore(0) );// By default, the initial state of the automaton is 0.
    }
    conclusion = conclusion.flat(Infinity);
    /*Conclusion of the interview*/
    //Output of the conclusions
    document.getElementById("interface1").innerHTML += "<BR></BR><hr><p style='white-space: pre-line; text-align: left'>"+username+", here are my tips for you:</p>";
    for (var i = 0; i < conclusion.length; i++) {
        document.getElementById("interface1").innerHTML += "<p style='white-space: pre-line; text-align: left'>(" + (i+1) + ") " + conclusion[i] + "</p>";
    }
    //Goodbye message
    document.getElementById("interface1").innerHTML += "<hr><BR></BR><p style='white-space: pre-line; text-align: left'>Well "+username+", that's all for today. I hope you come back in the future to see how much has changed after following these tips.</p>";
}

/*Introduction*/
function MedeaStart() {
    /*Learning username*/ 
    username = document.getElementById("myname").value;
  
    /*Introduction*/
    document.getElementById("interface1").innerHTML = "<BR></BR><p style='white-space: pre-line; text-align: left'>Hello " + username + ", nice to meet you! Let\'s talk about your lifestyle. At the end of our conversation, I\'ll give you some personalized tips to help you be more productive and healthy.</p> <BR></BR>";
  
    document.getElementById("interface1").innerHTML += "<input type='button' onclick='MedeaStart2();' value='Next' class='blocksmall'>"
}