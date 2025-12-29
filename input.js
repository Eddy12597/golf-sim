let trump_p_l = 0.67; // P(Trump Long)
let obama_p_l_ahead = 0.00; // P(Obama Long | Obama ahead)
let obama_p_l_behind = 1.00; // P(Obama Long | Obama behind)

let trump_l_s = 0.55; // S(Trump Long)
let trump_s_s = 0.85; // S(Trump Short)
let obama_l_s = 0.55; // S(Obama Long)
let obama_s_s = 0.85; // S(Obama Short)


const trump_p_l_slider = document.getElementById("trump-long-p");
const obama_p_l_ahead_slider = document.getElementById("obama-long-p-ahead");
const obama_p_l_behind_slider = document.getElementById("obama-long-p-behind");
const trump_l_s_slider = document.getElementById("trump-long-suc");
const trump_s_s_slider = document.getElementById("trump-short-suc");
const obama_l_s_slider = document.getElementById("obama-long-suc");
const obama_s_s_slider = document.getElementById("obama-short-suc");

const trump_p_l_display = document.getElementById("ptcl");
const obama_p_l_ahead_display = document.getElementById("oplAhead");
const obama_p_l_behind_display = document.getElementById("oplBehind");
const trump_l_s_display = document.getElementById("tlss");
const trump_s_s_display = document.getElementById("tsss");
const obama_l_s_display = document.getElementById("olss");
const obama_s_s_display = document.getElementById("osss");

trump_p_l_slider.oninput = function() {
    trump_p_l = this.value;
    trump_p_l_display.value = Number(trump_p_l).toFixed(3);
    // console.log(`Changed trump_p_l to ${trump_p_l}`);

}

trump_p_l_display.oninput = function() {
    trump_p_l = this.value;
    trump_p_l_slider.value = Number(trump_p_l).toFixed(3);
    // console.log(`Changed trump_p_l to ${trump_p_l}`);
}

// ---

obama_p_l_ahead_slider.oninput = function() {
  obama_p_l_ahead = this.value;
  obama_p_l_ahead_display.value = Number(obama_p_l_ahead).toFixed(3);
}

obama_p_l_ahead_display.oninput = function() {
  obama_p_l_ahead = this.value;
  obama_p_l_ahead_slider.value = Number(obama_p_l_ahead).toFixed(3);
}

// ---

obama_p_l_behind_slider.oninput = function() {
  obama_p_l_behind = this.value;
  obama_p_l_behind_display.value = Number(obama_p_l_behind).toFixed(3);
}
obama_p_l_behind_display.oninput = function() {
  obama_p_l_behind = this.value;
  obama_p_l_behind_slider.value = Number(obama_p_l_behind).toFixed(3);
}

// ---

trump_l_s_slider.oninput = function() {
    trump_l_s = this.value;
    // console.log(`Changed trump_l_s to ${trump_l_s}`);
    trump_l_s_display.value = Number(trump_l_s).toFixed(3);
}

trump_l_s_display.oninput = function() {
    trump_l_s = this.value;
    trump_l_s_slider.value = Number(trump_l_s).toFixed(3);
}

// ---

trump_s_s_slider.oninput = function() {
    trump_s_s = this.value;
    // console.log(`Changed trump_s_S to ${trump_s_s}`);
    trump_s_s_display.value = Number(trump_s_s).toFixed(3);
}

trump_s_s_display.oninput = function() {
    trump_s_s = this.value;
    trump_s_s_slider.value = Number(trump_s_s).toFixed(3);
}

// ---

obama_l_s_slider.oninput = function() {
    obama_l_s = this.value;
    // console.log(`Changed obama_l_s to ${obama_l_s}`);
    obama_l_s_display.value = Number(obama_l_s).toFixed(3);
}

obama_l_s_display.oninput = function() {
    obama_l_s = this.value;
    obama_l_s_slider.value = Number(obama_l_s).toFixed(3);
}

//---

obama_s_s_slider.oninput = function() {
    obama_s_s = this.value;
    // console.log(`Changed obama_s_s to ${obama_s_s}`);
    obama_s_s_display.value = Number(obama_s_s).toFixed(3);
}

obama_s_s_display.oninput = function() {
    obama_s_s = this.value;
    obama_s_s_slider.value = Number(obama_s_s).toFixed(3);
}


export { trump_p_l, trump_l_s, trump_s_s, obama_l_s, obama_s_s, obama_p_l_ahead, obama_p_l_behind };
