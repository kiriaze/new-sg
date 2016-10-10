var plyrHTML = ["<div class='plyr__controls'>",
    "<div class='plyr__controls__bg'></div>",
    "<button type='button' data-plyr='play'>",
        "<div class='button-bg'></div>",
        "<img class='button-icon button-icon-play' src='../../assets/images/vectors/plyr-icon-play.svg' />",
        "<span class='plyr__sr-only'>Play</span>",
    "</button>",
    "<button type='button' data-plyr='pause'>",
        "<div class='button-bg'></div>",
       "<img class='button-icon button-icon-pause' src='../../assets/images/vectors/plyr-icon-pause.svg' />",
        "<span class='plyr__sr-only'>Pause</span>",
    "</button>",
    "<span class='plyr__progress'>",
        "<div class='progress-bg'></div>",
        "<div class='progress-wrapper'>",
          "<label for='seek{id}' class='plyr__sr-only'>Seek</label>",
          "<input id='seek{id}' class='plyr__progress--seek' type='range' min='0' max='100' step='0.1' value='0' data-plyr='seek'>",
          "<progress class='plyr__progress--played' max='100' value='0' role='presentation'></progress>",
          "<progress class='plyr__progress--buffer' max='100' value='0'>",
              "<span>0</span>% buffered",
         "</progress>",
          "<span class='plyr__tooltip'>00:00</span>",
        "</div>",
    "</span>",
    "<div class='plyr__time__wrapper'>",
      "<span class='plyr__time'>",
          "<span class='plyr__sr-only'>Current time</span>",
          "<span class='plyr__time--current'>00:00</span>",
      "</span>",
      "<span class='plyr__time plyr__time'>",
          "<span class='plyr__sr-only'>Duration</span>",
          "<span class='plyr__time--duration'>00:00</span>",
      "</span>",
      "<button class='button-mute' type='button' data-plyr='mute'>",
          "<img class='icon--muted button-icon' src='../../assets/images/vectors/plyr-icon-muted.svg' />",
          "<img class='icon-unmuted button-icon' src='../../assets/images/vectors/plyr-icon-volume.svg' />",
          "<span class='plyr__sr-only'>Toggle Mute</span>",
      "</button>",
      "<span class='plyr__volume'>",
          "<label for='volume{id}' class='plyr__sr-only'>Volume</label>",
          "<input id='volume{id}' class='plyr__volume--input' type='range' min='0' max='10' step='0.1' value='5' data-plyr='volume'>",
          "<progress class='plyr__volume--display' max='10' value='0' role='presentation'></progress>",
      "</span>",
    "</div>",
    "<button type='button' class='button-fullscreen' data-plyr='fullscreen'>",
        "<svg class='icon--exit-fullscreen'><use xlink:href='#plyr-exit-fullscreen'></use></svg>",
        "<img class='icon--enter-fullscreen button-icon' src='../../assets/images/vectors/plyr-icon-fullscreen.svg' />",
        "<span class='plyr__sr-only'>Toggle Fullscreen</span>",
    "</button>",
"</div>"].join("");

module.exports = plyrHTML;
