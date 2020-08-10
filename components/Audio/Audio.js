

export default type => {
  var audio = document.createElement('audio');

  if (type === 'success') {
    audio.src = '/audio/completed.wav'
  } else {
    audio.src = '/audio/ui_loading.wav'
  }
  audio.play()
}

