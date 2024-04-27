var x = 0;
var thingies = 0;

var generatorAlphaLevel = 1;

var generatorBetaLevel = 1;

var generatorGammaLevel = 1;

var scaryMath = document.getElementsByClassName("scary");

function update_thingies()
{
    document.getElementById("thingies_counter").innerHTML = thingies.toPrecision(3);
    if(thingies <= evolutionGoal)
    {
        document.getElementById("evolution_button").setAttribute("disabled", "disabled");
    }
    else
    {
        document.getElementById("evolution_button").removeAttribute("disabled");
    }
    if(thingies <= generatorBetaCost)
    {
        document.getElementById("buy_beta").setAttribute("disabled", "disabled");
    }
    else
    {
        document.getElementById("buy_beta").removeAttribute("disabled");
    }
    if(thingies <= generatorGammaCost)
    {
        document.getElementById("buy_gamma").setAttribute("disabled", "disabled");
    }
    else
    {
        document.getElementById("buy_gamma").removeAttribute("disabled");
    }
    if(thingies <= generatorAlphaCost)
    {
        document.getElementById("buy_alpha").setAttribute("disabled", "disabled");
    }
    else
    {
        document.getElementById("buy_alpha").removeAttribute("disabled");
    }
}

function update_per_second()
{
    thingiesPerSecond = 2**x * generatorAlphaLevel * generatorBetaLevel * generatorGammaLevel;
}

function evolve()
{
    if(thingies >= evolutionGoal)
    {
        x+=1;
        update_per_second();
        evolutionGoal = 3**x;
        thingies = 0;
        update_indicators();
    }
}

function update_indicators()
{
    document.getElementById("x_counter").innerHTML = x;
    document.getElementById("thingies_per_second").innerHTML = thingiesPerSecond.toPrecision(3);
    document.getElementById("evolution_goal").innerHTML = evolutionGoal.toPrecision(3);
    document.getElementById("thingies_per_second_exponential").innerHTML = "(2^" + x + " * " + generatorAlphaLevel + " * " + generatorBetaLevel + " * " + generatorGammaLevel + ")";
    document.getElementById("evolution_goal_exponential").innerHTML = "(3^" + x + ")";

    document.getElementById("generator_alpha_level").innerHTML = generatorAlphaLevel;
    document.getElementById("generator_alpha_cost").innerHTML = generatorAlphaCost.toPrecision(3);

    document.getElementById("generator_beta_level").innerHTML = generatorBetaLevel;
    document.getElementById("generator_beta_cost").innerHTML = generatorBetaCost.toPrecision(3);

    document.getElementById("generator_gamma_level").innerHTML = generatorGammaLevel;
    document.getElementById("generator_gamma_cost").innerHTML = generatorGammaCost.toPrecision(3);
}

function upgrade_generator(which)
{
    if(which == 1)
    {
        if(thingies >= generatorAlphaCost)
        {
            thingies -= generatorAlphaCost;
            generatorAlphaLevel++;
            generatorAlphaCost = 4**(4+generatorAlphaLevel);
        }
    }
    if(which == 2)
    {
        if(thingies >= generatorBetaCost)
        {
            thingies -= generatorBetaCost;
            generatorBetaLevel++;
            generatorBetaCost = 5**(5+generatorBetaLevel);
        }
    }
    if(which == 3)
    {
        if(thingies >= generatorGammaCost)
        {
            thingies -= generatorGammaCost;
            generatorGammaLevel++;
            generatorGammaCost = 6**(6+generatorGammaLevel);
        }
    }
    update_per_second();
    update_indicators();
}

for (let i = 0; i < scaryMath.length; i++) {
    scaryMath[i].style.display="none";
}

function showScary()
{
    var toggle = document.getElementById("scary_toggle");
    if(toggle.checked == true)
    {
        for (let i = 0; i < scaryMath.length; i++) {
            scaryMath[i].style.removeProperty("display");
        }
    }
    else
    {
        for (let i = 0; i < scaryMath.length; i++) {
            scaryMath[i].style.display="none";
        }
    }
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  } 

function save()
{
    var save = 
    {
        x: x,
        thingies: thingies,
        generatorAlphaLevel: generatorAlphaLevel,
        generatorBetaLevel: generatorBetaLevel,
        generatorGammaLevel: generatorGammaLevel
    }
    localStorage.setItem("save",JSON.stringify(save));
}
function load()
{
    var savegame = JSON.parse(localStorage.getItem("save"));
    if(savegame != null)
    {
        if (typeof savegame.x !== "undefined") x = savegame.x;
        if (typeof savegame.thingies !== "undefined") thingies = savegame.thingies; 
        if (typeof savegame.generatorAlphaLevel !== "undefined") generatorAlphaLevel = savegame.generatorAlphaLevel; 
        if (typeof savegame.generatorBetaLevel !== "undefined") generatorBetaLevel = savegame.generatorBetaLevel; 
        if (typeof savegame.generatorGammaLevel !== "undefined") generatorGammaLevel = savegame.generatorGammaLevel; 
    }
}
function reset()
{
    if(confirm("Are you sure you want to hard reset your save?"))
    {
        window.clearInterval(saveInterval);
        localStorage.removeItem("save");
        location.reload();
    }
}
load();
var evolutionGoal = 3**x;
var generatorAlphaCost = 4**(4+generatorAlphaLevel);
var generatorBetaCost = 5**(5+generatorBetaLevel);
var generatorGammaCost = 6**(6+generatorGammaLevel);
var thingiesPerSecond = 2**x * generatorAlphaLevel * generatorBetaLevel * generatorGammaLevel;
update_per_second();
update_indicators();

window.setInterval(function(){
    if (document.visibilityState == "visible")
    {
        thingies += thingiesPerSecond/100;
    }
    else
    {
        thingies += thingiesPerSecond;
    }
    update_thingies();
    document.title = '2v3 - ' + thingies.toPrecision(3) + ' thingies';  
}, 10);

var saveInterval = window.setInterval(save, 1000);

document.getElementById("default_open").click();

document.addEventListener("keydown", function onEvent(event)
{
    if (event.key == "e") 
    {
        evolve();
    }
    else if (event.key == "1")
    {
       upgrade_generator(1);
    }
    else if (event.key == "2")
    {
       upgrade_generator(2);
    }
    else if (event.key == "3")
    {
       upgrade_generator(3);
    }
});
