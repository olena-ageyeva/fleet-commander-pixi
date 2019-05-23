const enableMusic = false;

// GET PLAYER ELEMENTS
const audPlayer = document.createElement("AUDIO");
audPlayer.volume = 0.0;

//TRACK DATA
const tracks = [
  {
    title: "$4.99",
    artist: "Denny Kemps",
    src: "../../assets/music/back1.mp3",
    index: 0
  },
  {
    title: "Space Music Vol 1",
    artist: "Denny Kemps",
    src: "../../assets/music/back2.mp3",
    index: 1
  }
];

// INITIALIZE CURRENT TRACK
let currentTrack;

// WHEN PAGE LOADS, CHECK FOR PREVIOUS SESSION AND LOAD THAT TRACK.
// IF NO PREVIOUS SESSION, LOAD THE FIRST TRACK
function start() {
  currentTrack = tracks[1];
  audPlayer.src = currentTrack.src;
}

function nextTrack() {
  console.log("change track");
  if (!currentTrack || currentTrack.index + 1 === tracks.length) {
    currentTrack = tracks[0];
  } else {
    currentTrack = tracks[currentTrack.index + 1];
  }
  audPlayer.src = currentTrack.src;
  audPlayer.play();
}

start();
